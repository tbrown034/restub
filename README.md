# Restub

A modern experience cataloging application built with Next.js that helps you capture and remember your most memorable moments. Never forget the details of concerts, sports events, movies, travel experiences, and more.

## Features

- **Experience Cataloging**: Add and organize experiences by category (concerts, sports, movies, theater, festivals, travel, dining, and more)
- **Rich Details**: Capture who, what, when, where, and personal notes for each experience
- **Interactive Cards**: View experiences in beautiful, categorized cards with edit and delete functionality
- **Modern UI**: Clean, responsive design with gradient backgrounds and smooth animations
- **Form Validation**: Comprehensive form handling with required fields and category-specific options

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
app/
├── components/          # Reusable components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Homepage hero section
│   └── Footer.tsx      # Site footer
├── catalog/            # Experience cataloging pages
│   ├── page.tsx        # Main catalog interface
│   └── layout.tsx      # Catalog-specific layout
├── layout.tsx          # Root layout
├── page.tsx           # Homepage
└── globals.css        # Global styles
```

## Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom React components
- **State Management**: React useState hooks. But respect server/client component relationship (use use client only when needed, be skepetical of excessive or uneeded useeffects -- as outlined: https://react.dev/learn/you-might-not-need-an-effect)
- **Forms**: Next.js form actions

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features in Development

- Automatic experience detection from tickets/receipts
- Data persistence with database integration
- Search and filtering capabilities
- Export functionality
- Photo attachments

