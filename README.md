# Atelier Wall Calendar

A portfolio-ready interactive calendar built with Next.js, TypeScript, and Tailwind CSS. The UI is inspired by premium physical wall calendars: editorial imagery, warm paper tones, refined typography, and polished interaction details.

## Overview

The app provides:

- Interactive month grid with a wall-calendar visual language
- Date range selection with edge-case handling and hover preview
- Local note-taking tied to selected date ranges
- Responsive, touch-friendly layouts for desktop/tablet/mobile

## Tech Decisions

- **Next.js 16** with App Router for clean route structure and production-ready build tooling
- **Client component boundary** at `components/Calendar.tsx` to support interaction and localStorage
- **TypeScript** for type-safe development with clear interfaces
- **Tailwind CSS v4** for utility-first styling with scalable patterns
- **Framer Motion** for smooth animations and micro-interactions
- **System font pairing** for strong hierarchy without external font fetch dependency

## Tradeoffs

- Notes are keyed by normalized date-range keys in localStorage (simple and fast) instead of a more flexible relational model.
- A lightweight custom date utility set is used instead of `date-fns` to keep dependencies minimal.
- Motion library added for premium feel despite bundle size increase.

## Feature Breakdown

### 1) Wall Calendar Aesthetic

- Split layout on desktop: hero image panel + interactive calendar area
- Vertical stacked composition on smaller breakpoints
- Paper-like surfaces, layered shadows, and warm palette via Tailwind classes

### 2) Date Range Selection

- Click once: set start date
- Hover after start: preview range
- Click second time:
  - later date -> closes range
  - same date -> single-day range
  - earlier date -> reset start logically
- Clear and Today controls included

### 3) Notes (Persisted Locally)

- Notes are attached to the selected range key
- Auto-persisted to localStorage
- Empty notes remove the stored key

### 4) Responsive UX

- Touch-friendly day cells and controls
- Controlled spacing and typographic scaling from mobile to desktop
- Deliberate component grouping to maintain readability on narrow screens

## Project Structure

```
calendar_tuf/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── types/
│   │   └── index.ts
│   ├── Calendar.tsx
│   ├── CalendarDay.tsx
│   ├── CalendarGrid.tsx
│   ├── DateRangePicker.tsx
│   ├── HeroImage.tsx
│   └── NotesPanel.tsx
├── package.json
└── tsconfig.json
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Production Verification

```bash
npm run lint
npm run build
```

## Video Demo Script (Short)

1. **Intro (5s)**
   "This is Atelier Wall Calendar, a premium interactive calendar UI inspired by physical wall calendars."

2. **Range Selection (20s)**
   "I click a start date, hover across nearby dates to preview the range, then click an end date to finalize. If I click an earlier day, the range resets logically. Clicking the same day twice creates a single-day range."

3. **Notes Flow (15s)**
   "With a selected range, I add notes in the journal panel. The note persists automatically in localStorage."

4. **Responsive Pass (15s)**
   "On desktop, the hero image and calendar form a split editorial layout. On tablet and mobile, it collapses into a vertical flow with preserved touch targets and readable spacing."

5. **Design Rationale (10s)**
   "The emerald accent palette, subtle shadows, and restrained motion were chosen to deliver a tactile, premium wall-calendar feel."

## Future Improvements

- Keyboard navigation for day grid (arrow keys, Enter to select)
- Holidays/events overlay with legend filters
- Seasonal hero image packs
- Multi-note metadata (tags/priority) per range
