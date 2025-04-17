
# Habit Tracker

A modern web application for tracking daily, weekly, and custom habits with a clean UI and reminder system.

## Features

- Track daily and weekly habits
- Set custom reminders
- View habit completion statistics
- Visual progress tracking with contribution matrix
- Responsive design that works on desktop and mobile
- Weekly progress and streak tracking

## Tech Stack

- Frontend: React + TypeScript + Vite
- UI: Tailwind CSS + Shadcn/ui
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM
- Notifications: Web Push API

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check TypeScript
- `npm run db:push` - Push database schema changes

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Express.js backend
├── shared/          # Shared types and schemas
└── public/          # Static assets
```

## License

MIT
