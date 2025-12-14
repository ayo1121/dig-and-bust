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
import MineShaft from './MineShaft';
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
        if (!user) return;

        // Spam prevention
        const now = Date.now();
        if (now - lastSubmitTime < GAME_CONFIG.SUBMIT_COOLDOWN_MS) {
            console.log('Score submission rate limited');
            return;
        }
        setLastSubmitTime(now);

        try {
            const { error } = await supabase.from('scores').insert({
                player_id: user.id,
                display_name: user.displayName,
                score: finalScore,
                digs: finalDigs,
                outcome,
            });

            if (error) {
                console.error('Failed to submit score:', error);
            }
        } catch (err) {
            console.error('Score submission error:', err);
        }
    }, [user, lastSubmitTime]);

    // Handle dig action
    const dig = useCallback(() => {
        if (!game.isPlaying || game.isDigging) return;

        // Start dig animation
        setGame(prev => ({ ...prev, isDigging: true }));

        // Delay result calculation for animation
        setTimeout(() => {
            setGame(prev => {
                const newDigs = prev.digs + 1;
                const { result, points } = calculateDigResult(newDigs);

                if (result === 'bust') {
                    // Game over - bust
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
        <div className="min-h-screen bg-tunnel-bg text-white p-4">
            <Confetti trigger={showJackpot} type="jackpot" />

            {/* Header stats */}
            <div className="max-w-md mx-auto mb-6">
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div className="bg-tunnel-wall rounded-lg p-3">
                        <div className="text-2xl font-bold text-amber-400">{game.score}</div>
                        <div className="text-xs text-gray-400">Score</div>
                    </div>
                    <div className="bg-tunnel-wall rounded-lg p-3">
                        <div className="text-2xl font-bold text-diamond">{game.digs}</div>
                        <div className="text-xs text-gray-400">Digs</div>
                    </div>
                    <div className="bg-tunnel-wall rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-400">{bestScore}</div>
                        <div className="text-xs text-gray-400">Best</div>
                    </div>
                </div>

                {/* Attempts */}
                <div className="text-center text-sm text-gray-400">
                    Attempt #{attempts + 1} | Playing as <span className="text-amber-400">{user?.displayName || 'Guest'}</span>
                </div>
            </div>

            {/* Progress message */}
            <div className="text-center mb-6">
                <div className={`text-xl font-bold transition-colors ${progress >= 75 ? 'text-diamond animate-pulse' :
                        progress >= 50 ? 'text-amber-400' :
                            'text-white'
                    }`}>
                    {message}
                </div>
                {game.lastResult === 'gem' && game.lastPoints > 0 && (
                    <div className="text-green-400 text-lg animate-bounce">
                        +{game.lastPoints} 💎
                    </div>
                )}
            </div>

            {/* Mine shaft */}
            <MineShaft
                progress={progress}
                lastResult={game.lastResult}
                isDigging={game.isDigging}
            />

            {/* Game controls */}
            <div className="max-w-md mx-auto mt-6">
                {game.isPlaying ? (
                    <button
                        onClick={dig}
                        disabled={game.isDigging}
                        className={`
              w-full py-6 text-2xl font-bold rounded-xl
              transition-all transform
              ${game.isDigging
                                ? 'bg-dirt-dark text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
                            }
            `}
                    >
                        {game.isDigging ? '⛏️ Digging...' : '⛏️ DIG!'}
                    </button>
                ) : (
                    <div className="space-y-4">
                        {/* Result display */}
                        <div className={`text-center p-6 rounded-xl ${game.outcome === 'jackpot'
                                ? 'bg-gradient-to-r from-diamond-dark to-diamond text-white'
                                : 'bg-gradient-to-r from-red-800 to-red-900'
                            }`}>
                            {game.outcome === 'jackpot' ? (
                                <>
                                    <div className="text-4xl mb-2">🏆💎🏆</div>
                                    <div className="text-2xl font-bold">JACKPOT!</div>
                                    <div className="text-lg">You hit the Diamond Wall!</div>
                                    <div className="text-3xl font-bold mt-2">{game.score} points</div>
                                </>
                            ) : (
                                <>
                                    <div className="text-4xl mb-2">💥</div>
                                    <div className="text-2xl font-bold">BUST!</div>
                                    <div className="text-lg opacity-80">You were THIS close...</div>
                                    <div className="text-xl mt-2">Final Score: {game.score}</div>
                                    <div className="text-sm opacity-60">{game.digs} digs deep</div>
                                </>
                            )}
                        </div>

                        {/* Play again button */}
                        <button
                            onClick={resetGame}
                            className="w-full py-4 text-xl font-bold rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 transition-all transform hover:scale-105"
                        >
                            🔄 Dig Again!
                        </button>
                    </div>
                )}
            </div>

            {/* Tips */}
            {game.isPlaying && game.digs === 0 && (
                <div className="max-w-md mx-auto mt-8 text-center text-sm text-gray-400">
                    <p>💡 Keep digging to reach the Diamond Wall!</p>
                    <p>But be careful... dig too deep and you might bust!</p>
                </div>
            )}

            {/* Near jackpot warning */}
            {game.isPlaying && progress >= 50 && (
                <div className="max-w-md mx-auto mt-4 text-center">
                    <div className="bg-diamond/20 border border-diamond/40 rounded-lg p-3">
                        <span className="text-diamond font-semibold">
                            ⚡ Near the Diamond Wall! Jackpot chance active!
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
