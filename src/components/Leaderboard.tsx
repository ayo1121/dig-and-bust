'use client';

import { useEffect, useState } from 'react';
import { supabase, Score } from '@/lib/supabaseClient';

interface LeaderboardProps {
    limit?: number;
    showToday?: boolean;
}

export default function Leaderboard({ limit = 50, showToday = true }: LeaderboardProps) {
    const [scores, setScores] = useState<Score[]>([]);
    const [todayScores, setTodayScores] = useState<Score[]>([]);
    const [activeTab, setActiveTab] = useState<'alltime' | 'today'>('alltime');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchScores() {
            setLoading(true);

            // Fetch all-time scores
            const { data: allTime, error: allTimeError } = await supabase
                .from('scores')
                .select('*')
                .order('score', { ascending: false })
                .limit(limit);

            if (allTimeError) {
                console.error('Error fetching scores:', allTimeError);
            } else {
                setScores(allTime || []);
            }

            // Fetch today's scores
            if (showToday) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const { data: todayData, error: todayError } = await supabase
                    .from('scores')
                    .select('*')
                    .gte('created_at', today.toISOString())
                    .order('score', { ascending: false })
                    .limit(limit);

                if (todayError) {
                    console.error('Error fetching today scores:', todayError);
                } else {
                    setTodayScores(todayData || []);
                }
            }

            setLoading(false);
        }

        fetchScores();
    }, [limit, showToday]);

    const displayScores = activeTab === 'alltime' ? scores : todayScores;

    const getRankEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin text-4xl">⛏️</div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Tabs */}
            {showToday && (
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab('alltime')}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'alltime'
                                ? 'bg-amber-600 text-white'
                                : 'bg-tunnel-wall text-gray-400 hover:text-white'
                            }`}
                    >
                        🏆 All Time
                    </button>
                    <button
                        onClick={() => setActiveTab('today')}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${activeTab === 'today'
                                ? 'bg-amber-600 text-white'
                                : 'bg-tunnel-wall text-gray-400 hover:text-white'
                            }`}
                    >
                        📅 Today
                    </button>
                </div>
            )}

            {/* Leaderboard table */}
            <div className="bg-tunnel-wall rounded-xl overflow-hidden">
                {displayScores.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                        <div className="text-4xl mb-2">🕳️</div>
                        <p>No scores yet. Be the first to dig!</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="bg-dirt-dark text-amber-400 text-sm">
                                <th className="py-3 px-4 text-left">Rank</th>
                                <th className="py-3 px-4 text-left">Player</th>
                                <th className="py-3 px-4 text-right">Score</th>
                                <th className="py-3 px-4 text-right hidden sm:table-cell">Digs</th>
                                <th className="py-3 px-4 text-center hidden sm:table-cell">Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayScores.map((score, index) => (
                                <tr
                                    key={score.id}
                                    className={`border-t border-dirt-dark/50 ${index < 3 ? 'bg-dirt-dark/30' : ''
                                        } hover:bg-dirt-dark/20 transition-colors`}
                                >
                                    <td className="py-3 px-4 font-bold">
                                        {getRankEmoji(index + 1)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-semibold truncate max-w-[120px] sm:max-w-[200px]">
                                            {score.display_name}
                                        </div>
                                        <div className="text-xs text-gray-500 sm:hidden">
                                            {score.digs} digs • {score.outcome === 'jackpot' ? '💎' : '💥'}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-right font-bold text-amber-400">
                                        {score.score.toLocaleString()}
                                    </td>
                                    <td className="py-3 px-4 text-right text-gray-400 hidden sm:table-cell">
                                        {score.digs}
                                    </td>
                                    <td className="py-3 px-4 text-center hidden sm:table-cell">
                                        {score.outcome === 'jackpot' ? (
                                            <span className="text-diamond">💎 Jackpot</span>
                                        ) : (
                                            <span className="text-red-400">💥 Bust</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
