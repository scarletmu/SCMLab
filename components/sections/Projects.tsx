import { ProjectsList } from "@/components/client/ProjectsList";
import type { ProjectManual } from "@/lib/content";

export function Projects({ projects }: { projects: ProjectManual[] }) {
  return (
    <div className="win grow flex flex-col">
      <div className="win-title">
        <span>◆ OPEN-SOURCE · 开源项目</span>
        <span className="en" style={{ fontSize: 8 }}>
          {String(projects.length).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>
      <div
        style={{
          padding: 12,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <ProjectsList projects={projects} />
      </div>
    </div>
  );
}
