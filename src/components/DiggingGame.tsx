'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';
import { supabase } from '@/lib/supabaseClient';
import {
    GAME_CONFIG,
    calculateDigResult,
    getProgressToJackpot,
    getProgressMessage,
    DigResult
} from '@/lib/gameConfig';
import MemeDigger from './MemeDigger';
import Confetti from './Confetti';

interface GameState {
    score: number;
    digs: number;
    isPlaying: boolean;
    lastResult: DigResult | null;
    outcome: 'bust' | 'jackpot' | null;
    isDigging: boolean;
    lastPoints: number;
}

const initialGameState: GameState = {
    score: 0,
    digs: 0,
    isPlaying: true,
    lastResult: null,
    outcome: null,
    isDigging: false,
    lastPoints: 0,
};

export default function DiggingGame() {
    const { user } = useAuth();
    const [game, setGame] = useState<GameState>(initialGameState);
    const [bestScore, setBestScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const [showJackpot, setShowJackpot] = useState(false);

    const progress = getProgressToJackpot(game.digs);
    const message = getProgressMessage(game.digs, progress);

    useEffect(() => {
        const saved = localStorage.getItem('dig_bust_best');
        if (saved) setBestScore(parseInt(saved, 10));

        const savedAttempts = localStorage.getItem('dig_bust_attempts');
        if (savedAttempts) setAttempts(parseInt(savedAttempts, 10));
    }, []);

    const submitScore = useCallback(async (finalScore: number, finalDigs: number, outcome: 'bust' | 'jackpot') => {
        const playerId = user?.id || 'anonymous_' + Date.now();
        const displayName = user?.displayName || 'Anonymous';

        console.log('Submitting score:', { playerId, displayName, finalScore, finalDigs, outcome });

        const now = Date.now();
        if (now - lastSubmitTime < GAME_CONFIG.SUBMIT_COOLDOWN_MS) {
            return;
        }
        setLastSubmitTime(now);

        try {
            const { data, error } = await supabase.from('scores').insert({
                player_id: playerId,
                display_name: displayName,
                score: finalScore,
                digs: finalDigs,
                outcome,
            }).select();

            if (error) {
                console.error('Failed to submit score:', error.message);
            } else {
                console.log('Score submitted:', data);
            }
        } catch (err) {
            console.error('Score submission error:', err);
        }
    }, [user, lastSubmitTime]);

    const handleDig = useCallback(() => {
        if (!game.isPlaying || game.isDigging) return;

        setGame(prev => ({ ...prev, isDigging: true }));

        setTimeout(() => {
            setGame(prev => {
                const { result, points } = calculateDigResult(prev.digs);
                const newDigs = prev.digs + 1;

                if (result === 'bust') {
                    const finalScore = prev.score;
                    submitScore(finalScore, newDigs, 'bust');

                    if (finalScore > bestScore) {
                        setBestScore(finalScore);
                        localStorage.setItem('dig_bust_best', finalScore.toString());
                    }

                    const newAttempts = attempts + 1;
                    setAttempts(newAttempts);
                    localStorage.setItem('dig_bust_attempts', newAttempts.toString());

                    return { ...prev, digs: newDigs, isPlaying: false, lastResult: 'bust', outcome: 'bust', isDigging: false };
                }

                if (result === 'jackpot') {
                    const finalScore = prev.score + points;
                    submitScore(finalScore, newDigs, 'jackpot');
                    setShowJackpot(true);

                    if (finalScore > bestScore) {
                        setBestScore(finalScore);
                        localStorage.setItem('dig_bust_best', finalScore.toString());
                    }

                    const newAttempts = attempts + 1;
                    setAttempts(newAttempts);
                    localStorage.setItem('dig_bust_attempts', newAttempts.toString());

                    return { ...prev, score: finalScore, digs: newDigs, isPlaying: false, lastResult: 'jackpot', outcome: 'jackpot', isDigging: false, lastPoints: points };
                }

                return { ...prev, score: prev.score + points, digs: newDigs, lastResult: result, isDigging: false, lastPoints: points };
            });
        }, GAME_CONFIG.DIG_ANIMATION_MS);
    }, [game.isPlaying, game.isDigging, bestScore, attempts, submitScore]);

    const resetGame = () => {
        setGame(initialGameState);
        setShowJackpot(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-dark-900 to-dark-950 text-white">
            <Confetti trigger={showJackpot} type="jackpot" />

            {/* Header */}
            <header className="border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/meme.png" alt="Logo" className="w-9 h-9 rounded-lg object-cover" />
                        <span className="text-lg font-bold text-gradient">Never Give Up</span>
                    </div>
                    <div className="text-sm text-dark-400">
                        {user?.displayName || 'Guest'}
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="card p-4 text-center">
                        <div className="text-2xl font-bold text-gradient">{game.score}</div>
                        <div className="text-xs text-dark-400 mt-1">Score</div>
                    </div>
                    <div className="card p-4 text-center">
                        <div className="text-2xl font-bold text-gradient-cyan">{game.digs}</div>
                        <div className="text-xs text-dark-400 mt-1">Digs</div>
                    </div>
                    <div className="card p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-400">{bestScore}</div>
                        <div className="text-xs text-dark-400 mt-1">Best</div>
                    </div>
                </div>

                {/* Progress */}
                {game.isPlaying && (
                    <div className="text-center mb-4">
                        <p className={`text-sm font-medium ${progress >= 75 ? 'text-secondary-400' :
                                progress >= 50 ? 'text-primary-400' : 'text-dark-300'
                            }`}>
                            {message}
                        </p>
                        {game.lastResult === 'gem' && game.lastPoints > 0 && (
                            <p className="text-emerald-400 font-bold animate-bounce mt-1">+{game.lastPoints} 💎</p>
                        )}
                    </div>
                )}

                {/* Meme */}
                <MemeDigger
                    isDigging={game.isDigging}
                    progress={progress}
                    showBust={game.outcome === 'bust'}
                />

                {/* Controls */}
                <div className="max-w-sm mx-auto mt-6">
                    {game.isPlaying ? (
                        <button
                            onClick={handleDig}
                            disabled={game.isDigging}
                            className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${game.isDigging
                                    ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-400 hover:to-primary-500 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98]'
                                }`}
                        >
                            {game.isDigging ? 'Digging...' : '⛏️ DIG'}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className={`card p-6 text-center ${game.outcome === 'jackpot'
                                    ? 'border-secondary-500/50 shadow-lg shadow-secondary-500/10'
                                    : 'border-danger/50 shadow-lg shadow-danger/10'
                                }`}>
                                <div className="text-4xl mb-2">
                                    {game.outcome === 'jackpot' ? '🎉💎' : '💥'}
                                </div>
                                <div className={`text-2xl font-bold ${game.outcome === 'jackpot' ? 'text-gradient-cyan' : 'text-danger'
                                    }`}>
                                    {game.outcome === 'jackpot' ? 'JACKPOT!' : 'BUSTED'}
                                </div>
                                <div className="text-dark-300 mt-2">
                                    Score: <span className="text-gradient font-bold">{game.score}</span>
                                </div>
                                <div className="text-sm text-dark-500 mt-1">
                                    {game.digs} digs
                                </div>
                            </div>

                            <button
                                onClick={resetGame}
                                className="w-full py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Play Again
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center mt-4 text-dark-500 text-sm">
                    Attempt #{attempts + 1}
                </p>
            </main>
        </div>
    );
}
