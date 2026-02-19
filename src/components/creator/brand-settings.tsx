'use client'

import React, { useRef } from 'react'
import type { PostingConfig, BrandSettings } from '@/types/posting'
import { Upload, Palette, Type } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BrandSettingsProps {
  config: PostingConfig
  updateConfig: (updates: Partial<PostingConfig>) => void
}

export function BrandSettingsComponent({ config, updateConfig }: BrandSettingsProps) {
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateBrandSettings({ logo: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const updateBrandSettings = (updates: Partial<BrandSettings>) => {
    updateConfig({
      brandSettings: { ...config.brandSettings, ...updates },
    })
  }

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <div>
        <Label className="text-gray-300 mb-3 block">Brand Logo</Label>
        <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
        <div
          onClick={() => logoInputRef.current?.click()}
          className="relative border-2 border-dashed border-white/30 rounded-xl p-6 cursor-pointer hover:border-cyan-400 transition-all bg-white/5 hover:bg-white/10"
        >
          {config.brandSettings.logo ? (
            <div className="space-y-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={config.brandSettings.logo} alt="Brand Logo" className="h-16 mx-auto object-contain" />
              <p className="text-xs text-cyan-400 text-center">Klicken zum Ersetzen</p>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Logo hochladen</p>
                <p className="text-xs text-gray-400">PNG, SVG, JPG</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">ℹ️ Mindestgröße: 30 x 8 mm | Schutzraum beachten</p>
      </div>

      {/* Logo Text Fallback */}
      <div>
        <Label htmlFor="logoText" className="text-gray-300">Logo Text (Fallback)</Label>
        <Input
          id="logoText"
          value={config.brandSettings.logoText}
          onChange={(e) => updateBrandSettings({ logoText: e.target.value })}
          className="mt-2 bg-white/5 border-white/20 text-white"
          placeholder="PKN"
        />
        <p className="text-xs text-gray-500 mt-1">Wird verwendet, wenn kein Logo hochgeladen ist</p>
      </div>

      {/* Logo Size */}
      <div>
        <Label className="text-gray-300 mb-2 block">Logo-Größe</Label>
        <Select
          value={config.brandSettings.logoSize}
          onValueChange={(v) => updateBrandSettings({ logoSize: v as 'small' | 'medium' | 'large' })}
        >
          <SelectTrigger className="bg-white/5 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Klein</SelectItem>
            <SelectItem value="medium">Mittel (Standard)</SelectItem>
            <SelectItem value="large">Groß</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logo Background Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div>
          <Label className="text-gray-300">Logo-Hintergrund</Label>
          <p className="text-xs text-gray-500 mt-1">Glass-Container um das Logo</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.brandSettings.logoBackground}
            onChange={(e) => updateBrandSettings({ logoBackground: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
        </label>
      </div>

      {/* Logo Color */}
      <div>
        <Label className="text-gray-300 mb-2 block">Logo-Farbe</Label>
        <Select
          value={config.brandSettings.logoColor}
          onValueChange={(v) => updateBrandSettings({ logoColor: v as 'original' | 'white' | 'black' | 'primary' })}
        >
          <SelectTrigger className="bg-white/5 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="original">Original</SelectItem>
            <SelectItem value="white">Weiß</SelectItem>
            <SelectItem value="black">Schwarz</SelectItem>
            <SelectItem value="primary">Primärfarbe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Primary Color */}
      <div>
        <Label className="text-gray-300 mb-3 block">
          <Palette className="w-4 h-4 inline mr-2" />
          Primärfarbe
        </Label>
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-lg" style={{ backgroundColor: config.brandSettings.primaryColor }} />
          <div className="flex-1">
            <Input
              type="text"
              value={config.brandSettings.primaryColor}
              onChange={(e) => updateBrandSettings({ primaryColor: e.target.value })}
              className="bg-white/5 border-white/20 text-white mb-2"
              placeholder="#01AAD5"
            />
            <Input
              type="color"
              value={config.brandSettings.primaryColor}
              onChange={(e) => updateBrandSettings({ primaryColor: e.target.value })}
              className="w-full h-8 bg-transparent border-white/20 cursor-pointer"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">PKN Standard: #01AAD5</p>
      </div>

      {/* Secondary Color */}
      <div>
        <Label className="text-gray-300 mb-3 block">
          <Palette className="w-4 h-4 inline mr-2" />
          Sekundärfarbe
        </Label>
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-lg border-2 border-white/20 shadow-lg" style={{ backgroundColor: config.brandSettings.secondaryColor }} />
          <div className="flex-1">
            <Input
              type="text"
              value={config.brandSettings.secondaryColor}
              onChange={(e) => updateBrandSettings({ secondaryColor: e.target.value })}
              className="bg-white/5 border-white/20 text-white mb-2"
              placeholder="#1D1D1B"
            />
            <Input
              type="color"
              value={config.brandSettings.secondaryColor}
              onChange={(e) => updateBrandSettings({ secondaryColor: e.target.value })}
              className="w-full h-8 bg-transparent border-white/20 cursor-pointer"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">PKN Standard: #1D1D1B</p>
      </div>

      {/* Font Family */}
      <div>
        <Label className="text-gray-300 mb-2 block">
          <Type className="w-4 h-4 inline mr-2" />
          Schriftart
        </Label>
        <Select
          value={config.brandSettings.fontFamily}
          onValueChange={(v) => updateBrandSettings({ fontFamily: v as 'Vazirmatn' | 'Segoe UI' | 'Inter' })}
        >
          <SelectTrigger className="bg-white/5 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vazirmatn">Vazirmatn (PKN Standard)</SelectItem>
            <SelectItem value="Segoe UI">Segoe UI (Kommunikation)</SelectItem>
            <SelectItem value="Inter">Inter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => updateConfig({
          brandSettings: {
            logo: null,
            logoText: 'PKN',
            primaryColor: '#01AAD5',
            secondaryColor: '#1D1D1B',
            fontFamily: 'Vazirmatn',
            logoSize: 'medium',
            logoBackground: true,
            logoColor: 'primary',
          },
        })}
        className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/20 text-white text-sm font-medium transition-all"
      >
        PKN Standards wiederherstellen
      </button>
    </div>
  )
}
