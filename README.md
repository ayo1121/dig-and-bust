# Dig & Bust 💎⛏️

A simple "mining" web game inspired by the classic "keep digging" meme. Dig through dirt blocks to reach the Diamond Wall, but don't bust!

![Dig & Bust Meme](public/meme.png)

## 🎮 Game Features

- **Simple one-click gameplay**: Just click "DIG" to progress
- **Risk/reward mechanics**: The deeper you dig, the higher both risk and reward
- **Jackpot system**: Dig 30+ times to unlock jackpot chance
- **Global leaderboard**: Compete with other miners worldwide
- **Multiple auth options**: Email magic link, guest mode, or Solana wallet

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Magic Link) + Guest Mode + Solana Wallet
- **Deployment**: Vercel

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd dig-and-bust
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema:

```sql
-- Run the contents of supabase/schema.sql
```

Or copy from `supabase/schema.sql`:

```sql
-- Scores table for leaderboard
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  digs INTEGER NOT NULL DEFAULT 0,
  outcome TEXT NOT NULL CHECK (outcome IN ('bust', 'jackpot')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS scores_score_desc_idx ON scores(score DESC);
CREATE INDEX IF NOT EXISTS scores_created_at_idx ON scores(created_at DESC);

-- Enable RLS
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Anyone can view scores
CREATE POLICY "Anyone can view scores" ON scores FOR SELECT USING (true);

-- Anyone can insert scores
CREATE POLICY "Anyone can insert scores" ON scores FOR INSERT WITH CHECK (true);
```

3. Get your API credentials from **Settings > API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure environment variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy to Vercel

### Option 1: One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

### Option 2: Manual deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

---

## 📊 How the Leaderboard Works

### Score Submission

When a game ends (bust or jackpot), the score is submitted to Supabase:

```typescript
{
  player_id: "user_id or guest_id or wallet_address",
  display_name: "Username",
  score: 150,
  digs: 25,
  outcome: "bust" | "jackpot",
  created_at: "timestamp"
}
```

### Spam Prevention

1. **Client-side cooldown**: 5-second minimum between submissions
2. **RLS policies**: Database-level security (extendable for rate limiting)

### Leaderboard Queries

- **All Time**: Top 50 scores ordered by score descending
- **Today**: Top 50 scores from the last 24 hours

---

## ⚙️ Game Configuration

All game balance constants are in `src/lib/gameConfig.ts`:

| Constant | Default | Description |
|----------|---------|-------------|
| `BUST_BASE_CHANCE` | 5% | Base bust probability |
| `BUST_INCREMENT` | 0.2% | Added bust chance per dig |
| `GEM_CHANCE` | 30% | Chance to find a gem |
| `GEM_MIN_POINTS` | 5 | Minimum gem points |
| `GEM_MAX_POINTS` | 25 | Maximum gem points |
| `JACKPOT_THRESHOLD` | 30 | Digs before jackpot possible |
| `JACKPOT_BASE_CHANCE` | 2% | Starting jackpot chance |
| `JACKPOT_INCREMENT` | 1% | Added per dig after threshold |
| `JACKPOT_BONUS` | 500 | Jackpot bonus points |

---

## 📁 Project Structure

```
dig-and-bust/
├── public/
│   └── meme.png              # Hero meme image
├── src/
│   ├── app/
│   │   ├── globals.css       # Tailwind + custom styles
│   │   ├── layout.tsx        # Root layout with AuthProvider
│   │   ├── page.tsx          # Landing page
│   │   ├── play/
│   │   │   └── page.tsx      # Game page
│   │   └── leaderboard/
│   │       └── page.tsx      # Leaderboard page
│   ├── components/
│   │   ├── AuthProvider.tsx  # Auth context
│   │   ├── AuthModal.tsx     # Login modal
│   │   ├── Confetti.tsx      # Celebration effects
│   │   ├── DiggingGame.tsx   # Main game logic
│   │   ├── Leaderboard.tsx   # Leaderboard display
│   │   └── MineShaft.tsx     # Mine visual
│   └── lib/
│       ├── gameConfig.ts     # Game constants
│       └── supabaseClient.ts # Supabase client
├── supabase/
│   └── schema.sql            # Database schema
├── .env.example
├── package.json
└── README.md
```

---

## 🎨 Meme Styling

The game UI uses meme-inspired copy:

- **"KEEP DIGGING!"** - Main encouragement message
- **"YOU WERE THIS CLOSE..."** - Bust message
- **"DIAMOND WALL"** - The jackpot goal

Colors match the mining theme:
- Dirt browns (`#8B6914`, `#a67c52`)
- Diamond blues (`#4fc3f7`, `#0288d1`)
- Dark tunnel background (`#2d1810`)

---

## 📝 License

MIT License - Feel free to fork and modify!

---

**Don't give up. You were THIS close! 💎**
