import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Logo from '../components/Logo';
import { requestPasswordReset, verifyPasswordResetOtp } from '../api/auth';
import { useTheme } from '../context/themeContext';

interface ResetOtpRouteState {
    email?: string;
    codeSent?: boolean;
}

const VerifyPasswordResetOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme() as { theme: string; toggleTheme: () => void };
    const routeState = (location.state as ResetOtpRouteState | null) || {};
    const [email, setEmail] = useState(routeState.email || '');
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [codeSent, setCodeSent] = useState(routeState.codeSent === true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(routeState.codeSent ? 'If an account exists for this email, a reset code has been sent.' : '');
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    const handleEmailChange = (value: string) => {
        setEmail(value);
        setCodeSent(false);
        setCode(['', '', '', '', '', '']);
        setError('');
        setSuccess('');
    };

    const handleRequestCode = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        if (!email.trim()) return setError('Email address is required.');
        if (!/\S+@\S+\.\S+/.test(email.trim())) return setError('Enter a valid email address.');

        setSending(true);
        try {
            const result = await requestPasswordReset({ email: email.trim() });
            if (!result?.success) throw new Error(result?.error || 'Unable to send a reset code.');
            setCodeSent(true);
            setSuccess('If an account exists for this email, a reset code has been sent.');
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Unable to send a reset code. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const updateCode = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1);
        setCode((current) => current.map((item, itemIndex) => itemIndex === index ? digit : item));
        setError('');
        if (digit && index < code.length - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (!pasted) return;
        event.preventDefault();
        setCode(pasted.split('').concat(Array(6 - pasted.length).fill('')));
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerifyCode = async (event: React.FormEvent) => {
        event.preventDefault();
        const otp = code.join('');
        setError('');
        setSuccess('');
        if (otp.length !== 6) return setError('Enter the 6-digit reset code.');

        setVerifying(true);
        try {
            const result = await verifyPasswordResetOtp({ email: email.trim(), otp });
            if (!result.success || !result.response.resetToken) {
                throw new Error(result.success ? 'The reset code could not be verified.' : result.error);
            }
            setCode(['', '', '', '', '', '']);
            navigate('/reset-password', { state: { resetToken: result.response.resetToken } });
        } catch (verificationError) {
            setError(verificationError instanceof Error ? verificationError.message : 'The reset code could not be verified.');
        } finally {
            setVerifying(false);
        }
    };

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
                    <p className="text-xs uppercase tracking-[0.24em] text-primary font-semibold mb-3">Account recovery</p>
                    <h2 className="text-4xl font-extrabold font-heading text-text-white leading-tight mb-4">A secure way back into your wallet.</h2>
                    <p className="text-sm leading-7 text-text-gray">Verify your reset code to choose a new password and restore access to your VtuNova account.</p>
                </div>
                <p className="text-xs text-text-muted">Secure access for every top-up.</p>
            </aside>

            <main className="flex-1 flex items-center justify-center px-6 py-16 lg:px-16 relative">
                <div className="absolute top-[15%] right-[12%] w-72 h-72 bg-primary/10 blur-3xl pointer-events-none" />
                <div className="w-full max-w-md relative z-10">
                    <div className="mb-8 lg:hidden"><Link to="/"><Logo size="lg" /></Link></div>
                    <div className="w-14 h-14 rounded-2xl bg-accent-green/15 border border-accent-green/25 flex items-center justify-center mb-6"><EnvelopeIcon className="w-7 h-7 text-accent-green" /></div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-text-white font-heading mb-2">Reset your password</h1>
                    <p className="text-sm text-text-gray leading-6 mb-8">Enter the email associated with your account. We’ll send a code if the account is eligible for recovery.</p>

                    {error && <div role="alert" className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
                    {success && <div role="status" className="mb-5 px-4 py-3 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 shrink-0" />{success}</div>}

                    <form onSubmit={handleRequestCode} className="space-y-5">
                        <div>
                            <label htmlFor="reset-email" className="block text-xs font-medium text-text-gray mb-1.5">Email address</label>
                            <input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => handleEmailChange(event.target.value)} placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
                        </div>
                        <button type="submit" disabled={sending || verifying} className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-green to-emerald-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                            {sending ? 'Sending code...' : codeSent ? 'Send another code' : 'Send reset code'}
                        </button>
                    </form>

                    {codeSent && <form onSubmit={handleVerifyCode} className="space-y-5 mt-6">
                        <div>
                            <label className="block text-xs font-medium text-text-gray mb-2">6-digit reset code</label>
                            <div className="grid grid-cols-6 gap-2">
                                {code.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} aria-label={`Reset code digit ${index + 1}`} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={1} value={digit} onChange={(event) => updateCode(index, event.target.value)} onKeyDown={(event) => handleKeyDown(index, event)} onPaste={handlePaste} className="h-14 w-full rounded-xl bg-bg-card border border-border text-center text-xl font-bold text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />)}
                            </div>
                        </div>
                        <button type="submit" disabled={verifying || sending} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-emerald-500 text-white font-semibold text-sm hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                            {verifying ? 'Verifying code...' : 'Verify code'}
                        </button>
                    </form>}

                    <p className="text-center text-sm text-text-gray mt-7"><Link to="/login" className="text-primary font-semibold hover:underline">← Back to Login</Link></p>
                </div>
            </main>
        </div>
    );
};

export default VerifyPasswordResetOtp;