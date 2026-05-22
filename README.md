# Mini-Jira Prototype

Award-caliber frontend (Awwwards quality) with a robust Node.js/Prisma backend.

## Features
- **Kanban Board:** D&D reordering and status updates.
- **Role-based Access:** Admin, Manager, and Employee roles.
- **Real-time UI:** Optimistic updates with rollback.
- **Analytics:** Dashboard charts (status/priority) and velocity tracking.
- **Fully Accessible:** WCAG 2.1 AA compliant.

## Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, shadcn/ui, @dnd-kit, TanStack Query, Recharts.
- **Backend:** Node.js, Express, Prisma (SQLite), JWT, Zod.

## Setup

### Backend
1. `cd backend`
2. `npm install`
3. `cp .env.example .env`
4. `npx prisma migrate dev`
5. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
