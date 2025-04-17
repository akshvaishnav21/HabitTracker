# Habit Tracker App

A minimal habit tracking web application designed for seamless personal growth tracking. The app provides an intuitive interface for monitoring daily habits with offline capabilities and local browser storage.

## Key Technologies

- React.js frontend
- TypeScript
- Local browser storage
- Progressive Web App (PWA) architecture
- Responsive design for mobile and desktop

## Development

To start the development server:

```bash
npm run dev
```

## Deployment Instructions

To deploy this application correctly, follow these steps:

1. Run the custom build script to ensure files are in the correct location:

```bash
./build-for-deploy.sh
```

This script:
- Runs the normal build process
- Copies files from `dist/public` to `dist` to fix the deployment structure
- Ensures the `index.html` file is at the root of the `dist` directory

2. Deploy using Replit's deployment feature

Without running this script first, the deployment will fail with an error about missing the index.html file.

## Features

- Track daily, weekly, and custom frequency habits
- Visual habit completion matrices
- Streak tracking
- Progress statistics
- Mobile-responsive design