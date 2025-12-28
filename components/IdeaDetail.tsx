"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from "react";
import { X, Calendar, Code, Workflow, Video, Image, Database, FileText, Sparkles, Trash2, ChevronDown, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Idea } from '@/types/idea';
import { IDEA_STATUS_META } from "@/types/idea";
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface IdeaDetailProps {
  idea: Idea | null;
  onClose: () => void;
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

export function IdeaDetail({
  idea,
  onClose,
  onDelete,
  onStatusChange,
  isDeleting,
  isUpdatingStatus,
}: IdeaDetailProps) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  if (!idea) return null;

  const isWebApp = idea.tipo_idea === 'web_app';
  const isVideo = idea.tipo_post === 'video';
  const statusMeta = IDEA_STATUS_META[idea.status];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed right-0 top-0 h-full w-full max-w-2xl border-l border-border bg-card shadow-2xl"
        >
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border p-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl',
                      isWebApp ? 'bg-webapp/20' : 'bg-workflow/20'
                    )}
                  >
                    {isWebApp ? (
                      <Code className="h-5 w-5 text-webapp" />
                    ) : (
                      <Workflow className="h-5 w-5 text-workflow" />
                    )}
                  </div>
                  <Badge variant={isWebApp ? 'webapp' : 'workflow'}>
                    {isWebApp ? 'Web App' : 'Workflow n8n'}
                  </Badge>
                  <Badge variant={isVideo ? 'video' : 'image'}>
                    {isVideo ? (
                      <Video className="h-3 w-3 mr-1" />
                    ) : (
                      <Image className="h-3 w-3 mr-1" />
                    )}
                    {isVideo ? 'Video' : 'Imagen'}
                  </Badge>
                  <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {idea.idea}
                </h2>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(idea.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="text-border">•</span>
                  <span className="text-accent-foreground font-medium">
                    {idea.nicho}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <DropdownMenu open={statusMenuOpen} onOpenChange={setStatusMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={(e) => e.stopPropagation()}
                      disabled={isUpdatingStatus || isDeleting}
                    >
                      Status <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
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

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
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

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Description */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Descripción
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted/50"
                      onClick={() => {
                        navigator.clipboard.writeText(idea.body);
                        toast.success('Descripción copiada al portapapeles');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-foreground leading-relaxed">{idea.body}</p>
                </section>

                <Separator className="bg-border/50" />

                {/* Social Networks */}
                <section>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Redes Sociales
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {idea.redes_sociales.map((red) => (
                      <Badge key={red} variant="social" className="px-3 py-1.5">
                        <span className="mr-1.5">{socialIcons[red] || '🌐'}</span>
                        {red}
                      </Badge>
                    ))}
                  </div>
                </section>

                <Separator className="bg-border/50" />

                  {/* Images Prompts */}
                  <section>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Prompts de imágenes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(idea.images_prompt || []).map((prompt) => (
                      <div key={prompt} className="relative rounded-lg bg-muted/50 p-4 font-mono text-sm text-foreground whitespace-pre-wrap">
                        <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-muted/80"
                        onClick={() => {
                          navigator.clipboard.writeText(prompt || '');
                          toast.success('Prompt de imagen copiado al portapapeles');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                        {prompt}
                      </div>
                    ))}
                  </div>
                </section>

                <Separator className="bg-border/50" />

                {/* Script */}
                <section>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    <FileText className="h-4 w-4" />
                    Guión
                  </h3>
                  <div className="relative rounded-lg bg-muted/50 p-4 font-mono text-sm text-foreground whitespace-pre-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-muted/80"
                      onClick={() => {
                        navigator.clipboard.writeText(idea.guion || '');
                        toast.success('Guión copiado al portapapeles');
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {idea.guion?.trim() ? idea.guion : "—"}
                  </div>
                </section>

                {/* Web App Prompt (if applicable) */}
                {isWebApp && idea.web_app_prompt && (
                  <>
                    <Separator className="bg-border/50" />
                    <section>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        <Sparkles className="h-4 w-4 text-webapp" />
                        AI Prompt
                      </h3>
                      <div className="relative rounded-lg border border-webapp/30 bg-webapp/5 p-4 text-sm text-foreground">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-webapp/20"
                          onClick={() => {
                            navigator.clipboard.writeText(idea.web_app_prompt || '');
                            toast.success('Prompt copiado al portapapeles');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {idea.web_app_prompt}
                      </div>
                    </section>
                  </>
                )}

                {/* Database Structure */}
                {idea.db_structure && (
                  <>
                    <Separator className="bg-border/50" />
                    <section>
                      <h3 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                        <Database className="h-4 w-4 text-secondary" />
                        Estructura de BD
                      </h3>
                      <div className="relative rounded-lg bg-muted/50 p-4 font-mono text-sm text-foreground whitespace-pre-wrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-secondary/20"
                          onClick={() => {
                            navigator.clipboard.writeText(idea.db_structure || '');
                            toast.success('Estructura de BD copiada al portapapeles');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {idea.db_structure.trim() ? idea.db_structure : "—"}
                      </div>
                    </section>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

