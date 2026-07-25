import React, { useState, useMemo, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  FlagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
export interface Customer {
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
}

export interface CableSubscription {
  id: string;
  reference: string;
  customer: Customer;
  provider: 'DSTV' | 'GOtv' | 'Startimes';
  smartCardNumber: string;
  packageName: string;
  amount: number;
  costPrice: number;
  profit: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed';
  date: string;
  time: string;
  duration: string; // e.g. "1 Month"
  activationStatus: string; // e.g. "Completed" or "Reconciled"
  walletBefore: number;
  walletAfter: number;
  failureReason?: string;
  assignedAdmin?: string;
  timeline: {
    created: string;
    validated: string;
    processing: string;
    activated: string;
    completed: string;
  };
}

export interface CableProvider {
  name: 'DSTV' | 'GOtv' | 'Startimes';
  subCount: number;
  revenue: number;
  successRate: number;
  avgTime: string;
}

export interface PackagePlan {
  name: string;
  provider: 'DSTV' | 'GOtv' | 'Startimes';
  orders: number;
  revenue: number;
  growth: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  volume: number;
  successRate: number;
  failedRate: number;
  pendingRate: number;
  profit: number;
}

export interface AlertLog {
  id: string;
  title: string;
  desc: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
}

export interface ActivityEvent {
  id: number;
  text: string;
  time: string;
  icon: string;
  color: string;
}

// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_SUBSCRIPTIONS: CableSubscription[] = [
  {
    id: 'SWT-TV-10045',
    reference: 'REF-TV-DSTV-884019',
    customer: {
      name: 'Michael Anazodo',
      email: 'michael@example.com',
      phone: '+234 803 111 2222',
      avatarInitials: 'MA'
    },
    provider: 'DSTV',
    smartCardNumber: '1234567890',
    packageName: 'Compact',
    amount: 15700,
    costPrice: 15250,
    profit: 450,
    status: 'Success',
    date: '2026-06-20',
    time: '17:55:00',
    duration: '1 Month',
    activationStatus: 'Completed',
    walletBefore: 45000,
    walletAfter: 29300,
    timeline: {
      created: '17:54:10',
      validated: '17:54:20',
      processing: '17:54:40',
      activated: '17:54:55',
      completed: '17:55:00'
    }
  },
  {
    id: 'SWT-TV-10046',
    reference: 'REF-TV-GOTV-093841',
    customer: {
      name: 'Chidi Benson',
      email: 'chidi.b@example.com',
      phone: '+234 803 445 7821',
      avatarInitials: 'CB'
    },
    provider: 'GOtv',
    smartCardNumber: '7029184730',
    packageName: 'Max',
    amount: 6000,
    costPrice: 5750,
    profit: 250,
    status: 'Success',
    date: '2026-06-20',
    time: '17:10:00',
    duration: '1 Month',
    activationStatus: 'Completed',
    walletBefore: 12000,
    walletAfter: 6000,
    timeline: {
      created: '17:09:00',
      validated: '17:09:15',
      processing: '17:09:30',
      activated: '17:09:50',
      completed: '17:10:00'
    }
  },
  {
    id: 'SWT-TV-10047',
    reference: 'REF-TV-ST-882039',
    customer: {
      name: 'Amara Okafor',
      email: 'amara.o@example.com',
      phone: '+234 810 984 5673',
      avatarInitials: 'AO'
    },
    provider: 'Startimes',
    smartCardNumber: '2084739182',
    packageName: 'Classic',
    amount: 3800,
    costPrice: 3650,
    profit: 150,
    status: 'Failed',
    date: '2026-06-20',
    time: '15:10:00',
    duration: '1 Month',
    activationStatus: 'Failed',
    walletBefore: 8500,
    walletAfter: 8500,
    failureReason: 'MultiChoice API reported: Smartcard number validation timeout.',
    assignedAdmin: 'Aliyu Bello',
    timeline: {
      created: '15:08:00',
      validated: '15:08:45',
      processing: '15:09:30',
      activated: '-',
      completed: '15:10:00'
    }
  },
  {
    id: 'SWT-TV-10048',
    reference: 'REF-TV-DSTV-119280',
    customer: {
      name: 'Tunde Bakare',
      email: 'tunde.b@example.com',
      phone: '+234 802 984 5673',
      avatarInitials: 'TB'
    },
    provider: 'DSTV',
    smartCardNumber: '1098473829',
    packageName: 'Premium',
    amount: 25000,
    costPrice: 24200,
    profit: 800,
    status: 'Pending',
    date: '2026-06-20',
    time: '16:50:00',
    duration: '1 Month',
    activationStatus: 'Pending',
    walletBefore: 85000,
    walletAfter: 60000,
    timeline: {
      created: '16:48:00',
      validated: '16:48:30',
      processing: '16:49:15',
      activated: '-',
      completed: '-'
    }
  },
  {
    id: 'SWT-TV-10049',
    reference: 'REF-TV-GOTV-102934',
    customer: {
      name: 'Fatima Musa',
      email: 'fatima.m@example.com',
      phone: '+234 903 234 5678',
      avatarInitials: 'FM'
    },
    provider: 'GOtv',
    smartCardNumber: '7039281746',
    packageName: 'Max',
    amount: 6000,
    costPrice: 5750,
    profit: 250,
    status: 'Reversed',
    date: '2026-06-19',
    time: '12:12:45',
    duration: '1 Month',
    activationStatus: 'Reclaimed',
    walletBefore: 15000,
    walletAfter: 15000,
    failureReason: 'Gateway Timeout. Auto-refund triggered.',
    assignedAdmin: 'System',
    timeline: {
      created: '12:11:30',
      validated: '12:11:45',
      processing: '12:12:10',
      activated: '12:12:35',
      completed: '12:12:45'
    }
  },
  {
    id: 'SWT-TV-10050',
    reference: 'REF-TV-ST-091823',
    customer: {
      name: 'Obinna Ani',
      email: 'obinna.a@example.com',
      phone: '+234 705 270 5119',
      avatarInitials: 'OA'
    },
    provider: 'Startimes',
    smartCardNumber: '2093847561',
    packageName: 'Basic',
    amount: 2600,
    costPrice: 2500,
    profit: 100,
    status: 'Success',
    date: '2026-06-19',
    time: '09:40:00',
    duration: '1 Month',
    activationStatus: 'Completed',
    walletBefore: 5000,
    walletAfter: 2400,
    timeline: {
      created: '09:38:00',
      validated: '09:38:30',
      processing: '09:39:15',
      activated: '09:39:35',
      completed: '09:40:00'
    }
  }
];

const PROVIDERS: CableProvider[] = [
  { name: 'DSTV', subCount: 18420, revenue: 31200000, successRate: 99.2, avgTime: '3.5s' },
  { name: 'GOtv', subCount: 15500, revenue: 18200000, successRate: 98.6, avgTime: '4.2s' },
  { name: 'Startimes', subCount: 8920, revenue: 5200000, successRate: 97.8, avgTime: '6.1s' }
];

const POPULAR_PACKAGES: PackagePlan[] = [
  { name: 'DSTV Compact', provider: 'DSTV', orders: 4200, revenue: 65940000, growth: '+12.4%' },
  { name: 'GOtv Max', provider: 'GOtv', orders: 6800, revenue: 40800000, growth: '+8.7%' },
  { name: 'Startimes Classic', provider: 'Startimes', orders: 2500, revenue: 9500000, growth: '-2.1%' }
];

const ALERTS: AlertLog[] = [
  { id: 'ALT-CB-01', title: 'Provider Downtime', desc: 'Startimes API Gateway connection refused (503 Service Unavailable).', severity: 'Critical', timestamp: '2m ago' },
  { id: 'ALT-CB-02', title: 'Slow Renewals', desc: 'DSTV bouquet synch delay. Activation queue latency spiking to 15s.', severity: 'High', timestamp: '15m ago' },
  { id: 'ALT-CB-03', title: 'Large Subscription Activity', desc: 'Unreconciled ledger warning: 3 transactions in pending state for > 1hr.', severity: 'Medium', timestamp: '1h ago' },
  { id: 'ALT-CB-04', title: 'High Failure Rate', desc: 'Multiple failed smartcard validations (Smartcard: 980128394) from user @chidi.', severity: 'Low', timestamp: '3h ago' }
];

const MONITORING_FEED: ActivityEvent[] = [
  { id: 1, text: 'Subscription Activated: SWT-TV-10045 successfully provisioned on DSTV Compact', time: 'Just now', icon: '📺', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { id: 2, text: 'Renewal Failed: SWT-TV-10047 smartcard verification time-out. Routed to failure queue', time: '4 mins ago', icon: '✕', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { id: 3, text: 'Provider Delay: MultiChoice gateway API response lag (12.8s)', time: '12 mins ago', icon: '⚠️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { id: 4, text: 'Refund Issued: Reversed charges (₦6,000) for @fatima on transaction SWT-TV-10049', time: '30 mins ago', icon: '🔄', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { id: 5, text: 'High Subscription Activity: DSTV bundle sales spikes (+32%) within Lekki server region', time: '1h ago', icon: '⚡', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
];

// Recharts Charts Data
const REVENUE_ANALYTICS = [
  { name: 'Mon', DSTV: 3500000, GOtv: 2100000, Startimes: 600000, Profit: 250000, SuccessCount: 520, VolumeCount: 6200000 },
  { name: 'Tue', DSTV: 4200000, GOtv: 2400000, Startimes: 700000, Profit: 310000, SuccessCount: 610, VolumeCount: 7300000 },
  { name: 'Wed', DSTV: 3900000, GOtv: 2200000, Startimes: 650000, Profit: 280000, SuccessCount: 580, VolumeCount: 6750000 },
  { name: 'Thu', DSTV: 4800000, GOtv: 2800000, Startimes: 800000, Profit: 340000, SuccessCount: 720, VolumeCount: 8400000 },
  { name: 'Fri', DSTV: 5200000, GOtv: 3100000, Startimes: 900000, Profit: 380000, SuccessCount: 790, VolumeCount: 9200000 },
  { name: 'Sat', DSTV: 6100000, GOtv: 3800000, Startimes: 1100000, Profit: 450000, SuccessCount: 910, VolumeCount: 11000000 },
  { name: 'Sun', DSTV: 4100000, GOtv: 2600000, Startimes: 750000, Profit: 290000, SuccessCount: 570, VolumeCount: 7450000 }
];

const PROVIDER_PIE = [
  { name: 'DSTV', value: 18420, color: '#3b82f6' },
  { name: 'GOtv', value: 15500, color: '#f59e0b' },
  { name: 'Startimes', value: 8920, color: '#06b6d4' }
];

const PACKAGE_PIE = [
  { name: 'Compact', value: 12400, color: '#3b82f6' },
  { name: 'Max', value: 14800, color: '#f59e0b' },
  { name: 'Classic', value: 6500, color: '#06b6d4' },
  { name: 'Premium', value: 5200, color: '#8b5cf6' },
  { name: 'Others', value: 3940, color: '#10b981' }
];

export default function AdminCableTVManagement() {
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [subscriptions, setSubscriptions] = useState<CableSubscription[]>(INITIAL_SUBSCRIPTIONS);
  const [alerts, setAlerts] = useState<AlertLog[]>(ALERTS);
  const [feedEvents, setFeedEvents] = useState<ActivityEvent[]>(MONITORING_FEED);
  const [popularPlans, setPopularPlans] = useState<PackagePlan[]>(POPULAR_PACKAGES);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');
  const [packageFilter, setPackageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Active applied filters (to simulate "Apply Filters" submit flow)
  const [appliedQuery, setAppliedQuery] = useState('');
  const [appliedProvider, setAppliedProvider] = useState('All');
  const [appliedPackage, setAppliedPackage] = useState('All');
  const [appliedStatus, setAppliedStatus] = useState('All');
  const [appliedMin, setAppliedMin] = useState('');
  const [appliedMax, setAppliedMax] = useState('');
  const [appliedStart, setAppliedStart] = useState('');
  const [appliedEnd, setAppliedEnd] = useState('');

  // Sorting / Pagination
  const [sortField, setSortField] = useState<'id' | 'amount' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected state / Drawer UI / Loader / Toasts
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([]);
  const [selectedSub, setSelectedSub] = useState<CableSubscription | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Packages list based on provider selection
  const dynamicPackages = useMemo(() => {
    if (providerFilter === 'DSTV') return ['Compact', 'Premium', 'Confam', 'Yanga'];
    if (providerFilter === 'GOtv') return ['Max', 'Supa', 'Jinja', 'Smallie'];
    if (providerFilter === 'Startimes') return ['Classic', 'Basic', 'Smart', 'Super'];
    return ['Compact', 'Premium', 'Max', 'Classic', 'Basic', 'Supa'];
  }, [providerFilter]);

  // Export options modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportReportType, setExportReportType] = useState('Daily Renewals');

  // Live timeline events update simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        { text: 'Subscription Activated: SWT-TV-10046 successfully provisioned on GOtv Max', icon: '📺', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
        { text: 'Renewal Failed: SWT-TV-10048 gateway validation rejection', icon: '✕', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
        { text: 'Provider Delay: DSTV API response spikes to 14.2s latency', icon: '⚠️', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const newEvent: ActivityEvent = {
        id: Date.now(),
        text: randomMsg.text,
        time: 'Just now',
        icon: randomMsg.icon,
        color: randomMsg.color
      };
      setFeedEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 18000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ─── FILTER & SORT LOGIC ──────────────────────────────────────────────────
  const handleApplyFilters = () => {
    setAppliedQuery(searchQuery);
    setAppliedProvider(providerFilter);
    setAppliedPackage(packageFilter);
    setAppliedStatus(statusFilter);
    setAppliedMin(minAmount);
    setAppliedMax(maxAmount);
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
    setCurrentPage(1);
    triggerToast('Filters applied successfully.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setProviderFilter('All');
    setPackageFilter('All');
    setStatusFilter('All');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');

    setAppliedQuery('');
    setAppliedProvider('All');
    setAppliedPackage('All');
    setAppliedStatus('All');
    setAppliedMin('');
    setAppliedMax('');
    setAppliedStart('');
    setAppliedEnd('');

    setCurrentPage(1);
    triggerToast('Filters reset successfully.');
  };

  const filteredSubs = useMemo(() => {
    return subscriptions.filter(s => {
      // Global Search
      const searchMatch = appliedQuery === '' || 
        s.id.toLowerCase().includes(appliedQuery.toLowerCase()) ||
        s.reference.toLowerCase().includes(appliedQuery.toLowerCase()) ||
        s.customer.name.toLowerCase().includes(appliedQuery.toLowerCase()) ||
        s.customer.email.toLowerCase().includes(appliedQuery.toLowerCase()) ||
        s.smartCardNumber.includes(appliedQuery);

      const providerMatch = appliedProvider === 'All' || s.provider === appliedProvider;
      const statusMatch = appliedStatus === 'All' || s.status === appliedStatus;
      const packageMatch = appliedPackage === 'All' || s.packageName === appliedPackage;

      // Amount Bounds
      const minA = appliedMin === '' ? 0 : parseFloat(appliedMin);
      const maxA = appliedMax === '' ? Infinity : parseFloat(appliedMax);
      const amountMatch = s.amount >= minA && s.amount <= maxA;

      // Date Range Bounds
      let dateMatch = true;
      if (appliedStart) {
        dateMatch = dateMatch && new Date(s.date) >= new Date(appliedStart);
      }
      if (appliedEnd) {
        dateMatch = dateMatch && new Date(s.date) <= new Date(appliedEnd);
      }

      return searchMatch && providerMatch && statusMatch && packageMatch && amountMatch && dateMatch;
    });
  }, [subscriptions, appliedQuery, appliedProvider, appliedPackage, appliedStatus, appliedMin, appliedMax, appliedStart, appliedEnd]);

  const sortedSubs = useMemo(() => {
    const sorted = [...filteredSubs];
    sorted.sort((a, b) => {
      if (sortField === 'id') {
        return sortDirection === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
      } else if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
    });
    return sorted;
  }, [filteredSubs, sortField, sortDirection]);

  const paginatedSubs = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedSubs.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedSubs, currentPage]);

  const totalPages = Math.ceil(sortedSubs.length / itemsPerPage);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setSubscriptions(INITIAL_SUBSCRIPTIONS);
      setFeedEvents(MONITORING_FEED);
      setPopularPlans(POPULAR_PACKAGES);
      setAlerts(ALERTS);
      setLoading(false);
      triggerToast('Database details refreshed.');
    }, 750);
  };

  // Row selections
  const handleSelectRow = (id: string) => {
    setSelectedSubIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedSubIds(paginatedSubs.map(s => s.id));
    } else {
      setSelectedSubIds([]);
    }
  };

  // Sorting Handler
  const handleSort = (field: 'id' | 'amount' | 'date') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Actions
  const handleRetry = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setSubscriptions(prev => prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'Success',
            activationStatus: 'Completed',
            failureReason: undefined,
            timeline: {
              ...s.timeline,
              activated: new Date().toLocaleTimeString(),
              completed: new Date().toLocaleTimeString()
            }
          };
        }
        return s;
      }));
      setLoading(false);
      triggerToast(`Re-dispatched renewal for ${id} successfully!`);
      setIsDrawerOpen(false);
    }, 1000);
  };

  const handleRefund = (id: string) => {
    setLoading(true);
    setTimeout(() => {
      setSubscriptions(prev => prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'Reversed',
            activationStatus: 'Reclaimed',
            failureReason: 'Refunded by administrator.'
          };
        }
        return s;
      }));
      setLoading(false);
      triggerToast(`Transaction ${id} reversed and refunded to user wallet.`);
      setIsDrawerOpen(false);
    }, 1000);
  };

  const handleFlag = (id: string) => {
    triggerToast(`Subscription ${id} has been flagged for audit review.`);
    setIsDrawerOpen(false);
  };

  // Bulk Actions
  const handleBulkRetry = () => {
    setLoading(true);
    setTimeout(() => {
      setSubscriptions(prev => prev.map(s => {
        if (selectedSubIds.includes(s.id) && s.status === 'Failed') {
          return {
            ...s,
            status: 'Success',
            activationStatus: 'Completed',
            failureReason: undefined,
            timeline: {
              ...s.timeline,
              activated: new Date().toLocaleTimeString(),
              completed: new Date().toLocaleTimeString()
            }
          };
        }
        return s;
      }));
      setSelectedSubIds([]);
      setLoading(false);
      triggerToast('Selected failed renewals re-dispatched.');
    }, 1200);
  };

  const handleBulkMarkReviewed = () => {
    setSelectedSubIds([]);
    triggerToast('Selected subscription logs marked as reviewed.');
  };

  const handleBulkArchive = () => {
    setSelectedSubIds([]);
    triggerToast('Selected subscriptions archived.');
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    triggerToast(`${label} copied to clipboard.`);
  };

  const failedQueue = useMemo(() => {
    return subscriptions.filter(s => s.status === 'Failed');
  }, [subscriptions]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark text-text-gray relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-bg-card border-l-4 border-primary text-text-white shadow-2xl px-5 py-3.5 rounded-r-xl flex items-center gap-3 animate-slide-in">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global Loader */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-bg-dark/40 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-bg-card border border-border p-5 rounded-2xl flex flex-col items-center gap-3 shadow-2xl">
            <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
            </svg>
            <span className="text-xs font-semibold text-text-white font-heading">Reconciling operations...</span>
          </div>
        </div>
      )}

      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header Checkmarks */}
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-text-muted font-medium">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            DSTV Integration: Online
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            GOtv Integration: Online
          </span>
          <span className="flex items-center gap-1.5 text-red-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Startimes Integration: Degraded
          </span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-text-white font-heading tracking-tight">
              Cable TV Management
            </h1>
            <p className="text-xs text-text-muted mt-1">
              Monitor subscriptions, track renewals, manage delivery issues, and oversee provider performance.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={() => { setExportReportType('Daily Renewals'); setShowExportModal(true); }}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <ArrowDownTrayIcon className="w-4 h-4 text-text-muted" />
              Export Orders
            </button>
            <button
              onClick={() => { setExportReportType('Revenue Report'); setShowExportModal(true); }}
              className="flex items-center gap-2 text-xs font-semibold text-text-white bg-bg-card border border-border hover:border-border-hover hover:bg-bg-card-hover px-4 py-2.5 rounded-xl transition-all duration-200"
            >
              <DocumentTextIcon className="w-4 h-4 text-text-muted" />
              Generate Report
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(59,130,246,0.3)] transition-all duration-200"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI overview Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Subs */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Total Subscriptions</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">42,840</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">+11%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-primary opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,22 Q15,8 30,18 T60,28 T90,8 L100,12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 2: Total Volume */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Subscription Volume</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-text-white font-heading">₦54.60M</span>
              <span className="text-[10px] font-semibold text-emerald-400">+14.2%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-emerald-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,25 Q20,10 40,20 T70,5 T100,10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 3: Success Rate */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Successful Renewals</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">98.9%</span>
              <span className="text-[10px] font-semibold text-emerald-400">+0.3%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-emerald-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <line x1="0" y1="15" x2="100" y2="15" stroke="currentColor" strokeWidth="1.8" strokeDasharray="3 2" />
              </svg>
            </div>
          </div>

          {/* Card 4: Failed Rate */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Failed Renewals</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">0.9%</span>
              <span className="text-[10px] font-semibold text-red-400">-0.2%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-red-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,5 Q30,22 60,8 T100,25" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Card 5: Pending Queue */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Pending Renewals</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold text-text-white font-heading">0.2%</span>
              <span className="text-[9px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-amber-400 opacity-60 animate-pulse" viewBox="0 0 100 30" fill="none">
                <path d="M0,15 L20,15 L40,10 L60,20 L80,15 L100,15" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>

          {/* Card 6: Platform Net Profit */}
          <div className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-2 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 group">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Platform Profit</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-extrabold text-text-white font-heading">₦3.82M</span>
              <span className="text-[10px] font-semibold text-cyan-400">+7.8%</span>
            </div>
            <div className="h-5">
              <svg className="w-full h-full text-cyan-400 opacity-60" viewBox="0 0 100 30" fill="none">
                <path d="M0,25 L30,18 L60,10 L90,2 L100,4" stroke="currentColor" strokeWidth="1.8" />
              </svg>
            </div>
          </div>
        </div>

        {/* Management Controls */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Global Search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by Transaction ID, User profile, Smart Card number, Subscription reference..."
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
                onClick={() => { setExportReportType('Daily Renewals'); setShowExportModal(true); }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => { setExportReportType('Revenue Report'); setShowExportModal(true); }}
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
              {/* Provider Selection */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Provider</label>
                <select
                  value={providerFilter}
                  onChange={e => { setProviderFilter(e.target.value); setPackageFilter('All'); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Providers</option>
                  <option value="DSTV">DSTV</option>
                  <option value="GOtv">GOtv</option>
                  <option value="Startimes">Startimes</option>
                </select>
              </div>

              {/* Package Selector */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Package</label>
                <select
                  value={packageFilter}
                  onChange={e => setPackageFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Packages</option>
                  {dynamicPackages.map(pkg => (
                    <option key={pkg} value={pkg}>{pkg}</option>
                  ))}
                </select>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Reversed">Reversed</option>
                </select>
              </div>

              {/* Amount Range */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Amount Bounds (₦)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minAmount}
                    onChange={e => setMinAmount(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-bg-dark-secondary text-text-white border border-border rounded-lg placeholder:text-text-muted focus:outline-hidden"
                  />
                  <span className="text-[10px] text-text-muted font-bold">to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={e => setMaxAmount(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 bg-bg-dark-secondary text-text-white border border-border rounded-lg placeholder:text-text-muted focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-[9px] font-bold text-text-muted uppercase mb-1">Date Range</label>
                <div className="flex items-center gap-1.5">
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

        {/* Bulk Actions Panel */}
        {selectedSubIds.length > 0 && (
          <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-[fadeIn_.2s_ease]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-extrabold text-white">
                {selectedSubIds.length}
              </span>
              <span className="text-xs font-bold text-text-white">Selected subscriptions for administrative action</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleBulkRetry}
                className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-semibold transition"
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
                onClick={() => { setExportReportType('Custom Report'); setShowExportModal(true); }}
                className="px-3.5 py-1.5 rounded-lg bg-bg-dark border border-border text-text-white text-[11px] font-semibold transition hover:bg-bg-card-hover"
              >
                Generate Report
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

        {/* Cable TV Transactions Table */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto relative">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="sticky top-0 bg-bg-dark-secondary z-10 border-b border-border">
                <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  <th className="py-4 px-4 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={paginatedSubs.length > 0 && paginatedSubs.every(s => selectedSubIds.includes(s.id))}
                      className="rounded border-border focus:ring-primary text-primary"
                    />
                  </th>
                  <th className="py-4 px-4 cursor-pointer select-none" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">
                      Subscription ID
                      {sortField === 'id' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4">User</th>
                  <th className="py-4 px-4">Provider</th>
                  <th className="py-4 px-4">Smart Card</th>
                  <th className="py-4 px-4">Package</th>
                  <th className="py-4 px-4 text-right cursor-pointer select-none" onClick={() => handleSort('amount')}>
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      {sortField === 'amount' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                    </div>
                  </th>
                  <th className="py-4 px-4 text-right">Profit</th>
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
                {paginatedSubs.length > 0 ? (
                  paginatedSubs.map(s => {
                    const isSelected = selectedSubIds.includes(s.id);
                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-bg-card-hover/40 transition-colors ${
                          isSelected ? 'bg-primary/5 hover:bg-primary/10' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(s.id)}
                            className="rounded border-border focus:ring-primary text-primary"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text-white">{s.id}</td>
                        <td className="py-3.5 px-4">
                          <div>
                            <span className="font-semibold text-text-white block">{s.customer.name}</span>
                            <span className="text-[10px] text-text-muted block">{s.customer.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.provider === 'DSTV' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            s.provider === 'GOtv' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          }`}>
                            {s.provider}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1 font-mono text-text-white">
                            <span>{s.smartCardNumber}</span>
                            <button
                              onClick={() => handleCopyText(s.smartCardNumber, 'Smart Card Number')}
                              className="text-text-muted hover:text-text-white transition p-0.5 rounded"
                              title="Copy smartcard ID"
                            >
                              <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-text-white">{s.packageName}</td>
                        <td className="py-3.5 px-4 text-right font-extrabold text-text-white">
                          ₦{s.amount.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-emerald-400">
                          ₦{s.profit.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                            s.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            s.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            s.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            'bg-zinc-500/15 text-zinc-400 border border-zinc-500/20'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${
                              s.status === 'Success' ? 'bg-emerald-400' :
                              s.status === 'Pending' ? 'bg-amber-400' :
                              s.status === 'Failed' ? 'bg-red-400' :
                              'bg-zinc-400'
                            }`} />
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text-muted whitespace-nowrap">{s.date}</td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => { setSelectedSub(s); setIsDrawerOpen(true); }}
                              className="p-1 px-2.5 rounded-lg border border-border hover:border-border-hover text-text-muted hover:text-text-white hover:bg-bg-dark transition text-[11px] font-semibold"
                            >
                              View
                            </button>
                            {s.status === 'Failed' && (
                              <button
                                onClick={() => handleRetry(s.id)}
                                className="p-1 px-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-[11px] font-bold transition shadow-xs"
                              >
                                Retry
                              </button>
                            )}
                            <button
                              onClick={() => triggerToast(`Receipt generated for transaction ${s.id}`)}
                              className="p-1 rounded-lg border border-border hover:bg-bg-dark text-text-muted hover:text-text-white transition"
                              title="Print customer receipt"
                            >
                              <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-text-muted">
                      <ExclamationTriangleIcon className="w-8 h-8 mx-auto text-text-muted mb-2 opacity-50" />
                      <span className="text-xs font-semibold block">No cable subscriptions found.</span>
                      <button
                        onClick={handleResetFilters}
                        className="mt-3.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition"
                      >
                        Reset filters parameters
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
                  {Math.min(currentPage * itemsPerPage, sortedSubs.length)}
                </span>{' '}
                of <span className="font-bold text-text-white">{sortedSubs.length}</span> entries
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

        {/* Failed Renewals Queue */}
        {failedQueue.length > 0 && (
          <div className="bg-bg-card border border-red-500/25 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">
                  Failed Renewals Queue
                </h3>
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Requires action
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="text-[10px] font-bold text-text-muted uppercase border-b border-border pb-2">
                    <th className="pb-2">Subscription ID</th>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Provider</th>
                    <th className="pb-2">Package</th>
                    <th className="pb-2">Failure Reason</th>
                    <th className="pb-2">Assigned Admin</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {failedQueue.map(item => (
                    <tr key={item.id} className="hover:bg-bg-dark-secondary/40 transition">
                      <td className="py-3 font-semibold text-text-white font-mono">{item.id}</td>
                      <td className="py-3">
                        <span className="font-medium text-text-white block">{item.customer.name}</span>
                      </td>
                      <td className="py-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15">
                          {item.provider}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-text-white">{item.packageName}</td>
                      <td className="py-3 text-red-400 max-w-[200px] truncate" title={item.failureReason}>
                        {item.failureReason}
                      </td>
                      <td className="py-3 font-medium text-text-muted">{item.assignedAdmin || 'Unassigned'}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRetry(item.id)}
                            className="px-2.5 py-1 rounded bg-primary hover:bg-primary-hover text-white text-[10px] font-bold transition"
                          >
                            Retry
                          </button>
                          <button
                            onClick={() => handleRefund(item.id)}
                            className="px-2.5 py-1 rounded bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 text-[10px] font-semibold transition"
                          >
                            Refund
                          </button>
                          <button
                            onClick={() => triggerToast(`Investigating campaign issue for ${item.id}`)}
                            className="px-2.5 py-1 rounded border border-border text-text-white hover:bg-bg-dark text-[10px] font-semibold transition"
                          >
                            Investigate
                          </button>
                          <button
                            onClick={() => triggerToast(`Escalated order ${item.id} to engineering team`)}
                            className="px-2.5 py-1 rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 text-[10px] font-semibold transition"
                          >
                            Escalate
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

        {/* Revenue Analytics charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Revenue Trends & Profit Stack */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Subscription Revenue & Profit</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Daily breakdown of subscription billing vs margins</p>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-bold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Revenue</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Profit</span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₦${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#100f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ fontSize: '11px' }}
                    formatter={(value: any) => [`₦${value.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="VolumeCount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Volume (₦)" />
                  <Area type="monotone" dataKey="Profit" stroke="#06b6d4" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} name="Profit (₦)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Provider Market Share */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Provider Distribution</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Share of total subscription transactions count</p>
            </div>
            <div className="h-40 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PROVIDER_PIE}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PROVIDER_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-[9px] font-bold text-text-muted uppercase block">Total Subs</span>
                <span className="text-lg font-extrabold text-text-white font-heading">42,840</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-border pt-3.5 text-center text-[10px]">
              {PROVIDER_PIE.map(item => (
                <div key={item.name}>
                  <span className="text-text-white font-bold block">{item.name}</span>
                  <span className="text-text-muted block mt-0.5">
                    {((item.value / 42840) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 3: Renewal Volumes & Success Rates */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Success Rate vs volume Counts</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Daily subscription activation counts and gateway integrity percentages</p>
              </div>
              <span className="text-[10px] font-bold text-text-white flex items-center gap-1">
                <ChartBarIcon className="w-3.5 h-3.5 text-emerald-400" />
                Gateway success average: 98.9%
              </span>
            </div>

            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={REVENUE_ANALYTICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#100f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    labelStyle={{ color: '#ffffff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="SuccessCount" stroke="#10b981" strokeWidth={2.5} name="Successful Orders" dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Profit" stroke="#a855f7" strokeWidth={2} name="Net Yields" strokeDasharray="4 4" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Package Distribution */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Package Distribution Shares</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Volume shares distributed across top billing bouquets</p>
            </div>
            <div className="h-40 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PACKAGE_PIE}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PACKAGE_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center text-[10px]">
              {PACKAGE_PIE.map(item => (
                <div key={item.name} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-text-white font-semibold">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Operational Grid: Provider Dashboard & Package performance list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provider Performance Dashboard */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Provider Performance Dashboard</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Real-time status check and processing speeds</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {PROVIDERS.map(prov => (
                <div key={prov.name} className="bg-bg-card border border-border rounded-2xl p-4.5 space-y-3 flex flex-col justify-between hover:scale-102 transition-transform duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-text-white font-heading">{prov.name}</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded border ${
                      prov.successRate >= 98.5
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {prov.successRate >= 98.5 ? 'ONLINE' : 'DEGRADED'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-text-muted uppercase tracking-wider block">Success Rate</span>
                    <span className="text-base font-extrabold text-text-white font-heading">{prov.successRate}%</span>
                  </div>
                  <div className="border-t border-border/50 pt-2.5 space-y-1 text-[10px] text-text-muted font-medium">
                    <div className="flex justify-between">
                      <span>Avg Speed:</span>
                      <strong className="text-text-white font-bold">{prov.avgTime}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Volume:</span>
                      <strong className="text-text-white font-bold">₦{(prov.revenue / 1000000).toFixed(1)}M</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Renewals:</span>
                      <strong className="text-text-white font-bold">{prov.subCount.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Package Performance Section */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Package Performance Section</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Top performing bouquet packages by subscriber volume</p>
            </div>

            <div className="space-y-4">
              {popularPlans.map((pkg, index) => (
                <div key={pkg.name} className="flex items-center justify-between text-xs hover:bg-bg-dark-secondary/35 p-1 rounded transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-lg bg-bg-dark-secondary border border-border flex items-center justify-center text-[10px] font-bold text-text-muted">
                      #{index + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-text-white block">{pkg.name}</span>
                      <span className="text-[10px] text-text-muted block">{pkg.provider}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-text-white block">₦{(pkg.revenue / 1000000).toFixed(1)}M</span>
                    <span className="text-[10px] text-text-muted block">{pkg.orders.toLocaleString()} orders • <span className={pkg.growth.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>{pkg.growth}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Logs: Service Monitoring Feed & Alerts Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Monitoring Feed */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Service Monitoring Feed</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Live operational logs audit trail timeline</p>
              </div>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                Live Monitor
              </span>
            </div>

            <div className="space-y-4 pl-1">
              {feedEvents.map(event => (
                <div key={event.id} className="flex gap-3 text-xs items-start">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${event.color}`}>
                    {event.icon}
                  </span>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-text-white font-medium">{event.text}</p>
                    <span className="text-[10px] text-text-muted block">{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Center */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="border-b border-border pb-3">
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Alerts Center</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Active operational warnings and gateway delays</p>
            </div>

            <div className="space-y-3">
              {alerts.map(alt => (
                <div
                  key={alt.id}
                  className={`p-3.5 border rounded-xl space-y-1.5 transition hover:-translate-y-0.5 duration-200 ${
                    alt.severity === 'Critical' ? 'bg-red-500/5 border-red-500/20' :
                    alt.severity === 'High' ? 'bg-amber-500/5 border-amber-500/20' :
                    'bg-bg-dark-secondary border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-white font-heading">{alt.title}</span>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${
                      alt.severity === 'Critical' ? 'bg-red-500/15 text-red-400' :
                      alt.severity === 'High' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-zinc-700/30 text-zinc-300'
                    }`}>
                      {alt.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-relaxed">{alt.desc}</p>
                  <div className="flex items-center justify-between text-[9px] text-text-muted pt-1">
                    <span>{alt.id}</span>
                    <span>{alt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Center widget */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Export Center</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Quickly compile and download aggregated operations datasets</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
            {[
              { name: 'Daily Renewals', desc: 'Current 24h subscription logs' },
              { name: 'Provider Report', desc: 'API speeds & volume analytics' },
              { name: 'Revenue Report', desc: 'Revenue margins and net yields' },
              { name: 'Package Report', desc: 'Ranked bouquet plans counts' },
              { name: 'Custom Report', desc: 'Export logs by specific dates' }
            ].map(card => (
              <div key={card.name} className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4.5 flex flex-col justify-between space-y-3.5 hover:scale-102 transition-transform duration-200">
                <div>
                  <span className="font-bold text-text-white block">{card.name}</span>
                  <span className="text-[10px] text-text-muted block mt-0.5 leading-relaxed">{card.desc}</span>
                </div>
                <div className="flex items-center gap-1.5 border-t border-border/50 pt-2.5">
                  <button
                    onClick={() => triggerToast(`Composed details draft for ${card.name}`)}
                    className="flex-1 py-1 rounded bg-bg-card hover:bg-bg-card-hover border border-border text-text-white text-[10px] font-bold transition"
                  >
                    Generate
                  </button>
                  <button
                    onClick={() => triggerToast(`Downloaded dataset file: SWT_REPORT_${card.name.toUpperCase().replace(' ', '_')}.csv`)}
                    className="py-1 px-2 rounded bg-primary hover:bg-primary-hover text-white text-[10px] font-bold transition"
                    title="Download File"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Subscription Details Slide-over Drawer */}
      {isDrawerOpen && selectedSub && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div
              onClick={() => setIsDrawerOpen(false)}
              className="absolute inset-0 bg-bg-dark/65 backdrop-blur-xs transition-opacity"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform bg-bg-card border-l border-border text-text-gray shadow-2xl transition-all duration-300 animate-slide-left">
                <div className="flex h-full flex-col overflow-y-auto">
                  {/* Drawer Header */}
                  <div className="bg-bg-dark-secondary/60 border-b border-border px-6 py-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-text-white font-heading tracking-tight">
                        Subscription details
                      </h2>
                      <p className="text-[10px] text-text-muted mt-0.5 font-mono">Reference: {selectedSub.reference}</p>
                    </div>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="rounded-xl border border-border p-1.5 hover:bg-bg-dark hover:text-text-white transition text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Drawer Body Content */}
                  <div className="flex-1 p-6 space-y-6">
                    {/* Subscription Summary */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Subscription Summary</span>
                      <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Subscription ID</span>
                          <span className="font-bold text-text-white">{selectedSub.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Reference</span>
                          <span className="font-mono text-text-white">{selectedSub.reference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Created Time</span>
                          <span className="text-text-white">{selectedSub.date} at {selectedSub.time}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-border/30">
                          <span className="text-text-muted">Status</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                            selectedSub.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' :
                            selectedSub.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-red-500/10 text-red-400'
                          }`}>
                            {selectedSub.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Customer Details</span>
                      <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 flex gap-3 text-xs">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center font-extrabold text-primary shrink-0">
                          {selectedSub.customer.avatarInitials}
                        </div>
                        <div className="space-y-1">
                          <span className="font-bold text-text-white block">{selectedSub.customer.name}</span>
                          <span className="text-text-muted block font-mono">{selectedSub.customer.email}</span>
                          <span className="text-text-muted block">{selectedSub.customer.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Details */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Subscription Specifications</span>
                      <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Provider</span>
                          <span className="font-bold text-text-white">{selectedSub.provider}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Smart Card Number</span>
                          <span className="font-mono text-text-white">{selectedSub.smartCardNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Package Bouquet</span>
                          <span className="font-semibold text-text-white">{selectedSub.packageName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Renewal Duration</span>
                          <span className="text-text-white">{selectedSub.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Activation Status</span>
                          <span className="text-text-white">{selectedSub.activationStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financial Details */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Financial Details</span>
                      <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Cost Price</span>
                          <span className="text-text-white">₦{selectedSub.costPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Selling Price</span>
                          <span className="font-bold text-text-white">₦{selectedSub.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-border/30 pt-1.5">
                          <span className="text-emerald-400 font-bold">Net Profit</span>
                          <span className="font-extrabold text-emerald-400">₦{selectedSub.profit.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-border/30">
                          <span className="text-text-muted">User Wallet Before</span>
                          <span className="font-mono text-text-white">₦{selectedSub.walletBefore.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">User Wallet After</span>
                          <span className="font-mono text-text-white">₦{selectedSub.walletAfter.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Processing Timeline */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Processing Timeline Audit</span>
                      <div className="space-y-4 relative pl-5.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                        <div className="relative">
                          <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-bg-card" />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Created</span>
                            <span className="text-[10px] text-text-muted block">{selectedSub.timeline.created}</span>
                          </div>
                        </div>

                        <div className="relative">
                          <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-bg-card" />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Validated</span>
                            <span className="text-[10px] text-text-muted block">{selectedSub.timeline.validated}</span>
                          </div>
                        </div>

                        <div className="relative">
                          <span className="absolute -left-5 top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-bg-card" />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Processing</span>
                            <span className="text-[10px] text-text-muted block">{selectedSub.timeline.processing}</span>
                          </div>
                        </div>

                        <div className="relative">
                          <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-bg-card ${
                            selectedSub.status === 'Success' ? 'bg-emerald-400' : 'bg-amber-400'
                          }`} />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Activated</span>
                            <span className="text-[10px] text-text-muted block">{selectedSub.timeline.activated}</span>
                          </div>
                        </div>

                        <div className="relative">
                          <span className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-bg-card ${
                            selectedSub.status === 'Success' ? 'bg-emerald-400' : 'bg-red-400'
                          }`} />
                          <div className="text-xs">
                            <span className="font-bold text-text-white block">Completed</span>
                            <span className="text-[10px] text-text-muted block">{selectedSub.timeline.completed}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="bg-bg-dark-secondary/60 border-t border-border px-6 py-5 flex items-center justify-between gap-2.5">
                    <button
                      onClick={() => triggerToast(`Receipt generated for subscription ${selectedSub.id}`)}
                      className="flex-1 py-2.5 rounded-xl border border-border bg-bg-card hover:bg-bg-card-hover text-text-white text-xs font-bold transition text-center"
                    >
                      View Receipt
                    </button>
                    {selectedSub.status === 'Failed' && (
                      <button
                        onClick={() => handleRetry(selectedSub.id)}
                        className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition text-center"
                      >
                        Retry Renewal
                      </button>
                    )}
                    <button
                      onClick={() => handleFlag(selectedSub.id)}
                      className="py-2.5 px-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      title="Flag Subscription"
                    >
                      <FlagIcon className="w-3.5 h-3.5" />
                      Flag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Center Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowExportModal(false)} className="absolute inset-0 bg-bg-dark/60 backdrop-blur-xs animate-fade-in" />
          <div className="relative bg-bg-card border border-border w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4 animate-scale-in">
            <div>
              <h3 className="font-extrabold text-text-white text-sm font-heading tracking-tight">Export aggregated data</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Exporting: {exportReportType}</p>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Export filters matching provider <strong className="text-text-white">{appliedProvider}</strong> and package <strong className="text-text-white">{appliedPackage}</strong> will be serialized into standard CSV format.
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
