import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import logoImg from '../assets/img/vtuNova_logo.png';
import {
  ArrowLeftIcon,
  BoltIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  WifiIcon,
  PhoneIcon,
  CreditCardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { BoltIcon as BoltSolidIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/themeContext';

// console.log(localStorage.getItem('vtuNova_key'))
// const fil = localStorage.getItem('vtuNova_key')
// const fin = JSON.parse(fil)
// const userArray = fin.map(u => u.email)
// const tostring = userArray.toString()
// console.log(tostring)

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [, setShowError] = useState(false)
  const [loading, setLoading] = useState(false);
  const [animateShake, setAnimateShake] = useState(false);
  const [success, setSuccess] = useState('');

  // type LoginType = {
  //   email: string
  //   password: string
  // }
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { login } = useAuth() as { login: (credentials: { email: string; password?: string }) => { success: boolean; error?: string ; user?: any } };
  const { theme, toggleTheme } = useTheme() as {theme: string, toggleTheme: () => void};

  const set = (k: string, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError('');
    setSuccess('');
  };

  const triggerError = (msg: string) => {
    setError(msg);
    setAnimateShake(true);
    setTimeout(() => setAnimateShake(false), 500);
  };

  const validate = () => {
    if (!form.email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.password) return 'Password is required.';
    // if (form.email !== tostring) return 'invalid credentials'
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      triggerError(validationError);
      return
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const res = login({ email: form.email, password: form.password });
    setLoading(false);
    // console.log(form.email, form.password)

    if (res && res.success) {
      setSuccess('Access granted! Redirecting...');
      const roleHome: /* Record<string, string> */any = {
        user: '/user/dashboard',
        admin: '/admin/dashboard',
      }
      const role = res.user?.role?.toLowerCase().trim().replace(/[\s_-]/g, '') || '';
      const destination = roleHome[role] || params.get('from') || '/';
      setTimeout(() => navigate(destination), 1200);
    } else {
      triggerError('Invalid credentials. Please try again.');
      setShowError(true)
      return
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-dark text-text-white relative overflow-hidden">
      {/* Return Home Button */}
      <Link
        to="/"
        aria-label="Return home"
        className="absolute top-4 left-4 z-50 w-9 h-9 rounded-full bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200"
      >
        <ArrowLeftIcon className="w-4 h-4" />
      </Link>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200"
      >
        {theme === 'dark' ? (
          /* Sun icon — shown in dark mode to switch to light */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          /* Moon icon — shown in light mode to switch to dark */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </button>

      {/* Left Panel — Branding & Illustration (Visible on lg/desktop screens) */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col relative overflow-hidden bg-bg-dark-secondary border-r border-border">
        {/* Background glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Logo */}
        <div className="px-5 pt-5">
          <img src={logoImg} alt="VtuNova" className="h-35 w-auto object-contain" />
        </div>

        {/* Phone Mockup Area */}
        <div className="flex-1 flex items-center justify-center px-10 relative">
          <div className="relative w-[260px] h-[480px]">
            {/* Phone Frame */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-bg-card to-bg-dark border border-border shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              {/* Screen Content */}
              <div className="absolute inset-3 rounded-[24px] bg-bg-dark-secondary overflow-hidden">
                {/* Status Bar */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                  <span className="text-[10px] text-text-muted font-medium font-heading">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3.5 h-2 rounded-sm bg-text-muted/30" />
                    <div className="w-1.5 h-2 rounded-sm bg-text-muted/30" />
                    <div className="w-3 h-2 rounded-sm bg-accent-green" />
                  </div>
                </div>

                {/* Wallet Balance Section */}
                <div className="px-5 pt-6">
                  <div className="text-[10px] text-text-muted mb-1">Wallet Balance</div>
                  <div className="text-2xl font-bold text-text-white font-heading">₦128,450</div>
                  <div className="flex gap-2 mt-3">
                    <div className="flex-1 h-8 rounded-lg bg-primary/15 flex items-center justify-center gap-1">
                      <span className="text-[9px] font-semibold text-primary">+ Fund</span>
                    </div>
                    <div className="flex-1 h-8 rounded-lg bg-accent-green/15 flex items-center justify-center gap-1">
                      <span className="text-[9px] font-semibold text-accent-green">Send</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-2 px-5 mt-5">
                  {[
                    { icon: <PhoneIcon className="w-3 h-3" />, label: 'Airtime', color: 'text-primary' },
                    { icon: <WifiIcon className="w-3 h-3" />, label: 'Data', color: 'text-accent-green' },
                    { icon: <BoltIcon className="w-3 h-3" />, label: 'Electric', color: 'text-accent-orange' },
                    { icon: <CreditCardIcon className="w-3 h-3" />, label: 'Cable', color: 'text-accent-purple' },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className={`w-8 h-8 rounded-lg bg-bg-card border border-border flex items-center justify-center ${item.color}`}>
                        {item.icon}
                      </div>
                      <span className="text-[8px] text-text-muted">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Notification Card */}
            <div className="absolute -top-4 -left-10 animate-float">
              <div className="bg-bg-card/90 backdrop-blur-md border border-border rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 text-accent-green" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-text-white">Transaction Success</div>
                  <div className="text-[9px] text-text-muted">Wallet Funded · ₦10,000</div>
                </div>
              </div>
            </div>

            <div className="absolute top-28 -right-14 animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="bg-bg-card/90 backdrop-blur-md border border-border rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <BoltIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-text-white">Bill Payment</div>
                  <div className="text-[9px] text-text-muted">Electricity paid instantly</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Footer Details */}
        <div className="px-10 pb-10">
          <p className="text-sm text-text-gray leading-relaxed mb-6 max-w-[380px]">
            Welcome back! Sign in to access your wallet, fund accounts, and purchase digital services instantly.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['Swift Delivery', 'Zero Failures', 'Discounted Rates', 'Secure Gateway'].map(
              (badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 bg-bg-card/60 border border-border rounded-lg px-3 py-2"
                >
                  <CheckIcon className="w-3.5 h-3.5 text-accent-green shrink-0" />
                  <span className="text-xs text-text-white font-medium">{badge}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16 relative">
        {/* Glow backdrop */}
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <img src={logoImg} alt="VtuNova" className="h-24 w-auto object-contain" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-text-white font-heading mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-text-gray mb-8">
            Access your secure dashboard to manage payments and services.
          </p>

          {/* Error Alert */}
          {error && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 ${
                animateShake ? 'animate-[shake_0.5s_ease-in-out]' : ''
              }`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
              {error}
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-medium text-text-gray mb-1.5">Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-medium text-text-gray">Password</label>
                <a href="#" className="text-xs text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-white transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
                    rememberMe
                      ? 'bg-primary border-primary'
                      : 'border-border group-hover:border-border-hover'
                  }`}
                >
                  {rememberMe && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-xs text-text-gray select-none">Remember this device</span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-green to-emerald-500 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  <BoltSolidIcon className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Social Sign-in Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social login buttons */}
          <div className="space-y-3">
            <button className="w-full py-2.5 rounded-xl border border-border bg-bg-card text-text-white text-sm font-medium hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200 flex items-center justify-center gap-2.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            <button className="w-full py-2.5 rounded-xl border border-border bg-bg-card text-text-white text-sm font-medium hover:bg-bg-card-hover hover:border-border-hover transition-all duration-200 flex items-center justify-center gap-2.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
          </div>

          {/* Registration link */}
          <p className="text-center text-sm text-text-gray mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;