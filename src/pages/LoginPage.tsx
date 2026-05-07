import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[rgb(var(--bg-base))] flex items-center justify-center px-4 py-8">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[rgb(var(--color-primary))] opacity-[0.03] blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[rgb(var(--color-accent))] opacity-[0.03] blur-3xl" />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[rgb(var(--color-primary))] mb-4">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">
                        Sign in to continue your learning journey
                    </p>
                </div>

                {/* Form Card */}
                <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-6 sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-[10px] font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-3 py-2.5 bg-[rgb(var(--bg-base))] border border-[rgb(var(--border-primary))] text-sm text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-tertiary))] focus:outline-none focus:border-[rgb(var(--color-primary))] transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-[10px] font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-10 py-2.5 bg-[rgb(var(--bg-base))] border border-[rgb(var(--border-primary))] text-sm text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-tertiary))] focus:outline-none focus:border-[rgb(var(--color-primary))] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-tertiary))] hover:text-[rgb(var(--text-secondary))] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6 pt-5 border-t border-[rgb(var(--border-secondary))]">
                        <p className="text-center text-xs text-[rgb(var(--text-tertiary))]">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-hover))] font-semibold transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-[9px] text-[rgb(var(--text-tertiary))] uppercase tracking-wider font-medium">
                        Powered by AI · College Core
                    </p>
                </div>
            </div>
        </div>
    );
}
