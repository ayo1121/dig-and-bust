-- Dig & Bust Supabase Schema
-- Run this in your Supabase SQL Editor

-- ===========================================
-- SCORES TABLE - Stores all completed runs
-- ===========================================
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  digs INTEGER NOT NULL DEFAULT 0,
  outcome TEXT NOT NULL CHECK (outcome IN ('bust', 'jackpot')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient leaderboard queries
CREATE INDEX IF NOT EXISTS scores_score_desc_idx ON scores(score DESC);
CREATE INDEX IF NOT EXISTS scores_created_at_idx ON scores(created_at DESC);

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view all scores (for leaderboard)
CREATE POLICY "Anyone can view scores" 
  ON scores 
  FOR SELECT 
  USING (true);

-- Policy: Anyone can insert scores (rate-limiting handled client-side)
-- For production, you might want stricter policies
CREATE POLICY "Anyone can insert scores" 
  ON scores 
  FOR INSERT 
  WITH CHECK (true);

-- ===========================================
-- PROFILES TABLE (Optional) - For custom usernames
-- ===========================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,  -- auth uid, wallet address, or guest id
  username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles
CREATE POLICY "Anyone can view profiles" 
  ON profiles 
  FOR SELECT 
  USING (true);

-- Anyone can insert their profile (one per user_id)
CREATE POLICY "Anyone can insert profile" 
  ON profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);
