'use client'

import React from 'react'
import type { PostingConfig } from '@/types/posting'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'

interface PostingGraphicProps {
  config: PostingConfig
  forExport?: boolean
}

// Deterministic "star" positions based on index (no Math.random in render)
function generateStarPositions(count: number): { top: string; left: string; opacity: number }[] {
  const stars = []
  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random based on index
    const x = ((i * 2654435761) >>> 0) % 10000 / 100
    const y = ((i * 1234567891) >>> 0) % 10000 / 100
    const op = (((i * 987654321) >>> 0) % 50) / 100 + 0.2
    stars.push({ top: `${y}%`, left: `${x}%`, opacity: op })
  }
  return stars
}

export function PostingGraphic({ config, forExport = false }: PostingGraphicProps) {
  const dimensions = {
    '1:1': { width: 1080, height: 1080 },
    '4:3': { width: 1200, height: 900 },
    '3:4': { width: 900, height: 1200 },
    '16:9': { width: 1200, height: 675 },
    '9:16': { width: 1080, height: 1920 },
  }

  const { width, height } = dimensions[config.format]
  const fontFamily = config.brandSettings.fontFamily

  const starCount = config.backgroundDensity === 'low' ? 30 : config.backgroundDensity === 'medium' ? 60 : 100
  const glowOpacity = config.glowIntensity === 'low' ? 0.15 : config.glowIntensity === 'medium' ? 0.25 : 0.4

  const isCarousel = config.postType === 'carousel'
  const currentSlide = isCarousel ? config.carouselSlides[config.currentSlideIndex] : null

  const activeImage = isCarousel && currentSlide ? currentSlide.image : config.image
  const activeGradient = isCarousel && currentSlide ? currentSlide.backgroundGradient : config.backgroundGradient

  const stars = generateStarPositions(starCount)

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-br from-[#0a0118] via-[#1a0a2e] to-[#0a0118]"
      style={{ width, height, fontFamily }}
      data-posting-graphic="true"
    >
      {/* Space Background */}
      {config.spaceBackgroundEnabled && (
        <>
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: star.top, left: star.left, opacity: star.opacity }}
            />
          ))}
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-cyan-500 rounded-full blur-[150px]" style={{ opacity: glowOpacity }} />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-600 rounded-full blur-[150px]" style={{ opacity: glowOpacity }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-600 rounded-full blur-[120px]" style={{ opacity: glowOpacity * 0.7 }} />
        </>
      )}

      {/* Gradient Background */}
      {activeGradient && (
        <div className="absolute inset-0" style={{ background: activeGradient }} />
      )}

      {/* Image Background */}
      {activeImage && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: `brightness(${1 - config.imageDarken / 100})` }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"
            style={{ opacity: config.imageDarken / 100 }}
          />
        </div>
      )}

      {/* Content Layer */}
      <div className="relative z-10 h-full">
        {config.postType === 'event' && <EventLayout config={config} />}
        {config.postType === 'announcement' && <AnnouncementLayout config={config} />}
        {config.postType === 'pure-visual' && <PureVisualLayout config={config} />}
        {config.postType === 'quote' && <QuoteLayout config={config} />}
        {config.postType === 'stat' && <StatLayout config={config} />}
        {config.postType === 'service' && <ServiceLayout config={config} />}
        {config.postType === 'hiring' && <HiringLayout config={config} />}
        {config.postType === 'reminder' && <ReminderLayout config={config} />}
        {config.postType === 'presentation' && <PresentationLayout config={config} />}
        {config.postType === 'carousel' && <CarouselLayout config={config} />}
      </div>

      {/* Logo */}
      {config.logoEnabled && <Logo config={config} position={config.logoPosition} />}
    </div>
  )
}

// ---- Sub-components ----

function Logo({ config, position }: { config: PostingConfig; position: PostingConfig['logoPosition'] }) {
  const positionClasses = {
    'top-left': 'top-12 left-12',
    'top-right': 'top-12 right-12',
    'bottom-left': 'bottom-12 left-12',
    'bottom-right': 'bottom-12 right-12',
  }
  const sizeClasses = {
    small: 'h-16',
    medium: 'h-24',
    large: 'h-32',
  }
  const textSizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-5xl',
  }

  const getLogoFilter = () => {
    switch (config.brandSettings.logoColor) {
      case 'white': return 'brightness(0) invert(1)'
      case 'black': return 'brightness(0)'
      case 'primary': return 'brightness(0) saturate(100%)'
      default: return 'none'
    }
  }

  return (
    <div className={`absolute ${positionClasses[position]} z-20`}>
      {config.brandSettings.logo ? (
        config.brandSettings.logoBackground ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.brandSettings.logo}
              alt="Logo"
              className={`${sizeClasses[config.brandSettings.logoSize]} object-contain`}
              style={{ filter: getLogoFilter() }}
            />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.brandSettings.logo}
            alt="Logo"
            className={`${sizeClasses[config.brandSettings.logoSize]} object-contain`}
            style={{ filter: getLogoFilter() }}
          />
        )
      ) : (
        <div
          className="px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/10"
          style={{ background: `linear-gradient(135deg, ${config.brandSettings.primaryColor}, ${config.brandSettings.secondaryColor})` }}
        >
          <span className={`${textSizeClasses[config.brandSettings.logoSize]} font-bold text-white tracking-wider`}>
            {config.brandSettings.logoText}
          </span>
        </div>
      )}
    </div>
  )
}

function Pill({ label, config }: { label: string; config: PostingConfig }) {
  return (
    <div
      className="inline-block px-6 py-2 rounded-full backdrop-blur-sm"
      style={{
        backgroundColor: `${config.brandSettings.primaryColor}33`,
        borderColor: `${config.brandSettings.primaryColor}80`,
        borderWidth: '1px',
        borderStyle: 'solid',
      }}
    >
      <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: config.brandSettings.primaryColor }}>
        {label}
      </span>
    </div>
  )
}

function CTAButton({ label, mode, config }: { label: string; mode: 'primary' | 'secondary'; config: PostingConfig }) {
  const isPrimary = mode === 'primary'
  return (
    <button
      className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold ${isPrimary ? 'text-white shadow-lg' : 'bg-white/10 text-white border border-white/30 backdrop-blur-sm'}`}
      style={isPrimary ? {
        background: `linear-gradient(135deg, ${config.brandSettings.primaryColor}, ${config.brandSettings.secondaryColor})`,
        boxShadow: `0 10px 40px ${config.brandSettings.primaryColor}50`,
      } : {}}
    >
      {label}
      <ArrowRight className="w-5 h-5" />
    </button>
  )
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl ${className}`}>
      {children}
    </div>
  )
}

function HeadlineWithHighlight({ config, className }: { config: PostingConfig; className?: string }) {
  if (!config.highlightEnabled || !config.highlightWord || !config.headline.includes(config.highlightWord)) {
    return <span className={className}>{config.headline}</span>
  }
  const parts = config.headline.split(config.highlightWord)
  return (
    <span className={className}>
      {parts[0]}
      <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
        {config.highlightWord}
      </span>
      {parts.slice(1).join(config.highlightWord)}
    </span>
  )
}

// ---- Layout Components ----

function EventLayout({ config }: { config: PostingConfig }) {
  const isHorizontal = config.format === '16:9' || config.format === '4:3'

  return (
    <div className={`flex items-center justify-between h-full w-full ${isHorizontal ? 'px-12 py-10 gap-10' : 'px-16 py-12 gap-10'}`}>
      <div className="flex-1 space-y-6">
        {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
        <h1 className={`${isHorizontal ? 'text-5xl' : 'text-6xl'} font-bold text-white leading-tight`}>
          <HeadlineWithHighlight config={config} />
        </h1>
        <p className={`${isHorizontal ? 'text-xl' : 'text-2xl'} text-gray-300 leading-relaxed`}>{config.subline}</p>
        {config.metaLine && (
          <div className={`flex items-center ${isHorizontal ? 'gap-4' : 'gap-6'} text-cyan-400 flex-wrap`}>
            <div className="flex items-center gap-2">
              <Calendar className={isHorizontal ? 'w-5 h-5' : 'w-6 h-6'} />
              <span className={isHorizontal ? 'text-base' : 'text-lg'}>{config.metaLine.split('·')[0]?.trim()}</span>
            </div>
            {config.metaLine.includes('·') && (
              <div className="flex items-center gap-2">
                <MapPin className={isHorizontal ? 'w-5 h-5' : 'w-6 h-6'} />
                <span className={isHorizontal ? 'text-base' : 'text-lg'}>{config.metaLine.split('·')[1]?.trim()}</span>
              </div>
            )}
          </div>
        )}
        {config.ctaMode !== 'off' && <CTAButton label={config.ctaLabel} mode={config.ctaMode} config={config} />}
      </div>
      {config.featuredImage && (
        <div className={isHorizontal ? 'w-[300px] flex-shrink-0' : 'w-[420px] flex-shrink-0'}>
          <GlassCard className="p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={config.featuredImage}
              alt="Featured"
              className={`w-full ${isHorizontal ? 'h-[300px]' : 'h-[420px]'} object-cover rounded-2xl`}
            />
          </GlassCard>
        </div>
      )}
    </div>
  )
}

function AnnouncementLayout({ config }: { config: PostingConfig }) {
  const isVertical = config.format === '9:16' || config.format === '3:4'
  return (
    <div className="flex flex-col justify-center h-full px-20">
      <GlassCard className={`${isVertical ? 'p-20' : 'p-16'} space-y-8 max-w-4xl`}>
        {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
        <h1 className={`${isVertical ? 'text-8xl' : 'text-7xl'} font-bold text-white leading-tight`}>
          <HeadlineWithHighlight config={config} />
        </h1>
        <p className="text-4xl text-gray-300 leading-relaxed">{config.subline}</p>
        {config.ctaMode !== 'off' && (
          <div className="pt-6">
            <CTAButton label={config.ctaLabel} mode={config.ctaMode} config={config} />
          </div>
        )}
      </GlassCard>
    </div>
  )
}

function PureVisualLayout({ config }: { config: PostingConfig }) {
  return (
    <div className="flex items-end h-full p-16">
      {config.headline && (
        <GlassCard className="p-10">
          <h1 className="text-6xl font-bold text-white leading-tight">{config.headline}</h1>
        </GlassCard>
      )}
    </div>
  )
}

function QuoteLayout({ config }: { config: PostingConfig }) {
  const isVertical = config.format === '9:16' || config.format === '3:4'
  return (
    <div className="flex items-center justify-center h-full px-20">
      <GlassCard className={`${isVertical ? 'p-20' : 'p-16'} max-w-4xl`}>
        {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
        <blockquote className="mt-10 space-y-8">
          <p className={`${isVertical ? 'text-6xl' : 'text-5xl'} font-bold text-white leading-tight italic`}>
            &ldquo;{config.headline}&rdquo;
          </p>
          {config.subline && (
            <p className="text-3xl font-medium" style={{ color: config.brandSettings.primaryColor }}>
              — {config.subline}
            </p>
          )}
        </blockquote>
      </GlassCard>
    </div>
  )
}

function StatLayout({ config }: { config: PostingConfig }) {
  const showStats = config.statsMode !== 'off'
  const statsCount = config.statsMode === 'three' ? 3 : 1
  const isVertical = config.format === '9:16' || config.format === '3:4'

  return (
    <div className="flex flex-col justify-center items-center h-full px-20 space-y-16">
      {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
      {showStats && (
        <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} gap-10`}>
          {statsCount >= 1 && (
            <GlassCard className="p-16 text-center min-w-[200px]">
              <div className="text-8xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {config.stat1Value}
              </div>
              <div className="text-2xl text-gray-300 mt-6 font-medium">{config.stat1Label}</div>
            </GlassCard>
          )}
          {statsCount === 3 && (
            <>
              <GlassCard className="p-16 text-center min-w-[200px]">
                <div className="text-8xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {config.stat2Value}
                </div>
                <div className="text-2xl text-gray-300 mt-6 font-medium">{config.stat2Label}</div>
              </GlassCard>
              <GlassCard className="p-16 text-center min-w-[200px]">
                <div className="text-8xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {config.stat3Value}
                </div>
                <div className="text-2xl text-gray-300 mt-6 font-medium">{config.stat3Label}</div>
              </GlassCard>
            </>
          )}
        </div>
      )}
      <h1 className="text-6xl font-bold text-white text-center max-w-3xl leading-tight">{config.headline}</h1>
    </div>
  )
}

function ServiceLayout({ config }: { config: PostingConfig }) {
  return (
    <div className="flex items-center h-full px-16 gap-12">
      <div className="flex-1">
        <GlassCard className="p-16 space-y-6">
          {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
          <h1 className="text-6xl font-bold text-white">{config.headline}</h1>
          <p className="text-2xl text-gray-300">{config.subline}</p>
          {config.ctaMode !== 'off' && (
            <div className="pt-4">
              <CTAButton label={config.ctaLabel} mode={config.ctaMode} config={config} />
            </div>
          )}
        </GlassCard>
      </div>
      {config.featuredImage && (
        <div className="w-[400px]">
          <GlassCard className="p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={config.featuredImage} alt="Service" className="w-full h-[500px] object-cover rounded-2xl" />
          </GlassCard>
        </div>
      )}
    </div>
  )
}

function HiringLayout({ config }: { config: PostingConfig }) {
  if (config.featuredImage) {
    return (
      <div className="flex items-center h-full px-16 gap-12">
        <div className="flex-1">
          <GlassCard className="p-12 space-y-6">
            {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">{config.headline}</h1>
            <p className="text-2xl text-gray-300">{config.subline}</p>
            {config.metaLine && (
              <div className="flex items-center gap-4" style={{ color: config.brandSettings.primaryColor }}>
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{config.metaLine}</span>
              </div>
            )}
            {config.ctaMode !== 'off' && (
              <div className="pt-4">
                <CTAButton label={config.ctaLabel} mode={config.ctaMode} config={config} />
              </div>
            )}
          </GlassCard>
        </div>
        <div className="w-[400px]">
          <GlassCard className="p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={config.featuredImage} alt="Team" className="w-full h-[500px] object-cover rounded-2xl" />
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center h-full px-20">
      <GlassCard className="p-16 space-y-8 max-w-4xl mx-auto text-center">
        {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-6xl font-bold text-white">{config.headline}</h1>
        <p className="text-3xl text-gray-300">{config.subline}</p>
        {config.metaLine && (
          <div className="flex items-center justify-center gap-4" style={{ color: config.brandSettings.primaryColor }}>
            <MapPin className="w-5 h-5" />
            <span className="text-xl">{config.metaLine}</span>
          </div>
        )}
        {config.ctaMode !== 'off' && (
          <div className="pt-4">
            <CTAButton label={config.ctaLabel} mode={config.ctaMode} config={config} />
          </div>
        )}
      </GlassCard>
    </div>
  )
}

function ReminderLayout({ config }: { config: PostingConfig }) {
  return (
    <div className="flex items-center justify-center h-full px-20">
      <GlassCard className="p-12 max-w-3xl text-center space-y-6">
        {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
        <h1 className="text-5xl font-bold text-white mt-4">{config.headline}</h1>
        {config.subline && <p className="text-xl text-gray-300">{config.subline}</p>}
      </GlassCard>
    </div>
  )
}

function PresentationLayout({ config }: { config: PostingConfig }) {
  return (
    <div className="flex flex-col justify-center h-full px-20">
      <GlassCard className="p-16 space-y-6 max-w-4xl">
        {config.pillEnabled && <Pill label={config.pillLabel} config={config} />}
        <h1 className="text-7xl font-bold text-white leading-tight">
          <HeadlineWithHighlight config={config} />
        </h1>
        <p className="text-3xl text-gray-300">{config.subline}</p>
        {config.ctaMode !== 'off' && (
          <div className="pt-4">
            <CTAButton label={config.ctaLabel} mode={config.ctaMode} config={config} />
          </div>
        )}
      </GlassCard>
    </div>
  )
}

function CarouselLayout({ config }: { config: PostingConfig }) {
  const currentSlide = config.carouselSlides[config.currentSlideIndex]

  if (!currentSlide) {
    return (
      <div className="flex items-center justify-center h-full px-20">
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-20 text-center space-y-6">
          <div className="text-6xl">📱</div>
          <h2 className="text-4xl font-bold text-white">Keine Slides</h2>
          <p className="text-xl text-gray-400">Slides im Carousel Manager hinzufügen</p>
        </div>
      </div>
    )
  }

  const slideConfig: PostingConfig = {
    ...config,
    postType: currentSlide.slideType,
    image: currentSlide.image,
    backgroundGradient: currentSlide.backgroundGradient,
    featuredImage: currentSlide.featuredImage,
    headline: currentSlide.headline,
    subline: currentSlide.subline,
    pillLabel: currentSlide.pillLabel,
    ctaLabel: currentSlide.ctaLabel,
    metaLine: currentSlide.metaLine,
  }

  return (
    <>
      {currentSlide.slideType === 'event' && <EventLayout config={slideConfig} />}
      {currentSlide.slideType === 'announcement' && <AnnouncementLayout config={slideConfig} />}
      {currentSlide.slideType === 'pure-visual' && <PureVisualLayout config={slideConfig} />}
      {currentSlide.slideType === 'quote' && <QuoteLayout config={slideConfig} />}
      {currentSlide.slideType === 'stat' && <StatLayout config={slideConfig} />}
      {currentSlide.slideType === 'service' && <ServiceLayout config={slideConfig} />}
      {currentSlide.slideType === 'hiring' && <HiringLayout config={slideConfig} />}
      {currentSlide.slideType === 'reminder' && <ReminderLayout config={slideConfig} />}
      {currentSlide.slideType === 'presentation' && <PresentationLayout config={slideConfig} />}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {config.carouselSlides.map((_, idx) => (
          <div
            key={idx}
            className={`h-3 rounded-full transition-all ${idx === config.currentSlideIndex ? 'w-8 bg-cyan-400' : 'w-3 bg-white/30'}`}
          />
        ))}
      </div>
    </>
  )
}
