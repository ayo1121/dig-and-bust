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
        // Allow guest submissions too
        const playerId = user?.id || 'anonymous_' + Date.now();
        const displayName = user?.displayName || 'Anonymous';

        console.log('Submitting score:', { playerId, displayName, finalScore, finalDigs, outcome });

        // Spam prevention
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

        // Simulate mining delay
        setTimeout(() => {
            setGame(prev => {
                const { result, points } = calculateDigResult(prev.digs);
                const newDigs = prev.digs + 1;

                if (result === 'bust') {
                    // Game over - submit score on bust too
                    const finalScore = prev.score;
                    submitScore(finalScore, newDigs, 'bust');

                    // Update best score
                    if (finalScore > bestScore) {
                        setBestScore(finalScore);
                        localStorage.setItem('dig_bust_best', finalScore.toString());
                    }

                    // Update attempts
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
                    // Winner!
                    const finalScore = prev.score + points;
                    submitScore(finalScore, newDigs, 'jackpot');
                    setShowJackpot(true);

                    // Update best score
                    if (finalScore > bestScore) {
                        setBestScore(finalScore);
                        localStorage.setItem('dig_bust_best', finalScore.toString());
                    }

                    // Update attempts
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

                // Continue playing
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

    // Reset game
    const resetGame = () => {
        setGame(initialGameState);
        setShowJackpot(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1a0f08] to-[#0d0604] text-white">
            <Confetti trigger={showJackpot} type="jackpot" />

            {/* Clean Header */}
            <header className="py-4 border-b border-amber-900/30">
                <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-amber-400">⛏️ Dig & Bust</h1>
                    <div className="text-sm text-gray-400">
                        Playing as <span className="text-amber-300">{user?.displayName || 'Guest'}</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Stats Bar */}
                <div className="flex justify-center gap-6 mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400">{game.score}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Score</div>
                    </div>
                    <div className="h-12 w-px bg-amber-900/30" />
                    <div className="text-center">
                        <div className="text-3xl font-bold text-cyan-400">{game.digs}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Digs</div>
                    </div>
                    <div className="h-12 w-px bg-amber-900/30" />
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-400">{bestScore}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Best</div>
                    </div>
                </div>

                {/* Progress message */}
                {game.isPlaying && (
                    <div className="text-center mb-4">
                        <div className={`text-lg font-semibold ${progress >= 75 ? 'text-cyan-400 animate-pulse' :
                                progress >= 50 ? 'text-amber-400' : 'text-gray-300'
                            }`}>
                            {message}
                        </div>
                        {game.lastResult === 'gem' && game.lastPoints > 0 && (
                            <div className="text-green-400 text-xl font-bold animate-bounce mt-1">
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
                                    ? 'bg-gray-700 cursor-not-allowed scale-95'
                                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 hover:scale-105 active:scale-95 shadow-lg hover:shadow-amber-500/25'
                                }`}
                        >
                            {game.isDigging ? '⛏️ Digging...' : '⛏️ DIG'}
                        </button>
                    ) : (
                        <div className="space-y-4">
                            {/* Result display */}
                            <div className={`text-center p-6 rounded-xl ${game.outcome === 'jackpot'
                                    ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-500/30'
                                    : 'bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30'
                                }`}>
                                <div className="text-4xl mb-2">
                                    {game.outcome === 'jackpot' ? '🎉💎🎉' : '💥'}
                                </div>
                                <div className={`text-2xl font-bold ${game.outcome === 'jackpot' ? 'text-cyan-400' : 'text-red-400'
                                    }`}>
                                    {game.outcome === 'jackpot' ? 'JACKPOT!' : 'BUSTED!'}
                                </div>
                                <div className="text-lg text-gray-300 mt-2">
                                    Final Score: <span className="font-bold text-amber-400">{game.score}</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    Total Digs: {game.digs}
                                </div>
                            </div>

                            {/* Play again button */}
                            <button
                                onClick={resetGame}
                                className="w-full py-4 text-xl font-bold rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all transform hover:scale-105 shadow-lg"
                            >
                                🔄 Play Again
                            </button>
                        </div>
                    )}
                </div>

                {/* Attempt counter */}
                <div className="text-center mt-4 text-gray-500 text-sm">
                    Attempt #{attempts + 1}
                </div>
            </main>
        </div>
    );
}
