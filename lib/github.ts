import { FAKE_DAILY_CODE } from "./prng";
import type { DailyCode, Last7Day, LastPush } from "./prng";
import type { ProjectManual } from "./content";

const GITHUB_LOGIN = process.env.GITHUB_LOGIN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const QUERY = /* GraphQL */ `
  query ($login: String!, $from: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from) {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      repos: repositories(
        first: 6
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
        privacy: PUBLIC
        isFork: false
      ) {
        nodes {
          name
          description
          stargazerCount
          forkCount
          primaryLanguage {
            name
          }
          url
          pushedAt
        }
      }
      recentPush: repositories(
        first: 1
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
        isFork: false
      ) {
        nodes {
          name
          pushedAt
          defaultBranchRef {
            name
            target {
              ... on Commit {
                oid
                messageHeadline
              }
            }
          }
        }
      }
    }
  }
`;

type GhCommit = { oid: string; messageHeadline: string };
type GhRecentPushNode = {
  name: string;
  pushedAt: string;
  defaultBranchRef: {
    name: string;
    target: GhCommit | null;
  } | null;
};

type GhResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: Array<{
            contributionDays: Array<{ date: string; contributionCount: number }>;
          }>;
        };
      };
      repos: {
        nodes: Array<{
          name: string;
          description: string | null;
          stargazerCount: number;
          forkCount: number;
          primaryLanguage: { name: string } | null;
          url: string;
          pushedAt: string;
        }>;
      };
      recentPush: { nodes: GhRecentPushNode[] };
    };
  };
  errors?: Array<{ message: string }>;
};

export type GithubData = {
  daily: DailyCode;
  projects: ProjectManual[];
};

// Map contribution count → activity level.
// 1 commit already activates to `mid`; `wash` (lvl 1) is intentionally unused
// because at 22px it reads identical to the empty `paper-2`.
function bucketize(count: number): 0 | 1 | 2 | 3 {
  if (count === 0) return 0;
  if (count <= 2) return 2;
  return 3;
}

function langLabel(name: string | null | undefined): string {
  if (!name) return "—";
  const m: Record<string, string> = {
    TypeScript: "TS",
    JavaScript: "JS",
    Python: "Py",
    "C++": "C++",
  };
  return m[name] ?? name;
}

function streakFromCalendar(
  days: Array<{ date: string; contributionCount: number }>,
): number {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].contributionCount > 0) streak += 1;
    else break;
  }
  return streak;
}

function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMin = Math.max(0, Math.round((Date.now() - then) / 60_000));
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 48) return `${diffH}h ago`;
  const diffD = Math.round(diffH / 24);
  return `${diffD}d ago`;
}

// "YYYY-MM-DD" is interpreted as UTC midnight by the Date constructor —
// pinning to noon UTC avoids timezone slippage when deriving weekday.
const WEEKDAY_LETTER = ["S", "M", "T", "W", "T", "F", "S"];
function weekdayLetter(isoDate: string): string {
  const day = new Date(`${isoDate}T12:00:00Z`).getUTCDay();
  return WEEKDAY_LETTER[day];
}

export async function getGithubData(
  fallbackProjects: ProjectManual[],
): Promise<GithubData> {
  if (!GITHUB_TOKEN || !GITHUB_LOGIN) {
    return { daily: FAKE_DAILY_CODE, projects: fallbackProjects };
  }

  // 90 days is plenty for last-7 + multi-week streaks without blowing past
  // GitHub's contribution-calendar range cap.
  const from = new Date();
  from.setDate(from.getDate() - 90);

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "scarletmu-home",
      },
      body: JSON.stringify({
        query: QUERY,
        variables: { login: GITHUB_LOGIN, from: from.toISOString() },
      }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`gh ${res.status}`);
    const json = (await res.json()) as GhResponse;
    if (json.errors?.length) {
      throw new Error(json.errors.map((e) => e.message).join("; "));
    }
    const user = json.data!.user;
    const cal = user.contributionsCollection.contributionCalendar;

    const allDays = cal.weeks
      .flatMap((w) => w.contributionDays)
      .sort((a, b) => a.date.localeCompare(b.date));
    const tail = allDays.slice(-7);

    const last7: Last7Day[] = tail.map((d, i) => ({
      day: weekdayLetter(d.date),
      lvl: bucketize(d.contributionCount),
      today: i === tail.length - 1 || undefined,
    }));

    const recent = user.recentPush.nodes[0];
    const commit = recent?.defaultBranchRef?.target ?? null;
    const lastPush: LastPush = recent
      ? {
          ago: relTime(recent.pushedAt),
          branch: recent.defaultBranchRef?.name ?? "—",
          sha: commit ? commit.oid.slice(0, 7) : "—",
          msg: commit ? commit.messageHeadline : recent.name,
        }
      : FAKE_DAILY_CODE.lastPush;

    const daily: DailyCode = {
      last7,
      streakDays: streakFromCalendar(allDays),
      lastPush,
    };

    const projects: ProjectManual[] = user.repos.nodes.map((r) => ({
      name: r.name,
      desc: r.description ?? "",
      lang: langLabel(r.primaryLanguage?.name),
      stars: r.stargazerCount,
      forks: r.forkCount,
      url: r.url,
    }));

    return { daily, projects };
  } catch (err) {
    console.warn("[github] fetch failed, falling back to manual data:", err);
    return { daily: FAKE_DAILY_CODE, projects: fallbackProjects };
  }
}
