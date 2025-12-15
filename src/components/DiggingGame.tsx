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

    // Load best score from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('dig_bust_best');
        if (saved) setBestScore(parseInt(saved, 10));

        const savedAttempts = localStorage.getItem('dig_bust_attempts');
        if (savedAttempts) setAttempts(parseInt(savedAttempts, 10));
    }, []);

    // Submit score to Supabase
    const submitScore = useCallback(async (finalScore: number, finalDigs: number, outcome: 'bust' | 'jackpot') => {
        const playerId = user?.id || 'anonymous_' + Date.now();
        const displayName = user?.displayName || 'Anonymous';

        console.log('Submitting score:', { playerId, displayName, finalScore, finalDigs, outcome });

        const now = Date.now();
        if (now - lastSubmitTime < GAME_CONFIG.SUBMIT_COOLDOWN_MS) {
            console.log('Score submission rate limited');
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
                console.error('Failed to submit score:', error.message, error.details, error.hint);
            } else {
                console.log('Score submitted successfully:', data);
            }
        } catch (err) {
            console.error('Score submission error:', err);
        }
    }, [user, lastSubmitTime]);

    // Handle dig action
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

                    return {
                        ...prev,
                        digs: newDigs,
                        isPlaying: false,
                        lastResult: 'bust',
                        outcome: 'bust',
                        isDigging: false,
                    };
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

                    return {
                        ...prev,
                        score: finalScore,
                        digs: newDigs,
                        isPlaying: false,
                        lastResult: 'jackpot',
                        outcome: 'jackpot',
                        isDigging: false,
                        lastPoints: points,
                    };
                }

                return {
                    ...prev,
                    score: prev.score + points,
                    digs: newDigs,
                    lastResult: result,
                    isDigging: false,
                    lastPoints: points,
                };
            });
        }, GAME_CONFIG.DIG_ANIMATION_MS);
    }, [game.isPlaying, game.isDigging, bestScore, attempts, submitScore]);

    const resetGame = () => {
        setGame(initialGameState);
        setShowJackpot(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-tunnel-surface via-tunnel-bg to-tunnel-wall text-white">
            <Confetti trigger={showJackpot} type="jackpot" />

            {/* Header */}
            <header className="py-4 px-4 glass border-b border-gold/20">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/meme.png" alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
                        <h1 className="text-2xl font-bold text-gradient-gold">Miner: Never Give Up</h1>
                    </div>
                    <div className="text-sm text-earth-light">
                        Playing as <span className="text-gold font-semibold">{user?.displayName || 'Guest'}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-gradient-gold">{game.score}</div>
                        <div className="text-xs text-earth-light uppercase tracking-widest mt-1">Score</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-gradient-diamond">{game.digs}</div>
                        <div className="text-xs text-earth-light uppercase tracking-widest mt-1">Digs</div>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-success">{bestScore}</div>
                        <div className="text-xs text-earth-light uppercase tracking-widest mt-1">Best</div>
                    </div>
                </div>

                {/* Progress message */}
                {game.isPlaying && (
                    <div className="text-center mb-4">
                        <div className={`text-lg font-semibold ${progress >= 75 ? 'text-diamond animate-pulse' :
                            progress >= 50 ? 'text-gold' : 'text-earth-light'
                            }`}>
                            {message}
                        </div>
                        {game.lastResult === 'gem' && game.lastPoints > 0 && (
                            <div className="text-success text-xl font-bold animate-bounce mt-1">
                                +{game.lastPoints} 💎
                            </div>
                        )}
                    </div>
                )}

                {/* Meme Display */}
                <MemeDigger
                    isDigging={game.isDigging}
                    progress={progress}
                    showBust={game.outcome === 'bust'}
                />

                {/* Game Controls */}
                <div className="max-w-md mx-auto mt-6">
                    {game.isPlaying ? (
                        <button
                            onClick={handleDig}
                            disabled={game.isDigging}
                            className={`w-full py-4 text-xl font-bold rounded-xl transition-all transform ${game.isDigging
                                ? 'bg-earth-dark text-earth-light cursor-not-allowed scale-95'
                                : 'bg-gradient-to-r from-gold to-gold-dark text-tunnel-bg hover:scale-105 active:scale-95 glow-gold'
                                }`}
                        >
                            {game.isDigging ? '⛏️ Digging...' : '⛏️ DIG'}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            {/* Result display */}
                            <div className={`text-center p-6 rounded-xl glass ${game.outcome === 'jackpot'
                                ? 'border-2 border-diamond glow-diamond'
                                : 'border-2 border-danger glow-danger'
                                }`}>
                                <div className="text-5xl mb-3">
                                    {game.outcome === 'jackpot' ? '🎉💎🎉' : '💥'}
                                </div>
                                <div className={`text-3xl font-bold ${game.outcome === 'jackpot' ? 'text-gradient-diamond' : 'text-danger'
                                    }`}>
                                    {game.outcome === 'jackpot' ? 'JACKPOT!' : 'BUSTED!'}
                                </div>
                                <div className="text-xl text-white mt-3">
                                    Final Score: <span className="font-bold text-gradient-gold">{game.score}</span>
                                </div>
                                <div className="text-sm text-earth-light mt-1">
                                    Total Digs: {game.digs}
                                </div>
                            </div>

                            {/* Play again button */}
                            <button
                                onClick={resetGame}
                                className="w-full py-4 text-xl font-bold rounded-xl bg-gradient-to-r from-success to-success-dark text-white transition-all transform hover:scale-105"
                            >
                                🔄 Play Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Attempt counter */}
                <div className="text-center mt-4 text-earth-brown text-sm">
                    Attempt #{attempts + 1}
                </div>
            </main>
        </div>
    );
}
