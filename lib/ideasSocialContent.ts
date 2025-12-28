import type { Idea, IdeaStatus, TipoIdea, TipoPost } from "@/types/idea";

export type IdeasSocialContentRow = {
  id: number;
  fecha: string; // Postgres DATE -> "YYYY-MM-DD"
  nicho: string;
  body: string;
  tipo_idea: string | null;
  tipo_post: string | null;
  guion: string | null;
  idea: string;
  status: number;
  web_app_prompt: string | null;
  db_structure: string | null;
  redes_sociales: string; // stored as TEXT in DB
  images_prompt: string; // stored as TEXT in DB
  created_at: string | null;
  updated_at: string | null;
};

const isTipoIdea = (v: unknown): v is TipoIdea => v === "web_app" || v === "workflow_n8n";
const isTipoPost = (v: unknown): v is TipoPost => v === "video" || v === "imagen";

export function toIdeaStatus(value: unknown): IdeaStatus {
  const n = typeof value === "number" ? value : Number(value);
  if (n === 1 || n === 2 || n === 3 || n === 4) return n;
  return 1;
}

export function parseRedesSociales(input: string | null | undefined): string[] {
  const raw = (input ?? "").trim();
  if (!raw) return [];

  // If it's JSON (common pattern when TEXT stores serialized arrays)
  if (raw.startsWith("[") && raw.endsWith("]")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((s) => s.trim()).filter(Boolean);
      }
    } catch {
      // fall through to delimiter parsing
    }
  }

  // Fallback: comma / newline separated
  return raw
    .split(/[,|\n]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function mapIdeasSocialContentRow(row: IdeasSocialContentRow): Idea {
  const tipoIdea = isTipoIdea(row.tipo_idea) ? row.tipo_idea : null;
  const tipoPost = isTipoPost(row.tipo_post) ? row.tipo_post : null;

  return {
    id: row.id,
    fecha: row.fecha,
    nicho: row.nicho,
    body: row.body,
    tipo_idea: tipoIdea,
    tipo_post: tipoPost,
    guion: row.guion,
    idea: row.idea,
    status: toIdeaStatus(row.status),
    web_app_prompt: row.web_app_prompt,
    db_structure: row.db_structure,
    redes_sociales: parseRedesSociales(row.redes_sociales),
    images_prompt: parseRedesSociales(row.images_prompt),
  };
}

