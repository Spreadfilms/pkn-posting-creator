'use client'

import React from 'react'
import type { PostingConfig, Format } from '@/types/posting'
import { FORMAT_DIMENSIONS } from '@/types/posting'
import { PostingGraphic } from './posting-graphic'

interface PreviewCanvasProps {
  config: PostingConfig
  updateConfig: (updates: Partial<PostingConfig>) => void
}

const FORMAT_LABELS: Record<Format, string> = {
  '1:1': '1080 × 1080 px',
  '4:3': '1200 × 900 px',
  '3:4': '900 × 1200 px',
  '16:9': '1200 × 675 px',
  '9:16': '1080 × 1920 px',
}

export function PreviewCanvas({ config, updateConfig }: PreviewCanvasProps) {
  const getMainPreviewScale = () => {
    const { width, height } = FORMAT_DIMENSIONS[config.format]
    const maxWidth = 750
    const maxHeight = 580
    const scaleX = maxWidth / width
    const scaleY = maxHeight / height
    const scale = Math.min(scaleX, scaleY, 1)
    return { scale, width: width * scale, height: height * scale }
  }

  const getMiniDimensions = (format: Format) => {
    const scale = 0.08
    const { width, height } = FORMAT_DIMENSIONS[format]
    return { width: width * scale, height: height * scale }
  }

  const mainPreview = getMainPreviewScale()

  return (
    <div className="flex-1 overflow-y-auto p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Live Preview</h2>
            <p className="text-sm text-gray-400">{FORMAT_LABELS[config.format]}</p>
            <p className="text-xs text-cyan-400 mt-1">✓ Was du siehst = Finales Posting</p>
          </div>
          {/* Format Quick Switcher */}
          <div className="flex gap-2">
            {(['1:1', '4:3', '3:4', '16:9', '9:16'] as const).map((format) => (
              <button
                key={format}
                onClick={() => updateConfig({ format })}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  config.format === format
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Main Preview */}
        <div className="relative flex justify-center items-center" style={{ minHeight: '620px' }}>
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl" />
          <div
            className="relative bg-black/40 backdrop-blur-sm rounded-2xl border-2 border-cyan-500/50 overflow-hidden shadow-2xl"
            style={{ width: `${mainPreview.width}px`, height: `${mainPreview.height}px` }}
          >
            <div
              style={{
                transform: `scale(${mainPreview.scale})`,
                transformOrigin: 'top left',
                width: `${(1 / mainPreview.scale) * 100}%`,
                height: `${(1 / mainPreview.scale) * 100}%`,
              }}
            >
              <PostingGraphic config={config} />
            </div>
          </div>
        </div>

        {/* Mini Previews */}
        <div className="mt-8 grid grid-cols-5 gap-3">
          {(['1:1', '4:3', '3:4', '16:9', '9:16'] as const).map((format) => {
            const dims = getMiniDimensions(format)
            return (
              <div key={format}>
                <p className="text-xs text-gray-400 mb-2 text-center">{format}</p>
                <div
                  className="relative bg-black/20 rounded-lg border border-white/10 overflow-hidden mx-auto cursor-pointer hover:border-cyan-500/50 transition-all"
                  style={{ width: `${dims.width}px`, height: `${dims.height}px` }}
                  onClick={() => updateConfig({ format })}
                >
                  <div style={{ transform: 'scale(0.08)', transformOrigin: 'top left', width: '1250%', height: '1250%' }}>
                    <PostingGraphic config={{ ...config, format }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hidden export containers */}
      <div className="fixed -top-[9999px] -left-[9999px] pointer-events-none">
        {(['1:1', '4:3', '3:4', '16:9', '9:16'] as const).map((format) => (
          <div key={format} id={`export-${format}`}>
            <PostingGraphic config={{ ...config, format }} forExport={true} />
          </div>
        ))}
      </div>
    </div>
  )
}
