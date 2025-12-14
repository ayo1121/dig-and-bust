import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database
export interface Score {
    id: string;
    player_id: string;
    display_name: string;
    score: number;
    digs: number;
    outcome: 'bust' | 'jackpot';
    created_at: string;
}

export interface Profile {
    id: string;
    user_id: string;
    username: string | null;
    created_at: string;
    updated_at: string;
}
