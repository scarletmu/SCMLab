// Data types + static fallback for the Daily Code bar.
// (Filename is historical — used to host a mulberry32 PRNG for a 26×7 heatmap.)

export type Last7Day = {
  day: string;
  lvl: 0 | 1 | 2 | 3;
  today?: boolean;
};

export type LastPush = {
  ago: string;
  branch: string;
  sha: string;
  msg: string;
};

export type DailyCode = {
  last7: Last7Day[];
  streakDays: number;
  lastPush: LastPush;
};

export const FAKE_DAILY_CODE: DailyCode = {
  last7: [
    { day: "M", lvl: 1 },
    { day: "T", lvl: 2 },
    { day: "W", lvl: 3 },
    { day: "T", lvl: 0 },
    { day: "F", lvl: 2 },
    { day: "S", lvl: 1 },
    { day: "S", lvl: 2, today: true },
  ],
  streakDays: 38,
  lastPush: {
    ago: "2h ago",
    branch: "main",
    sha: "abc1234",
    msg: "feat: character-file grid",
  },
};
