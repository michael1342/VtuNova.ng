import { useState } from 'react';
import {
  ArrowPathIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  CpuChipIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  BellIcon,
  CreditCardIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  CommandLineIcon,
  BanknotesIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import type { FeeConfig, GeneralConfig, HistoryRecord, MaintenanceConfig, NotificationSettings, ProviderConfig, SecurityPolicy, ServiceConfig, SettingsSystemAlert as SystemAlert, SystemConfig, TransactionRules, WalletRules } from '../../interface/admin.interface';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
// ─── INITIAL CONFIGURATIONS ──────────────────────────────────────────────────
const INITIAL_GENERAL: GeneralConfig = {
  platformName: 'VtuNova Admin Portal',
  platformDesc: 'Enterprise billing utility disbursement dashboard.',
  supportEmail: 'support@vtunova.com',
  supportPhone: '+234 1 234 5678',
  currency: 'NGN',
  language: 'English (US)',
  timezone: 'WAT (GMT+1)',
  logoUrl: 'logo_vtunova.png',
  faviconUrl: 'favicon.ico'
};

const INITIAL_SERVICES: ServiceConfig[] = [
  { id: 'srv-1', name: 'Airtime Recharge', enabled: true, maintenanceMessage: 'Service downtime for system reconciliation.', priority: 'High', dailyLimit: 50000 },
  { id: 'srv-2', name: 'Data Bundle Purchase', enabled: true, maintenanceMessage: 'Service offline due to MTN network lags.', priority: 'High', dailyLimit: 100000 },
  { id: 'srv-3', name: 'Electricity Tokens', enabled: true, maintenanceMessage: 'DisCo maintenance ongoing.', priority: 'Medium', dailyLimit: 250000 },
  { id: 'srv-4', name: 'Cable TV Subscriptions', enabled: true, maintenanceMessage: 'MultiChoice payment API updates.', priority: 'Medium', dailyLimit: 150000 },
  { id: 'srv-5', name: 'Wallet Funding', enabled: true, maintenanceMessage: 'Central Bank gateway reconciliation.', priority: 'High', dailyLimit: 500000 },
  { id: 'srv-6', name: 'Referrals Network', enabled: true, maintenanceMessage: 'Promo engine offline.', priority: 'Low', dailyLimit: 25000 }
];

const INITIAL_PROVIDERS: ProviderConfig[] = [
  { id: 'prv-1', type: 'VTU', name: 'Telecoms VTU Hub', enabled: true, priority: 1, healthScore: 99.2, apiKeyPlaceholder: 'SWT_VTU_KEY_****************', environment: 'Production', retryPolicy: 'Exponential backoff (3 retries)' },
  { id: 'prv-2', type: 'Electricity', name: 'DisCo Gateway APIs', enabled: true, priority: 1, healthScore: 97.4, apiKeyPlaceholder: 'SWT_ELEC_KEY_***************', environment: 'Production', retryPolicy: 'Immediate retry (2 retries)' },
  { id: 'prv-3', type: 'Cable', name: 'MultiChoice Direct Connection', enabled: true, priority: 2, healthScore: 98.9, apiKeyPlaceholder: 'SWT_CABLE_KEY_**************', environment: 'Production', retryPolicy: 'Exponential backoff (3 retries)' },
  { id: 'prv-4', type: 'Payment Gateway', name: 'Paystack Core Integration', enabled: true, priority: 1, healthScore: 99.8, apiKeyPlaceholder: 'SWT_PAY_KEY_****************', environment: 'Production', retryPolicy: 'Retry once after 5s' }
];

const AUDIT_HISTORY: HistoryRecord[] = [
  { id: 'HIS-001', adminName: 'Michael Anazodo', section: 'Fee Settings', action: 'Increased electricity surcharge to ₦100', date: '2026-06-20 12:30', status: 'Successful' },
  { id: 'HIS-002', adminName: 'Aliyu Bello', section: 'Services', action: 'Suspended Cable TV service temporarily', date: '2026-06-19 15:45', status: 'Successful' },
  { id: 'HIS-003', adminName: 'Michael Anazodo', section: 'Security Policies', action: 'Enforced 2FA requirements for admin accounts', date: '2026-06-18 09:00', status: 'Successful' }
];

const SYSTEM_ALERTS: SystemAlert[] = [
  { id: 'ALT-101', title: 'IP Conflict Warning', description: 'Admin console accessed from unauthorized subnet IP range.', severity: 'High', timestamp: '15m ago' },
  { id: 'ALT-102', title: 'Provider Down Alert', description: 'Telecom VTU Hub health metrics dropped under 95.0%.', severity: 'Critical', timestamp: '1h ago' }
];

export default function AdminSettings() {
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [generalConfig, setGeneralConfig] = useState<GeneralConfig>(INITIAL_GENERAL);
  const [servicesConfig, setServicesConfig] = useState<ServiceConfig[]>(INITIAL_SERVICES);
  const [providersConfig, setProvidersConfig] = useState<ProviderConfig[]>(INITIAL_PROVIDERS);
  const [auditLogs, setAuditLogs] = useState<HistoryRecord[]>(AUDIT_HISTORY);
  const [alerts, setAlerts] = useState<SystemAlert[]>(SYSTEM_ALERTS);

  // Forms rules states
  const [transactionRules, setTransactionRules] = useState<TransactionRules>({
    minAmount: 100,
    maxAmount: 500000,
    dailyLimit: 2000000,
    retryAttempts: 3,
    timeoutSeconds: 30,
    autoReverse: true,
    requirePin: true
  });

  const [walletRules, setWalletRules] = useState<WalletRules>({
    minFunding: 1000,
    maxFunding: 1000000,
    autoRefund: true,
    freezeRules: 'Immediate freeze on transactions exceeding ₦5,000,000 threshold within 1 hour.',
    lowBalanceThreshold: 5000,
    lockThreshold: 20000,
    requireApproval: true
  });

  const [notificationConfig, setNotificationConfig] = useState<NotificationSettings>({
    enableInApp: true,
    enableEmail: true,
    enableSMS: false,
    enablePush: true,
    retentionDays: 90,
    campaignLimit: 5,
    defaultTemplate: 'TPL-WELCOME'
  });

  const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicy>({
    passwordRegex: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$',
    sessionTimeoutMinutes: 15,
    deviceLimit: 3,
    allowApiLogins: false,
    allowedIpList: '192.168.1.1, 10.0.0.1',
    require2faAdmin: true,
    auditLevel: 'Verbose',
    maxLoginAttempts: 5
  });

  const [feeConfig, setFeeConfig] = useState<FeeConfig>({
    airtimeFeePercent: 1.5,
    dataFeePercent: 2.0,
    electricityFeeFlat: 100,
    cableFeeFlat: 150,
    walletFundingFeeFlat: 0,
    referralRewardPercent: 5,
    taxPercent: 7.5
  });

  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>({
    enabled: false,
    message: 'VtuNova is currently undergoing planned database schema upgrades.',
    allowedRoles: ['admin', 'developer'],
    startTime: '2026-06-21T02:00',
    endTime: '2026-06-21T04:00',
    emergencyBanner: 'Planned database upgrade on Sunday 2:00 AM WAT.'
  });

  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    cacheDurationMinutes: 10,
    loggingLevel: 'Info',
    fileUploadLimitMb: 5,
    backupFrequencyHours: 24,
    dataRetentionMonths: 12,
    queueConcurrency: 10,
    environmentLabel: 'Production'
  });

  // UI state
  const [activeTab, setActiveTab] = useState<
    'general' | 'services' | 'transactions' | 'wallet' | 'notifications' | 'security' | 'providers' | 'fees' | 'maintenance' | 'system'
  >('general');
  const [isDirty, setIsDirty] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Drawer modal states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFieldChange = (setter: Function) => (e: any) => {
    setIsDirty(true);
    const { name, value, type, checked } = e.target;
    setter((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleServiceToggle = (id: string) => {
    setIsDirty(true);
    setServicesConfig(prev =>
      prev.map(srv => (srv.id === id ? { ...srv, enabled: !srv.enabled } : srv))
    );
  };

  const handleServiceLimitChange = (id: string, limit: number) => {
    setIsDirty(true);
    setServicesConfig(prev =>
      prev.map(srv => (srv.id === id ? { ...srv, dailyLimit: limit } : srv))
    );
  };

  const handleProviderToggle = (id: string) => {
    setIsDirty(true);
    setProvidersConfig(prev =>
      prev.map(prv => (prv.id === id ? { ...prv, enabled: !prv.enabled } : prv))
    );
  };

  const handleTestConnection = (name: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      triggerToast(`Connection handshake successful for: ${name}`);
    }, 1000);
  };

  const handlePublishConfig = () => {
    setLoading(true);
    setTimeout(() => {
      setIsDirty(false);
      setIsDrawerOpen(false);
      setLoading(false);
      triggerToast('Configuration changes committed to live gateways.');

      const newLog: HistoryRecord = {
        id: `HIS-${Math.floor(100 + Math.random() * 900)}`,
        adminName: 'Michael Anazodo',
        section: activeTab.toUpperCase(),
        action: `Updated platform configurations in section ${activeTab}`,
        date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString(),
        status: 'Successful'
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }, 900);
  };

  const handleReset = () => {
    setIsDirty(false);
    triggerToast('Discarded modifications. Reloaded default configurations.');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setGeneralConfig(INITIAL_GENERAL);
      setServicesConfig(INITIAL_SERVICES);
      setProvidersConfig(INITIAL_PROVIDERS);
      setAuditLogs(AUDIT_HISTORY);
      setAlerts(SYSTEM_ALERTS);
      setIsDirty(false);
      setLoading(false);
      triggerToast('Refreshed configuration registry.');
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark text-text-gray relative">
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-bg-card border-l-4 border-primary text-text-white shadow-2xl px-5 py-3.5 rounded-r-xl flex items-center gap-3 animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Loading Backdrop */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-bg-dark/40 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-bg-card border border-border p-5 rounded-2xl flex flex-col items-center gap-3 shadow-2xl">
            <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            <span className="text-xs font-semibold text-text-white font-heading">Processing API handshake...</span>
          </div>
        </div>
      )}

      {/* Layout wrapper */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-text-white font-heading tracking-tight">
                Platform Settings
              </h1>
              {isDirty && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold animate-pulse">
                  Unsaved Changes
                </span>
              )}
            </div>
            <p className="text-xs text-text-muted mt-1">
              Configure platform behavior, services, financial controls, security policies, and operational preferences.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={handleReset}
              disabled={!isDirty}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              Reset
            </button>
            <button
              onClick={() => setIsDrawerOpen(true)}
              disabled={!isDirty}
              className="flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(59,130,246,0.3)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                if (isDirty) {
                  setIsDrawerOpen(true);
                } else {
                  triggerToast('Latest active configuration is already published.');
                }
              }}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              Publish Configuration
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <ArrowPathIcon className="w-4 h-4 text-text-muted" />
              Refresh
            </button>
          </div>
        </div>

        {/* Outer Split Navigation & Form grid */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Settings Tab Navigation */}
          <div className="w-full lg:w-60 shrink-0 bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs lg:sticky lg:top-6">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block p-4 border-b border-border/50">Configuration sections</span>
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible divide-x lg:divide-x-0 lg:divide-y divide-border/40 text-xs">
              {[
                { key: 'general', label: 'General Settings', icon: Cog6ToothIcon },
                { key: 'services', label: 'Services Config', icon: BoltIcon },
                { key: 'transactions', label: 'Transactions', icon: CreditCardIcon },
                { key: 'wallet', label: 'Wallet Settings', icon: BanknotesIcon },
                { key: 'notifications', label: 'Notifications', icon: BellIcon },
                { key: 'security', label: 'Security Policy', icon: LockClosedIcon },
                { key: 'providers', label: 'Providers', icon: CpuChipIcon },
                { key: 'fees', label: 'Fee Management', icon: CreditCardIcon },
                { key: 'maintenance', label: 'Maintenance Mode', icon: WrenchScrewdriverIcon },
                { key: 'system', label: 'System Config', icon: CommandLineIcon }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2.5 p-3.5 text-left w-full transition shrink-0 whitespace-nowrap lg:whitespace-normal ${
                      isActive
                        ? 'bg-primary/5 text-primary border-b-2 lg:border-b-0 lg:border-l-2 border-primary font-bold'
                        : 'text-text-muted hover:text-text-white hover:bg-bg-dark-secondary/30'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Content container split panel */}
          <div className="flex-1 w-full space-y-6">
            {/* Tab Views */}
            <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm min-h-[420px]">
              
              {/* TAB 1: General settings */}
              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">General Platform Settings</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Control descriptive branding parameters and default currencies</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Platform Name</label>
                      <input
                        type="text"
                        name="platformName"
                        value={generalConfig.platformName}
                        onChange={handleFieldChange(setGeneralConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Default Currency</label>
                      <input
                        type="text"
                        name="currency"
                        value={generalConfig.currency}
                        onChange={handleFieldChange(setGeneralConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Platform Description</label>
                      <textarea
                        rows={2}
                        name="platformDesc"
                        value={generalConfig.platformDesc}
                        onChange={handleFieldChange(setGeneralConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Support Email</label>
                      <input
                        type="email"
                        name="supportEmail"
                        value={generalConfig.supportEmail}
                        onChange={handleFieldChange(setGeneralConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Support Phone</label>
                      <input
                        type="text"
                        name="supportPhone"
                        value={generalConfig.supportPhone}
                        onChange={handleFieldChange(setGeneralConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Timezone Settings</label>
                      <input
                        type="text"
                        name="timezone"
                        value={generalConfig.timezone}
                        onChange={handleFieldChange(setGeneralConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Default Language</label>
                      <input
                        type="text"
                        name="language"
                        value={generalConfig.language}
                        onChange={handleFieldChange(setGeneralConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Services settings */}
              {activeTab === 'services' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Utility Services configuration</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Toggle live availability of services and define client limits</p>
                  </div>
                  <div className="space-y-4">
                    {servicesConfig.map(srv => (
                      <div key={srv.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-bg-dark-secondary/40 border border-border rounded-xl">
                        <div className="space-y-1">
                          <span className="font-extrabold text-text-white text-xs block">{srv.name}</span>
                          <p className="text-[10px] text-text-muted">Status Message: "{srv.maintenanceMessage}"</p>
                        </div>
                        <div className="flex items-center gap-4.5">
                          <div className="space-y-0.5 text-right">
                            <span className="text-[9px] text-text-muted block">Daily limit cap</span>
                            <input
                              type="number"
                              value={srv.dailyLimit}
                              onChange={e => handleServiceLimitChange(srv.id, parseFloat(e.target.value) || 0)}
                              className="w-28 text-xs text-right px-2 py-1 bg-bg-dark border border-border text-text-white rounded"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleServiceToggle(srv.id)}
                            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                              srv.enabled ? 'bg-primary' : 'bg-zinc-700'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                              srv.enabled ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: Transactions settings */}
              {activeTab === 'transactions' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Transactions Rules Configuration</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Configure strict limits and automatic reversals parameters</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Minimum Transaction Amount</label>
                      <input
                        type="number"
                        name="minAmount"
                        value={transactionRules.minAmount}
                        onChange={handleFieldChange(setTransactionRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Maximum Transaction Amount</label>
                      <input
                        type="number"
                        name="maxAmount"
                        value={transactionRules.maxAmount}
                        onChange={handleFieldChange(setTransactionRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Daily Cumulative Limit</label>
                      <input
                        type="number"
                        name="dailyLimit"
                        value={transactionRules.dailyLimit}
                        onChange={handleFieldChange(setTransactionRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Gateway Retry Attempts</label>
                      <input
                        type="number"
                        name="retryAttempts"
                        value={transactionRules.retryAttempts}
                        onChange={handleFieldChange(setTransactionRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-bg-dark-secondary/30 border border-border rounded-xl">
                      <div>
                        <span className="font-bold text-text-white block">Auto-Reverse Failed</span>
                        <p className="text-[9px] text-text-muted">Refund automatically on network time-outs</p>
                      </div>
                      <input
                        type="checkbox"
                        name="autoReverse"
                        checked={transactionRules.autoReverse}
                        onChange={handleFieldChange(setTransactionRules)}
                        className="rounded border-border focus:ring-primary text-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-bg-dark-secondary/30 border border-border rounded-xl">
                      <div>
                        <span className="font-bold text-text-white block">Confirmation requirements PIN</span>
                        <p className="text-[9px] text-text-muted">Require transaction security PIN checkout</p>
                      </div>
                      <input
                        type="checkbox"
                        name="requirePin"
                        checked={transactionRules.requirePin}
                        onChange={handleFieldChange(setTransactionRules)}
                        className="rounded border-border focus:ring-primary text-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: Wallet settings */}
              {activeTab === 'wallet' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Wallet Funding Policies</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Define bounds on bank transfers and funding approvals</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Minimum Wallet Funding Limit</label>
                      <input
                        type="number"
                        name="minFunding"
                        value={walletRules.minFunding}
                        onChange={handleFieldChange(setWalletRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Maximum Funding Threshold</label>
                      <input
                        type="number"
                        name="maxFunding"
                        value={walletRules.maxFunding}
                        onChange={handleFieldChange(setWalletRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Low Balance Alert Threshold</label>
                      <input
                        type="number"
                        name="lowBalanceThreshold"
                        value={walletRules.lowBalanceThreshold}
                        onChange={handleFieldChange(setWalletRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Wallet Lock Limit Cap</label>
                      <input
                        type="number"
                        name="lockThreshold"
                        value={walletRules.lockThreshold}
                        onChange={handleFieldChange(setWalletRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Account Freeze rules description</label>
                      <textarea
                        rows={2}
                        name="freezeRules"
                        value={walletRules.freezeRules}
                        onChange={handleFieldChange(setWalletRules)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-bg-dark-secondary/30 border border-border rounded-xl md:col-span-2">
                      <div>
                        <span className="font-bold text-text-white block">Manual approval required for large transfers</span>
                        <p className="text-[9px] text-text-muted">Triggers admin reviews on funding values over ₦500,000</p>
                      </div>
                      <input
                        type="checkbox"
                        name="requireApproval"
                        checked={walletRules.requireApproval}
                        onChange={handleFieldChange(setWalletRules)}
                        className="rounded border-border focus:ring-primary text-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: Notifications settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Global Communication Channels</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Control SMS dispatch gateways and default templates</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3.5 bg-bg-dark-secondary/30 border border-border rounded-xl">
                      <span className="font-bold text-text-white">Enable In-App Alerts</span>
                      <input
                        type="checkbox"
                        name="enableInApp"
                        checked={notificationConfig.enableInApp}
                        onChange={handleFieldChange(setNotificationConfig)}
                        className="rounded border-border focus:ring-primary text-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-bg-dark-secondary/30 border border-border rounded-xl">
                      <span className="font-bold text-text-white">Enable Email Dispatches</span>
                      <input
                        type="checkbox"
                        name="enableEmail"
                        checked={notificationConfig.enableEmail}
                        onChange={handleFieldChange(setNotificationConfig)}
                        className="rounded border-border focus:ring-primary text-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-bg-dark-secondary/30 border border-border rounded-xl">
                      <span className="font-bold text-text-white">Enable SMS Alerts</span>
                      <input
                        type="checkbox"
                        name="enableSMS"
                        checked={notificationConfig.enableSMS}
                        onChange={handleFieldChange(setNotificationConfig)}
                        className="rounded border-border focus:ring-primary text-primary"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-bg-dark-secondary/30 border border-border rounded-xl">
                      <span className="font-bold text-text-white">Enable Push Broadcasts</span>
                      <input
                        type="checkbox"
                        name="enablePush"
                        checked={notificationConfig.enablePush}
                        onChange={handleFieldChange(setNotificationConfig)}
                        className="rounded border-border focus:ring-primary text-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Retention Days Limit</label>
                      <input
                        type="number"
                        name="retentionDays"
                        value={notificationConfig.retentionDays}
                        onChange={handleFieldChange(setNotificationConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Default Template Mapping</label>
                      <input
                        type="text"
                        name="defaultTemplate"
                        value={notificationConfig.defaultTemplate}
                        onChange={handleFieldChange(setNotificationConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="pt-4.5 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => triggerToast('Test push notification successfully dispatched.')}
                      className="px-4 py-2 bg-bg-dark border border-border text-[11px] font-bold text-text-white rounded-xl hover:bg-bg-card-hover transition"
                    >
                      Send Test Notification
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 6: Security settings */}
              {activeTab === 'security' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Security & Admin Access Policies</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Establish 2FA enforcements and authorized session boundaries</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Session Timeout Minutes</label>
                      <input
                        type="number"
                        name="sessionTimeoutMinutes"
                        value={securityPolicy.sessionTimeoutMinutes}
                        onChange={handleFieldChange(setSecurityPolicy)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Password Validation Regex</label>
                      <input
                        type="text"
                        name="passwordRegex"
                        value={securityPolicy.passwordRegex}
                        onChange={handleFieldChange(setSecurityPolicy)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Allowed Subnet IPs (Comma Separated)</label>
                      <input
                        type="text"
                        name="allowedIpList"
                        value={securityPolicy.allowedIpList}
                        onChange={handleFieldChange(setSecurityPolicy)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-bg-dark-secondary/30 border border-border rounded-xl md:col-span-2">
                      <div>
                        <span className="font-bold text-text-white block">Enforce 2FA checks on Admin accounts</span>
                        <p className="text-[9px] text-text-muted">Requires TOTP setup for active administrative dashboards</p>
                      </div>
                      <input
                        type="checkbox"
                        name="require2faAdmin"
                        checked={securityPolicy.require2faAdmin}
                        onChange={handleFieldChange(setSecurityPolicy)}
                        className="rounded border-border focus:ring-primary text-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: Providers settings */}
              {activeTab === 'providers' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Integration Gateway Providers</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Monitor API credentials and priority levels</p>
                  </div>
                  <div className="space-y-4">
                    {providersConfig.map(prv => (
                      <div key={prv.id} className="bg-bg-dark-secondary/40 border border-border rounded-xl p-4.5 space-y-4">
                        <div className="flex justify-between items-center border-b border-border/40 pb-2">
                          <div>
                            <span className="font-extrabold text-text-white text-xs block">{prv.name}</span>
                            <span className="text-[9px] text-text-muted block mt-0.5">Type: {prv.type} • Target: {prv.environment}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prv.healthScore > 98 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            Health: {prv.healthScore}%
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-text-muted uppercase">API Authorization Secret Key</label>
                            <input
                              type="text"
                              value={prv.apiKeyPlaceholder}
                              readOnly
                              className="w-full text-xs px-2.5 py-1.5 bg-bg-dark border border-border text-text-muted rounded-lg font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-text-muted uppercase">Dispatcher Retry Policy</label>
                            <input
                              type="text"
                              value={prv.retryPolicy}
                              readOnly
                              className="w-full text-xs px-2.5 py-1.5 bg-bg-dark border border-border text-text-muted rounded-lg"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2.5 pt-1.5">
                          <button
                            type="button"
                            onClick={() => handleTestConnection(prv.name)}
                            className="px-3.5 py-1.5 bg-bg-dark border border-border text-[9px] font-bold text-text-white rounded-lg hover:bg-bg-card-hover transition"
                          >
                            Test Connection
                          </button>
                          <button
                            type="button"
                            onClick={() => handleProviderToggle(prv.id)}
                            className={`px-3.5 py-1.5 border text-[9px] font-bold rounded-lg transition ${
                              prv.enabled
                                ? 'border-red-500/25 text-red-400 hover:bg-red-500/10'
                                : 'border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                          >
                            {prv.enabled ? 'Disable Provider' : 'Enable'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: Fees settings */}
              {activeTab === 'fees' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Financial Fees & Surcharge Rates</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Control pricing markups and referral incentive limits</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Airtime Fee Percentage (%)</label>
                      <input
                        type="number"
                        name="airtimeFeePercent"
                        value={feeConfig.airtimeFeePercent}
                        onChange={handleFieldChange(setFeeConfig)}
                        step="0.1"
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Data Bundle Fee Percentage (%)</label>
                      <input
                        type="number"
                        name="dataFeePercent"
                        value={feeConfig.dataFeePercent}
                        onChange={handleFieldChange(setFeeConfig)}
                        step="0.1"
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Electricity Flat Surcharge (₦)</label>
                      <input
                        type="number"
                        name="electricityFeeFlat"
                        value={feeConfig.electricityFeeFlat}
                        onChange={handleFieldChange(setFeeConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Cable TV Flat Surcharge (₦)</label>
                      <input
                        type="number"
                        name="cableFeeFlat"
                        value={feeConfig.cableFeeFlat}
                        onChange={handleFieldChange(setFeeConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="pt-4.5 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => triggerToast(`Preview Pricing: Airtime ₦1,000 purchase will charge ₦${1000 * (1 + feeConfig.airtimeFeePercent / 100)}`)}
                      className="px-4 py-2 bg-bg-dark border border-border text-[11px] font-bold text-text-white rounded-xl hover:bg-bg-card-hover transition"
                    >
                      Preview Pricing Charges
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 9: Maintenance settings */}
              {activeTab === 'maintenance' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Platform Maintenance Settings</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Schedule database upgrades or toggle platform lockdowns</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-bg-dark-secondary/40 border border-border rounded-xl">
                      <div>
                        <span className="font-extrabold text-text-white text-xs block">Enable Platform Maintenance Mode</span>
                        <p className="text-[10px] text-text-muted">Restricts client API transactions</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDirty(true);
                          setMaintenanceConfig(prev => ({ ...prev, enabled: !prev.enabled }));
                        }}
                        className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                          maintenanceConfig.enabled ? 'bg-red-600' : 'bg-zinc-700'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          maintenanceConfig.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-text-muted uppercase">Lockdown Start Time</label>
                        <input
                          type="datetime-local"
                          name="startTime"
                          value={maintenanceConfig.startTime}
                          onChange={handleFieldChange(setMaintenanceConfig)}
                          className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-text-muted uppercase">Lockdown End Time</label>
                        <input
                          type="datetime-local"
                          name="endTime"
                          value={maintenanceConfig.endTime}
                          onChange={handleFieldChange(setMaintenanceConfig)}
                          className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[9px] font-bold text-text-muted uppercase">Emergency Banner Notification</label>
                        <input
                          type="text"
                          name="emergencyBanner"
                          value={maintenanceConfig.emergencyBanner}
                          onChange={handleFieldChange(setMaintenanceConfig)}
                          className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[9px] font-bold text-text-muted uppercase">Client Maintenance Warning Message</label>
                        <textarea
                          rows={2}
                          name="message"
                          value={maintenanceConfig.message}
                          onChange={handleFieldChange(setMaintenanceConfig)}
                          className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: System settings */}
              {activeTab === 'system' && (
                <div className="space-y-5 text-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-text-white font-heading">Advanced System Variables</h3>
                    <p className="text-[10px] text-text-muted mt-0.5">Control data backups schedules and concurrent queues</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Platform Cache Duration (Min)</label>
                      <input
                        type="number"
                        name="cacheDurationMinutes"
                        value={systemConfig.cacheDurationMinutes}
                        onChange={handleFieldChange(setSystemConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Backup Execution Frequency (Hours)</label>
                      <input
                        type="number"
                        name="backupFrequencyHours"
                        value={systemConfig.backupFrequencyHours}
                        onChange={handleFieldChange(setSystemConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Client File Upload Limit (MB)</label>
                      <input
                        type="number"
                        name="fileUploadLimitMb"
                        value={systemConfig.fileUploadLimitMb}
                        onChange={handleFieldChange(setSystemConfig)}
                        className="w-full text-xs px-3 py-2 bg-bg-dark border border-border text-text-white rounded-lg focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-text-muted uppercase">Diagnostic Logging Severity</label>
                      <select
                        name="loggingLevel"
                        value={systemConfig.loggingLevel}
                        onChange={handleFieldChange(setSystemConfig)}
                        className="w-full text-xs px-2.5 py-2 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                      >
                        <option value="Debug">Debug Level</option>
                        <option value="Info">Info logs</option>
                        <option value="Warning">Warnings only</option>
                        <option value="Error">Errors only</option>
                      </select>
                    </div>
                  </div>
                  <div className="pt-4.5 border-t border-border/50">
                    <button
                      type="button"
                      onClick={() => triggerToast('Handshake check successful. All backend database nodes healthy.')}
                      className="px-4 py-2 bg-bg-dark border border-border text-[11px] font-bold text-text-white rounded-xl hover:bg-bg-card-hover transition"
                    >
                      Run Health Check
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Audit Log Configuration History Table */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block p-4 border-b border-border/50 bg-bg-dark-secondary/30">
            Settings Modification Logs
          </span>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="text-[10px] font-bold text-text-muted uppercase border-b border-border pb-2 bg-bg-dark-secondary/50">
                  <th className="py-3 px-4">Change ID</th>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Section Mapped</th>
                  <th className="py-3 px-4">Action Taken</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-bg-dark-secondary/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-text-white">{log.id}</td>
                    <td className="py-3 px-4 text-text-white font-medium">{log.adminName}</td>
                    <td className="py-3 px-4 text-cyan-400 font-semibold">{log.section}</td>
                    <td className="py-3 px-4 text-text-muted max-w-xs truncate">{log.action}</td>
                    <td className="py-3 px-4 text-text-muted whitespace-nowrap">{log.date}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => triggerToast(`Restoring backup revision ${log.id}...`)}
                        className="text-[11px] font-bold text-primary hover:underline"
                      >
                        Restore Config
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Health Monitoring & System Alerts bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health status */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <HeartIcon className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Active Platform Health</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {[
                { label: 'API Health', status: 'Healthy', color: 'text-emerald-400' },
                { label: 'Database Node', status: 'Healthy', color: 'text-emerald-400' },
                { label: 'Payout Queue', status: 'Healthy', color: 'text-emerald-400' },
                { label: 'Notifications', status: 'Healthy', color: 'text-emerald-400' },
                { label: 'Backup Engine', status: 'Warning', color: 'text-amber-400' }
              ].map(item => (
                <div key={item.label} className="bg-bg-dark-secondary/40 border border-border rounded-xl p-3.5 text-center space-y-1">
                  <span className="text-[9px] font-bold text-text-muted uppercase block truncate">{item.label}</span>
                  <span className={`text-[10px] font-bold ${item.color} block`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active warnings alerts */}
          <div className="bg-bg-card border border-red-500/20 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <ShieldExclamationIcon className="w-5 h-5 text-red-400" />
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Alerts Center</h3>
            </div>
            <div className="space-y-3.5 max-h-40 overflow-y-auto pr-1">
              {alerts.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-bg-dark-secondary/35 border border-border rounded-xl p-3 text-xs">
                  <div>
                    <span className="font-bold text-text-white block">{item.title}</span>
                    <p className="text-[10px] text-text-muted leading-relaxed mt-0.5">{item.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold shrink-0 ml-2 ${
                    item.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {item.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* Confirmation slide-out Drawer before saving dirty states */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden text-xs" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-bg-dark/65 backdrop-blur-xs transition-opacity"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-bg-card border-l border-border text-text-gray shadow-2xl transition-all duration-300 animate-slide-left">
                <div className="flex h-full flex-col overflow-y-auto">
                  {/* Header */}
                  <div className="bg-bg-dark-secondary/60 border-b border-border px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" />
                      <h2 className="text-base font-extrabold text-text-white font-heading tracking-tight">
                        Confirm Changes
                      </h2>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="rounded-xl border border-border p-1.5 hover:bg-bg-dark hover:text-text-white transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto text-xs">
                    <p className="text-text-muted leading-relaxed">
                      Please confirm that you want to publish the settings modifications. These rules will propagate live to all active gateway APIs immediately.
                    </p>

                    {/* Change summary */}
                    <div className="bg-bg-dark-secondary/40 border border-border rounded-xl p-4.5 space-y-3.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block border-b border-border/50 pb-2">Impact Estimates</span>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Target Mapped Section</span>
                        <span className="font-extrabold text-text-white uppercase">{activeTab}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Rollback Capability</span>
                        <span className="font-bold text-emerald-400">Available (via audit logs)</span>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="bg-bg-dark-secondary/60 border-t border-border px-6 py-5 flex items-center justify-between gap-3 shadow-2xl">
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-border bg-bg-card hover:bg-bg-card-hover text-text-white text-xs font-bold transition text-center"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePublishConfig}
                      className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition text-center shadow-xs"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
