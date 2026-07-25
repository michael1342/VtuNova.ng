import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  BellIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  PaperAirplaneIcon,
  PlusIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowRightIcon,
  PauseIcon
} from '@heroicons/react/24/outline';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
export interface Customer {
  name: string;
  email: string;
}

export interface NotificationCampaign {
  id: string;
  title: string;
  message: string;
  type: 'Announcement' | 'Transaction Alert' | 'Promotion' | 'Security' | 'System Update';
  audience: 'All Users' | 'Specific Users' | 'User Segments' | 'Inactive Users' | 'New Users' | 'VIP Users';
  channels: ('In-App' | 'Email' | 'Push' | 'SMS')[];
  sentCount: number;
  status: 'Draft' | 'Scheduled' | 'Sending' | 'Delivered' | 'Failed';
  date: string;
  time: string;
  buttonLabel?: string;
  buttonUrl?: string;
  timezone?: string;
  scheduledTime?: string;
  timeline: {
    created?: string;
    scheduled?: string;
    sending?: string;
    delivered?: string;
    completed?: string;
  };
}

export interface FailedNotification {
  id: string;
  title: string;
  recipientCount: number;
  failureReason: string;
  retries: number;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationCampaign['type'];
  subject: string;
  body: string;
  channels: NotificationCampaign['channels'];
}

export interface ActivityLog {
  id: string;
  event: string;
  adminName: string;
  timestamp: string;
}

export interface AudienceInsight {
  label: string;
  value: string | number;
  change: string;
  isPositive: boolean;
}

// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_CAMPAIGNS: NotificationCampaign[] = [
  {
    id: 'NOT-10045',
    title: 'Wallet Funding Promo',
    message: 'Fund your wallet today and get 5% instant cashback on all utility payments. Limited time offer.',
    type: 'Promotion',
    audience: 'All Users',
    channels: ['Push', 'In-App'],
    sentCount: 12840,
    status: 'Delivered',
    date: '2026-06-20',
    time: '12:00:00',
    buttonLabel: 'Fund Now',
    buttonUrl: 'https://vtunova.com/user/fund',
    timezone: 'WAT',
    timeline: {
      created: '10:00 AM',
      scheduled: '10:15 AM',
      sending: '11:00 AM',
      delivered: '12:00 PM',
      completed: '12:05 PM'
    }
  },
  {
    id: 'NOT-10046',
    title: 'Weekly Security Audit Notice',
    message: 'Please review your active logins list inside your profile to verify recent access security.',
    type: 'Security',
    audience: 'User Segments',
    channels: ['Email'],
    sentCount: 4200,
    status: 'Delivered',
    date: '2026-06-19',
    time: '15:30:00',
    buttonLabel: 'Verify Session',
    buttonUrl: 'https://vtunova.com/user/profile',
    timezone: 'WAT',
    timeline: {
      created: '14:00 PM',
      sending: '15:00 PM',
      delivered: '15:30 PM',
      completed: '15:35 PM'
    }
  },
  {
    id: 'NOT-10047',
    title: 'System Upgrade Notice',
    message: 'We will undergo database maintenance on Sunday between 2:00 AM and 4:00 AM. Expected latency is minimal.',
    type: 'System Update',
    audience: 'All Users',
    channels: ['Push', 'Email', 'In-App'],
    sentCount: 25000,
    status: 'Scheduled',
    date: '2026-06-21',
    time: '02:00:00',
    scheduledTime: '2026-06-21 02:00 AM',
    timezone: 'WAT',
    timeline: {
      created: '09:00 AM',
      scheduled: '09:30 AM'
    }
  },
  {
    id: 'NOT-10048',
    title: 'Inactive User Cashback Offer',
    message: 'We miss you! Recharge airtime or data today and get 10% instant rebate back to your wallet.',
    type: 'Promotion',
    audience: 'Inactive Users',
    channels: ['SMS', 'Push'],
    sentCount: 1200,
    status: 'Draft',
    date: '2026-06-18',
    time: '14:00:00',
    timeline: {
      created: '11:00 AM'
    }
  },
  {
    id: 'NOT-10049',
    title: 'Suspicious Login Warning',
    message: 'Unrecognized login attempt detected on your profile from London, UK. Disavow activity immediately.',
    type: 'Security',
    audience: 'Specific Users',
    channels: ['Push', 'SMS'],
    sentCount: 1,
    status: 'Failed',
    date: '2026-06-20',
    time: '18:10:00',
    timeline: {
      created: '18:05 PM',
      sending: '18:08 PM',
      completed: '18:10 PM'
    }
  }
];

const INITIAL_FAILURES: FailedNotification[] = [
  { id: 'NOT-10049', title: 'Suspicious Login Warning', recipientCount: 1, failureReason: 'FCM push token invalid; Twilio SMS gateway timeout.', retries: 2 },
  { id: 'NOT-10051', title: 'Developer API Rate Limits Update', recipientCount: 150, failureReason: 'SendGrid SMTP TLS handshake failure (Error 504).', retries: 1 }
];

const TEMPLATES: NotificationTemplate[] = [
  { id: 'TPL-01', name: 'Welcome Message', type: 'Announcement', subject: 'Welcome to VtuNova!', body: 'Thank you for choosing VtuNova. Fund your wallet and start utility payments now.', channels: ['In-App', 'Email'] },
  { id: 'TPL-02', name: 'Transaction Success', type: 'Transaction Alert', subject: 'Transaction Confirmation', body: 'Your purchase of {{service}} for {{amount}} was completed successfully. ID: {{txId}}.', channels: ['Push', 'In-App'] },
  { id: 'TPL-03', name: 'Wallet Funding', type: 'Transaction Alert', subject: 'Wallet Credited Successfully', body: 'Your wallet has been credited with {{amount}} via bank transfer.', channels: ['Email', 'In-App'] },
  { id: 'TPL-04', name: 'Maintenance Notice', type: 'System Update', subject: 'Scheduled Maintenance Update', body: 'VtuNova will undergo scheduled server updates on {{date}}. Temporary service lag expected.', channels: ['In-App', 'Email', 'Push'] },
  { id: 'TPL-05', name: 'Referral Campaign', type: 'Promotion', subject: 'Earn ₦500 for referring friends!', body: 'Invite your buddies to sign up on VtuNova. Get ₦500 cash reward on their first funding.', channels: ['Push', 'SMS'] }
];

const AUDIENCE_STATS: AudienceInsight[] = [
  { label: 'Total Reach', value: 45280, change: '+8.4%', isPositive: true },
  { label: 'Active Users', value: 18420, change: '+12.2%', isPositive: true },
  { label: 'Open Rate', value: '62.0%', change: '+4.5%', isPositive: true },
  { label: 'Engagement', value: '41.5%', change: '+2.8%', isPositive: true },
  { label: 'Delivery Time', value: '2.4s', change: '-0.8s', isPositive: true }
];

const ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'ACT-01', event: 'Notification Sent: Wallet Funding Promo (NOT-10045)', adminName: 'Michael Anazodo', timestamp: '1h ago' },
  { id: 'ACT-02', event: 'Campaign Scheduled: System Upgrade Notice (NOT-10047)', adminName: 'Aliyu Bello', timestamp: '3h ago' },
  { id: 'ACT-03', event: 'Template Updated: Referral Campaign (TPL-05)', adminName: 'Michael Anazodo', timestamp: '5h ago' },
  { id: 'ACT-04', event: 'Delivery Retried: Suspicious Login Warning (NOT-10049)', adminName: 'System Trigger', timestamp: '20m ago' }
];

// Charts data
const ENGAGEMENT_TRENDS = [
  { name: 'Mon', InApp: 3500, Email: 2200, Push: 4500, OpenRate: 58, DeliveryRate: 97.4 },
  { name: 'Tue', InApp: 4200, Email: 2800, Push: 5800, OpenRate: 61, DeliveryRate: 98.1 },
  { name: 'Wed', InApp: 3900, Email: 2400, Push: 5100, OpenRate: 59, DeliveryRate: 97.6 },
  { name: 'Thu', InApp: 5100, Email: 3200, Push: 7400, OpenRate: 64, DeliveryRate: 98.0 },
  { name: 'Fri', InApp: 5800, Email: 3800, Push: 8200, OpenRate: 68, DeliveryRate: 97.9 },
  { name: 'Sat', InApp: 6400, Email: 4500, Push: 9800, OpenRate: 72, DeliveryRate: 98.2 },
  { name: 'Sun', InApp: 4500, Email: 2900, Push: 6100, OpenRate: 62, DeliveryRate: 97.8 }
];

const CHANNEL_PERFORMANCE_BARS = [
  { name: 'Push', Sent: 45000, Delivered: 44200, Opens: 28000 },
  { name: 'In-App', Sent: 38000, Delivered: 38000, Opens: 22000 },
  { name: 'Email', Sent: 28000, Delivered: 27950, Opens: 18500 },
  { name: 'SMS', Sent: 12000, Delivered: 11400, Opens: 11000 }
];

export default function AdminNotifications() {
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [campaigns, setCampaigns] = useState<NotificationCampaign[]>(INITIAL_CAMPAIGNS);
  const [failures, setFailures] = useState<FailedNotification[]>(INITIAL_FAILURES);
  const [templates, setTemplates] = useState<NotificationTemplate[]>(TEMPLATES);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(ACTIVITY_LOGS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State (New Notification slide-out drawer)
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerTitle, setComposerTitle] = useState('');
  const [composerMessage, setComposerMessage] = useState('');
  const [composerType, setComposerType] = useState<NotificationCampaign['type']>('Announcement');
  const [composerAudience, setComposerAudience] = useState<NotificationCampaign['audience']>('All Users');
  const [composerChannels, setComposerChannels] = useState<NotificationCampaign['channels']>(['In-App']);
  const [composerSchedule, setComposerSchedule] = useState<'now' | 'later'>('now');
  const [composerDateTime, setComposerDateTime] = useState('');
  const [composerTimezone, setComposerTimezone] = useState('WAT');
  const [composerButtonLabel, setComposerButtonLabel] = useState('');
  const [composerButtonUrl, setComposerButtonUrl] = useState('');

  // Selected Campaign State for Timeline/Drawer Inspector
  const [selectedCampaign, setSelectedCampaign] = useState<NotificationCampaign | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Filter toolbar parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Active filters applied parameters
  const [appliedSearch, setAppliedSearch] = useState('');
  const [appliedType, setAppliedType] = useState('All');
  const [appliedChannel, setAppliedChannel] = useState('All');
  const [appliedStatus, setAppliedStatus] = useState('All');
  const [appliedAudience, setAppliedAudience] = useState('All');
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');

  // Table sorting & pagination
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'id' | 'sent' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Export center modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportReportType, setExportReportType] = useState('Delivery Report');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Compose dynamic channel toggles
  const handleComposerChannelToggle = (ch: NotificationCampaign['channels'][number]) => {
    setComposerChannels(prev => 
      prev.includes(ch) ? prev.filter(item => item !== ch) : [...prev, ch]
    );
  };

  // Handlers for Compose Form Action
  const handleCreateNotification = (status: 'Draft' | 'Sent' | 'Scheduled') => {
    if (!composerTitle || !composerMessage) {
      triggerToast('Title and Message content details are required.');
      return;
    }
    if (composerChannels.length === 0) {
      triggerToast('Please select at least one delivery channel.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const count = composerAudience === 'All Users' ? 18420 : composerAudience === 'VIP Users' ? 2450 : 850;
      const newCampaign: NotificationCampaign = {
        id: `NOT-${Math.floor(10000 + Math.random() * 9000)}`,
        title: composerTitle,
        message: composerMessage,
        type: composerType,
        audience: composerAudience,
        channels: composerChannels,
        sentCount: status === 'Draft' ? 0 : count,
        status: status,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        buttonLabel: composerButtonLabel || undefined,
        buttonUrl: composerButtonUrl || undefined,
        timezone: composerTimezone,
        scheduledTime: status === 'Scheduled' ? composerDateTime : undefined,
        timeline: {
          created: 'Just now',
          scheduled: status === 'Scheduled' ? 'Just now' : undefined,
          sending: status === 'Sent' ? 'Just now' : undefined,
          delivered: status === 'Sent' ? 'Just now' : undefined
        }
      };

      setCampaigns(prev => [newCampaign, ...prev]);

      // Add log
      const newLog: ActivityLog = {
        id: `ACT-${Math.floor(10 + Math.random() * 90)}`,
        event: `${status === 'Sent' ? 'Notification Sent' : status === 'Scheduled' ? 'Campaign Scheduled' : 'Draft Created'}: ${composerTitle}`,
        adminName: 'Michael Anazodo',
        timestamp: 'Just now'
      };
      setActivityLogs(prev => [newLog, ...prev]);

      // Reset Form State
      setComposerTitle('');
      setComposerMessage('');
      setComposerType('Announcement');
      setComposerAudience('All Users');
      setComposerChannels(['In-App']);
      setComposerSchedule('now');
      setComposerDateTime('');
      setComposerButtonLabel('');
      setComposerButtonUrl('');
      setIsComposerOpen(false);

      setLoading(false);
      triggerToast(`Notification campaign saved successfully as ${status}.`);
    }, 850);
  };

  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedType(typeFilter);
    setAppliedChannel(channelFilter);
    setAppliedStatus(statusFilter);
    setAppliedAudience(audienceFilter);
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
    setCurrentPage(1);
    triggerToast('Outbox filters applied.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setTypeFilter('All');
    setChannelFilter('All');
    setStatusFilter('All');
    setAudienceFilter('All');
    setStartDate('');
    setEndDate('');

    setAppliedSearch('');
    setAppliedType('All');
    setAppliedChannel('All');
    setAppliedStatus('All');
    setAppliedAudience('All');
    setAppliedStart('');
    setAppliedEnd('');

    setCurrentPage(1);
    triggerToast('Outbox filters reset.');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setCampaigns(INITIAL_CAMPAIGNS);
      setFailures(INITIAL_FAILURES);
      setTemplates(TEMPLATES);
      setActivityLogs(ACTIVITY_LOGS);
      setLoading(false);
      triggerToast('Notifications dashboard reconciled.');
    }, 750);
  };

  // Row selection handler
  const handleSelectRow = (id: string) => {
    setSelectedSubIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSubIds(paginatedCampaigns.map(c => c.id));
    } else {
      setSelectedSubIds([]);
    }
  };

  // Sorting
  const handleSort = (field: 'id' | 'sent' | 'date') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Table Filter Logic
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const searchMatch = appliedSearch === '' || 
        c.id.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        c.title.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        c.message.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        c.audience.toLowerCase().includes(appliedSearch.toLowerCase());

      const typeMatch = appliedType === 'All' || c.type === appliedType;
      const statusMatch = appliedStatus === 'All' || c.status === appliedStatus;
      const audienceMatch = appliedAudience === 'All' || c.audience === appliedAudience;

      let channelMatch = true;
      if (appliedChannel !== 'All') {
        channelMatch = c.channels.includes(appliedChannel as any);
      }

      let dateMatch = true;
      if (appliedStart) {
        dateMatch = dateMatch && new Date(c.date) >= new Date(appliedStart);
      }
      if (appliedEnd) {
        dateMatch = dateMatch && new Date(c.date) <= new Date(appliedEnd);
      }

      return searchMatch && typeMatch && statusMatch && audienceMatch && channelMatch && dateMatch;
    });
  }, [campaigns, appliedSearch, appliedType, appliedStatus, appliedAudience, appliedChannel, appliedStart, appliedEnd]);

  const sortedCampaigns = useMemo(() => {
    const sorted = [...filteredCampaigns];
    sorted.sort((a, b) => {
      if (sortField === 'id') {
        return sortDirection === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      } else if (sortField === 'sent') {
        return sortDirection === 'asc' ? a.sentCount - b.sentCount : b.sentCount - a.sentCount;
      } else {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
    });
    return sorted;
  }, [filteredCampaigns, sortField, sortDirection]);

  const paginatedCampaigns = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedCampaigns.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedCampaigns, currentPage]);

  const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage);

  // Actions
  const handleDuplicate = (c: NotificationCampaign) => {
    setComposerTitle(`${c.title} (Copy)`);
    setComposerMessage(c.message);
    setComposerType(c.type);
    setComposerAudience(c.audience);
    setComposerChannels(c.channels);
    setComposerButtonLabel(c.buttonLabel || '');
    setComposerButtonUrl(c.buttonUrl || '');
    setIsComposerOpen(true);
    triggerToast('Campaign contents loaded into Composer drawer.');
  };

  const handlePause = (id: string) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'Sending' ? 'Draft' : 'Sending' };
      }
      return c;
    }));
    triggerToast(`Delivery states updated for ${id}.`);
  };

  const handleRetryFailure = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setFailures(prev => prev.filter(f => f.id !== id));
      setLoading(false);
      triggerToast(`Re-dispatched push/email packets for failure queue ${id}.`);
    }, 1000);
  };

  const handleEditFailure = (item: FailedNotification) => {
    setComposerTitle(item.title);
    setComposerMessage('Rescheduling failed delivery logs details...');
    setIsComposerOpen(true);
  };

  const handleCancelFailure = (id: string) => {
    setFailures(prev => prev.filter(f => f.id !== id));
    triggerToast(`Broadcast queue payload cancelled for ${id}.`);
  };

  // Bulk parameters handlers
  const handleBulkExport = () => {
    setSelectedSubIds([]);
    triggerToast('Exported selected outbox campaign ledger files.');
  };

  const handleBulkRetry = () => {
    setSelectedSubIds([]);
    triggerToast('Triggered manual dispatch retry on selected outboxes.');
  };

  const handleBulkMarkReviewed = () => {
    setSelectedSubIds([]);
    triggerToast('Selected outbox notifications marked as reviewed.');
  };

  const handleBulkArchive = () => {
    setSelectedSubIds([]);
    triggerToast('Selected campaigns logs archived successfully.');
  };

  const handleUseTemplate = (tpl: NotificationTemplate) => {
    setComposerTitle(tpl.name);
    setComposerMessage(tpl.body);
    setComposerType(tpl.type);
    setComposerChannels(tpl.channels);
    setIsComposerOpen(true);
    triggerToast(`Loaded "${tpl.name}" notification template details.`);
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

      {/* Loader indicator */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-bg-dark/40 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-bg-card border border-border p-5 rounded-2xl flex flex-col items-center gap-3 shadow-2xl">
            <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            <span className="text-xs font-semibold text-text-white font-heading">Reconciling dispatcher details...</span>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Gateway checkmarks */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-text-muted font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Firebase FCM Link: Connected
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SendGrid SMTP Link: Active
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            SMS Gateway Status: Warning (3.2s lag)
          </span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-text-white font-heading tracking-tight">
              Notifications
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Create announcements, send alerts, manage broadcasts, and monitor notification delivery.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => setIsComposerOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4" />
              Create Notification
            </button>
            <button
              onClick={() => { setExportReportType('Delivery Report'); setShowExportModal(true); }}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <ArrowDownTrayIcon className="w-4 h-4 text-text-muted" />
              Export Logs
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

        {/* KPI overview Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Notifications */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Notifications</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">18,420</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+10%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-primary opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,20 Q15,5 30,15 T60,25 T90,5 L100,10" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* Card 2: Delivered */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Delivered</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">97.8%</span>
              <span className="text-[10px] font-semibold text-emerald-400">+0.4%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-emerald-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,25 Q20,10 40,20 T70,5 T100,12" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Pending</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">1.4%</span>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-amber-400 opacity-60 animate-pulse" viewBox="0 0 100 30" fill="none">
                <path d="M0,15 L20,15 L40,10 L60,20 L80,15 L100,15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Card 4: Failed */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Failed</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">0.8%</span>
              <span className="text-[10px] font-semibold text-red-400">-0.1%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-red-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,5 Q30,25 60,10 T100,28" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* Card 5: Active Campaigns */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Active Campaigns</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">12</span>
              <span className="text-[10px] font-semibold text-emerald-400">+2</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-primary opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,10 L25,25 L50,12 L75,28 L100,15" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>

          {/* Card 6: Engagement Rate */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Engagement Rate</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">62%</span>
              <span className="text-[10px] font-semibold text-emerald-400">+1.5%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-emerald-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,28 L30,22 L60,12 L90,2 L100,5" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Notification Controls Toolbar */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Global Search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by Notification ID, Title, Audience targeting, Campaign name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-11 pr-4 py-3 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden focus:border-primary transition-colors placeholder:text-text-muted"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 w-full lg:w-auto">
              <button
                onClick={handleApplyFilters}
                className="flex-1 lg:flex-none px-4.5 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="flex-1 lg:flex-none px-4.5 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-bold rounded-xl transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => { setExportReportType('Campaign Report'); setShowExportModal(true); }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => { setExportReportType('Engagement Report'); setShowExportModal(true); }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-text-white font-heading font-bold text-[10px] uppercase tracking-wider mb-3">
              <FunnelIcon className="w-3.5 h-3.5 text-primary" />
              Filter parameters
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {/* Type Filter */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Notification Type</label>
                <select
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Types</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Transaction Alert">Transaction Alert</option>
                  <option value="Promotion">Promotion</option>
                  <option value="Security">Security</option>
                  <option value="System Update">System Update</option>
                </select>
              </div>

              {/* Channel Filter */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Delivery Channel</label>
                <select
                  value={channelFilter}
                  onChange={e => setChannelFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Channels</option>
                  <option value="In-App">In-App</option>
                  <option value="Email">Email</option>
                  <option value="Push">Push</option>
                  <option value="SMS">SMS</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Sending">Sending</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              {/* Audience Filter */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Audience</label>
                <select
                  value={audienceFilter}
                  onChange={e => setAudienceFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Audience</option>
                  <option value="All Users">All Users</option>
                  <option value="Specific Users">Specific Users</option>
                  <option value="User Segments">User Segments</option>
                  <option value="Inactive Users">Inactive Users</option>
                  <option value="New Users">New Users</option>
                  <option value="VIP Users">VIP Users</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Date Range</label>
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-bg-dark-secondary text-text-white border border-border rounded-lg focus:outline-hidden"
                  />
                  <span className="text-[10px] text-text-muted font-bold">-</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-bg-dark-secondary text-text-white border border-border rounded-lg focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedSubIds.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-[fadeIn_.2s_ease]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-extrabold text-white">
                {selectedSubIds.length}
              </span>
              <span className="text-xs font-bold text-text-white">Selected notification logs for administrative action</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleBulkExport}
                className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold transition"
              >
                Export Selected
              </button>
              <button
                onClick={handleBulkRetry}
                className="px-3.5 py-1.5 rounded-lg bg-bg-dark border border-border text-text-white text-[11px] font-semibold transition hover:bg-bg-card-hover"
              >
                Retry Selected
              </button>
              <button
                onClick={handleBulkMarkReviewed}
                className="px-3.5 py-1.5 rounded-lg bg-bg-dark border border-border text-text-white text-[11px] font-semibold transition hover:bg-bg-card-hover"
              >
                Mark Reviewed
              </button>
              <button
                onClick={handleBulkArchive}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-700/30 text-zinc-300 text-[11px] font-semibold border border-zinc-700/40 hover:bg-zinc-700/50 transition"
              >
                Archive
              </button>
              <button
                onClick={() => setSelectedSubIds([])}
                className="text-[11px] font-semibold text-text-muted hover:text-text-white px-2 py-1 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Notifications Table */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto relative">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-bg-dark-secondary z-10 border-b border-border">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-4 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={paginatedCampaigns.length > 0 && paginatedCampaigns.every(c => selectedSubIds.includes(c.id))}
                      className="rounded border-border focus:ring-primary text-primary"
                    />
                  </th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">
                      Notification ID
                      {sortField === 'id' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4">Title</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Audience</th>
                  <th className="py-4 px-4">Channel</th>
                  <th className="py-4 px-4 text-right cursor-pointer select-none" onClick={() => handleSort('sent')}>
                    <div className="flex items-center justify-end gap-1">
                      Sent
                      {sortField === 'sent' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => handleSort('date')}>
                    <div className="flex items-center gap-1">
                      Date
                      {sortField === 'date' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-xs">
                {paginatedCampaigns.length > 0 ? (
                  paginatedCampaigns.map(c => {
                    const isSelected = selectedSubIds.includes(c.id);
                    return (
                      <tr
                        key={c.id}
                        className={`hover:bg-bg-card-hover/40 transition-colors ${
                          isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(c.id)}
                            className="rounded border-border focus:ring-primary text-primary"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text-white">{c.id}</td>
                        <td className="py-3.5 px-4 font-semibold text-text-white max-w-[180px] truncate" title={c.title}>
                          {c.title}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.type === 'Security' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            c.type === 'Promotion' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            c.type === 'System Update' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {c.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text-muted">{c.audience}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {c.channels.map(ch => (
                              <span key={ch} className="px-1.5 py-0.5 rounded bg-bg-dark-secondary border border-border text-[9px] font-semibold text-text-white">
                                {ch}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-text-white">
                          {c.sentCount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                            c.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            c.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            c.status === 'Sending' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            c.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              c.status === 'Delivered' ? 'bg-emerald-400' :
                              c.status === 'Scheduled' ? 'bg-amber-400' :
                              c.status === 'Sending' ? 'bg-blue-400' :
                              c.status === 'Failed' ? 'bg-red-400' :
                              'bg-zinc-400'
                            }`} />
                            {c.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">{c.date}</td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setSelectedCampaign(c); setIsInspectorOpen(true); }}
                              className="p-1 px-2.5 rounded-lg border border-border hover:border-border-hover text-text-muted hover:text-text-white hover:bg-bg-dark transition text-[11px] font-semibold"
                            >
                              View
                            </button>
                            <button
                              onClick={() => handleDuplicate(c)}
                              className="p-1.5 rounded-lg border border-border hover:bg-bg-dark text-text-muted hover:text-text-white transition"
                              title="Duplicate Campaign"
                            >
                              <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                            </button>
                            {c.status === 'Sending' && (
                              <button
                                onClick={() => handlePause(c.id)}
                                className="p-1 rounded-lg border border-border hover:bg-red-500/10 hover:text-red-400 transition"
                                title="Pause Campaign"
                              >
                                <PauseIcon className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-text-muted">
                      <ExclamationTriangleIcon className="w-8 h-8 mx-auto text-text-muted mb-2 opacity-50" />
                      <span className="text-xs font-semibold block">No notifications created.</span>
                      <button
                        onClick={() => setIsComposerOpen(true)}
                        className="mt-3.5 px-4.5 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-xs transition"
                      >
                        Create Notification
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3.5 bg-bg-dark-secondary/50 border-t border-border flex items-center justify-between text-xs text-text-muted">
              <span>
                Showing <span className="font-bold text-text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-bold text-text-white">
                  {Math.min(currentPage * itemsPerPage, sortedCampaigns.length)}
                </span>{' '}
                of <span className="font-bold text-text-white">{sortedCampaigns.length}</span> entries
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-2.5 py-1 rounded bg-bg-card border border-border text-text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-card-hover"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-2.5 py-1 rounded ${
                      currentPage === i + 1
                        ? 'bg-primary text-white font-bold'
                        : 'bg-bg-card border border-border text-text-white hover:bg-bg-card-hover'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-2.5 py-1 rounded bg-bg-card border border-border text-text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-card-hover"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Failed Delivery Queue */}
        {failures.length > 0 && (
          <div className="bg-bg-card border border-red-500/25 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">
                  Failed Delivery Queue
                </h3>
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Action required
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold text-text-muted uppercase border-b border-border pb-2">
                    <th className="pb-2">Notification</th>
                    <th className="pb-2">Recipient Count</th>
                    <th className="pb-2">Failure Reason</th>
                    <th className="pb-2">Retries</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {failures.map(item => (
                    <tr key={item.id} className="hover:bg-bg-dark-secondary/40 transition">
                      <td className="py-3 font-semibold text-text-white">
                        <span className="block font-mono text-[10px] text-text-muted">{item.id}</span>
                        <span className="block font-medium">{item.title}</span>
                      </td>
                      <td className="py-3 text-text-white font-bold">{item.recipientCount.toLocaleString()}</td>
                      <td className="py-3 text-red-400 max-w-[250px] truncate" title={item.failureReason}>
                        {item.failureReason}
                      </td>
                      <td className="py-3 font-bold text-text-white">{item.retries} / 3</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRetryFailure(item.id)}
                            className="px-2.5 py-1 rounded bg-primary hover:bg-primary-hover text-white text-[10px] font-bold transition"
                          >
                            Retry
                          </button>
                          <button
                            onClick={() => handleEditFailure(item)}
                            className="px-2.5 py-1 rounded border border-border text-text-white hover:bg-bg-dark text-[10px] font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleCancelFailure(item.id)}
                            className="px-2.5 py-1 rounded bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 text-[10px] font-semibold transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delivery Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Delivery vs Open engagement rates */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Delivery & Open Engagement Rates</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Engagement percentages and outbox rates logs this week</p>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ENGAGEMENT_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} domain={[40, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#100f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="DeliveryRate" stroke="#10b981" fillOpacity={1} fill="url(#colorDelivery)" strokeWidth={2} name="Delivery Rate (%)" />
                  <Area type="monotone" dataKey="OpenRate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOpen)" strokeWidth={2} name="Open Rate (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Channel Performance */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Channel Performance</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Aggregate dispatch volume stats per channel link</p>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHANNEL_PERFORMANCE_BARS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#100f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Bar dataKey="Sent" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sent Txs" />
                  <Bar dataKey="Opens" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Opened Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around text-[10px] text-text-muted font-bold uppercase pt-2 border-t border-border">
              <span>fcm push: 98.2%</span>
              <span>smtp mail: 99.8%</span>
            </div>
          </div>
        </div>

        {/* Broadcast Center Shortcuts */}
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Broadcast Center</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Fast-track template payloads to specific global client layers</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
            {[
              { name: 'Broadcast to All Users', tpl: 'TPL-01', desc: 'Dispatches generic welcome alerts' },
              { name: 'Security Alert', tpl: 'TPL-02', desc: 'Urgent user transaction notice pushes' },
              { name: 'Maintenance Notice', tpl: 'TPL-04', desc: 'Server downtime outage templates' },
              { name: 'Promotional Campaign', tpl: 'TPL-05', desc: 'Promos referral rewards triggers' },
              { name: 'Product Announcement', tpl: 'TPL-01', desc: 'Feature launch campaigns updates' }
            ].map(item => (
              <div key={item.name} className="bg-bg-card border border-border rounded-2xl p-4.5 flex flex-col justify-between space-y-4 hover:scale-102 hover:border-primary/20 transition-all duration-200 group">
                <div>
                  <span className="font-bold text-text-white block group-hover:text-primary transition-colors">{item.name}</span>
                  <span className="text-[10px] text-text-muted block mt-0.5 leading-relaxed">{item.desc}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const matched = templates.find(t => t.id === item.tpl);
                    if (matched) handleUseTemplate(matched);
                  }}
                  className="w-full py-1.5 rounded-xl bg-bg-dark-secondary hover:bg-primary hover:text-white border border-border hover:border-primary text-text-white text-[10px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  Launch Payload
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Audience Insights & Templates Library */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Audience Insights */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Audience Insights</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Audience reach metrics and user metrics overview</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              {AUDIENCE_STATS.map(stat => (
                <div key={stat.label} className="bg-bg-card border border-border rounded-2xl p-4 space-y-2 hover:-translate-y-0.5 transition duration-200">
                  <span className="text-[9px] font-bold text-text-muted uppercase block">{stat.label}</span>
                  <span className="text-base font-extrabold text-text-white font-heading block">
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-400 block">{stat.change} limit</span>
                </div>
              ))}
            </div>
          </div>

          {/* Templates Library */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Templates Library</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Reusable pre-formatted messaging templates</p>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 text-xs">
              {templates.map(tpl => (
                <div key={tpl.id} className="bg-bg-dark-secondary/50 border border-border rounded-xl p-3 flex justify-between items-center hover:border-primary/25 transition">
                  <div>
                    <span className="font-bold text-text-white block">{tpl.name}</span>
                    <span className="text-[9px] text-text-muted block mt-0.5">{tpl.type} • {tpl.channels.join(' + ')}</span>
                  </div>
                  <div className="flex gap-1.5 shrink-0 ml-2">
                    <button
                      onClick={() => handleUseTemplate(tpl)}
                      className="p-1 px-2 rounded bg-primary hover:bg-primary-hover text-white text-[9px] font-bold transition"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => {
                        setComposerTitle(tpl.name);
                        setComposerMessage(tpl.body);
                        setComposerType(tpl.type);
                        setComposerChannels(tpl.channels);
                        setIsComposerOpen(true);
                      }}
                      className="p-1 rounded border border-border hover:bg-bg-dark text-text-muted hover:text-text-white transition"
                      title="Edit template details"
                    >
                      ✎
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed & Export Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="border-b border-border pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Activity Feed</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Logs of recent administrative notification edits and dispatches</p>
            </div>

            <div className="space-y-3.5 pl-1 text-xs">
              {activityLogs.map(log => (
                <div key={log.id} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-primary/10 border border-primary/15 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                    ✓
                  </span>
                  <div className="flex-1">
                    <span className="font-medium text-text-white block">{log.event}</span>
                    <span className="text-[9px] text-text-muted block mt-0.5">Action by {log.adminName} • {log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Center */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Export Center</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Aggregate dispatch campaigns reports downloads</p>
            </div>

            <div className="space-y-3 text-xs">
              {['Delivery Report', 'Campaign Report', 'Audience Report', 'Engagement Report'].map(item => (
                <div key={item} className="bg-bg-dark-secondary/50 border border-border rounded-xl p-3 flex items-center justify-between hover:border-primary/20 transition-all duration-200">
                  <div>
                    <span className="font-bold text-text-white block">{item}</span>
                    <span className="text-[9px] text-text-muted block">Aggregate downloads file (.csv)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setExportReportType(item); setShowExportModal(true); }}
                      className="px-2.5 py-1 rounded bg-bg-card hover:bg-bg-card-hover border border-border text-[9px] font-bold text-text-white transition"
                    >
                      Generate
                    </button>
                    <button
                      onClick={() => triggerToast(`Downloaded report file: SWT_CAMPAIGN_${item.toUpperCase().replace(' ', '_')}.csv`)}
                      className="py-1 px-2 rounded bg-primary hover:bg-primary-hover text-white text-[9px] font-bold transition"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Slide-outcomposer Drawer (New Notification / Campaign Panel) */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Overlay */}
            <div
              onClick={() => setIsComposerOpen(false)}
              className="absolute inset-0 bg-bg-dark/65 backdrop-blur-xs transition-opacity animate-fade-in"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-3xl transform bg-bg-card border-l border-border text-text-gray shadow-2xl transition-all duration-300 animate-slide-left">
                <div className="flex h-full flex-col overflow-y-auto">
                  {/* Composer Header */}
                  <div className="bg-bg-dark-secondary/60 border-b border-border px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-text-white font-heading tracking-tight">
                        Compose New Notification Campaign
                      </h2>
                      <p className="text-[10px] text-text-muted mt-0.5">Select audiences and dispatch channels</p>
                    </div>
                    <button
                      onClick={() => setIsComposerOpen(false)}
                      className="rounded-xl border border-border p-1.5 hover:bg-bg-dark hover:text-text-white transition text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Composer Body split grid */}
                  <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                    {/* Left: Input Form controls */}
                    <div className="space-y-4">
                      {/* Notification Content */}
                      <div className="space-y-3.5 bg-bg-dark-secondary/40 border border-border p-4.5 rounded-xl">
                        <h3 className="text-xs font-bold text-text-white uppercase tracking-wider">Notification Content</h3>

                        {/* Title */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-text-muted uppercase">Notification Title</label>
                          <input
                            type="text"
                            placeholder="Enter alert title header..."
                            value={composerTitle}
                            onChange={e => setComposerTitle(e.target.value)}
                            maxLength={70}
                            className="w-full text-xs px-3 py-2.5 bg-bg-dark border border-border text-text-white rounded-lg placeholder:text-text-muted focus:outline-hidden"
                          />
                        </div>

                        {/* Message content */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-text-muted uppercase">Message Body</label>
                          <textarea
                            rows={4}
                            placeholder="Enter the notification message details..."
                            value={composerMessage}
                            onChange={e => setComposerMessage(e.target.value)}
                            maxLength={240}
                            className="w-full text-xs px-3 py-2.5 bg-bg-dark border border-border text-text-white rounded-lg placeholder:text-text-muted focus:outline-hidden resize-none"
                          />
                          <div className="text-right text-[9px] text-text-muted font-bold font-mono">
                            {composerMessage.length} / 240 Characters
                          </div>
                        </div>

                        {/* Composer Type */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-text-muted uppercase">Notification Type</label>
                          <select
                            value={composerType}
                            onChange={e => setComposerType(e.target.value as any)}
                            className="w-full text-xs px-2.5 py-2 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                          >
                            <option value="Announcement">Announcement</option>
                            <option value="Transaction Alert">Transaction Alert</option>
                            <option value="Promotion">Promotion</option>
                            <option value="Security">Security</option>
                            <option value="System Update">System Update</option>
                          </select>
                        </div>
                      </div>

                      {/* Delivery channels */}
                      <div className="space-y-2 bg-bg-dark-secondary/40 border border-border p-4.5 rounded-xl">
                        <label className="block text-[10px] font-bold text-text-white uppercase tracking-wider">Delivery Channels (Multi-select)</label>
                        <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                          {['In-App', 'Email', 'Push', 'SMS'].map((ch) => {
                            const isChecked = composerChannels.includes(ch as any);
                            return (
                              <button
                                key={ch}
                                type="button"
                                onClick={() => handleComposerChannelToggle(ch as any)}
                                className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between text-xs font-semibold ${
                                  isChecked
                                    ? 'border-primary bg-primary/10 text-white'
                                    : 'border-border bg-bg-dark hover:border-border-hover text-text-muted'
                                }`}
                              >
                                <span>{ch}</span>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  readOnly
                                  className="rounded border-border focus:ring-primary text-primary"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Audience */}
                      <div className="space-y-2.5 bg-bg-dark-secondary/40 border border-border p-4.5 rounded-xl text-xs">
                        <label className="block text-[10px] font-bold text-text-white uppercase tracking-wider">Target Audience Segment</label>
                        <select
                          value={composerAudience}
                          onChange={e => setComposerAudience(e.target.value as any)}
                          className="w-full text-xs px-2.5 py-2 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                        >
                          <option value="All Users">All Users (45,280)</option>
                          <option value="Specific Users">Specific Users list (CSV)</option>
                          <option value="User Segments">User Segments Group</option>
                          <option value="Inactive Users">Inactive Users (4,200)</option>
                          <option value="New Users">New Users (850)</option>
                          <option value="VIP Users">VIP Users (2,450)</option>
                        </select>
                      </div>

                      {/* Scheduling */}
                      <div className="space-y-3 bg-bg-dark-secondary/40 border border-border p-4.5 rounded-xl text-xs">
                        <label className="block text-[10px] font-bold text-text-white uppercase tracking-wider">Campaign Scheduling</label>
                        <div className="flex items-center gap-4 pt-1">
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-text-white">
                            <input
                              type="radio"
                              name="composerSchedule"
                              checked={composerSchedule === 'now'}
                              onChange={() => setComposerSchedule('now')}
                              className="text-primary focus:ring-primary"
                            />
                            <span>Send Now</span>
                          </label>
                          <label className="inline-flex items-center gap-1.5 cursor-pointer text-text-white">
                            <input
                              type="radio"
                              name="composerSchedule"
                              checked={composerSchedule === 'later'}
                              onChange={() => setComposerSchedule('later')}
                              className="text-primary focus:ring-primary"
                            />
                            <span>Schedule Later</span>
                          </label>
                        </div>

                        {composerSchedule === 'later' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 animate-[fadeIn_.2s_ease]">
                            <div>
                              <label className="block text-[9px] font-bold text-text-muted mb-1">Select Date & Time</label>
                              <input
                                type="datetime-local"
                                value={composerDateTime}
                                onChange={e => setComposerDateTime(e.target.value)}
                                className="w-full text-xs px-2 py-1.5 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-text-muted mb-1">Timezone</label>
                              <select
                                value={composerTimezone}
                                onChange={e => setComposerTimezone(e.target.value)}
                                className="w-full text-xs px-2 py-1.5 bg-bg-dark border border-border rounded-lg text-text-white focus:outline-hidden"
                              >
                                <option value="WAT">WAT (GMT+1)</option>
                                <option value="GMT">GMT (GMT+0)</option>
                                <option value="EST">EST (GMT-5)</option>
                              </select>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA links */}
                      <div className="space-y-3 bg-bg-dark-secondary/40 border border-border p-4.5 rounded-xl text-xs">
                        <label className="block text-[10px] font-bold text-text-white uppercase tracking-wider">CTA Actions Links</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-text-muted mb-1">Button Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Fund Now"
                              value={composerButtonLabel}
                              onChange={e => setComposerButtonLabel(e.target.value)}
                              className="w-full text-xs px-2 py-1.5 bg-bg-dark border border-border text-text-white rounded-lg placeholder:text-text-muted"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-text-muted mb-1">URL Target Redirect</label>
                            <input
                              type="text"
                              placeholder="e.g. https://..."
                              value={composerButtonUrl}
                              onChange={e => setComposerButtonUrl(e.target.value)}
                              className="w-full text-xs px-2 py-1.5 bg-bg-dark border border-border text-text-white rounded-lg placeholder:text-text-muted"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Notification Preview */}
                    <div className="space-y-4 border-l border-border/50 pl-0 lg:pl-6">
                      <h3 className="text-xs font-bold text-text-white uppercase tracking-wider pb-1.5 border-b border-border">
                        Live Preview Panel
                      </h3>

                      {/* Mobile push alert preview */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-semibold text-text-muted uppercase flex items-center gap-1.5">
                          <DevicePhoneMobileIcon className="w-3.5 h-3.5" />
                          Mobile Push Alert
                        </span>
                        <div className="bg-zinc-900 border border-zinc-700/50 rounded-2xl p-4 max-w-sm mx-auto shadow-xl relative overflow-hidden">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 text-[9px] text-zinc-400">
                            <span className="flex items-center gap-1 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              VtuNova
                            </span>
                            <span>now</span>
                          </div>
                          <span className="text-xs font-extrabold text-white block truncate">
                            {composerTitle || 'Wallet Funding Promo'}
                          </span>
                          <p className="text-[11px] text-zinc-300 block mt-0.5 line-clamp-2 leading-relaxed">
                            {composerMessage || 'Fund your wallet today and get 5% instant cashback on all utility payments.'}
                          </p>
                          {composerButtonLabel && (
                            <span className="mt-2 py-1.5 px-3 rounded-lg bg-blue-600 text-white font-bold text-[9px] block w-fit">
                              {composerButtonLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Web Alert preview */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] font-semibold text-text-muted uppercase flex items-center gap-1.5">
                          <ComputerDesktopIcon className="w-3.5 h-3.5" />
                          Web Notification
                        </span>
                        <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 max-w-md mx-auto shadow-md">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary shrink-0">
                              <BellIcon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-1.5 min-w-0">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-text-white truncate">
                                  {composerTitle || 'Wallet Funding Promo'}
                                </span>
                                <span className="text-[9px] text-text-muted font-mono whitespace-nowrap">Just now</span>
                              </div>
                              <p className="text-[11px] text-text-muted leading-relaxed">
                                {composerMessage || 'Fund your wallet today and get 5% instant cashback on all utility payments.'}
                              </p>
                              {composerButtonLabel && (
                                <button className="text-[10px] font-bold text-primary hover:underline">
                                  {composerButtonLabel} →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Email template Preview */}
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] font-semibold text-text-muted uppercase flex items-center gap-1.5">
                          <EnvelopeIcon className="w-3.5 h-3.5" />
                          Email Body Mock Layout
                        </span>
                        <div className="bg-white border border-gray-200 rounded-xl max-w-lg mx-auto overflow-hidden text-zinc-800 shadow-sm text-xs">
                          {/* Email top shell */}
                          <div className="bg-zinc-950 p-4 border-b border-gray-200 flex items-center gap-2 text-white">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                            <span className="font-bold text-[10px] tracking-wide font-heading">VtuNova Broadcast Dispatch</span>
                          </div>
                          {/* Subject */}
                          <div className="p-4 border-b border-gray-100 text-[11px] text-zinc-500">
                            <strong>Subject:</strong> {composerTitle || 'Wallet Funding Promo'}
                          </div>
                          {/* Content body */}
                          <div className="p-6 space-y-4">
                            <h3 className="text-sm font-extrabold text-zinc-950">
                              Hello VtuNova Client,
                            </h3>
                            <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                              {composerMessage || 'Fund your wallet today and get 5% instant cashback on all utility payments. Limited time offer.'}
                            </p>
                            {composerButtonLabel && (
                              <a
                                href={composerButtonUrl || '#'}
                                onClick={e => e.preventDefault()}
                                className="inline-block py-2.5 px-5 rounded-lg bg-zinc-900 text-white font-bold text-[10px] hover:bg-zinc-800 transition"
                              >
                                {composerButtonLabel}
                              </a>
                            )}
                          </div>
                          {/* Footer */}
                          <div className="bg-zinc-50 p-4 border-t border-gray-100 text-[9px] text-zinc-400 text-center">
                            VtuNova Ltd. • Plot 12, Lekki Admiralty Way, Lagos, Nigeria • Unsubscribe
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="bg-bg-dark-secondary/60 border-t border-border px-6 py-5 flex items-center justify-between gap-3 shadow-2xl">
                    <div className="flex gap-2.5">
                      <button
                        onClick={() => handleCreateNotification('Draft')}
                        className="py-2.5 px-4 rounded-xl border border-border bg-bg-card hover:bg-bg-card-hover text-text-white text-xs font-bold transition text-center cursor-pointer"
                      >
                        Save Draft
                      </button>
                      <button
                        onClick={() => triggerToast('Generating live browser simulation preview...')}
                        className="py-2.5 px-4 rounded-xl border border-border bg-bg-card hover:bg-bg-card-hover text-text-white text-xs font-bold transition text-center"
                      >
                        Preview Draft
                      </button>
                    </div>

                    <div className="flex gap-2.5">
                      {composerSchedule === 'later' ? (
                        <button
                          onClick={() => handleCreateNotification('Scheduled')}
                          className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition text-center shadow-xs cursor-pointer"
                        >
                          Schedule
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCreateNotification('Sent')}
                          className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition text-center shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <PaperAirplaneIcon className="w-3.5 h-3.5" />
                          Send Notification
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Inspector Drawer (Timeline lifecycle details) */}
      {isInspectorOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 overflow-hidden text-xs" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div
              onClick={() => setIsInspectorOpen(false)}
              className="absolute inset-0 bg-bg-dark/65 backdrop-blur-xs transition-opacity animate-fade-in"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-bg-card border-l border-border text-text-gray shadow-2xl transition-all duration-300 animate-slide-left">
                <div className="flex h-full flex-col overflow-y-auto">
                  {/* Header */}
                  <div className="bg-bg-dark-secondary/60 border-b border-border px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-text-white font-heading tracking-tight">
                        Campaign Analytics Inspector
                      </h2>
                      <p className="text-[10px] text-text-muted mt-0.5 font-mono">Campaign ID: {selectedCampaign.id}</p>
                    </div>
                    <button
                      onClick={() => setIsInspectorOpen(false)}
                      className="rounded-xl border border-border p-1.5 hover:bg-bg-dark hover:text-text-white transition"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                    {/* Status & summary */}
                    <div className="space-y-2 border-b border-border pb-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          selectedCampaign.type === 'Security' ? 'bg-red-500/10 text-red-400 border border-red-500/15' :
                          'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                        }`}>
                          {selectedCampaign.type}
                        </span>
                        <span className="text-[10px] text-text-muted font-bold uppercase">{selectedCampaign.status}</span>
                      </div>
                      <h3 className="text-sm font-extrabold text-text-white font-heading leading-snug">{selectedCampaign.title}</h3>
                      <p className="text-[11px] text-text-muted bg-bg-dark-secondary/50 border border-border p-3.5 rounded-xl leading-relaxed">
                        {selectedCampaign.message}
                      </p>
                    </div>

                    {/* Notification Specs */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Audience Targeting</span>
                      <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 space-y-3 text-xs">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Target Segment</span>
                          <span className="font-bold text-text-white">{selectedCampaign.audience}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Delivery Channels</span>
                          <div className="flex gap-1">
                            {selectedCampaign.channels.map(ch => (
                              <span key={ch} className="px-1.5 rounded bg-bg-dark border border-border text-[9px] text-text-white font-bold">{ch}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Created Date</span>
                          <span className="text-text-white">{selectedCampaign.date}</span>
                        </div>
                        {selectedCampaign.scheduledTime && (
                          <div className="flex justify-between">
                            <span className="text-text-muted">Scheduled Time</span>
                            <span className="text-amber-400 font-bold">{selectedCampaign.scheduledTime}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notification Timeline Lifecycle */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Notification Timeline</span>
                      <div className="space-y-4 relative pl-5.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                        <div className="relative">
                          <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-bg-card" />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Draft Created</span>
                            <span className="text-[10px] text-text-muted block">Timestamp: {selectedCampaign.timeline.created || 'Completed'}</span>
                          </div>
                        </div>

                        <div className="relative">
                          <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-bg-card ${
                            selectedCampaign.status === 'Scheduled' ? 'bg-amber-400' : 'bg-primary'
                          }`} />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Scheduled Broadcast</span>
                            <span className="text-[10px] text-text-muted block">Timestamp: {selectedCampaign.timeline.scheduled || 'Completed'}</span>
                          </div>
                        </div>

                        <div className="relative">
                          <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-bg-card ${
                            selectedCampaign.status === 'Sending' ? 'bg-blue-400' : 'bg-primary'
                          }`} />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Sending Queue Dispatch</span>
                            <span className="text-[10px] text-text-muted block">Timestamp: {selectedCampaign.timeline.sending || 'Completed'}</span>
                          </div>
                        </div>

                        <div className="relative">
                          <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-bg-card ${
                            selectedCampaign.status === 'Delivered' ? 'bg-emerald-400' : 'bg-zinc-700'
                          }`} />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Delivered Broadcasts Packet</span>
                            <span className="text-[10px] text-text-muted block">Timestamp: {selectedCampaign.timeline.delivered || 'Completed'}</span>
                          </div>
                        </div>

                        <div className="relative">
                          <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-bg-card ${
                            selectedCampaign.status === 'Delivered' ? 'bg-emerald-400' : 'bg-zinc-700'
                          }`} />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Completed Campaign Session</span>
                            <span className="text-[10px] text-text-muted block">Timestamp: {selectedCampaign.timeline.completed || 'Completed'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="bg-bg-dark-secondary/60 border-t border-border px-6 py-5 flex items-center justify-between gap-3 shadow-2xl">
                    <button
                      onClick={() => setIsInspectorOpen(false)}
                      className="w-full py-2.5 rounded-xl border border-border bg-bg-card hover:bg-bg-card-hover text-text-white text-xs font-bold transition text-center"
                    >
                      Close Inspector
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export modals */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-xs">
          <div onClick={() => setShowExportModal(false)} className="absolute inset-0 bg-bg-dark/60 backdrop-blur-xs animate-fade-in" />
          <div className="relative bg-bg-card border border-border w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4 animate-scale-in">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Export Notification Logs</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Exporting: {exportReportType}</p>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Export filters matching audience <strong className="text-text-white">{appliedAudience}</strong> and type <strong className="text-text-white">{appliedType}</strong> will be serialized into standard CSV format.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                onClick={() => setShowExportModal(false)}
                className="text-[11px] font-bold text-text-muted hover:text-text-white px-3 py-1.5"
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowExportModal(false); triggerToast(`Export successful for: ${exportReportType}`); }}
                className="bg-primary hover:bg-primary-hover text-white px-4.5 py-2.5 rounded-xl text-xs font-bold transition shadow-xs"
              >
                Download dataset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
