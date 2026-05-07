import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    GraduationCap, User, Mail, Lock, ArrowRight, ArrowLeft,
    Loader2, Eye, EyeOff, Check, Sparkles,
    Code, Cpu, Database, Wifi, Zap, Cog, Building, Boxes,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDomains } from '../hooks/useDomains';

const YEARS = [
    { value: 1, label: '1st Year', sub: 'Freshman' },
    { value: 2, label: '2nd Year', sub: 'Sophomore' },
    { value: 3, label: '3rd Year', sub: 'Junior' },
    { value: 4, label: '4th Year', sub: 'Senior' },
];

const BRANCHES = [
    { value: 'CSE', label: 'CSE', icon: Code, color: '#10B981' },
    { value: 'AIDS', label: 'AI & DS', icon: Cpu, color: '#8B5CF6' },
    { value: 'IT', label: 'IT', icon: Database, color: '#3B82F6' },
    { value: 'ECE', label: 'ECE', icon: Wifi, color: '#F59E0B' },
    { value: 'EEE', label: 'EEE', icon: Zap, color: '#EF4444' },
    { value: 'ME', label: 'ME', icon: Cog, color: '#6366F1' },
    { value: 'CE', label: 'CE', icon: Building, color: '#14B8A6' },
    { value: 'Other', label: 'Other', icon: Boxes, color: '#78716C' },
];

export default function SignupPage() {
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState<'forward' | 'back'>('forward');

    // Step 1
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Step 2
    const [year, setYear] = useState<number | null>(null);
    const [branch, setBranch] = useState<string | null>(null);

    // Step 3
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signup, completeOnboarding } = useAuth();
    const { domains } = useDomains();
    const navigate = useNavigate();

    const goNext = () => {
        setDirection('forward');
        setStep((s) => s + 1);
        setError('');
    };

    const goBack = () => {
        setDirection('back');
        setStep((s) => s - 1);
        setError('');
    };

    const handleStep1 = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signup({ name, email, password });
            goNext();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleStep2 = () => {
        if (!year || !branch) {
            setError('Please select your year and branch');
            return;
        }
        goNext();
    };

    const handleStep3 = async () => {
        setError('');
        setLoading(true);
        try {
            await completeOnboarding({
                branch: branch || undefined,
                year: year || undefined,
                interests: selectedInterests,
            });
            navigate('/onboarding-complete');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save preferences');
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (domainName: string) => {
        setSelectedInterests((prev) =>
            prev.includes(domainName)
                ? prev.filter((i) => i !== domainName)
                : [...prev, domainName]
        );
    };

    const stepAnimation = direction === 'forward'
        ? 'animate-slideInRight'
        : 'animate-slideInLeft';

    return (
        <div className="min-h-screen bg-[rgb(var(--bg-base))] flex items-center justify-center px-4 py-8">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[rgb(var(--color-primary))] opacity-[0.03] blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[rgb(var(--color-accent))] opacity-[0.03] blur-3xl" />
            </div>

            <div className="w-full max-w-lg relative">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[rgb(var(--color-primary))] mb-4">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--text-primary))] tracking-tight">
                        {step === 1 && 'Create your account'}
                        {step === 2 && 'Tell us about yourself'}
                        {step === 3 && 'Pick your interests'}
                    </h1>
                    <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">
                        {step === 1 && 'Start your personalized learning journey'}
                        {step === 2 && 'We\'ll personalize your experience'}
                        {step === 3 && 'Select topics you want to explore'}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-1.5 mb-6">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className="h-1 flex-1 transition-all duration-500"
                            style={{
                                backgroundColor: s <= step
                                    ? 'rgb(var(--color-primary))'
                                    : 'rgb(var(--border-primary))',
                            }}
                        />
                    ))}
                </div>

                {/* Step Content */}
                <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-6 sm:p-8 overflow-hidden">
                    {/* Step 1: Account Details */}
                    {step === 1 && (
                        <div key="step1" className={stepAnimation}>
                            <form onSubmit={handleStep1} className="space-y-5">
                                {error && (
                                    <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            required
                                            className="w-full pl-10 pr-3 py-2.5 bg-[rgb(var(--bg-base))] border border-[rgb(var(--border-primary))] text-sm text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-tertiary))] focus:outline-none focus:border-[rgb(var(--color-primary))] transition-all"
                                        />
                                    </div>
                                </div>

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
                                            placeholder="Min 6 characters"
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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-2.5 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="w-4 h-4" strokeWidth={2} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-5 pt-4 border-t border-[rgb(var(--border-secondary))]">
                                <p className="text-center text-xs text-[rgb(var(--text-tertiary))]">
                                    Already have an account?{' '}
                                    <Link
                                        to="/login"
                                        className="text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-hover))] font-semibold transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Year & Branch */}
                    {step === 2 && (
                        <div key="step2" className={stepAnimation}>
                            <div className="space-y-6">
                                {error && (
                                    <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                {/* Year Selection */}
                                <div>
                                    <label className="block text-[10px] font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider mb-3">
                                        College Year
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {YEARS.map((y) => (
                                            <button
                                                key={y.value}
                                                type="button"
                                                onClick={() => setYear(y.value)}
                                                className={`relative p-3 border text-left transition-all duration-200 group ${year === y.value
                                                        ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5'
                                                        : 'border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-base))] hover:border-[rgb(var(--text-tertiary))]'
                                                    }`}
                                            >
                                                {year === y.value && (
                                                    <div className="absolute top-2 right-2 w-5 h-5 bg-[rgb(var(--color-primary))] flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                    </div>
                                                )}
                                                <span className={`block text-sm font-bold ${year === y.value ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--text-primary))]'
                                                    }`}>
                                                    {y.label}
                                                </span>
                                                <span className="block text-[10px] text-[rgb(var(--text-tertiary))] mt-0.5 uppercase tracking-wider">
                                                    {y.sub}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Branch Selection */}
                                <div>
                                    <label className="block text-[10px] font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider mb-3">
                                        Branch
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {BRANCHES.map((b) => (
                                            <button
                                                key={b.value}
                                                type="button"
                                                onClick={() => setBranch(b.value)}
                                                className={`relative p-3 border text-center transition-all duration-200 ${branch === b.value
                                                        ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5'
                                                        : 'border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-base))] hover:border-[rgb(var(--text-tertiary))]'
                                                    }`}
                                            >
                                                {branch === b.value && (
                                                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[rgb(var(--color-primary))] flex items-center justify-center">
                                                        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                    </div>
                                                )}
                                                <b.icon
                                                    className="w-5 h-5 mx-auto mb-1.5"
                                                    style={{ color: b.color }}
                                                    strokeWidth={2}
                                                />
                                                <span className={`block text-xs font-bold ${branch === b.value ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--text-primary))]'
                                                    }`}>
                                                    {b.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="px-4 py-2.5 border border-[rgb(var(--border-primary))] text-[rgb(var(--text-secondary))] text-sm font-semibold flex items-center gap-2 hover:bg-[rgb(var(--bg-overlay))] transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStep2}
                                        className="flex-1 py-2.5 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4" strokeWidth={2} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Interests */}
                    {step === 3 && (
                        <div key="step3" className={stepAnimation}>
                            <div className="space-y-5">
                                {error && (
                                    <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-semibold text-[rgb(var(--text-secondary))] uppercase tracking-wider mb-3">
                                        Select your interests
                                        <span className="ml-1 text-[rgb(var(--text-tertiary))] normal-case">
                                            ({selectedInterests.length} selected)
                                        </span>
                                    </label>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {domains.map((domain) => {
                                            const isSelected = selectedInterests.includes(domain.name);
                                            return (
                                                <button
                                                    key={domain.id}
                                                    type="button"
                                                    onClick={() => toggleInterest(domain.name)}
                                                    className={`relative p-3 border transition-all duration-200 text-left ${isSelected
                                                            ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5'
                                                            : 'border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-base))] hover:border-[rgb(var(--text-tertiary))]'
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[rgb(var(--color-primary))] flex items-center justify-center">
                                                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                        </div>
                                                    )}
                                                    <div
                                                        className="w-6 h-6 flex items-center justify-center mb-1.5"
                                                        style={{ backgroundColor: `${domain.color}15` }}
                                                    >
                                                        <Sparkles className="w-3.5 h-3.5" style={{ color: domain.color }} strokeWidth={2} />
                                                    </div>
                                                    <span className={`block text-xs font-bold truncate ${isSelected ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--text-primary))]'
                                                        }`}>
                                                        {domain.name}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {domains.length === 0 && (
                                        <div className="text-center py-8 text-sm text-[rgb(var(--text-tertiary))]">
                                            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                                            Loading domains...
                                        </div>
                                    )}
                                </div>

                                {/* Navigation */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={goBack}
                                        className="px-4 py-2.5 border border-[rgb(var(--border-primary))] text-[rgb(var(--text-secondary))] text-sm font-semibold flex items-center gap-2 hover:bg-[rgb(var(--bg-overlay))] transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStep3}
                                        disabled={loading}
                                        className="flex-1 py-2.5 bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                                        ) : (
                                            <>
                                                Complete Setup
                                                <Sparkles className="w-4 h-4" strokeWidth={2} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step indicator text */}
                <div className="mt-4 text-center">
                    <p className="text-[9px] text-[rgb(var(--text-tertiary))] uppercase tracking-wider font-medium">
                        Step {step} of 3
                    </p>
                </div>
            </div>
        </div>
    );
}
