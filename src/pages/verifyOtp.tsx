import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon, EnvelopeIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Logo from '../components/Logo';
import { resendOtp, verifyOtp } from '../api/auth';
import ApiError from '../api/ApiError';
import { useTheme } from '../context/themeContext';
import type { VerificationState } from '../interface/user-page.interface';

const OTP_DURATION_SECONDS = 5 * 60;
const OTP_EXPIRY_STORAGE_KEY = 'vtuNova_otp_expires_at';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme() as { theme: string; toggleTheme: () => void };
  const routeState = (location.state as VerificationState | null) || {};
  const [email, setEmail] = useState(routeState.email || '');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [otpId, setOtpId] = useState(routeState.otpId || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(() => {
    const savedExpiry = Number(sessionStorage.getItem(OTP_EXPIRY_STORAGE_KEY));
    if (savedExpiry > Date.now()) return Math.ceil((savedExpiry - Date.now()) / 1000);

    sessionStorage.setItem(OTP_EXPIRY_STORAGE_KEY, String(Date.now() + OTP_DURATION_SECONDS * 1000));
    return OTP_DURATION_SECONDS;
  });
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!routeState.email) {
      const savedEmail = sessionStorage.getItem('vtuNova_pending_email');
      if (savedEmail) setEmail(savedEmail);
    }
  }, [routeState.email]);

  useEffect(() => {
    if (email) sessionStorage.setItem('vtuNova_pending_email', email);
  }, [email]);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (expiresIn === 0) return;
    const timer = window.setInterval(() => {
      setExpiresIn((value) => {
        const nextValue = Math.max(value - 1, 0);
        if (nextValue === 0) sessionStorage.removeItem(OTP_EXPIRY_STORAGE_KEY);
        return nextValue;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expiresIn]);

  const formattedExpiry = `${String(Math.floor(expiresIn / 60)).padStart(2, '0')}:${String(expiresIn % 60).padStart(2, '0')}`;

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const otp = code.join('');
    setError('');
    setSuccess('');
    if (!email.trim()) return setError('Enter the email address used to register.');
    if (otp.length !== 6) return setError('Enter the 6-digit verification code.');
    if (expiresIn === 0) return setError('This verification code has expired. Request a new code to continue.');

    setLoading(true);
    try {
      const response = await verifyOtp({ email: email.trim(), otp, otpId: otpId || undefined });
      if (!response?.success) throw new Error(response?.error || 'That code is not valid.');
      sessionStorage.removeItem('vtuNova_pending_email');
      setSuccess('Email verified. Taking you to sign in...');
      window.setTimeout(() => navigate('/login', { state: { email: email.trim() } }), 900);
    } catch (verificationError: any) {
      setError(verificationError instanceof ApiError ? verificationError.message : verificationError?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || cooldown > 0 || resending) return;
    setError('');
    setSuccess('');
    setResending(true);
    try {
      const response = await resendOtp({ email: email.trim(), otpId: otpId || undefined });
      if (!response?.success) throw new Error(response?.error || 'Could not resend the code.');
      setOtpId((response.response as any)?.otpId || (response.response as any)?.data?.otpId || otpId);
      setCooldown(30);
      setExpiresIn(OTP_DURATION_SECONDS);
      sessionStorage.setItem(OTP_EXPIRY_STORAGE_KEY, String(Date.now() + OTP_DURATION_SECONDS * 1000));
      setSuccess('A new code has been sent to your email.');
    } catch (resendError: any) {
      setError(resendError instanceof ApiError ? resendError.message : resendError?.message || 'Could not resend the code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-dark text-text-white relative overflow-hidden">
      <Link to="/" aria-label="Return home" className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200">
        <ArrowLeftIcon className="w-4 h-4" />
      </Link>
      <button onClick={toggleTheme} aria-label="Toggle theme" className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200">
        <span className="text-xs">{theme === 'dark' ? 'Sun' : 'Moon'}</span>
      </button>

      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between relative overflow-hidden bg-bg-dark-secondary border-r border-border p-10">
        <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <Link to="/"><Logo size="lg" /></Link>
        <div className="relative max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mb-6"><ShieldCheckIcon className="w-8 h-8 text-primary" /></div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary font-semibold mb-3">One secure step</p>
          <h2 className="text-4xl font-extrabold font-heading text-text-white leading-tight mb-4">Your wallet starts with a verified email.</h2>
          <p className="text-sm leading-7 text-text-gray">Confirm your email to protect your VtuNova account and unlock fast, reliable payments.</p>
        </div>
        <p className="text-xs text-text-muted">Secure access for every top-up.</p>
      </div>

      <main className="flex-1 flex items-center justify-center px-6 py-16 lg:px-16 relative">
        <div className="absolute top-[15%] right-[12%] w-72 h-72 bg-primary/10 blur-3xl pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <div className="mb-8 lg:hidden"><Link to="/"><Logo size="lg" /></Link></div>
          <div className="w-14 h-14 rounded-2xl bg-accent-green/15 border border-accent-green/25 flex items-center justify-center mb-6"><EnvelopeIcon className="w-7 h-7 text-accent-green" /></div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-white font-heading mb-2">Verify your email</h1>
          <p className="text-sm text-text-gray leading-6 mb-8">We sent a 6-digit code to your email. Enter it below to finish setting up your account.</p>

          {error && <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          {success && <div className="mb-5 px-4 py-3 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm flex items-center gap-2"><CheckCircleIcon className="w-4 h-4 shrink-0" />{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="verification-email" className="block text-xs font-medium text-text-gray mb-1.5">Email address</label>
              <input id="verification-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2"><label className="text-xs font-medium text-text-gray">Verification code</label><span className={`text-xs font-semibold ${expiresIn === 0 ? 'text-red-400' : expiresIn <= 60 ? 'text-accent-orange' : 'text-text-muted'}`}>{expiresIn === 0 ? 'Code expired' : `${formattedExpiry} remaining`}</span></div>
              <div className="grid grid-cols-6 gap-2">
                {code.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} aria-label={`Digit ${index + 1}`} inputMode="numeric" maxLength={1} value={digit} onChange={(event) => updateCode(index, event.target.value)} onKeyDown={(event) => handleKeyDown(index, event)} onPaste={handlePaste} className="h-14 w-full rounded-xl bg-bg-card border border-border text-center text-xl font-bold text-text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all" />)}
              </div>
            </div>
            <button type="submit" disabled={loading || expiresIn === 0} className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-green to-emerald-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">{loading ? 'Verifying code...' : expiresIn === 0 ? 'Code expired' : 'Verify email'}</button>
          </form>

          <p className="text-center text-sm text-text-gray mt-7">Didn’t receive a code? <button type="button" onClick={handleResend} disabled={resending || cooldown > 0 || !email.trim()} className="text-primary font-semibold hover:underline disabled:text-text-muted disabled:no-underline">{resending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}</button></p>
          <p className="text-center text-sm text-text-gray mt-5">Already verified? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link></p>
        </div>
      </main>
    </div>
  );
};

export default VerifyOtp;