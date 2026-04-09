#Wall Calendar Component

An interactive calendar built with Next.js, TypeScript, and Tailwind CSS. The UI is inspired by premium physical wall calendars: editorial imagery, warm paper tones, refined typography, and polished interaction details.

## Overview

The app provides:

- Interactive month grid with a wall-calendar visual language
- Date range selection with edge-case handling and hover preview
- Local note-taking tied to selected date ranges
- Responsive, touch-friendly layouts for desktop/tablet/mobile

## Tech Decisions

- **Next.js 16** with App Router for clean route structure and production-ready build tooling
<!-- - **Client component boundary** at `components/Calendar.tsx` to support interaction and localStorage -->
- **TypeScript** for type-safe development with clear interfaces
- **Tailwind CSS v4** for styling
- **Framer Motion** for smooth animations and micro-interactions
- **System font pairing** for strong hierarchy without external font fetch dependency

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
