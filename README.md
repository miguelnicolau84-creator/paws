# PawsConnect

A modern shelter management platform for animal adoption, volunteer care tracking, and shelter operations.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TailwindCSS v4** + **shadcn/ui** components
- **React Router** for navigation
- **Zustand** for state management
- **Recharts** for analytics
- **Local JSON database** with localStorage persistence (mock API layer)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Features

### Volunteer Role
- View animal profiles with personality, medical info, and talking points
- Log walks, play sessions, training, grooming, and feeding
- Administer medications with status tracking (green/yellow/red)
- Track facility cleaning tasks

### Coordinator Role
- Add new animals and create medication schedules
- Access all volunteer features
- View shelter dashboards and analytics

Switch roles via the user selector in the sidebar (try **Emma Rodriguez** or **Anna Kowalski** for coordinator access).

## Data Model

The app is structured for easy backend integration:

| Entity | Description |
|--------|-------------|
| `Animal` | Profile, personality, medical, adoption readiness |
| `Volunteer` | Stats, badges, role |
| `Medication` | Schedules with compliance tracking |
| `Activity` | Walks, play, training, grooming, feeding, cleaning |
| `Facility` | Kennels, cat rooms, outdoor areas |
| `AdoptionInquiry` | Potential adopter messages |

Seed data lives in `src/data/seed.ts` (10 dogs, 10 cats, 8 volunteers).

The mock API in `src/api/client.ts` mirrors REST patterns — swap for Firebase, Supabase, or a custom backend without changing UI components.

## Reset Data

Clear browser localStorage key `pawsconnect-db` to reload seed data.

## Project Structure

```
src/
├── api/           # Mock API client (backend-ready)
├── components/    # UI components
├── data/          # Seed data
├── pages/         # Route pages
├── stores/        # Zustand state
└── types/         # TypeScript interfaces
```
