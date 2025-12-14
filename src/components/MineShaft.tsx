'use client';

import { GAME_CONFIG } from '@/lib/gameConfig';

interface MineShaftProps {
    progress: number; // 0-100
    lastResult?: 'dirt' | 'gem' | 'bust' | 'jackpot' | null;
    isDigging?: boolean;
}

export default function MineShaft({ progress, lastResult, isDigging }: MineShaftProps) {
    const blocksCount = GAME_CONFIG.MAX_VISIBLE_BLOCKS;
    const dugBlocks = Math.floor((progress / 100) * blocksCount);

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Mine tunnel container */}
            <div className="relative bg-tunnel-wall rounded-xl overflow-hidden border-4 border-dirt-dark shadow-2xl">
                {/* Diamond wall on the right */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-diamond via-diamond-dark to-transparent animate-pulse-glow"
                    style={{
                        opacity: progress > 50 ? 0.4 + (progress - 50) / 100 : 0.2,
                    }}
                >
                    {/* Diamond pattern */}
                    <div className="h-full flex flex-col justify-around py-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-end pr-2 gap-1">
                                {[...Array(3)].map((_, j) => (
                                    <span
                                        key={j}
                                        className="text-xl opacity-80"
                                        style={{
                                            animationDelay: `${(i + j) * 0.2}s`,
                                            animation: 'pulse 2s ease-in-out infinite'
                                        }}
                                    >
                                        💎
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tunnel / dug area */}
                <div className="relative z-10 p-4">
                    <div className="flex flex-wrap gap-2 justify-start">
                        {[...Array(blocksCount)].map((_, i) => {
                            const isDug = i < dugBlocks;
                            const isLatest = i === dugBlocks - 1 && lastResult;

                            return (
                                <div
                                    key={i}
                                    className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                    transition-all duration-300 transform
                    ${isDug
                                            ? 'bg-tunnel-bg/50 scale-90 border border-dirt-dark/30'
                                            : 'bg-gradient-to-br from-dirt to-dirt-dark border-2 border-dirt-dark hover:scale-105 cursor-pointer shadow-md'
                                        }
                    ${isDigging && i === dugBlocks ? 'animate-dig-shake' : ''}
                    ${isLatest && lastResult === 'gem' ? 'animate-gem-pop' : ''}
                  `}
                                >
                                    {isDug ? (
                                        isLatest ? (
                                            lastResult === 'gem' ? '💎' :
                                                lastResult === 'bust' ? '💥' :
                                                    lastResult === 'jackpot' ? '🏆' :
                                                        '🕳️'
                                        ) : '🕳️'
                                    ) : (
                                        <span className="opacity-60">🪨</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-4 bg-tunnel-wall border-t-2 border-dirt-dark">
                    <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-dirt via-amber-500 to-diamond transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow-lg">
                            {Math.round(progress)}% to Diamond Wall
                        </span>
                    </div>
                </div>
            </div>

            {/* Near diamond wall indicator */}
            {progress >= 50 && (
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 animate-bounce">
                    <div className="bg-diamond-dark text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {progress >= 75 ? '🔥 SO CLOSE!' : '⚡ Near!'}
                    </div>
                </div>
            )}
        </div>
    );
}
