import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BoltIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  HashtagIcon,
  CheckCircleIcon,
  WifiIcon,
  CreditCardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { BoltIcon as BoltSolidIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/themeContext';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateShake, setAnimateShake] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

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

  // Password strength
  const hasMinLength = form.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(form.password);
  const hasNumber = /[0-9]/.test(form.password);
  const strengthChecks = [hasMinLength, hasUppercase, hasNumber];
  const strengthScore = strengthChecks.filter(Boolean).length;

  const strengthColor =
    strengthScore === 3
      ? 'bg-accent-green'
      : strengthScore === 2
        ? 'bg-primary'
        : strengthScore === 1
          ? 'bg-accent-orange'
          : 'bg-border';

  const validate = () => {
    if (!form.firstName.trim()) return 'First Name is required.';
    if (!form.lastName.trim()) return 'Last Name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email address.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!agreedToTerms) return 'You must agree to the Terms of Service.';
    if (!form.role) return 'Please select an account type.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const validationError = validate();
    if (validationError) {
      triggerError(validationError);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const res = register({
      email: form.email,
      password: form.password,
      firstName: form.firstName,
      lastName: form.lastName,
      role: form.role,
    });

    setLoading(false);
    if (res && res.success) {
      setSuccess('Account created successfully! Welcome aboard.');
      const roleHome: Record<string, string> = {
        user: '/user-dashboard',
        admin: '/admin-dashboard',
      };
      const role = res.user?.role?.toLowerCase().trim().replace(/[\s_-]/g, '') || '';
      const destination = roleHome[role] || '/';
      setTimeout(() => navigate(destination), 1500);
    } else {
      triggerError(res?.error || 'Registration failed. Please try again.');
    }
  };

  const { theme, toggleTheme } = useTheme();

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

      {/* Left Panel — Branding & Illustration */}
      <div className="hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col relative overflow-hidden bg-bg-dark-secondary">
        {/* Background glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,transparent_70%)] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 px-10 pt-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center">
            <BoltSolidIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-text-white font-heading">SwiftTopup</span>
        </div>

        {/* Illustration area */}
        <div className="flex-1 flex items-center justify-center px-10 relative">
          {/* Phone mockup */}
          <div className="relative w-[260px] h-[480px]">
            {/* Phone frame */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-bg-card to-bg-dark border border-border shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              {/* Screen content */}
              <div className="absolute inset-3 rounded-[24px] bg-bg-dark-secondary overflow-hidden">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-4 pb-2">
                  <span className="text-[10px] text-text-muted font-medium">9:41</span>
                  <div className="flex gap-1">
                    <div className="w-3.5 h-2 rounded-sm bg-text-muted/30" />
                    <div className="w-1.5 h-2 rounded-sm bg-text-muted/30" />
                    <div className="w-3 h-2 rounded-sm bg-accent-green" />
                  </div>
                </div>

                {/* Wallet section */}
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

                {/* Quick actions */}
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

            {/* Floating cards */}
            <div className="absolute -top-4 -left-10 animate-float">
              <div className="bg-bg-card/90 backdrop-blur-md border border-border rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-accent-green/20 flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 text-accent-green" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-text-white">Airtime Purchase</div>
                  <div className="text-[9px] text-text-muted">₦1,000 · Successful</div>
                </div>
              </div>
            </div>

            <div className="absolute top-28 -right-14" style={{ animation: 'float 6s ease-in-out 1s infinite' }}>
              <div className="bg-bg-card/90 backdrop-blur-md border border-border rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <WifiIcon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-text-white">Data Bundle</div>
                  <div className="text-[9px] text-text-muted">10GB · 30 Days</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 -right-6" style={{ animation: 'float 6s ease-in-out 2s infinite' }}>
              <div className="bg-bg-card/90 backdrop-blur-md border border-border rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-accent-orange/20 flex items-center justify-center">
                  <BoltIcon className="w-4 h-4 text-accent-orange" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-text-white">Bill Payment</div>
                  <div className="text-[9px] text-text-muted">Electricity · Confirmed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom text & badges */}
        <div className="px-10 pb-10">
          <p className="text-sm text-text-gray leading-relaxed mb-6 max-w-[380px]">
            Buy airtime, purchase data bundles, pay electricity bills,
            subscribe to cable TV, and manage your wallet from one
            secure platform.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {['Instant Delivery', 'Secure Transactions', 'Affordable Rates', '24/7 Availability'].map(
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

      {/* Right Panel — Registration Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-16 relative">
        {/* Subtle glow */}
        <div className="absolute top-[10%] right-[10%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo (mobile only) */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-purple flex items-center justify-center">
              <BoltSolidIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-white font-heading">SwiftTopup</span>
          </div>

          {/* Header icon */}
         
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-white font-heading mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-text-gray mb-8">
            Join SwiftTopup and start enjoying seamless digital services.
          </p>

          {/* Error / Success */}
          {error && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 ${animateShake ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-accent-green/10 border border-accent-green/20 text-accent-green text-sm flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-text-gray mb-1.5">First Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="John"
                    value={form.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-gray mb-1.5">Last Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
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

            {/* Phone */}
            <div>
              <label className="block text-xs font-medium text-text-gray mb-1.5">Phone Number</label>
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-text-gray mb-1.5">Password</label>
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

              {/* Password strength bar */}
              {form.password.length > 0 && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strengthScore ? strengthColor : 'bg-border'}`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className={`text-[11px] flex items-center gap-1 ${hasMinLength ? 'text-accent-green' : 'text-text-muted'}`}>
                      {hasMinLength ? <CheckCircleIcon className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-text-muted inline-block" />}
                      Minimum 8 characters
                    </span>
                    <span className={`text-[11px] flex items-center gap-1 ${hasUppercase ? 'text-accent-green' : 'text-text-muted'}`}>
                      {hasUppercase ? <CheckCircleIcon className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-text-muted inline-block" />}
                      One uppercase letter
                    </span>
                    <span className={`text-[11px] flex items-center gap-1 ${hasNumber ? 'text-accent-green' : 'text-text-muted'}`}>
                      {hasNumber ? <CheckCircleIcon className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-text-muted inline-block" />}
                      One number
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-text-gray mb-1.5">Confirm Password</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block text-xs font-medium text-text-gray mb-1.5">Referral Code (Optional)</label>
              <div className="relative">
                <HashtagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Enter code"
                  value={form.referralCode}
                  onChange={(e) => set('referralCode', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-bg-card border border-border text-sm text-text-white placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${
                    agreedToTerms
                      ? 'bg-primary border-primary'
                      : 'border-border group-hover:border-border-hover'
                  }`}
                >
                  {agreedToTerms && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-xs text-text-gray leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit */}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <BoltSolidIcon className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-muted uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
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

          {/* Sign in link */}
          <p className="text-center text-sm text-text-gray mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;