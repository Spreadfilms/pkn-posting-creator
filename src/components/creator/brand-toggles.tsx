'use client'

import React from 'react'
import type { PostingConfig } from '@/types/posting'
import { Label } from '@/components/ui/label'

interface BrandTogglesProps {
  config: PostingConfig
  updateConfig: (updates: Partial<PostingConfig>) => void
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
    </label>
  )
}

function SegmentButtons<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
            value === opt.value ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function BrandToggles({ config, updateConfig }: BrandTogglesProps) {
  return (
    <div className="space-y-4">
      {/* Logo */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Logo</Label>
          <Toggle checked={config.logoEnabled} onChange={(v) => updateConfig({ logoEnabled: v })} />
        </div>
        {config.logoEnabled && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Position</p>
            <div className="grid grid-cols-2 gap-1">
              {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => (
                <button
                  key={pos}
                  onClick={() => updateConfig({ logoPosition: pos })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                    config.logoPosition === pos ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {pos === 'top-left' ? '↖ Links oben' : pos === 'top-right' ? '↗ Rechts oben' : pos === 'bottom-left' ? '↙ Links unten' : '↘ Rechts unten'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pill */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <Label className="text-gray-300">Pill/Tag</Label>
        <Toggle checked={config.pillEnabled} onChange={(v) => updateConfig({ pillEnabled: v })} />
      </div>

      {/* CTA */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">CTA Button</Label>
          <Toggle checked={config.ctaMode !== 'off'} onChange={(v) => updateConfig({ ctaMode: v ? 'primary' : 'off' })} />
        </div>
        {config.ctaMode !== 'off' && (
          <SegmentButtons
            options={[{ value: 'primary', label: 'Primary' }, { value: 'secondary', label: 'Secondary' }]}
            value={config.ctaMode}
            onChange={(v) => updateConfig({ ctaMode: v })}
          />
        )}
      </div>

      {/* Stats */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Statistics</Label>
          <Toggle checked={config.statsMode !== 'off'} onChange={(v) => updateConfig({ statsMode: v ? 'one' : 'off' })} />
        </div>
        {config.statsMode !== 'off' && (
          <SegmentButtons
            options={[{ value: 'one', label: '1 Stat' }, { value: 'three', label: '3 Stats' }]}
            value={config.statsMode}
            onChange={(v) => updateConfig({ statsMode: v })}
          />
        )}
      </div>

      {/* Highlight */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div>
          <Label className="text-gray-300">Highlight Gradient</Label>
          <p className="text-xs text-gray-500 mt-1">Farbverlauf auf Schlüsselwort</p>
        </div>
        <Toggle checked={config.highlightEnabled} onChange={(v) => updateConfig({ highlightEnabled: v })} />
      </div>

      {/* Stars Density */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
        <Label className="text-gray-300 block">Sterne-Dichte</Label>
        <SegmentButtons
          options={[{ value: 'low', label: 'Wenig' }, { value: 'medium', label: 'Mittel' }, { value: 'high', label: 'Viel' }]}
          value={config.backgroundDensity}
          onChange={(v) => updateConfig({ backgroundDensity: v })}
        />
      </div>

      {/* Glow Intensity */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
        <Label className="text-gray-300 block">Glow-Intensität</Label>
        <SegmentButtons
          options={[{ value: 'low', label: 'Schwach' }, { value: 'medium', label: 'Mittel' }, { value: 'high', label: 'Stark' }]}
          value={config.glowIntensity}
          onChange={(v) => updateConfig({ glowIntensity: v })}
        />
      </div>
    </div>
  )
}
