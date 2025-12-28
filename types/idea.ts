export type TipoIdea = 'web_app' | 'workflow_n8n';
export type TipoPost = 'video' | 'imagen';
export type IdeaStatus = 1 | 2 | 3 | 4;

export const IDEA_STATUS_META: Record<
  IdeaStatus,
  {
    label: "Pending" | "Progress" | "Posting" | "Rejected";
    badgeVariant: "pending" | "progress" | "posting" | "rejected";
  }
> = {
  1: { label: "Pending", badgeVariant: "pending" },
  2: { label: "Progress", badgeVariant: "progress" },
  3: { label: "Posting", badgeVariant: "posting" },
  4: { label: "Rejected", badgeVariant: "rejected" },
};

export interface Idea {
  id: number;
  fecha: string;
  nicho: string;
  body: string;
  tipo_idea: TipoIdea | null;
  tipo_post: TipoPost | null;
  guion?: string | null;
  idea: string;
  status: IdeaStatus;
  web_app_prompt?: string | null;
  db_structure?: string | null;
  redes_sociales: string[];
  images_prompt: string[];
}

