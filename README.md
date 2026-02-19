# PKN Posting Creator

Production-ready Social Media Grafik-Generator für das PKN-Team.

**Live:** https://pkn-posting-creator.vercel.app
**Passwort:** `Sprite`

---

## So benutzt du's

1. **Login** → Passwort `Sprite` eingeben
2. **Brand/CI** → Logo hochladen, Farben & Font einstellen
3. **Media** → CI Gradient wählen oder Bild hochladen
4. **Post Type** → Template auswählen (Event, Quote, Stats, etc.)
5. **Content** → Headline, Subline, Pill, CTA, Stats befüllen
6. **Preview** → Live-Vorschau im Canvas, alle 5 Formate gleichzeitig
7. **Export** → Einzelformat als PNG oder alle 5 als ZIP herunterladen

---

## Templates

| Template | Beschreibung |
|----------|-------------|
| **Event** | Hero Split – Inhalt links, Featured Image rechts |
| **Announcement** | Große Headline auf Glass-Card zentriert |
| **Pure Visual** | Minimalistisch, nur Headline am unteren Rand |
| **Quote** | Zitat in Anführungszeichen mit Autor |
| **Stats** | 1 oder 3 Statistiken mit Farbverlauf-Zahlen |
| **Service** | Service Spotlight mit optionalem Featured Image |
| **Hiring** | Team-Post mit Icon oder Bild |
| **Reminder** | Einfacher zentrierter Hinweis |
| **Presentation** | Visuelles Slide-Format |
| **Carousel** | Multi-Slide (jede Folie = eigener Template-Typ) |

---

## Export-Formate

| Format | Größe | Plattform |
|--------|-------|-----------|
| 1:1 Square | 1080 × 1080 px | Instagram Post |
| 4:3 Landscape | 1200 × 900 px | Classic |
| 3:4 Portrait | 900 × 1200 px | Feed Post |
| 16:9 Wide | 1200 × 675 px | YouTube, LinkedIn |
| 9:16 Story | 1080 × 1920 px | Instagram Story, TikTok |

**Dateiname-Schema:** `PKN_{template}_{format}_{YYYY-MM-DD}.png`

---

## Presets

| Preset | Beschreibung |
|--------|-------------|
| **PKN Standard** | Standard-Config mit allen CI-Defaults |
| **Minimal** | Kein Space-Hintergrund, kein Pill, kein CTA |
| **Event Strong** | High Density Sterne, alle Stats, starke Glow |

---

## So fügst du ein neues Template hinzu

1. Öffne `src/components/creator/posting-graphic.tsx`
2. Erstelle eine neue Layout-Komponente (z.B. `function NewsletterLayout(...)`)
3. Füge sie im `PostingGraphic`-Render hinzu:
   ```tsx
   {config.postType === 'newsletter' && <NewsletterLayout config={config} />}
   ```
4. Erweitere den Type in `src/types/posting.ts`:
   ```ts
   export type PostType = ... | 'newsletter'
   ```
5. Füge einen Eintrag in `src/components/creator/post-type-selector.tsx` hinzu
6. Commit & Push → Vercel deployed automatisch

---

## ENV-Variablen (Vercel)

| Variable | Beschreibung | Default |
|----------|-------------|---------|
| `PKN_PASSWORD` | Login-Passwort | `Sprite` |

Passwort ändern: Vercel Dashboard → Project Settings → Environment Variables

---

## Lokale Entwicklung

```bash
# Dependencies installieren
npm install

# Dev-Server starten (http://localhost:3000)
npm run dev

# Production Build testen
npm run build && npm run start

# Tests ausführen
npm test

# TypeScript prüfen
npm run typecheck
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3
- **Export:** html2canvas + JSZip
- **Auth:** httpOnly Cookie + Next.js Middleware
- **Icons:** Lucide React
- **Toast:** Sonner
- **Deploy:** Vercel (automatisch via GitHub)

---

## Architektur

```
src/
  app/
    page.tsx              ← Login-Seite
    api/auth/route.ts     ← Auth-Endpoint (POST = Login, DELETE = Logout)
    creator/page.tsx      ← Haupt-Creator-Seite
  components/
    creator/
      posting-graphic.tsx ← Alle Templates + Rendering
      creator-sidebar.tsx ← Linke Sidebar mit Controls
      preview-canvas.tsx  ← Vorschau + Mini-Previews
      export-bar.tsx      ← Export-Buttons (PNG/ZIP)
      brand-settings.tsx  ← Logo, Farben, Font
      brand-toggles.tsx   ← Logo/Pill/CTA/Stats Toggles
      media-uploader.tsx  ← Background & Featured Image
      post-type-selector.tsx ← Template-Auswahl
    ui/                   ← Radix UI Primitives
  types/posting.ts        ← Alle TypeScript-Typen + Defaults
  lib/
    utils.ts              ← cn() Helper
    stable-stringify.ts   ← Deterministisches JSON.stringify
  middleware.ts           ← Auth-Check für alle Routes
```
