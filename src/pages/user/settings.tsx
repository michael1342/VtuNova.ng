import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/themeContext';
import {
  Cog6ToothIcon,
  ShieldCheckIcon,
  BellIcon,
  CreditCardIcon,
  EyeSlashIcon,
  LinkIcon,
  LifebuoyIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
  XMarkIcon,
  LockClosedIcon,
  SparklesIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  CheckIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import type { ThemeContextType } from '../../interface/context.interface';
import type { ConnectedAccount, DeviceSession, SettingsState, SettingsTab, ToastMessage } from '../../interface/user-page.interface';

// ─── TYPES ────────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: SettingsState = {
  language: 'English',
  currency: 'NGN (₦)',
  dateFormat: 'DD/MM/YYYY',
  timeZone: 'Africa/Lagos (WAT, UTC+1)',
  twoFactorAuth: false,
  loginAlerts: true,
  transactionAlerts: true,
  walletUpdates: true,
  securityAlerts: true,
  promotions: false,
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
  autoSaveBeneficiaries: true,
  transactionConfirmation: true,
  walletFundingReminder: false,
  dailyLimit: '50000',
  monthlyLimit: '500000',
  profileVisibility: false,
  activityVisibility: true,
  analyticsTracking: true,
  personalizedRecommendations: true,
  dataSharing: false,
  preferredContact: 'Email',
};

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'general', label: 'General', icon: <Cog6ToothIcon className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <ShieldCheckIcon className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <BellIcon className="w-4 h-4" /> },
  { id: 'wallet', label: 'Wallet', icon: <CreditCardIcon className="w-4 h-4" /> },
  { id: 'privacy', label: 'Privacy', icon: <EyeSlashIcon className="w-4 h-4" /> },
  { id: 'connected', label: 'Connected Accounts', icon: <LinkIcon className="w-4 h-4" /> },
  { id: 'support', label: 'Support', icon: <LifebuoyIcon className="w-4 h-4" /> },
];

const TIME_ZONES = [
  'Africa/Lagos (WAT, UTC+1)',
  'Africa/Accra (GMT, UTC+0)',
  'Africa/Cairo (EET, UTC+2)',
  'Europe/London (GMT/BST)',
  'America/New_York (EST, UTC-5)',
];

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

const ToggleSwitch = ({
  enabled,
  onToggle,
  id,
}: {
  enabled: boolean;
  onToggle: () => void;
  id?: string;
}) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onToggle}
    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shrink-0 ${
      enabled ? 'bg-blue-500' : 'bg-zinc-400 dark:bg-zinc-600'
    }`}
  >
    <div
      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
        enabled ? 'translate-x-4' : 'translate-x-0'
      }`}
    />
  </button>
);

const SettingsCard = ({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
  >
    <div className="mb-5">
      <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">{title}</h3>
      {subtitle && <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  icon?: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs text-text-gray font-semibold">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors appearance-none cursor-pointer ${
          icon ? 'pl-9 pr-8' : 'px-4'
        }`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </div>
);

const ToggleRow = ({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-border/50 last:border-0 last:pb-0 first:pt-0">
    <div className="min-w-0">
      <div className="text-xs font-semibold text-text-white">{title}</div>
      {description && <div className="text-[10px] text-text-muted mt-0.5">{description}</div>}
    </div>
    <ToggleSwitch enabled={enabled} onToggle={onToggle} />
  </div>
);

const SecurityScoreRing = ({ score }: { score: number }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-28 h-28 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-extrabold text-text-white font-['Space_Grotesk']">{score}%</span>
        <span className="text-[9px] text-text-muted font-semibold uppercase tracking-wider">Score</span>
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Settings() {
  const { theme, toggleTheme, setTheme } = useTheme() as ThemeContextType;
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState<SettingsState>({ ...DEFAULT_SETTINGS });
  const [savedSettings, setSavedSettings] = useState<SettingsState>({ ...DEFAULT_SETTINGS });
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [show2FaModal, setShow2FaModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

  const [sessions, setSessions] = useState<DeviceSession[]>([
    { id: 's1', browser: 'Chrome', os: 'Windows', lastActive: 'Now', isCurrent: true },
    { id: 's2', browser: 'Safari', os: 'iPhone', lastActive: '3 days ago', isCurrent: false },
    { id: 's3', browser: 'Firefox', os: 'macOS', lastActive: '1 week ago', isCurrent: false },
  ]);

  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    {
      id: 'email',
      name: 'Email',
      icon: <EnvelopeIcon className="w-5 h-5 text-blue-500" />,
      connected: true,
      detail: 'michael@example.com',
    },
    {
      id: 'phone',
      name: 'Phone Number',
      icon: <PhoneIcon className="w-5 h-5 text-emerald-500" />,
      connected: true,
      detail: '+234 803 123 4567',
    },
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ),
      connected: false,
      detail: 'Not connected',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: (
        <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      connected: false,
      detail: 'Not connected',
    },
  ]);

  const hasChanges = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  );

  const securityScore = useMemo(() => {
    let score = 60;
    if (settings.twoFactorAuth) score += 20;
    if (settings.loginAlerts) score += 5;
    if (settings.securityAlerts) score += 5;
    if (passwords.new.length >= 8) score += 2;
    return Math.min(score, 100);
  }, [settings.twoFactorAuth, settings.loginAlerts, settings.securityAlerts, passwords.new]);

  const triggerToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSetting = (key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSavedSettings({ ...settings });
    setIsSaving(false);
    setShowSaveSuccess(true);
    triggerToast('All settings saved successfully!', 'success');
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleDiscard = () => {
    setSettings({ ...savedSettings });
    triggerToast('Changes discarded.', 'info');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      triggerToast('New passwords do not match.', 'danger');
      return;
    }
    if (passwords.new.length < 6) {
      triggerToast('Password must be at least 6 characters.', 'danger');
      return;
    }
    setPasswords({ current: '', new: '', confirm: '' });
    triggerToast('Password updated successfully!', 'success');
  };

  const handleConfirm2Fa = () => {
    updateSetting('twoFactorAuth', true);
    setShow2FaModal(false);
    triggerToast('Two-Factor Authentication enabled!', 'success');
  };

  const handleLogoutDevice = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    triggerToast('Device logged out successfully.', 'success');
  };

  const toggleConnectedAccount = (id: string) => {
    setConnectedAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              connected: !acc.connected,
              detail: !acc.connected
                ? acc.id === 'google'
                  ? 'michael@gmail.com'
                  : acc.id === 'facebook'
                    ? 'Michael Anazodo'
                    : acc.detail
                : 'Not connected',
            }
          : acc
      )
    );
    const acc = connectedAccounts.find((a) => a.id === id);
    triggerToast(
      acc?.connected ? `${acc.name} disconnected.` : `${acc?.name} connected successfully!`,
      'success'
    );
  };

  const renderTabContent = () => {
    if (isUnavailable) {
      return (
        <div className="bg-bg-card border border-border rounded-2xl p-16 text-center space-y-4">
          <InformationCircleIcon className="w-12 h-12 text-text-muted mx-auto" />
          <div>
            <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Settings unavailable.</h3>
            <p className="text-sm text-text-muted mt-1">Try again later.</p>
          </div>
          <button
            onClick={() => setIsUnavailable(false)}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl px-5 py-2.5 text-xs transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Retry
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'general':
        return (
          <SettingsCard title="General Preferences" subtitle="Customize language, currency, and regional settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField
                label="Language"
                value={settings.language}
                onChange={(v) => updateSetting('language', v)}
                options={['English', 'French', 'Arabic']}
                icon={<GlobeAltIcon className="w-4 h-4" />}
              />
              <SelectField
                label="Currency"
                value={settings.currency}
                onChange={(v) => updateSetting('currency', v)}
                options={['NGN (₦)']}
                icon={<CurrencyDollarIcon className="w-4 h-4" />}
              />
              <SelectField
                label="Date Format"
                value={settings.dateFormat}
                onChange={(v) => updateSetting('dateFormat', v)}
                options={['DD/MM/YYYY', 'MM/DD/YYYY']}
                icon={<CalendarIcon className="w-4 h-4" />}
              />
              <SelectField
                label="Time Zone"
                value={settings.timeZone}
                onChange={(v) => updateSetting('timeZone', v)}
                options={TIME_ZONES}
                icon={<ClockIcon className="w-4 h-4" />}
              />
            </div>
            <button
              onClick={() => {
                setSavedSettings((prev) => ({
                  ...prev,
                  language: settings.language,
                  currency: settings.currency,
                  dateFormat: settings.dateFormat,
                  timeZone: settings.timeZone,
                }));
                triggerToast('General preferences saved!', 'success');
              }}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl px-5 py-2.5 text-xs transition-colors shadow-[0_4px_16px_rgba(59,130,246,0.25)]"
            >
              Save Preferences
            </button>
          </SettingsCard>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <SettingsCard title="Password Management" subtitle="Update your account password regularly">
              <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Current Password</label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••"
                    className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">New Password</label>
                  <input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                    placeholder="Min 6 characters"
                    className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Confirm Password</label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                    placeholder="Match new password"
                    className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl px-5 py-2.5 text-xs transition-colors"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </SettingsCard>

            <SettingsCard title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account">
              <div className="flex items-center justify-between bg-bg-dark-secondary border border-border rounded-xl p-4">
                <div>
                  <div className="text-xs font-semibold text-text-white">
                    Status:{' '}
                    <span className={settings.twoFactorAuth ? 'text-emerald-400' : 'text-amber-400'}>
                      {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted mt-0.5">Secure logins with OTP verification</p>
                </div>
                <ToggleSwitch
                  enabled={settings.twoFactorAuth}
                  onToggle={() => {
                    if (!settings.twoFactorAuth) setShow2FaModal(true);
                    else {
                      updateSetting('twoFactorAuth', false);
                      triggerToast('2FA disabled.', 'info');
                    }
                  }}
                />
              </div>
              <button
                onClick={() => setShow2FaModal(true)}
                className="mt-4 text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
              >
                Configure 2FA
              </button>
            </SettingsCard>

            <SettingsCard title="Device Sessions" subtitle="Manage devices currently signed in to your account">
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between gap-4 bg-bg-dark-secondary border border-border rounded-xl p-4 hover:border-border-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <ComputerDesktopIcon className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-text-white">
                          {session.browser} • {session.os}
                          {session.isCurrent && (
                            <span className="ml-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">
                          Last Active: <span className="font-semibold">{session.lastActive}</span>
                        </div>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button
                        onClick={() => handleLogoutDevice(session.id)}
                        className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                      >
                        Log Out Device
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard title="Login Alerts">
              <ToggleRow
                title="Notify on new logins"
                description="Get alerted when your account is accessed from a new device"
                enabled={settings.loginAlerts}
                onToggle={() => toggleSetting('loginAlerts')}
              />
            </SettingsCard>
          </div>
        );

      case 'notifications':
        return (
          <SettingsCard title="Notification Preferences" subtitle="Control how and when you receive alerts">
            <div className="space-y-1">
              <ToggleRow
                title="Transaction Alerts"
                description="Debit and credit transaction confirmations"
                enabled={settings.transactionAlerts}
                onToggle={() => toggleSetting('transactionAlerts')}
              />
              <ToggleRow
                title="Wallet Updates"
                description="Funding, withdrawals, and balance changes"
                enabled={settings.walletUpdates}
                onToggle={() => toggleSetting('walletUpdates')}
              />
              <ToggleRow
                title="Security Alerts"
                description="Login attempts and account security events"
                enabled={settings.securityAlerts}
                onToggle={() => toggleSetting('securityAlerts')}
              />
              <ToggleRow
                title="Promotions"
                description="Cashback offers and discount announcements"
                enabled={settings.promotions}
                onToggle={() => toggleSetting('promotions')}
              />
              <ToggleRow
                title="Email Notifications"
                description="Receive alerts via email"
                enabled={settings.emailNotifications}
                onToggle={() => toggleSetting('emailNotifications')}
              />
              <ToggleRow
                title="SMS Notifications"
                description="Receive alerts via text message"
                enabled={settings.smsNotifications}
                onToggle={() => toggleSetting('smsNotifications')}
              />
              <ToggleRow
                title="Push Notifications"
                description="Instant browser and mobile push alerts"
                enabled={settings.pushNotifications}
                onToggle={() => toggleSetting('pushNotifications')}
              />
            </div>

            {/* Delivery preview */}
            <div className="mt-6 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/10 rounded-xl p-4">
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-3">Delivery Preview</div>
              <div className="flex flex-wrap gap-2">
                {settings.emailNotifications && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-bg-card border border-border px-2.5 py-1 rounded-full">
                    <EnvelopeIcon className="w-3 h-3 text-blue-500" /> Email
                  </span>
                )}
                {settings.smsNotifications && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-bg-card border border-border px-2.5 py-1 rounded-full">
                    <PhoneIcon className="w-3 h-3 text-emerald-500" /> SMS
                  </span>
                )}
                {settings.pushNotifications && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-bg-card border border-border px-2.5 py-1 rounded-full">
                    <BellIcon className="w-3 h-3 text-cyan-500" /> Push
                  </span>
                )}
                {!settings.emailNotifications && !settings.smsNotifications && !settings.pushNotifications && (
                  <span className="text-[10px] text-text-muted">No delivery channels enabled</span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                triggerToast('Notification preferences saved!', 'success');
              }}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl px-5 py-2.5 text-xs transition-colors"
            >
              Save Notification Preferences
            </button>
          </SettingsCard>
        );

      case 'wallet':
        return (
          <SettingsCard title="Wallet Controls" subtitle="Manage wallet behavior and spending limits">
            <div className="space-y-1 mb-6">
              <ToggleRow
                title="Auto Save Beneficiaries"
                description="Automatically save frequent recipients"
                enabled={settings.autoSaveBeneficiaries}
                onToggle={() => toggleSetting('autoSaveBeneficiaries')}
              />
              <ToggleRow
                title="Transaction Confirmation"
                description="Require confirmation before every purchase"
                enabled={settings.transactionConfirmation}
                onToggle={() => toggleSetting('transactionConfirmation')}
              />
              <ToggleRow
                title="Wallet Funding Reminder"
                description="Get reminded when balance is low"
                enabled={settings.walletFundingReminder}
                onToggle={() => toggleSetting('walletFundingReminder')}
              />
            </div>

            <div className="border-t border-border pt-5">
              <h4 className="text-xs font-bold text-text-white mb-4 flex items-center gap-1.5">
                <CreditCardIcon className="w-4 h-4 text-blue-500" />
                Spending Limit
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Daily Transaction Limit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">₦</span>
                    <input
                      type="number"
                      value={settings.dailyLimit}
                      onChange={(e) => updateSetting('dailyLimit', e.target.value)}
                      className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl pl-7 pr-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-text-gray font-semibold">Monthly Transaction Limit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-text-muted">₦</span>
                    <input
                      type="number"
                      value={settings.monthlyLimit}
                      onChange={(e) => updateSetting('monthlyLimit', e.target.value)}
                      className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl pl-7 pr-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => triggerToast('Wallet settings saved!', 'success')}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl px-5 py-2.5 text-xs transition-colors"
            >
              Save Wallet Settings
            </button>
          </SettingsCard>
        );

      case 'privacy':
        return (
          <SettingsCard title="Privacy Controls" subtitle="Manage your data visibility and sharing preferences">
            <div className="space-y-1 mb-6">
              <ToggleRow
                title="Profile Visibility"
                description="Allow others to see your public profile"
                enabled={settings.profileVisibility}
                onToggle={() => toggleSetting('profileVisibility')}
              />
              <ToggleRow
                title="Activity Visibility"
                description="Show transaction activity on referral leaderboard"
                enabled={settings.activityVisibility}
                onToggle={() => toggleSetting('activityVisibility')}
              />
              <ToggleRow
                title="Analytics Tracking"
                description="Help improve VtuNova with usage analytics"
                enabled={settings.analyticsTracking}
                onToggle={() => toggleSetting('analyticsTracking')}
              />
              <ToggleRow
                title="Personalized Recommendations"
                description="Receive tailored service suggestions"
                enabled={settings.personalizedRecommendations}
                onToggle={() => toggleSetting('personalizedRecommendations')}
              />
              <ToggleRow
                title="Data Sharing Preferences"
                description="Share anonymized data with trusted partners"
                enabled={settings.dataSharing}
                onToggle={() => toggleSetting('dataSharing')}
              />
            </div>

            <div className="border-t border-border pt-5 flex flex-wrap gap-2">
              <button
                onClick={() => triggerToast('Opening data management portal...', 'info')}
                className="bg-bg-dark-secondary hover:bg-bg-card-hover border border-border hover:border-blue-500/30 text-text-white font-semibold rounded-xl px-4 py-2 text-xs transition-colors"
              >
                Manage Data
              </button>
              <button
                onClick={() => triggerToast('Data export started. You will receive an email shortly.', 'success')}
                className="inline-flex items-center gap-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border hover:border-emerald-500/30 text-text-white font-semibold rounded-xl px-4 py-2 text-xs transition-colors"
              >
                <DocumentArrowDownIcon className="w-3.5 h-3.5 text-emerald-500" />
                Export My Data
              </button>
              <button
                onClick={() => triggerToast('Stored data deletion request submitted.', 'info')}
                className="inline-flex items-center gap-1.5 bg-bg-dark-secondary hover:bg-red-500/10 border border-border hover:border-red-500/30 text-text-white hover:text-red-400 font-semibold rounded-xl px-4 py-2 text-xs transition-colors"
              >
                <TrashIcon className="w-3.5 h-3.5" />
                Delete Stored Data
              </button>
            </div>
          </SettingsCard>
        );

      case 'connected':
        return (
          <SettingsCard title="Linked Accounts" subtitle="Connect or disconnect third-party accounts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connectedAccounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-bg-dark-secondary border border-border rounded-xl p-4 hover:border-border-hover transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center shrink-0">
                        {account.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-text-white">{account.name}</div>
                        <div className="text-[10px] text-text-muted mt-0.5 truncate">{account.detail}</div>
                        <span
                          className={`inline-flex mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            account.connected
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-zinc-500/10 text-text-muted border border-border'
                          }`}
                        >
                          {account.connected ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleConnectedAccount(account.id)}
                    className={`mt-3 w-full font-semibold rounded-xl py-2 text-[11px] transition-colors ${
                      account.connected
                        ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300'
                        : 'bg-blue-500 hover:bg-blue-600 text-white shadow-[0_4px_12px_rgba(59,130,246,0.2)]'
                    }`}
                  >
                    {account.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </SettingsCard>
        );

      case 'support':
        return (
          <SettingsCard title="Support Preferences" subtitle="Configure how you receive help and support">
            <SelectField
              label="Preferred Contact Method"
              value={settings.preferredContact}
              onChange={(v) => updateSetting('preferredContact', v)}
              options={['Email', 'Phone', 'Live Chat']}
              icon={<ChatBubbleLeftRightIcon className="w-4 h-4" />}
            />

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => triggerToast('Connecting to support team...', 'info')}
                className="bg-bg-dark-secondary hover:bg-blue-500/10 border border-border hover:border-blue-500/30 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-sm group"
              >
                <LifebuoyIcon className="w-6 h-6 mx-auto text-blue-500 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-text-white mt-2">Contact Support</div>
              </button>
              <button
                onClick={() => triggerToast('Issue report form opened.', 'info')}
                className="bg-bg-dark-secondary hover:bg-amber-500/10 border border-border hover:border-amber-500/30 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-sm group"
              >
                <ExclamationTriangleIcon className="w-6 h-6 mx-auto text-amber-500 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-text-white mt-2">Report Issue</div>
              </button>
              <Link
                to="/main/help"
                className="bg-bg-dark-secondary hover:bg-emerald-500/10 border border-border hover:border-emerald-500/30 rounded-xl p-4 text-center transition-all duration-200 hover:shadow-sm group block"
              >
                <InformationCircleIcon className="w-6 h-6 mx-auto text-emerald-500 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-text-white mt-2">View FAQs</div>
              </Link>
            </div>
          </SettingsCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary text-text-gray font-sans transition-colors duration-200 pb-24">

      {/* Developer Demo Panel */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-2 px-6 flex items-center justify-between text-xs text-blue-500">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-4 h-4 animate-pulse" />
          <span>
            <strong>Developer Demo Panel:</strong> Simulate states to inspect UI behaviors.
          </span>
        </div>
        <button
          onClick={() => setIsUnavailable(!isUnavailable)}
          className="bg-blue-500 text-white font-semibold rounded-md px-3 py-1 hover:bg-blue-600 transition-colors text-[11px]"
        >
          Toggle Unavailable State ({isUnavailable ? 'Available' : 'Unavailable'})
        </button>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-white font-['Space_Grotesk'] leading-tight">Settings</h2>
            <p className="text-sm text-text-muted mt-1">
              Customize your VtuNova account experience, security, notifications, and preferences.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:flex items-center gap-x-4 gap-y-2 text-xs font-semibold text-blue-500 bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
            {['Secure Account', 'Personalized Experience', 'Privacy Controls', 'Smart Preferences'].map((badge) => (
              <div key={badge} className="flex items-center gap-1.5 whitespace-nowrap">
                <CheckCircleIcon className="w-4 h-4 shrink-0 text-blue-400" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid: Tabs + Sidebar widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left: Tab nav + Content */}
          <div className="lg:col-span-3 space-y-5">

            {/* Tab Navigation */}
            <div className="bg-bg-card border border-border rounded-2xl p-1.5 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'bg-blue-500 text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)]'
                          : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                      }`}
                    >
                      <span className={isActive ? 'text-white' : 'text-text-muted'}>{tab.icon}</span>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content with fade transition */}
            <div key={activeTab} className="animate-[fadeIn_.25s_ease]">
              {renderTabContent()}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">

            {/* Security Score */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-text-white font-bold text-xs font-['Space_Grotesk'] text-center mb-4">
                Account Security Score
              </h3>
              <SecurityScoreRing score={securityScore} />
              <div className="mt-5 space-y-2">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Recommendations</div>
                {[
                  { label: 'Enable 2FA', done: settings.twoFactorAuth },
                  { label: 'Review Active Devices', done: sessions.length <= 2 },
                  { label: 'Add Recovery Contact', done: connectedAccounts.find((a) => a.id === 'phone')?.connected },
                ].map((rec) => (
                  <div key={rec.label} className="flex items-center gap-2 text-[11px]">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        rec.done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {rec.done ? <CheckIcon className="w-2.5 h-2.5" /> : <ExclamationTriangleIcon className="w-2.5 h-2.5" />}
                    </span>
                    <span className={rec.done ? 'text-text-muted line-through' : 'text-text-white font-semibold'}>
                      {rec.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Appearance Card */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-text-white font-bold text-xs font-['Space_Grotesk'] mb-1">Appearance</h3>
              <p className="text-[10px] text-text-muted mb-4">Customize how VtuNova looks</p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'light') {
                      setTheme('light');
                      triggerToast('Switched to Light Mode', 'success');
                    }
                  }}
                  className={`w-full flex items-center justify-between rounded-xl p-3 transition-all duration-200 ${
                    theme === 'light'
                      ? 'bg-blue-500/10 border-2 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                      : 'bg-bg-dark-secondary border border-border hover:border-border-hover hover:bg-bg-card-hover'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <SunIcon className="w-4 h-4 text-amber-500" />
                    <div className="text-left">
                      <div className="text-xs font-semibold text-text-white">Light Mode</div>
                      {theme === 'light' && (
                        <div className="text-[10px] text-emerald-400 font-semibold">Current Mode</div>
                      )}
                    </div>
                  </div>
                  {theme === 'light' && <CheckCircleIcon className="w-5 h-5 text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'dark') {
                      setTheme('dark');
                      triggerToast('Switched to Dark Mode', 'success');
                    }
                  }}
                  className={`w-full flex items-center justify-between rounded-xl p-3 transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-blue-500/10 border-2 border-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.15)]'
                      : 'bg-bg-dark-secondary border border-border hover:border-border-hover hover:bg-bg-card-hover'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MoonIcon className="w-4 h-4 text-indigo-400" />
                    <div className="text-left">
                      <div className="text-xs font-semibold text-text-white">Dark Mode</div>
                      {theme === 'dark' && (
                        <div className="text-[10px] text-emerald-400 font-semibold">Current Mode</div>
                      )}
                    </div>
                  </div>
                  {theme === 'dark' && <CheckCircleIcon className="w-5 h-5 text-emerald-400" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  const next = theme === 'dark' ? 'Light' : 'Dark';
                  toggleTheme();
                  triggerToast(`Switched to ${next} Mode`, 'success');
                }}
                className="mt-4 w-full bg-bg-dark-secondary hover:bg-bg-card-hover border border-border hover:border-blue-500/30 text-text-white font-semibold rounded-xl px-3 py-2 text-xs transition-colors"
              >
                Toggle Theme
              </button>
            </div>

            {/* Quick Links */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-text-white font-bold text-xs font-['Space_Grotesk']">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  to="/user/profile"
                  className="flex items-center gap-2 text-xs text-text-gray hover:text-blue-500 transition-colors py-1.5"
                >
                  <UserGroupIcon className="w-4 h-4" />
                  View Profile
                </Link>
                <Link
                  to="/user/notifications"
                  className="flex items-center gap-2 text-xs text-text-gray hover:text-blue-500 transition-colors py-1.5"
                >
                  <BellIcon className="w-4 h-4" />
                  Notifications
                </Link>
                <Link
                  to="/user/transactions"
                  className="flex items-center gap-2 text-xs text-text-gray hover:text-blue-500 transition-colors py-1.5"
                >
                  <CreditCardIcon className="w-4 h-4" />
                  Transactions
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        {!isUnavailable && (
          <div className="bg-bg-card border border-red-500/20 rounded-2xl p-6 shadow-sm space-y-4 bg-red-500/[0.01]">
            <div>
              <h3 className="text-red-500 font-bold text-sm font-['Space_Grotesk']">Account Management</h3>
              <p className="text-xs text-text-muted mt-0.5">
                Destructive actions concerning your account. Proceed with caution.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowDeactivateModal(true)}
                className="bg-bg-dark-secondary hover:bg-amber-500/10 border border-border hover:border-amber-500/30 text-text-white hover:text-amber-500 font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
              >
                Deactivate Account
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-600 text-red-500 hover:text-white font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowLogoutAllModal(true)}
                className="bg-bg-dark-secondary hover:bg-bg-card-hover border border-border hover:border-red-500/30 text-text-white hover:text-red-400 font-bold rounded-xl px-4 py-2.5 text-xs transition-colors"
              >
                Log Out Everywhere
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Save Bar */}
      {(hasChanges || showSaveSuccess) && !isUnavailable && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-bg-card/95 backdrop-blur-md border-t border-border px-6 py-4 animate-[slideUp_.3s_ease]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {showSaveSuccess ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold animate-[fadeIn_.3s_ease]">
                  <CheckCircleIcon className="w-5 h-5" />
                  All changes saved successfully!
                </div>
              ) : (
                <span className="text-xs text-text-muted">
                  You have unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDiscard}
                disabled={isSaving}
                className="bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-bold rounded-xl px-4 py-2 text-xs transition-colors disabled:opacity-50"
              >
                Discard Changes
              </button>
              <button
                onClick={handleSaveAll}
                disabled={isSaving}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl px-5 py-2 text-xs transition-colors shadow-[0_4px_16px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save All Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setShow2FaModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white hover:bg-bg-dark-secondary p-1 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <div className="relative mx-auto w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
              <LockClosedIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Configure 2FA</h3>
              <p className="text-xs text-text-muted">Scan the barcode using your authenticator app</p>
            </div>
            <div className="mx-auto bg-white p-3 rounded-lg inline-block border border-border shadow-inner">
              <svg className="w-32 h-32 text-slate-800" viewBox="0 0 100 100">
                <rect x="5" y="5" width="20" height="20" fill="currentColor" />
                <rect x="75" y="5" width="20" height="20" fill="currentColor" />
                <rect x="5" y="75" width="20" height="20" fill="currentColor" />
                <rect x="35" y="15" width="30" height="10" fill="currentColor" />
                <rect x="15" y="45" width="40" height="20" fill="currentColor" />
                <rect x="65" y="65" width="25" height="15" fill="currentColor" />
                <rect x="35" y="80" width="15" height="15" fill="currentColor" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Enter 6-digit OTP code"
              maxLength={6}
              className="bg-bg-dark-secondary border border-border text-center text-sm font-bold tracking-widest text-text-white rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-blue-500/50"
            />
            <button
              onClick={handleConfirm2Fa}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-2.5 px-4 text-xs transition-colors"
            >
              Confirm & Enable 2FA
            </button>
          </div>
        </div>
      )}

      {/* Log Out Everywhere Modal */}
      {showLogoutAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
              <ArrowRightOnRectangleIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Log Out Everywhere</h3>
              <p className="text-xs text-text-muted">
                Terminate all active login sessions across all browsers and devices?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutAllModal(false)}
                className="flex-1 bg-bg-dark-secondary border border-border hover:bg-bg-card-hover text-text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutAllModal(false);
                  triggerToast('Logged out of all other devices.', 'success');
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Log Out All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Deactivate Account</h3>
              <p className="text-xs text-text-muted">
                This will temporarily freeze your transactions and wallet access. You can reactivate by logging back in.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="flex-1 bg-bg-dark-secondary border border-border hover:bg-bg-card-hover text-text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  triggerToast('Account deactivated.', 'info');
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 mx-auto flex items-center justify-center">
              <TrashIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-text-white font-bold text-base font-['Space_Grotesk']">Delete Account</h3>
              <p className="text-xs text-text-muted">
                This action is permanent. All your data, wallet balance, and transaction history will be erased.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-bg-dark-secondary border border-border hover:bg-bg-card-hover text-text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  triggerToast('Account deletion request submitted.', 'danger');
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold animate-[slideIn_.3s_ease] ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : toast.type === 'danger'
                  ? 'bg-red-500/10 border-red-500/20 text-red-400'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}
          >
            {toast.type === 'success' && <CheckCircleIcon className="w-4 h-4 shrink-0" />}
            {toast.type === 'danger' && <ExclamationTriangleIcon className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <InformationCircleIcon className="w-4 h-4 shrink-0" />}
            {toast.message}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
