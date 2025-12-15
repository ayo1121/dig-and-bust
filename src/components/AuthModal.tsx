'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface AuthModalProps {
    isOpen: boolean;
    onClose?: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { signInWithEmail, signInAsGuest } = useAuth();
    const [mode, setMode] = useState<'select' | 'email' | 'guest'>('select');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setError('');
        try {
            await signInWithEmail(email);
            setEmailSent(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send magic link');
        } finally {
            setLoading(false);
        }
    };

    const handleGuestSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;
        signInAsGuest(username.trim());
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-md relative border border-dark-600">
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-dark-400 hover:text-white"
                    >
                        ✕
                    </button>
                )}

                <h2 className="text-2xl font-bold text-center mb-6 text-gradient">
                    ⛏️ Start Mining
                </h2>

                {mode === 'select' && (
                    <div className="space-y-3">
                        <button
                            onClick={() => setMode('email')}
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            ✉️ Sign in with Email
                        </button>

                        <button
                            onClick={() => setMode('guest')}
                            className="w-full py-3 px-4 bg-dark-700 hover:bg-dark-600 border border-dark-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            👤 Play as Guest
                        </button>
                    </div>
                )}

                {mode === 'email' && (
                    <>
                        {emailSent ? (
                            <div className="text-center space-y-4">
                                <div className="text-5xl">📧</div>
                                <p className="text-emerald-400 font-semibold">Magic link sent!</p>
                                <p className="text-dark-300 text-sm">
                                    Check your email and click the link to sign in.
                                </p>
                                <button
                                    onClick={() => { setEmailSent(false); setMode('select'); }}
                                    className="text-primary-400 hover:underline text-sm"
                                >
                                    ← Back
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-dark-300 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="miner@example.com"
                                        className="input w-full"
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="text-danger text-sm">{error}</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
                                >
                                    {loading ? 'Sending...' : 'Send Magic Link'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setMode('select')}
                                    className="w-full text-dark-400 hover:text-white text-sm"
                                >
                                    ← Back
                                </button>
                            </form>
                        )}
                    </>
                )}

                {mode === 'guest' && (
                    <form onSubmit={handleGuestSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-dark-300 mb-2">Choose a Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="DiamondMiner"
                                maxLength={20}
                                className="input w-full"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white rounded-xl font-semibold transition-all"
                        >
                            Start Mining!
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('select')}
                            className="w-full text-dark-400 hover:text-white text-sm"
                        >
                            ← Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
