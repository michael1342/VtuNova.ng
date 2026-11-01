import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Logo from '../components/Logo';
import { resetPassword } from '../api/auth';
import ApiError from '../api/ApiError';
import { useTheme } from '../context/themeContext';

interface ResetPasswordRouteState {
    resetToken?: string;
}

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme() as { theme: string; toggleTheme: () => void };
    const routeState = (location.state as ResetPasswordRouteState | null) || {};
    const [resetToken, setResetToken] = useState(routeState.resetToken || '');
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [completed, setCompleted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (!passwords.newPassword) return setError('New password is required.');
        if (passwords.newPassword.length < 6) return setError('Password must be at least 6 characters.');
        if (!passwords.confirmPassword) return setError('Confirm your new password.');
        if (passwords.newPassword !== passwords.confirmPassword) return setError('Passwords do not match.');
        if (!resetToken) return setError('This reset authorization is missing. Request a new reset code.');

        setLoading(true);
        try {
            const result = await resetPassword({
                resetToken,
                newPassword: passwords.newPassword,
                confirmPassword: passwords.confirmPassword,
            });
            if (!result?.success) throw new Error(result?.error || 'Unable to reset your password.');
            setPasswords({ newPassword: '', confirmPassword: '' });
            setResetToken('');
            setCompleted(true);
            navigate('/reset-password', { replace: true, state: null });
        } catch (resetError) {
            setError(resetError instanceof ApiError ? resetError.message : resetError instanceof Error ? resetError.message : 'Unable to reset your password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => navigate('/login', { replace: true });

    return (
        <div className="min-h-screen flex bg-bg-dark text-text-white relative overflow-hidden">
            <Link to="/" aria-label="Return home" className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200">
                <ArrowLeftIcon className="w-4 h-4" />
            </Link>
            <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200">
                <span className="text-xs">{theme === 'dark' ? 'Sun' : 'Moon'}</span>
            </button>

            <aside className="hidden lg:flex lg:w-[45%] flex-col justify-between relative overflow-hidden bg-bg-dark-secondary border-r border-border p-10">
                <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <Link to="/"><Logo size="lg" /></Link>
                <div className="relative max-w-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-6"><ShieldCheckIcon className="w-8 h-8 text-primary" /></div>
                    <p className="text-xs uppercase tracking-[0.24em] text-primary font-semibold mb-3">Secure account recovery</p>
                    <h2 className="text-4xl font-extrabold font-heading text-text-white leading-tight mb-4">Protect your next sign-in.</h2>
                    <p className="text-sm leading-7 text-text-gray">Choose a new password to secure your VtuNova account.</p>
                </div>
                <p className="text-xs text-text-muted">Secure access for every top-up.</p>
            </aside>

            <main className="flex-1 flex items-center justify-center px-6 py-16 lg:px-16 relative">
                <div className="absolute top-[15%] right-[12%] w-72 h-72 bg-primary/10 blur-3xl pointer-events-none" />
                <div className="w-full max-w-md relative z-10">
                    <div className="mb-8 lg:hidden"><Link to="/"><Logo size="lg" /></Link></div>
                    {completed ? <>
                        <div className="w-14 h-14 rounded-2xl bg-accent-green/15 border border-accent-green/25 flex items-center justify-center mb-6"><CheckCircleIcon className="w-7 h-7 text-accent-green" /></div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-text-white font-heading mb-2">Password reset successful</h1>
                        <p className="text-sm text-text-gray leading-6 mb-8">Your password has been updated. You can now sign in with your new password.</p>
                        <button type="button" onClick={handleLogin} className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-green to-emerald-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 transition-all">Go to Login</button>
                    </> : !resetToken ? <>
                        <div className="w-14 h-14 rounded-2xl bg-accent-orange/15 border border-accent-orange/25 flex items-center justify-center mb-6"><LockClosedIcon className="w-7 h-7 text-accent-orange" /></div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-text-white font-heading mb-2">Reset authorization unavailable</h1>
                        <p className="text-sm text-text-gray leading-6 mb-8">Verify a password reset code before choosing a new password.</p>
                        <Link to="/verify-password-reset-otp" className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-green to-emerald-500 text-white font-semibold text-sm flex items-center justify-center hover:-translate-y-0.5 transition-all">Request a reset code</Link>
                        <p className="text-center text-sm text-text-gray mt-5"><Link to="/login" className="text-primary font-semibold hover:underline">← Back to Login</Link></p>
                    </> : <>
                        <div className="w-14 h-14 rounded-2xl bg-accent-green/15 border border-accent-green/25 flex items-center justify-center mb-6"><LockClosedIcon className="w-7 h-7 text-accent-green" /></div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-text-white font-heading mb-2">Choose a new password</h1>
                        <p className="text-sm text-text-gray leading-6 mb-8">Enter a new password for your account.</p>

                        {error && <div role="alert" className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="new-password" className="block text-xs font-medium text-text-gray mb-1.5">New password</label>
                                <input id="new-password" type="password" autoComplete="new-password" minLength={6} value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-xs font-medium text-text-gray mb-1.5">Confirm new password</label>
                                <input id="confirm-password" type="password" autoComplete="new-password" minLength={6} value={passwords.confirmPassword} onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))} className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-green to-emerald-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                                {loading ? 'Updating password...' : 'Reset password'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-text-gray mt-7"><Link to="/login" className="text-primary font-semibold hover:underline">← Back to Login</Link></p>
                    </>}
                </div>
            </main>
        </div>
    );
};

export default ResetPassword;