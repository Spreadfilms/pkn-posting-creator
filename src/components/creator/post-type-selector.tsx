'use client'

import React from 'react'
import type { PostingConfig, PostType } from '@/types/posting'
import { Calendar, Megaphone, Image, MessageSquareQuote, TrendingUp, Briefcase, Users, Bell, Presentation, Layers } from 'lucide-react'

interface PostTypeSelectorProps {
  config: PostingConfig
  updateConfig: (updates: Partial<PostingConfig>) => void
}

const POST_TYPES: { type: PostType; label: string; icon: React.ReactNode; description: string; defaults: Partial<PostingConfig> }[] = [
  {
    type: 'event',
    label: 'Event',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Hero Split',
    defaults: { pillLabel: 'Event', ctaLabel: 'Jetzt anmelden', ctaMode: 'primary', pillEnabled: true },
  },
  {
    type: 'announcement',
    label: 'Announcement',
    icon: <Megaphone className="w-5 h-5" />,
    description: 'Big Headline',
    defaults: { pillLabel: 'Neu', ctaLabel: 'Mehr erfahren', ctaMode: 'primary', pillEnabled: true },
  },
  {
    type: 'pure-visual',
    label: 'Pure Visual',
    icon: <Image className="w-5 h-5" />,
    description: 'Minimal',
    defaults: { pillEnabled: false, ctaMode: 'off', statsMode: 'off' },
  },
  {
    type: 'quote',
    label: 'Quote',
    icon: <MessageSquareQuote className="w-5 h-5" />,
    description: 'Statement',
    defaults: { pillLabel: 'Quote', pillEnabled: true, ctaMode: 'off' },
  },
  {
    type: 'stat',
    label: 'Stats',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'Proof Points',
    defaults: { statsMode: 'three', pillEnabled: true, ctaMode: 'off' },
  },
  {
    type: 'service',
    label: 'Service',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Spotlight',
    defaults: { pillLabel: 'Service', ctaLabel: 'Mehr erfahren', ctaMode: 'primary', pillEnabled: true },
  },
  {
    type: 'hiring',
    label: 'Hiring',
    icon: <Users className="w-5 h-5" />,
    description: 'Team Post',
    defaults: { pillLabel: 'Job', ctaLabel: 'Jetzt bewerben', ctaMode: 'primary', pillEnabled: true },
  },
  {
    type: 'reminder',
    label: 'Reminder',
    icon: <Bell className="w-5 h-5" />,
    description: 'Hinweis',
    defaults: { pillLabel: 'Reminder', pillEnabled: true, ctaMode: 'off' },
  },
  {
    type: 'presentation',
    label: 'Presentation',
    icon: <Presentation className="w-5 h-5" />,
    description: 'Visual Slide',
    defaults: { pillEnabled: true, ctaMode: 'primary' },
  },
  {
    type: 'carousel',
    label: 'Carousel',
    icon: <Layers className="w-5 h-5" />,
    description: 'Multi Slide',
    defaults: { pillEnabled: false, ctaMode: 'off' },
  },
]

export function PostTypeSelector({ config, updateConfig }: PostTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {POST_TYPES.map(({ type, label, icon, description, defaults }) => (
        <button
          key={type}
          onClick={() => updateConfig({ postType: type, ...defaults })}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            config.postType === type
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }`}
        >
          <div className={`mb-2 ${config.postType === type ? 'text-cyan-400' : 'text-gray-400'}`}>
            {icon}
          </div>
          <div className="text-white font-semibold text-sm">{label}</div>
          <div className="text-gray-500 text-xs">{description}</div>
        </button>
      ))}
    </div>
  )
}
