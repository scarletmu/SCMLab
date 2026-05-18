import {
  getCharacter,
  getStats,
  getEquipment,
  getSkills,
  getNowManual,
  getLogManual,
  getProjectsManual,
  getItasha,
} from "@/lib/content";
import { getGithubData } from "@/lib/github";
import { getWeatherLabel } from "@/lib/weather";
import { TopStatusBar } from "@/components/sections/TopStatusBar";
import { CharacterFile } from "@/components/sections/CharacterFile";
import { Contributions } from "@/components/sections/Contributions";
import { Projects } from "@/components/sections/Projects";
import { ItashaGallery } from "@/components/sections/ItashaGallery";
import { NowPanel } from "@/components/sections/NowPanel";
import { FooterHints } from "@/components/sections/FooterHints";

// Real content YAMLs are bind-mounted into /app/content at runtime; if the
// page were SSG, it'd serve build-time example data forever. Force per-request
// render so the bind-mount is reflected immediately. The github/weather fetch
// calls still cache via their own next.revalidate intervals.
export const revalidate = 0;

export default async function Home() {
  const [
    character,
    stats,
    equipment,
    skills,
    nowManual,
    log,
    projectsManual,
    itasha,
  ] = await Promise.all([
    getCharacter(),
    getStats(),
    getEquipment(),
    getSkills(),
    getNowManual(),
    getLogManual(),
    getProjectsManual(),
    getItasha(),
  ]);

  const [github, weatherLabel] = await Promise.all([
    getGithubData(projectsManual),
    getWeatherLabel(
      character.location.city,
      character.location.latitude,
      character.location.longitude,
    ),
  ]);

  return (
    <main
      className="pixel paper-bg relative"
      style={{ width: 1440, height: 1024, padding: 24, margin: "0 auto" }}
    >
      <TopStatusBar character={character} weatherLabel={weatherLabel} />

      {/* 3-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "440px 1fr 440px",
          gap: 16,
          height: 884,
        }}
      >
        <CharacterFile
          character={character}
          stats={stats}
          equipment={equipment}
          skills={skills}
        />

        <div className="flex flex-col" style={{ gap: 12 }}>
          <Contributions daily={github.daily} />
          <Projects projects={github.projects} />
        </div>

        <div className="flex flex-col" style={{ gap: 12 }}>
          <ItashaGallery items={itasha} />
          <NowPanel now={nowManual} weatherLabel={weatherLabel} log={log} />
        </div>
      </div>

      <FooterHints />
    </main>
  );
}
