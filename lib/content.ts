import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cache } from "react";
import yaml from "js-yaml";
import { z } from "zod";

const CONTENT_DIR = join(process.cwd(), "content");

// Real `*.yml` is gitignored (personal data); `*.example.yml` ships in the
// repo as a safe template. Loader prefers real, falls back to example so a
// fresh clone runs without setup.
function toExample(file: string): string {
  return file.replace(/\.yml$/, ".example.yml");
}

async function loadYaml<T>(file: string): Promise<T> {
  for (const candidate of [file, toExample(file)]) {
    try {
      const raw = await readFile(join(CONTENT_DIR, candidate), "utf8");
      return yaml.load(raw) as T;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }
  throw new Error(`content/${file} not found (no .example.yml fallback either)`);
}

// Strict loader — no .example.yml fallback. Returns null if the file is
// missing. Used for content where "no defaults" is the desired UX.
async function loadYamlStrictOptional<T>(file: string): Promise<T | null> {
  try {
    const raw = await readFile(join(CONTENT_DIR, file), "utf8");
    return yaml.load(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

// ─── Schemas ───────────────────────────────────────────────────

const CharacterSchema = z.object({
  handle: z.string(),
  class: z.string(),
  image: z.string().optional(),
  tagline: z.string(),
  taglineEn: z.string(),
  lv: z.number(),
  exp: z.number().min(0).max(20),
  hp: z.object({ now: z.number(), max: z.number() }),
  mp: z.object({ now: z.number(), max: z.number() }),
  gold: z.string(),
  home: z.string(),
  location: z.object({
    city: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  idNo: z.string(),
  fileNo: z.string(),
  saveLabel: z.string(),
});

const StatsSchema = z.array(
  z.object({
    k: z.string(),
    v: z.number().min(0).max(22),
    note: z.string(),
  }),
);

const EquipmentSchema = z.array(
  z.object({ slot: z.string(), name: z.string(), lvl: z.string() }),
);

const SkillsSchema = z.array(z.string());

const SocialsSchema = z.array(z.object({ k: z.string(), v: z.string() }));

const NowManualSchema = z.object({
  code: z.string(),
  music: z.string(),
  book: z.string(),
  car: z.string(),
});

const LogSchema = z.array(z.object({ t: z.string(), s: z.string() }));

const ProjectsManualSchema = z.array(
  z.object({
    name: z.string(),
    desc: z.string(),
    lang: z.string(),
    stars: z.number(),
    forks: z.number(),
    url: z.string().url().optional(),
  }),
);

const ItashaSchema = z.array(
  z.object({
    order: z.number(),
    car: z.string(),
    place: z.string(),
    date: z.string(),
    image: z.string().optional(),
  }),
);

// ─── Loaders (each is cached per render) ───────────────────────

export const getCharacter = cache(async () =>
  CharacterSchema.parse(await loadYaml("character.yml")),
);

export const getStats = cache(async () =>
  StatsSchema.parse(await loadYaml("stats.yml")),
);

export const getEquipment = cache(async () =>
  EquipmentSchema.parse(await loadYaml("equipment.yml")),
);

export const getSkills = cache(async () =>
  SkillsSchema.parse(await loadYaml("skills.yml")),
);

export const getSocials = cache(async () =>
  SocialsSchema.parse(await loadYaml("socials.yml")),
);

export const getNowManual = cache(async () =>
  NowManualSchema.parse(await loadYaml("now-manual.yml")),
);

export const getLogManual = cache(async () =>
  LogSchema.parse(await loadYaml("log-manual.yml")),
);

export const getProjectsManual = cache(async () =>
  ProjectsManualSchema.parse(await loadYaml("projects-manual.yml")),
);

// itasha.yml is single-file and has no .example.yml fallback — missing file
// just yields zero entries, which the gallery renders as "garage closed" slots.
export const getItasha = cache(async () => {
  const raw = await loadYamlStrictOptional<unknown>("itasha.yml");
  if (raw == null) return [];
  return ItashaSchema.parse(raw).sort((a, b) => a.order - b.order);
});

// ─── Inferred types ────────────────────────────────────────────

export type Character = z.infer<typeof CharacterSchema>;
export type Stat = z.infer<typeof StatsSchema>[number];
export type EquipmentItem = z.infer<typeof EquipmentSchema>[number];
export type Social = z.infer<typeof SocialsSchema>[number];
export type NowManual = z.infer<typeof NowManualSchema>;
export type LogEntry = z.infer<typeof LogSchema>[number];
export type ProjectManual = z.infer<typeof ProjectsManualSchema>[number];
export type Itasha = z.infer<typeof ItashaSchema>[number];
