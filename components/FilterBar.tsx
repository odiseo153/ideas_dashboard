"use client";

import { Search, Code, Workflow, Video, Image, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IDEA_STATUS_META, type IdeaStatus, TipoIdea, TipoPost } from '@/types/idea';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  tipoIdea: TipoIdea | null;
  onTipoIdeaChange: (value: TipoIdea | null) => void;
  tipoPost: TipoPost | null;
  onTipoPostChange: (value: TipoPost | null) => void;
  status: IdeaStatus | null;
  onStatusChange: (value: IdeaStatus | null) => void;
  selectedRed: string | null;
  onRedChange: (value: string | null) => void;
  availableRedes: string[];
  totalResults: number;
}

export function FilterBar({
  search,
  onSearchChange,
  tipoIdea,
  onTipoIdeaChange,
  tipoPost,
  onTipoPostChange,
  status,
  onStatusChange,
  selectedRed,
  onRedChange,
  availableRedes,
  totalResults,
}: FilterBarProps) {
  const hasFilters = search || tipoIdea || tipoPost || status || selectedRed;

  const STATUSES: IdeaStatus[] = [1, 2, 3, 4];

  const statusChipClasses: Record<
    IdeaStatus,
    { active: string; inactive: string }
  > = {
    1: {
      active: "bg-yellow-500/20 text-yellow-300",
      inactive:
        "bg-muted/50 text-muted-foreground hover:bg-yellow-500/10 hover:text-yellow-300",
    },
    2: {
      active: "bg-blue-500/20 text-blue-300",
      inactive:
        "bg-muted/50 text-muted-foreground hover:bg-blue-500/10 hover:text-blue-300",
    },
    3: {
      active: "bg-green-500/20 text-green-300",
      inactive:
        "bg-muted/50 text-muted-foreground hover:bg-green-500/10 hover:text-green-300",
    },
    4: {
      active: "bg-red-500/20 text-red-300",
      inactive:
        "bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-300",
    },
  };

  const clearFilters = () => {
    onSearchChange('');
    onTipoIdeaChange(null);
    onTipoPostChange(null);
    onStatusChange(null);
    onRedChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar ideas, nichos, conceptos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tipo Idea Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Tipo:</span>
          <button
            onClick={() => onTipoIdeaChange(tipoIdea === 'web_app' ? null : 'web_app')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              tipoIdea === 'web_app'
                ? 'bg-webapp text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-webapp/20 hover:text-webapp'
            )}
          >
            <Code className="h-3 w-3" />
            Web App
          </button>
          <button
            onClick={() => onTipoIdeaChange(tipoIdea === 'workflow_n8n' ? null : 'workflow_n8n')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              tipoIdea === 'workflow_n8n'
                ? 'bg-workflow text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-workflow/20 hover:text-workflow'
            )}
          >
            <Workflow className="h-3 w-3" />
            Workflow
          </button>
        </div>

        <div className="h-4 w-px bg-border/50" />

        {/* Tipo Post Filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Formato:</span>
          <button
            onClick={() => onTipoPostChange(tipoPost === 'video' ? null : 'video')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              tipoPost === 'video'
                ? 'bg-video text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-video/20 hover:text-video'
            )}
          >
            <Video className="h-3 w-3" />
            Video
          </button>
          <button
            onClick={() => onTipoPostChange(tipoPost === 'imagen' ? null : 'imagen')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all',
              tipoPost === 'imagen'
                ? 'bg-image text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-image/20 hover:text-image'
            )}
          >
            <Image className="h-3 w-3" />
            Imagen
          </button>
        </div>

        <div className="h-4 w-px bg-border/50" />

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Status:</span>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(status === s ? null : s)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                status === s ? statusChipClasses[s].active : statusChipClasses[s].inactive
              )}
              title={IDEA_STATUS_META[s].label}
            >
              {IDEA_STATUS_META[s].label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-border/50" />

        {/* Social Network Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Red:</span>
          {availableRedes.map((red) => (
            <button
              key={red}
              onClick={() => onRedChange(selectedRed === red ? null : red)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                selectedRed === red
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {red}
            </button>
          ))}
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <>
            <div className="h-4 w-px bg-border/50" />
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          </>
        )}

        {/* Results Count */}
        <div className="ml-auto">
          <Badge variant="outline" className="text-xs">
            {totalResults} {totalResults === 1 ? 'idea' : 'ideas'}
          </Badge>
        </div>
      </div>
    </div>
  );
}

