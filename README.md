<div align="center">

# AstralIQ

### The Intelligent Campus Ambassador Management Platform

**Built for AICore Connect Hackathon**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-astraliq.vercel.app-7C3AED?style=for-the-badge&logoColor=white)](https://astraliq.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-manali--mahadik--10%2Fastraliq-181717?style=for-the-badge&logo=github)](https://github.com/manali-mahadik-10/astraliq)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel)](https://astraliq.vercel.app)

</div>

---

## The Problem We Are Solving

Most Campus Ambassador programs are built on good intentions and broken infrastructure. Organizations distribute tasks over WhatsApp. Ambassadors report progress on Google Forms. Managers track performance on spreadsheets. Nobody has a clear picture. The best ambassadors disengage when they feel unseen. Organizations lose the ability to scale or make any data-driven decisions about their programs.

**The result:** programs that start strong and die quietly — not from lack of effort, but from lack of structure.

AstralIQ replaces that fragmented chaos with a single, intelligent platform that gives every stakeholder exactly what they need: ambassadors get clarity, recognition, and motivation; organizations get real-time visibility, automation, and measurable ROI.

---

## What AstralIQ Does

AstralIQ is a full-stack campus ambassador management platform with gamification and AI at its core. It turns a passive ambassador cohort into a self-sustaining, always-on growth engine.

### For Ambassadors
- A personal dashboard showing XP, level, streak, active tasks, and college ranking — everything they need to know their standing at a glance
- A structured task center with clearly defined challenges (referrals, content creation, event promotion) and instant XP rewards on completion
- A real-time global leaderboard so top performers always know where they stand
- A badge and rewards system that recognizes contribution with rarity tiers, streak bonuses, and redeemable rewards
- A personal profile with referral links, badge collections, activity history, and level progression tracking
- **Nova — an AI Coach** powered by Mistral AI, context-aware of each ambassador's XP, level, rank, tasks, and badges, available via voice or text to guide, motivate, and support

### For Organizations (Admin)
- A unified admin dashboard showing program health, ambassador activity, dropout risk signals, college battle standings, and top performer metrics — all in one place
- Full ambassador management, task assignment, analytics, and AI-generated program insights
- No more spreadsheets. No more WhatsApp. One platform, complete visibility

---

## Direct Alignment with the Problem Statement

| Problem Statement Requirement | AstralIQ Solution |
|---|---|
| No single source of truth | Unified dashboard for ambassadors and admins with live data sync |
| No structured task assignment | Task Center with defined challenges, XP values, proof tracking, and auto-scoring |
| Zero gamification or recognition | XP engine, 5-tier level system, badges with rarity tiers, streak tracking, rewards store |
| Cannot identify top performers | Real-time global leaderboard with live rank updates |
| Cannot measure program ROI | Admin analytics with engagement metrics, completion rates, and college battle data |
| High ambassador dropout | AI Coach Nova for personalized motivation, plus streaks and recognition to drive retention |
| Scalability issues | Fully automated, role-based platform — no manual intervention required |

---

## Core Features

### Gamification Engine
- XP-based progression system with 5 levels: Bronze, Silver, Gold, Platinum, Diamond
- Streak tracking that rewards consistent weekly engagement
- Badge system with rarity tiers (Common, Rare, Epic, Legendary) and specific unlock conditions
- Real-time leaderboard with live rank updates across the entire ambassador cohort

### AI Coach — Nova
- Conversational AI built on Mistral AI
- Fully context-aware: Nova knows each ambassador's XP, level, rank, streak, earned badges, and pending tasks
- Voice-enabled via the Browser Web Speech API — no third-party dependencies
- Provides personalized guidance, motivation, and task strategy in real time

### Admin Intelligence
- Program health metrics and dropout risk signals surfaced automatically
- College battle standings for inter-college competition tracking
- Ambassador segmentation by performance tier
- Full task and reward management

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| State Management | React Context API (AuthContext + DataContext) |
| AI | Mistral AI API |
| Voice | Browser Web Speech API |
| Fonts | Syne + DM Sans (Google Fonts) |
| Deployment | Vercel |

---

## Architecture

```
AstralIQ
├── src/
│   ├── assets/                  # Static assets, Nova avatar
│   ├── context/
│   │   ├── AuthContext.jsx      # Auth state, user session, live patch updates
│   │   └── DataContext.jsx      # Ambassador data, task engine, leaderboard
│   ├── data/
│   │   └── mockData.js          # Complete data engine — ambassadors, tasks, badges, rewards
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Landing.jsx      # Dark cosmic landing page
│   │   ├── ambassador/
│   │   │   ├── AmbassadorDashboard.jsx
│   │   │   ├── TaskCenter.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── Badges.jsx
│   │   │   ├── Rewards.jsx
│   │   │   ├── AICoach.jsx      # Nova — Mistral AI + Web Speech
│   │   │   └── AmbassadorProfile.jsx
│   │   └── admin/
│   │       └── AdminDashboard.jsx
│   ├── utils/
│   │   └── gameEngine.js        # XP calculations, badge unlock logic, level mapping
│   └── components/
│       └── AmbassadorNav.jsx
```

---

## Design Philosophy

AstralIQ is built with a dark cosmic aesthetic — deep `#0A0818` backgrounds, purple-violet gradient accents, animated starfields, and orbital ring graphics. The design is intentional: campus ambassadors are young, visual, and motivated by interfaces that feel premium and exciting rather than corporate.

Typography uses Syne (geometric, heavy) for headings and DM Sans for body — a combination that feels modern without being generic.

Every design decision reinforces the core product promise: this platform makes ambassadors feel like they matter.

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/manali-mahadik-10/astraliq.git
cd astraliq

# Install dependencies
npm install

# Configure environment
# Create a .env file and add:
VITE_MISTRAL_API_KEY=your_mistral_api_key_here

# Start development server
npm run dev
```

---

## Demo Access

Visit [https://astraliq.vercel.app](https://astraliq.vercel.app) and use any of the pre-seeded ambassador accounts from the platform's landing page to explore the full ambassador experience, or log in as admin to see the program management view.

---

## Roadmap

### Completed
- Ambassador Dashboard, Task Center, Leaderboard, Badges, Rewards
- AI Coach Nova with Mistral AI and voice support
- Ambassador Profile with edit functionality
- Landing Page
- Admin Dashboard with program health overview

### In Progress
- Admin: Ambassador Management
- Admin: Task Management with proof upload
- Admin: Analytics with program ROI metrics
- Admin: AI Insights panel
- Live Demo mode
- GitHub contribution comparison integration

---

## Built by

**Manali Mahadik**
[github.com/manali-mahadik-10](https://github.com/manali-mahadik-10)

Built for the **AICore Connect Hackathon**
Solving the Campus Ambassador Management problem — making community-led marketing structured, scalable, and measurable.

---

<div align="center">

**AstralIQ — Turn your ambassador cohort into an always-on growth engine**

[astraliq.vercel.app](https://astraliq.vercel.app)

</div>