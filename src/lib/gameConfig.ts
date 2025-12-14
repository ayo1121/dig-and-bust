/**
 * Game Configuration - All balancing constants in one place
 */

export const GAME_CONFIG = {
    // Bust mechanics
    BUST_BASE_CHANCE: 0.05, // 5% base chance to bust on each dig
    BUST_INCREMENT: 0.002, // +0.2% per dig (increases risk over time)

    // Gem mechanics
    GEM_CHANCE: 0.30, // 30% chance to find a gem
    GEM_MIN_POINTS: 5,
    GEM_MAX_POINTS: 25,

    // Jackpot mechanics
    JACKPOT_THRESHOLD: 30, // Must dig at least this many times before jackpot possible
    JACKPOT_BASE_CHANCE: 0.02, // 2% starting jackpot chance after threshold
    JACKPOT_INCREMENT: 0.01, // +1% per dig after threshold
    JACKPOT_MAX_CHANCE: 0.50, // Cap at 50% chance
    JACKPOT_BONUS: 500, // Points for hitting jackpot

    // Anti-spam
    SUBMIT_COOLDOWN_MS: 5000, // 5 seconds between score submissions

    // Visual
    MAX_VISIBLE_BLOCKS: 15, // Number of dirt blocks to show in tunnel
    DIG_ANIMATION_MS: 300, // Duration of dig animation
};

// Dig result types
export type DigResult = 'dirt' | 'gem' | 'bust' | 'jackpot';

/**
 * Calculate the result of a dig based on current progress
 */
export function calculateDigResult(currentDigs: number): { result: DigResult; points: number } {
    const random = Math.random();

    // Check for jackpot first (only after threshold)
    if (currentDigs >= GAME_CONFIG.JACKPOT_THRESHOLD) {
        const digsAfterThreshold = currentDigs - GAME_CONFIG.JACKPOT_THRESHOLD;
        const jackpotChance = Math.min(
            GAME_CONFIG.JACKPOT_BASE_CHANCE + (digsAfterThreshold * GAME_CONFIG.JACKPOT_INCREMENT),
            GAME_CONFIG.JACKPOT_MAX_CHANCE
        );

        if (random < jackpotChance) {
            return { result: 'jackpot', points: GAME_CONFIG.JACKPOT_BONUS };
        }
    }

    // Check for bust
    const bustChance = GAME_CONFIG.BUST_BASE_CHANCE + (currentDigs * GAME_CONFIG.BUST_INCREMENT);
    if (random < bustChance) {
        return { result: 'bust', points: 0 };
    }

    // Check for gem
    if (Math.random() < GAME_CONFIG.GEM_CHANCE) {
        const points = Math.floor(
            Math.random() * (GAME_CONFIG.GEM_MAX_POINTS - GAME_CONFIG.GEM_MIN_POINTS + 1) + GAME_CONFIG.GEM_MIN_POINTS
        );
        return { result: 'gem', points };
    }

    // Default: just dirt
    return { result: 'dirt', points: 0 };
}

/**
 * Get progress toward diamond wall (0-100%)
 */
export function getProgressToJackpot(digs: number): number {
    if (digs >= GAME_CONFIG.JACKPOT_THRESHOLD) {
        const digsAfterThreshold = digs - GAME_CONFIG.JACKPOT_THRESHOLD;
        const extraProgress = Math.min(digsAfterThreshold * 2, 50); // Up to 50% extra after threshold
        return 50 + extraProgress;
    }
    return (digs / GAME_CONFIG.JACKPOT_THRESHOLD) * 50;
}

/**
 * Get motivational message based on progress
 */
export function getProgressMessage(digs: number, progress: number): string {
    if (progress < 25) return "KEEP DIGGING!";
    if (progress < 50) return "Getting closer...";
    if (progress < 75) return "NEAR THE DIAMOND WALL!";
    return "SO CLOSE! DON'T GIVE UP!";
}
