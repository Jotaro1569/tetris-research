# Tetris Cognitive Study Website

A sleek, science-inspired web experience using Next.js App Router, styled with a dark + gold gradient theme, to onboard participants into a gamified cognitive study based on Tetris.

## Features

- 🎮 Tetris-style splash animation with falling blocks
- 📜 Fake, satirical "research study" description
- ✨ Immersive, scroll-based UX with dynamic transitions
- 🔄 Animated engagement taglines that cycle automatically
- 🌐 Participant group selection with IP-based location check
- 🤖 Simulated captcha protection for study participation
- 🎨 Dark mode with gold gradient accents and glassmorphism elements

## Tech Stack

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS with custom theme
- **Animations**: Framer Motion & GSAP
- **Icons**: React Icons
- **Analytics**: Vercel Analytics

## Getting Started

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

- `/app`: Next.js App Router pages
- `/components`: Reusable UI components
- `/public`: Static assets
- `/styles`: Global CSS and Tailwind config

## Component Overview

- `TetrisAnimation`: Creates the falling Tetris blocks animation
- `StudyDescription`: Displays the satirical research study information
- `EngagementText`: Shows cycling taglines to engage users
- `ParticipationGateway`: Handles participant group selection
- `ScrollIndicator`: Encourages users to scroll down

## License

MIT
