"use client";

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IdeaCard } from '@/components/IdeaCard';
import { IdeaDetail } from '@/components/IdeaDetail';
import { FilterBar } from '@/components/FilterBar';
import { StatsBar } from '@/components/StatsBar';
import { Logo } from "@/components/Logo";
import { mockIdeas } from '@/data/mockIdeas';
import { Idea, type IdeaStatus, TipoIdea, TipoPost } from '@/types/idea';
import { toast } from "sonner";
import { deleteIdea, fetchIdeas, updateIdeaStatus } from "@/lib/api";

export default function Home() {
  const [search, setSearch] = useState('');
  const [tipoIdea, setTipoIdea] = useState<TipoIdea | null>(null);
  const [tipoPost, setTipoPost] = useState<TipoPost | null>(null);
  const [status, setStatus] = useState<IdeaStatus | null>(null);
  const [selectedRed, setSelectedRed] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const queryClient = useQueryClient();

  const ideasQuery = useQuery({
    queryKey: ["ideas_social_content"],
    queryFn: async (): Promise<Idea[]> => {
      try {
        return await fetchIdeas();
      } catch {
        // Keep local dev usable even if API isn't running
        return mockIdeas;
      }
    },
  });

  const deleteIdeaMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteIdea(id);
    },
    onSuccess: async (_data, id) => {
      toast.success("Idea eliminada");
      if (selectedIdea?.id === id) setSelectedIdea(null);
      await queryClient.invalidateQueries({ queryKey: ["ideas_social_content"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "No se pudo eliminar la idea";
      toast.error(message);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (params: { id: number; status: Idea["status"] }) => {
      await updateIdeaStatus(params);
    },
    onSuccess: async (_data, variables) => {
      toast.success("Status actualizado");
      if (selectedIdea?.id === variables.id) {
        setSelectedIdea({ ...selectedIdea, status: variables.status });
      }
      await queryClient.invalidateQueries({ queryKey: ["ideas_social_content"] });
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "No se pudo actualizar el status";
      toast.error(message);
    },
  });

  const ideas = useMemo(() => ideasQuery.data ?? [], [ideasQuery.data]);

  // Get all unique social networks
  const availableRedes = useMemo(() => {
    const redes = new Set<string>();
    ideas.forEach((idea) => {
      idea.redes_sociales.forEach((red) => redes.add(red));
    });
    return Array.from(redes).sort();
  }, [ideas]);

  // Filter ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesSearch =
          idea.idea.toLowerCase().includes(searchLower) ||
          idea.body.toLowerCase().includes(searchLower) ||
          idea.nicho.toLowerCase().includes(searchLower) ||
          (idea.guion ?? "").toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Tipo idea filter
      if (tipoIdea && idea.tipo_idea !== tipoIdea) return false;

      // Tipo post filter
      if (tipoPost && idea.tipo_post !== tipoPost) return false;

      // Status filter
      if (status && idea.status !== status) return false;

      // Social network filter
      if (selectedRed && !idea.redes_sociales.includes(selectedRed)) return false;

      return true;
    });
  }, [ideas, search, tipoIdea, tipoPost, status, selectedRed]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Glow Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Logo className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">Ideas</span>{' '}
              <span className="text-foreground">Explorer</span>
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Explora ideas de automatización y aplicaciones web generadas por IA. 
            Filtra por tipo, formato y redes sociales para encontrar inspiración.
          </p>
        </motion.header>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <StatsBar ideas={ideas} />
        </motion.section>

        {/* Filters */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            tipoIdea={tipoIdea}
            onTipoIdeaChange={setTipoIdea}
            tipoPost={tipoPost}
            onTipoPostChange={setTipoPost}
            status={status}
            onStatusChange={setStatus}
            selectedRed={selectedRed}
            onRedChange={setSelectedRed}
            availableRedes={availableRedes}
            totalResults={filteredIdeas.length}
          />
        </motion.section>

        {/* Ideas Grid */}
        <section>
          {ideasQuery.isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="rounded-full bg-muted/50 p-6 mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Cargando ideas...
              </h3>
              <p className="text-muted-foreground max-w-md">
                Obteniendo datos desde Postgres API (o mock data si no está disponible).
              </p>
            </motion.div>
          ) : filteredIdeas.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredIdeas.map((idea, index) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  index={index}
                  onClick={() => setSelectedIdea(idea)}
                  onDelete={(id) => deleteIdeaMutation.mutate(id)}
                  onStatusChange={(id, status) => updateStatusMutation.mutate({ id, status })}
                  isDeleting={deleteIdeaMutation.isPending && deleteIdeaMutation.variables === idea.id}
                  isUpdatingStatus={
                    updateStatusMutation.isPending && updateStatusMutation.variables?.id === idea.id
                  }
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="rounded-full bg-muted/50 p-6 mb-4">
                <Sparkles className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No se encontraron ideas
              </h3>
              <p className="text-muted-foreground max-w-md">
                Intenta ajustar los filtros o el término de búsqueda para encontrar más resultados.
              </p>
              {ideasQuery.error && (
                <p className="text-sm text-destructive mt-4 max-w-md">
                  Error cargando desde API/Postgres:{" "}
                  {ideasQuery.error instanceof Error ? ideasQuery.error.message : "Error desconocido"}
                </p>
              )}
            </motion.div>
          )}
        </section>
      </div>

      {/* Detail Drawer */}
      {selectedIdea && (
        <IdeaDetail
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onDelete={(id) => deleteIdeaMutation.mutate(id)}
          onStatusChange={(id, status) => updateStatusMutation.mutate({ id, status })}
          isDeleting={deleteIdeaMutation.isPending && deleteIdeaMutation.variables === selectedIdea.id}
          isUpdatingStatus={
            updateStatusMutation.isPending && updateStatusMutation.variables?.id === selectedIdea.id
          }
        />
      )}
    </div>
  );
}
