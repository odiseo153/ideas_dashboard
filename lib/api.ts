import type { Idea, IdeaStatus, TipoIdea, TipoPost } from "@/types/idea";

// Tipo de respuesta de la API (Prisma)
interface ApiIdeaResponse {
  id: number;
  fecha: string;
  nicho: string;
  body: string;
  tipo_idea: string | null;
  tipo_post: string | null;
  guion: string | null;
  idea: string;
  status: number;
  web_app_prompt: string | null;
  db_structure: string | null;
  redes_sociales: string[];
  images_prompt: string[];
  created_at: string | null;
  updated_at: string | null;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

function toIdeaStatus(value: number): IdeaStatus {
  if (value === 1 || value === 2 || value === 3 || value === 4) return value;
  return 1;
}

function mapApiResponse(row: ApiIdeaResponse): Idea {
  const isTipoIdea = (v: unknown): v is TipoIdea => v === "web_app" || v === "workflow_n8n";
  const isTipoPost = (v: unknown): v is TipoPost => v === "video" || v === "imagen";

  return {
    id: row.id,
    fecha: row.fecha,
    nicho: row.nicho,
    body: row.body,
    tipo_idea: isTipoIdea(row.tipo_idea) ? row.tipo_idea : null,
    tipo_post: isTipoPost(row.tipo_post) ? row.tipo_post : null,
    guion: row.guion,
    idea: row.idea,
    status: toIdeaStatus(row.status),
    web_app_prompt: row.web_app_prompt,
    db_structure: row.db_structure,
    redes_sociales: row.redes_sociales ?? [],
    images_prompt: row.images_prompt ?? [],
  };
}

export async function fetchIdeas(): Promise<Idea[]> {
  const rows = await apiFetch<ApiIdeaResponse[]>("/api/ideas");
  return rows.map(mapApiResponse);
}

export async function deleteIdea(id: number): Promise<void> {
  await apiFetch(`/api/ideas/${id}`, { method: "DELETE" });
}

export async function updateIdeaStatus(params: { id: number; status: Idea["status"] }): Promise<void> {
  await apiFetch(`/api/ideas/${params.id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status: params.status }),
  });
}
