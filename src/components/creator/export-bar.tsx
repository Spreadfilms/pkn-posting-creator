'use client'

import React, { useState } from 'react'
import type { PostingConfig, Format } from '@/types/posting'
import { FORMAT_DIMENSIONS } from '@/types/posting'
import { Download, FileImage, Loader2, LogOut } from 'lucide-react'
import { toast } from 'sonner'

interface ExportBarProps {
  config: PostingConfig
}

async function captureElement(format: Format): Promise<string> {
  const element = document.getElementById(`export-${format}`)
  if (!element) throw new Error(`Export element nicht gefunden: ${format}`)

  // Dynamically import html2canvas
  const { default: html2canvas } = await import('html2canvas')

  const { width, height } = FORMAT_DIMENSIONS[format]

  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0118',
    scale: 2,
    width,
    height,
    logging: false,
    useCORS: true,
    allowTaint: true,
    imageTimeout: 0,
    onclone: (clonedDoc) => {
      // Fix oklch colors in cloned document
      const styleSheets = clonedDoc.styleSheets
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const sheet = styleSheets[i]
          if (sheet.cssRules) {
            for (let j = sheet.cssRules.length - 1; j >= 0; j--) {
              const rule = sheet.cssRules[j]
              if (rule.cssText && rule.cssText.includes('oklch')) {
                sheet.deleteRule(j)
              }
            }
          }
        } catch {
          // Skip cross-origin
        }
      }
    },
  })

  return canvas.toDataURL('image/png', 1.0)
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function getFilename(config: PostingConfig, format: Format): string {
  const date = new Date().toISOString().slice(0, 10)
  const typeStr = config.postType.replace('-', '_')
  const formatStr = format.replace(':', 'x')
  return `PKN_${typeStr}_${formatStr}_${date}.png`
}

export function ExportBar({ config }: ExportBarProps) {
  const [exporting, setExporting] = useState<string | null>(null)

  const exportFormat = async (format: Format) => {
    if (exporting) return
    setExporting(format)
    try {
      await new Promise((r) => setTimeout(r, 100)) // Wait for render
      const dataUrl = await captureElement(format)
      downloadDataUrl(dataUrl, getFilename(config, format))
      toast.success(`${format} exportiert!`)
    } catch (err) {
      console.error('Export fehler:', err)
      toast.error('Export fehlgeschlagen')
    } finally {
      setExporting(null)
    }
  }

  const exportAll = async () => {
    if (exporting) return
    setExporting('all')
    const formats: Format[] = ['1:1', '4:3', '3:4', '16:9', '9:16']
    let success = 0

    try {
      // Collect all exports first, then create ZIP
      const exports: { dataUrl: string; filename: string }[] = []

      for (const format of formats) {
        try {
          await new Promise((r) => setTimeout(r, 100))
          const dataUrl = await captureElement(format)
          exports.push({ dataUrl, filename: getFilename(config, format) })
          success++
        } catch (err) {
          console.error(`Export ${format} fehlgeschlagen:`, err)
        }
      }

      if (exports.length === 0) {
        toast.error('Kein Export erfolgreich')
        return
      }

      // Create ZIP
      const { default: JSZip } = await import('jszip')
      const zip = new JSZip()
      const folder = zip.folder('PKN_Postings') || zip

      for (const { dataUrl, filename } of exports) {
        // Convert dataUrl to Blob
        const base64 = dataUrl.split(',')[1]
        folder.file(filename, base64, { base64: true })
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const zipUrl = URL.createObjectURL(zipBlob)
      const date = new Date().toISOString().slice(0, 10)
      downloadDataUrl(zipUrl, `PKN_Postings_${date}.zip`)
      URL.revokeObjectURL(zipUrl)

      toast.success(`${success} Formate als ZIP exportiert!`)
    } catch (err) {
      console.error('ZIP Export fehlgeschlagen:', err)
      toast.error('ZIP Export fehlgeschlagen')
    } finally {
      setExporting(null)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    window.location.href = '/'
  }

  const isExporting = exporting !== null

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/40 backdrop-blur-xl z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 text-sm transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          <div className="flex items-center gap-2">
            {/* Individual Format Exports */}
            {(['1:1', '4:3', '3:4', '16:9', '9:16'] as const).map((format) => (
              <button
                key={format}
                onClick={() => exportFormat(format)}
                disabled={isExporting}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {exporting === format ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileImage className="w-3.5 h-3.5" />
                )}
                {format}
              </button>
            ))}

            <div className="w-px h-8 bg-white/20" />

            {/* Export All */}
            <button
              onClick={exportAll}
              disabled={isExporting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting === 'all' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Export All (ZIP)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
