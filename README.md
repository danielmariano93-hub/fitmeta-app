# FitMeta — Plano de Treino Inteligente

Premium fitness app with AI-generated 30-day workout plans. Built with React, TypeScript, and Tailwind CSS with the Nino design system.

## 🎯 Features

- **Onboarding Apple-style** — Progressive questions about fitness level, goals, and preferences
- **AI-Powered Plan Generation** — 30-day workout plans generated via Claude API
- **Daily Tracking** — Complete exercises, log notes, and track progress
- **Calendar Overview** — Visual representation of completed/pending workouts
- **Progress Insights** — Streaks, achievements, weekly breakdown
- **Premium Design** — Identical to Nino financial app design system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fitmeta-app.git
cd fitmeta-app

# Install dependencies
npm install
# or
pnpm install

# Copy environment variables
cp .env.example .env.local
```

### Configuration

Edit `.env.local`:

```
VITE_CLAUDE_API_KEY=your_claude_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

App opens at `http://localhost:5173`

### Build

```bash
npm run build
```

Output goes to `dist/` folder.

## 📁 Project Structure

```
fitmeta-app/
├── src/
│   ├── components/          # Reusable components
│   ├── context/            # App state (AppContext)
│   ├── pages/              # Page components
│   │   ├── Landing.tsx     # Home page
│   │   ├── Onboarding.tsx  # User setup flow
│   │   ├── Dashboard.tsx   # Main app dashboard
│   │   ├── WorkoutDetail.tsx # Daily workout view
│   │   └── Progress.tsx    # Progress tracking
│   ├── services/           # API services
│   │   └── claudeService.ts # Claude API integration
│   ├── types/              # TypeScript interfaces
│   ├── index.css           # Global styles (Nino tokens)
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── package.json
```

## 🎨 Design System (Nino)

All colors, typography, and components use the Nino design system:

- **Primary Color:** HSL 258 100% 59% (#6D3BFF)
- **Font:** DM Sans
- **Border Radius:** 1rem (16px)
- **Shadows:** Premium card, brand, and hero shadows
- **Gradients:** Brand gradient (violet → blue → coral)

See `src/index.css` for all design tokens.

## 🔌 Claude API Integration

The app uses Claude's API to generate personalized workout plans. The prompt system includes:

- Hypertrophy specialist
- Endurance coach
- Nutritionist
- Body-fat reduction expert

Plans are generated once per user and stored in Supabase.

## 📊 Database Schema (Supabase)

### Users Table
- `id` (UUID)
- `email` (string)
- `fitness_level` (enum: beginner/intermediate/advanced)
- `goal` (enum: hipertrofia/emagrecimento/definição/força)
- `frequency` (integer: 3-6)
- etc.

### Plans Table
- `id` (UUID)
- `user_id` (FK)
- `workouts` (JSON array)
- `nutritional_goals` (JSON)
- `created_at` (timestamp)

## 🚀 Deployment (Vercel)

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
vercel deploy
```

## 📝 TODO

- [ ] Supabase authentication
- [ ] Data persistence (database saves)
- [ ] Image uploads for exercise form tips
- [ ] Workout history and PRs
- [ ] Social sharing achievements
- [ ] Mobile app with Expo
- [ ] Workout videos integration
- [ ] Nutrition plan details

## 📞 Support

For issues or questions, please open a GitHub issue.

## 📄 License

MIT License — feel free to use for commercial projects.

