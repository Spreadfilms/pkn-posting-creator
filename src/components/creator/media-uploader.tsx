'use client'

import React, { useRef } from 'react'
import type { PostingConfig } from '@/types/posting'
import { Upload, Image as ImageIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'

interface MediaUploaderProps {
  config: PostingConfig
  updateConfig: (updates: Partial<PostingConfig>) => void
}

const GRADIENT_PRESETS = [
  { name: 'Space Blue', value: 'linear-gradient(135deg, #0a0118 0%, #1a0a2e 50%, #0d1b4e 100%)' },
  { name: 'Cyber Cyan', value: 'linear-gradient(135deg, #012830 0%, #014d60 50%, #01AAD5 100%)' },
  { name: 'Deep Ocean', value: 'linear-gradient(135deg, #000428 0%, #004e92 100%)' },
  { name: 'Purple Nebula', value: 'linear-gradient(135deg, #2d1b69 0%, #6a1b9a 50%, #0a0118 100%)' },
  { name: 'Dark Teal', value: 'linear-gradient(135deg, #0d1b2a 0%, #1a3a4a 50%, #0a2a3a 100%)' },
  { name: 'Midnight Blue', value: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a2e 100%)' },
  { name: 'Steel Blue', value: 'linear-gradient(135deg, #1d1d1b 0%, #2d3a4a 50%, #1a2a3a 100%)' },
  { name: 'Galaxy', value: 'linear-gradient(135deg, #0a0118 0%, #12022d 25%, #1a0a2e 50%, #0d1b4e 75%, #0a0118 100%)' },
  { name: 'PKN Brand', value: 'linear-gradient(135deg, #1D1D1B 0%, #01AAD5 100%)' },
  { name: 'PKN Reverse', value: 'linear-gradient(135deg, #01AAD5 0%, #1D1D1B 100%)' },
]

export function MediaUploader({ config, updateConfig }: MediaUploaderProps) {
  const bgInputRef = useRef<HTMLInputElement>(null)
  const featuredInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = React.useState<'gradient' | 'image'>(config.image ? 'image' : 'gradient')

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateConfig({ image: event.target?.result as string, backgroundGradient: null })
        setMode('image')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFeaturedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateConfig({ featuredImage: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const showFeaturedImage = ['event', 'service', 'hiring', 'pure-visual'].includes(config.postType)

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('gradient')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${mode === 'gradient' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
        >
          CI Gradient
        </button>
        <button
          onClick={() => setMode('image')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${mode === 'image' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
        >
          Bild Upload
        </button>
      </div>

      {mode === 'gradient' && (
        <div className="space-y-3">
          <Label className="text-gray-300">CI Gradient-Hintergrund</Label>
          <div className="grid grid-cols-2 gap-2">
            {GRADIENT_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateConfig({ backgroundGradient: preset.value, image: null })}
                className={`relative h-14 rounded-xl border-2 transition-all overflow-hidden ${
                  config.backgroundGradient === preset.value
                    ? 'border-cyan-400 shadow-lg shadow-cyan-500/30'
                    : 'border-white/10 hover:border-white/30'
                }`}
                style={{ background: preset.value }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white/80 bg-black/20">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Space Background Toggle — always visible regardless of bg mode */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div>
          <Label className="text-gray-300">Space-Hintergrund</Label>
          <p className="text-xs text-gray-500 mt-1">Sterne & Glow-Effekte</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.spaceBackgroundEnabled}
            onChange={(e) => updateConfig({ spaceBackgroundEnabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
        </label>
      </div>

      {mode === 'image' && (
        <div className="space-y-4">
          <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
          <div
            onClick={() => bgInputRef.current?.click()}
            className="border-2 border-dashed border-white/30 rounded-xl p-6 cursor-pointer hover:border-cyan-400 transition-all bg-white/5 hover:bg-white/10"
          >
            {config.image ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={config.image} alt="Background" className="h-24 w-full object-cover rounded-lg" />
                <p className="text-xs text-cyan-400 text-center">Klicken zum Ersetzen</p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <p className="text-sm text-white font-medium">Hintergrundbild hochladen</p>
                <p className="text-xs text-gray-400">JPG, PNG, WebP</p>
              </div>
            )}
          </div>

          {config.image && (
            <>
              <div>
                <Label className="text-gray-300 mb-2 block">Verdunklung: {config.imageDarken}%</Label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={config.imageDarken}
                  onChange={(e) => updateConfig({ imageDarken: Number(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
              </div>
              <button
                onClick={() => updateConfig({ image: null })}
                className="w-full py-2 px-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
              >
                Bild entfernen
              </button>
            </>
          )}
        </div>
      )}

      {/* Featured Image */}
      {showFeaturedImage && (
        <div className="pt-4 border-t border-white/10">
          <Label className="text-gray-300 mb-3 block">
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Featured Image (rechte Seite)
          </Label>
          <input ref={featuredInputRef} type="file" accept="image/*" onChange={handleFeaturedUpload} className="hidden" />
          <div
            onClick={() => featuredInputRef.current?.click()}
            className="border-2 border-dashed border-white/30 rounded-xl p-4 cursor-pointer hover:border-cyan-400 transition-all bg-white/5 hover:bg-white/10"
          >
            {config.featuredImage ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={config.featuredImage} alt="Featured" className="h-20 w-full object-cover rounded-lg" />
                <p className="text-xs text-cyan-400 text-center">Klicken zum Ersetzen</p>
              </div>
            ) : (
              <div className="text-center py-2">
                <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                <p className="text-sm text-white">Featured Image hochladen</p>
              </div>
            )}
          </div>
          {config.featuredImage && (
            <button
              onClick={() => updateConfig({ featuredImage: null })}
              className="w-full mt-2 py-2 px-3 rounded-lg text-sm text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
            >
              Entfernen
            </button>
          )}
        </div>
      )}
    </div>
  )
}
