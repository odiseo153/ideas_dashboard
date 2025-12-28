"use client";

import { motion } from 'framer-motion';
import { useState } from "react";
import { Calendar, Code, Workflow, Video, Image, ExternalLink, Trash2, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Idea } from '@/types/idea';
import { IDEA_STATUS_META } from "@/types/idea";
import { cn } from '@/lib/utils';

interface IdeaCardProps {
  idea: Idea;
  index: number;
  onClick: () => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Idea["status"]) => void;
  isDeleting?: boolean;
  isUpdatingStatus?: boolean;
}

const socialIcons: Record<string, string> = {
  Instagram: '📸',
  TikTok: '🎵',
  LinkedIn: '💼',
  Twitter: '𝕏',
  YouTube: '▶️',
};

export function IdeaCard({
  idea,
  index,
  onClick,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdatingStatus,
}: IdeaCardProps) {
  const isWebApp = idea.tipo_idea === 'web_app';
  const isVideo = idea.tipo_post === 'video';
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const statusMeta = IDEA_STATUS_META[idea.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        onClick={onClick}
        className={cn(
          'group cursor-pointer overflow-hidden card-hover glass',
          'border-border/50 hover:border-primary/30'
        )}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-lg',
                  isWebApp ? 'bg-webapp/20' : 'bg-workflow/20'
                )}
              >
                {isWebApp ? (
                  <Code className="h-4 w-4 text-webapp" />
                ) : (
                  <Workflow className="h-4 w-4 text-workflow" />
                )}
              </div>
              <Badge variant={isWebApp ? 'webapp' : 'workflow'}>
                {isWebApp ? 'Web App' : 'Workflow'}
              </Badge>
              <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isVideo ? 'video' : 'image'} className="gap-1">
                {isVideo ? (
                  <Video className="h-3 w-3" />
                ) : (
                  <Image className="h-3 w-3" />
                )}
                {isVideo ? 'Video' : 'Imagen'}
              </Badge>

              {/* Status menu */}
              <DropdownMenu open={statusMenuOpen} onOpenChange={setStatusMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    disabled={isUpdatingStatus || isDeleting}
                  >
                    Status <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => {
                    // Prevent card click when selecting a status
                    e.stopPropagation();
                  }}
                >
                  <DropdownMenuLabel>Cambiar status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup
                    value={String(idea.status)}
                    onValueChange={(value) => {
                      const next = Number(value) as Idea["status"];
                      if (next === idea.status) return;
                      onStatusChange(idea.id, next);
                      setStatusMenuOpen(false);
                    }}
                  >
                    <DropdownMenuRadioItem value="1">Pending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="2">Progress</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="3">Posting</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="4">Rejected</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => e.stopPropagation()}
                    disabled={isDeleting || isUpdatingStatus}
                    aria-label="Delete idea"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar idea?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esto borrará la idea permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => onDelete(idea.id)}
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <h3 className="mt-3 text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
            {idea.idea}
          </h3>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(idea.fecha).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            <span className="text-border">•</span>
            <span className="text-accent-foreground font-medium">{idea.nicho}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {idea.body}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {idea.redes_sociales.slice(0, 4).map((red) => (
                <Badge key={red} variant="social" className="text-xs px-2">
                  {socialIcons[red] || '🌐'} {red}
                </Badge>
              ))}
              {idea.redes_sociales.length > 4 && (
                <Badge variant="social" className="text-xs px-2">
                  +{idea.redes_sociales.length - 4}
                </Badge>
              )}
            </div>

            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

