"use client";

import { motion } from 'framer-motion';
import { Lightbulb, Code, Workflow, Video, Image } from 'lucide-react';
import { Idea } from '@/types/idea';

interface StatsBarProps {
  ideas: Idea[];
}

export function StatsBar({ ideas }: StatsBarProps) {
  const stats = {
    total: ideas.length,
    webApps: ideas.filter((i) => i.tipo_idea === 'web_app').length,
    workflows: ideas.filter((i) => i.tipo_idea === 'workflow_n8n').length,
    videos: ideas.filter((i) => i.tipo_post === 'video').length,
    images: ideas.filter((i) => i.tipo_post === 'imagen').length,
  };

  const statItems = [
    { label: 'Total Ideas', value: stats.total, icon: Lightbulb, color: 'text-primary' },
    { label: 'Web Apps', value: stats.webApps, icon: Code, color: 'text-webapp' },
    { label: 'Workflows', value: stats.workflows, icon: Workflow, color: 'text-workflow' },
    { label: 'Videos', value: stats.videos, icon: Video, color: 'text-video' },
    { label: 'Imágenes', value: stats.images, icon: Image, color: 'text-image' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

