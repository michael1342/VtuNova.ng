import React, { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import type { AdminActivityEvent as ActivityEvent } from '../../interface/admin-orders.interface';
import type { PendingAdjustment, SecurityLog, WalletAccount } from '../../interface/admin.interface';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_WALLETS: WalletAccount[] = [
  {
    id: 'SWT-001245',
    user: 'Michael Anazodo',
    email: 'michael@example.com',
    phone: '+234 803 111 2222',
    availableBalance: 150000,
    reservedBalance: 0,
    totalFunding: 620000,
    status: 'Active',
    lastActivity: 'Today • 11:45 AM',
    joinedDate: '2025-06-10',
    avatarInitials: 'MA',
    fundingCount: 24,
    averageFunding: 25830,
    largestFunding: 100000,
    totalSpending: 470000,
    spendingSuccessRate: 99.4
  },
  {
    id: 'SWT-001246',
    user: 'Chidi Benson',
    email: 'chidi.b@example.com',
    phone: '+234 803 445 7821',
    availableBalance: 87500,
    reservedBalance: 2500,
    totalFunding: 450000,
    status: 'Active',
    lastActivity: 'Today • 10:30 AM',
    joinedDate: '2025-06-12',
    avatarInitials: 'CB',
    fundingCount: 18,
    averageFunding: 25000,
    largestFunding: 80000,
    totalSpending: 360000,
    spendingSuccessRate: 98.7
  },
  {
    id: 'SWT-001247',
    user: 'Amara Okafor',
    email: 'amara.o@example.com',
    phone: '+234 810 984 5673',
    availableBalance: 245000,
    reservedBalance: 5000,
    totalFunding: 1200000,
    status: 'Active',
    lastActivity: 'Today • 09:15 AM',
    joinedDate: '2025-09-18',
    avatarInitials: 'AO',
    fundingCount: 52,
    averageFunding: 23076,
    largestFunding: 150000,
    totalSpending: 950000,
    spendingSuccessRate: 99.8
  },
  {
    id: 'SWT-001248',
    user: 'Tunde Bakare',
    email: 'tunde.b@example.com',
    phone: '+234 802 984 5673',
    availableBalance: 4500,
    reservedBalance: 0,
    totalFunding: 150000,
    status: 'Active',
    lastActivity: 'Yesterday • 04:22 PM',
    joinedDate: '2025-11-04',
    avatarInitials: 'TB',
    fundingCount: 12,
    averageFunding: 12500,
    largestFunding: 30000,
    totalSpending: 145500,
    spendingSuccessRate: 97.4
  },
  {
    id: 'SWT-001249',
    user: 'Fatima Musa',
    email: 'fatima.m@example.com',
    phone: '+234 903 234 5678',
    availableBalance: 87000,
    reservedBalance: 0,
    totalFunding: 380000,
    status: 'Active',
    lastActivity: 'Today • 02:10 PM',
    joinedDate: '2025-12-15',
    avatarInitials: 'FM',
    fundingCount: 15,
    averageFunding: 25333,
    largestFunding: 50000,
    totalSpending: 293000,
    spendingSuccessRate: 99.1
  },
  {
    id: 'SWT-001250',
    user: 'Obinna Ani',
    email: 'obinna.a@example.com',
    phone: '+234 705 270 5119',
    availableBalance: 12000,
    reservedBalance: 15000,
    totalFunding: 110000,
    status: 'Frozen',
    lastActivity: 'Yesterday • 12:40 PM',
    joinedDate: '2026-02-10',
    avatarInitials: 'OA',
    fundingCount: 6,
    averageFunding: 18333,
    largestFunding: 40000,
    totalSpending: 83000,
    spendingSuccessRate: 95.2
  },
  {
    id: 'SWT-001251',
    user: 'Aisha Yusuf',
    email: 'aisha.y@example.com',
    phone: '+234 803 112 3456',
    availableBalance: 320000,
    reservedBalance: 0,
    totalFunding: 1850000,
    status: 'Active',
    lastActivity: 'Today • 03:02 PM',
    joinedDate: '2026-03-01',
    avatarInitials: 'AY',
    fundingCount: 44,
    averageFunding: 42045,
    largestFunding: 200000,
    totalSpending: 1530000,
    spendingSuccessRate: 99.6
  },
  {
    id: 'SWT-001252',
    user: 'David Mark',
    email: 'david.m@example.com',
    phone: '+234 812 345 6789',
    availableBalance: 0,
    reservedBalance: 0,
    totalFunding: 35000,
    status: 'Restricted',
    lastActivity: 'Yesterday • 09:12 AM',
    joinedDate: '2026-05-20',
    avatarInitials: 'DM',
    fundingCount: 3,
    averageFunding: 11666,
    largestFunding: 20000,
    totalSpending: 35000,
    spendingSuccessRate: 96.0
  }
];

const INITIAL_PENDING_ADJUSTMENTS: PendingAdjustment[] = [
  { id: 'ADJ-101', userId: 'SWT-001247', user: 'Amara Okafor', email: 'amara.o@example.com', actionType: 'Credit', amount: 75000, reason: 'Promotional agent tier bonus deposit.', reference: 'REF-ADJ-99201', submitted: '2026-06-20', status: 'Pending' },
  { id: 'ADJ-102', userId: 'SWT-001248', user: 'Tunde Bakare', email: 'tunde.b@example.com', actionType: 'Refund', amount: 15000, reason: 'Failed electricity metering claim reversal.', reference: 'REF-ADJ-99202', submitted: '2026-06-20', status: 'Pending' },
  { id: 'ADJ-103', userId: 'SWT-001250', user: 'Obinna Ani', email: 'obinna.a@example.com', actionType: 'Debit', amount: 15000, reason: 'Reconciliation of erroneous dual credit transfer.', reference: 'REF-ADJ-99203', submitted: '2026-06-19', status: 'Pending' }
];

const INITIAL_SECURITY_LOGS: SecurityLog[] = [
  { id: 'SEC-W-01', type: 'Large Adjustment Request', details: 'Manual credit request of ₦75,000 for SWT-001247 by Chidera Obi.', riskLevel: 'Medium', timestamp: 'Today • 02:44 PM', admin: 'Chidera Obi' },
  { id: 'SEC-W-02', type: 'Wallet Balance Frozen', details: 'SWT-001250 was frozen due to multiple rapid bank transfers.', riskLevel: 'High', timestamp: 'Yesterday • 12:40 PM', admin: 'Automated System' },
  { id: 'SEC-W-03', type: 'Risky Adjustment Attempt', details: 'Debit correction of ₦150,000 requested for restricted wallet SWT-001252.', riskLevel: 'Critical', timestamp: '2 days ago', admin: 'Aliyu Bello' }
];

const FUNDING_TIMELINE_EVENTS: ActivityEvent[] = [
  { id: 1, text: 'User Funded Wallet: @amara funded ₦150,000 via Card', time: 'Just now', icon: '💳', color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 2, text: 'Admin Adjusted Account: SWT-001245 credited ₦5,000 (Refund)', time: '12 mins ago', icon: '🔧', color: 'text-blue-400 bg-blue-500/10' },
  { id: 3, text: 'Wallet Frozen: SWT-001250 status set to Frozen by system security check', time: '45 mins ago', icon: '❄️', color: 'text-red-400 bg-red-500/10' },
  { id: 4, text: 'Refund Approved: ₦1,500 credited to @obinna for failed Data order', time: '1 hour ago', icon: '🔄', color: 'text-cyan-400 bg-cyan-500/10' }
];

// Charts Mock Data
const FUNDING_TRENDS_DATA = [
  { name: 'Mon', Card: 2400000, Transfer: 1800000, USSD: 400000 },
  { name: 'Tue', Card: 3100000, Transfer: 2200000, USSD: 600000 },
  { name: 'Wed', Card: 2800000, Transfer: 1900000, USSD: 500000 },
  { name: 'Thu', Card: 3500000, Transfer: 2400000, USSD: 800000 },
  { name: 'Fri', Card: 4200000, Transfer: 2800000, USSD: 900000 },
  { name: 'Sat', Card: 4800000, Transfer: 3200000, USSD: 1100000 },
  { name: 'Sun', Card: 3900000, Transfer: 2600000, USSD: 700000 }
];

const BALANCE_DISTRIBUTION_DATA = [
  { name: '₦0 - ₦5k', Accounts: 2400 },
  { name: '₦5k - ₦20k', Accounts: 4800 },
  { name: '₦20k - ₦100k', Accounts: 3900 },
  { name: '₦100k+', Accounts: 1740 }
];

const ADJUSTMENT_VOLUME_DATA = [
  { name: 'Jun 15', Credit: 180000, Debit: 45000 },
  { name: 'Jun 16', Credit: 240000, Debit: 80000 },
  { name: 'Jun 17', Credit: 95000, Debit: 30000 },
  { name: 'Jun 18', Credit: 150000, Debit: 15000 },
  { name: 'Jun 19', Credit: 350000, Debit: 95000 },
  { name: 'Jun 20', Credit: 280000, Debit: 120000 }
];

const FUNDING_METHOD_PIE = [
  { name: 'Bank Transfer', value: 48300000, color: '#3b82f6' },
  { name: 'Card Checkout', value: 31200000, color: '#06b6d4' },
  { name: 'USSD Payment', value: 4800000, color: '#f59e0b' }
];

export default function AdminWalletManagement() {
  
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [wallets, setWallets] = useState<WalletAccount[]>(INITIAL_WALLETS);
  const [pendingQueue, setPendingQueue] = useState<PendingAdjustment[]>(INITIAL_PENDING_ADJUSTMENTS);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(INITIAL_SECURITY_LOGS);
  const [timelineEvents, setTimelineEvents] = useState(FUNDING_TIMELINE_EVENTS);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');
  const [adjustmentTypeFilter, setAdjustmentTypeFilter] = useState('All');

  // Sorting / Pagination
  const [sortField, setSortField] = useState<'availableBalance' | 'totalFunding' | 'lastActivity'>('availableBalance');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected state / UI Toggle details
  const [selectedWallet, setSelectedWallet] = useState<WalletAccount | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Adjustment Modal details
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustTargetUser, setAdjustTargetUser] = useState('');
  const [adjustType, setAdjustType] = useState<'Credit' | 'Debit' | 'Refund' | 'Correction'>('Credit');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [adjustRef, setAdjustRef] = useState('');
  const [confirmNoticeChecked, setConfirmNoticeChecked] = useState(false);

  // Export Modal trigger
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'csv' | 'pdf'>('csv');

  // Helper Toast notification trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Activity events update simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const liveActions = [
        { text: 'User Funded Wallet: @fatima added ₦12,500 using Paystack', icon: '💳', color: 'text-emerald-400 bg-emerald-500/10' },
        { text: 'Admin Adjusted Account: SWT-001246 debited ₦2,500 (Correction)', icon: '🔧', color: 'text-blue-400 bg-blue-500/10' },
        { text: 'Wallet Restricted: SWT-001252 status set to Restricted by Admin auditor', icon: '🔒', color: 'text-red-400 bg-red-500/10' }
      ];
      const randomAct = liveActions[Math.floor(Math.random() * liveActions.length)];
      const newEvent: ActivityEvent = {
        id: Date.now(),
        text: randomAct.text,
        time: 'Just now',
        icon: randomAct.icon,
        color: randomAct.color
      };
      setTimelineEvents(prev => [newEvent, ...prev.slice(0, 3)]);
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  // ─── FILTER & SORT LOGIC ──────────────────────────────────────────────────
  const filteredWallets = useMemo(() => {
    return wallets.filter(wallet => {
      // Global Search
      const searchMatch = searchQuery === '' || 
        wallet.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wallet.phone.includes(searchQuery);

      // Status Filter
      const statusMatch = statusFilter === 'All' || wallet.status === statusFilter;

      // Balance range
      const minB = minBalance === '' ? 0 : parseFloat(minBalance);
      const maxB = maxBalance === '' ? Infinity : parseFloat(maxBalance);
      const balanceMatch = wallet.availableBalance >= minB && wallet.availableBalance <= maxB;

      // Method match (card vs transfer vs ussd is simulated as true unless looking at distributions)
      return searchMatch && statusMatch && balanceMatch;
    });
  }, [wallets, searchQuery, statusFilter, minBalance, maxBalance]);

  const sortedWallets = useMemo(() => {
    const sorted = [...filteredWallets];
    sorted.sort((a, b) => {
      if (sortField === 'availableBalance') {
        return sortDirection === 'asc' ? a.availableBalance - b.availableBalance : b.availableBalance - a.availableBalance;
      } else if (sortField === 'totalFunding') {
        return sortDirection === 'asc' ? a.totalFunding - b.totalFunding : b.totalFunding - a.totalFunding;
      } else {
        // Last Activity Sorting (Simple alpha check on last activity labels)
        return sortDirection === 'asc' 
          ? a.lastActivity.localeCompare(b.lastActivity) 
          : b.lastActivity.localeCompare(a.lastActivity);
      }
    });
    return sorted;
  }, [filteredWallets, sortField, sortDirection]);

  const paginatedWallets = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedWallets.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedWallets, currentPage]);

  const totalPages = Math.ceil(sortedWallets.length / itemsPerPage);

  // Controls reset
  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setMethodFilter('All');
    setMinBalance('');
    setMaxBalance('');
    setAdjustmentTypeFilter('All');
    setCurrentPage(1);
    triggerToast('Filters reset successfully.');
  };

  // Re-run simulator refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setWallets(INITIAL_WALLETS);
      setLoading(false);
      triggerToast('Wallet parameters updated.');
    }, 750);
  };

  // Drawer trigger freeze action
  const handleFreezeWallet = (id: string, newStatus: 'Active' | 'Frozen') => {
    setWallets(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
    
    // Add logs
    const targetWallet = wallets.find(w => w.id === id);
    if (targetWallet) {
      const newLog: SecurityLog = {
        id: `SEC-W-${Math.floor(Math.random() * 90) + 10}`,
        type: `Wallet ${newStatus}`,
        details: `Wallet SWT-${id.slice(-6)} set to ${newStatus} by Admin.`,
        riskLevel: newStatus === 'Frozen' ? 'High' : 'Low',
        timestamp: 'Just now',
        admin: 'Current Admin'
      };
      setSecurityLogs(prev => [newLog, ...prev]);
      triggerToast(`Account status set to ${newStatus} successfully.`);
    }

    setIsDrawerOpen(false);
  };

  // Adjustment Confirm Action
  const handleConfirmAdjustment = (e: React.FormEvent) => {
    e.preventDefault();

    const targetVal = parseFloat(adjustAmount);
    if (isNaN(targetVal) || targetVal <= 0) {
      triggerToast('Please enter a valid positive adjustment volume.');
      return;
    }

    if (!confirmNoticeChecked) {
      triggerToast('Please check the verification notice audit compliance box.');
      return;
    }

    // High amount needs Approval Queue if above 50,000
    if (targetVal >= 50000) {
      const newPending: PendingAdjustment = {
        id: `ADJ-${Math.floor(Math.random() * 900) + 100}`,
        userId: adjustTargetUser || 'SWT-001245',
        user: wallets.find(w => w.id === adjustTargetUser)?.user || 'Michael Anazodo',
        email: wallets.find(w => w.id === adjustTargetUser)?.email || 'michael@example.com',
        actionType: adjustType,
        amount: targetVal,
        reason: adjustReason,
        reference: adjustRef || `REF-ADJ-${Math.floor(Math.random() * 90000) + 10000}`,
        submitted: '2026-06-20',
        status: 'Pending'
      };

      setPendingQueue(prev => [newPending, ...prev]);

      // Add to security log alert
      const newSecLog: SecurityLog = {
        id: `SEC-W-${Math.floor(Math.random() * 900) + 100}`,
        type: 'Large Adjustment Requested',
        details: `Manual adjustment of ₦${targetVal.toLocaleString()} requested for ${newPending.user}.`,
        riskLevel: 'High',
        timestamp: 'Just now',
        admin: 'Current Admin'
      };
      setSecurityLogs(prev => [newSecLog, ...prev]);

      triggerToast('Adjustment requires supervisor review. Added to Pending Approvals Queue.');
    } else {
      // Under 50,000 executes immediately!
      setWallets(prev => prev.map(w => {
        if (w.id === adjustTargetUser) {
          const isCredit = adjustType === 'Credit' || adjustType === 'Refund';
          const newBal = isCredit 
            ? w.availableBalance + targetVal 
            : Math.max(w.availableBalance - targetVal, 0);
          return { 
            ...w, 
            availableBalance: newBal,
            totalFunding: isCredit ? w.totalFunding + targetVal : w.totalFunding,
            lastActivity: 'Just now • Adjusted' 
          };
        }
        return w;
      }));

      triggerToast(`Adjustment executed. ${adjustType}ed ₦${targetVal.toLocaleString()} to wallet balance.`);
    }

    // Reset Form
    setAdjustTargetUser('');
    setAdjustAmount('');
    setAdjustReason('');
    setAdjustRef('');
    setConfirmNoticeChecked(false);
    setShowAdjustModal(false);
  };

  // Queue Approval / Rejection
  const handleApproveAdjustment = (reqId: string, action: 'Approved' | 'Rejected') => {
    setPendingQueue(prev => prev.map(p => p.id === reqId ? { ...p, status: action } : p));
    
    const request = pendingQueue.find(p => p.id === reqId);
    if (request) {
      if (action === 'Approved') {
        setWallets(prev => prev.map(w => {
          if (w.id === request.userId) {
            const isCredit = request.actionType === 'Credit' || request.actionType === 'Refund';
            const newBal = isCredit 
              ? w.availableBalance + request.amount 
              : Math.max(w.availableBalance - request.amount, 0);
            return {
              ...w,
              availableBalance: newBal,
              totalFunding: isCredit ? w.totalFunding + request.amount : w.totalFunding,
              lastActivity: 'Just now • Approved ADJ'
            };
          }
          return w;
        }));
        triggerToast(`Adjustment Approved. Account credited/debited ₦${request.amount.toLocaleString()}.`);
      } else {
        triggerToast(`Adjustment Request ${reqId} rejected.`);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      
      {/* Toast Notice Feedback */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 border border-blue-400 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="text-xs font-bold font-heading">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-gray-200 text-sm">✕</button>
        </div>
      )}

      {/* Workspace Wrapper */}
      <main className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">

        {/* ─── PAGE HEADER ────────────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl p-6">
          <div>
            <h2 className="text-text-white font-heading font-extrabold text-2xl tracking-tight">Wallet Management</h2>
            <p className="text-text-gray text-xs sm:text-sm mt-1 max-w-2xl">
              Monitor balances, manage wallet operations, review funding activity, and control platform financial flows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setAdjustType('Credit'); setAdjustTargetUser(wallets[0]?.id || ''); setShowAdjustModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Adjust Wallet
            </button>
            <button
              onClick={() => { setExportType('csv'); setShowExportModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              Export Report
            </button>
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-1.5 px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl shadow-xs transition-colors ${loading ? 'opacity-55 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ─── KPI OVERVIEW CARDS ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Wallet Balance */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Wallet Bal</span>
              <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold">₦</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦82,450,000</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+9% vs last wk</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L10,8 L20,12 L30,5 L40,7 L50,2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Today's Funding */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Today's Funding</span>
              <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
                <CreditCardIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦5,200,000</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">1,824 events</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,14 L12,10 L24,5 L36,7 L50,1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Monthly Funding */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Monthly Funding</span>
              <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold">₦</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦84,300,000</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+12.5% target</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,8 L15,8 L25,5 L35,5 L50,3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Pending Adjustments */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Pending ADJ</span>
              <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                <ClockIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">24</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-red-400 font-bold">Requires review</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-red-500 fill-none" strokeWidth="1.5">
                  <path d="M0,3 L15,5 L30,12 L50,14" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 5: Total Refunds */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Refunds</span>
              <div className="p-1.5 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                <XCircleIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦2,140,000</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">12 disputes open</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-amber-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L15,10 L30,10 L50,11" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 6: Funding Success Rate */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Success Rate</span>
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">99.2%</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+0.1% gateway</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L15,11 L30,5 L50,2" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* ─── WALLET CONTROLS TOOLBAR ────────────────────────────────────────── */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Global search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by User Name, Email, Customer ID, Transaction ID, Wallet Reference..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs pl-11 pr-4 py-3 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handleResetFilters}
                className="flex-1 lg:flex-none px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => { setExportType('csv'); setShowExportModal(true); }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                CSV
              </button>
              <button
                onClick={() => { setExportType('pdf'); setShowExportModal(true); }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <DocumentTextIcon className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>
          </div>

          {/* Advanced filters */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-text-white font-heading font-bold text-[11px] uppercase tracking-wider mb-3">
              <FunnelIcon className="w-3.5 h-3.5 text-blue-500" />
              Advanced Filters
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              
              {/* Status */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Wallet Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Frozen">Frozen</option>
                  <option value="Restricted">Restricted</option>
                </select>
              </div>

              {/* Funding method */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Funding Method</label>
                <select
                  value={methodFilter}
                  onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Methods</option>
                  <option value="Transfer">Bank Transfer</option>
                  <option value="Card">Card Checkout</option>
                  <option value="USSD">USSD Payment</option>
                </select>
              </div>

              {/* Balance range */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Min Balance (₦)</label>
                <input
                  type="number"
                  placeholder="e.g. 1000"
                  value={minBalance}
                  onChange={(e) => { setMinBalance(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Max Balance (₦)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={maxBalance}
                  onChange={(e) => { setMaxBalance(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                />
              </div>

              {/* Adjustment filter */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Adjustment Type</label>
                <select
                  value={adjustmentTypeFilter}
                  onChange={(e) => { setAdjustmentTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Adjustment</option>
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                  <option value="Refund">Refund</option>
                  <option value="Correction">Correction</option>
                </select>
              </div>

              {/* Date Filter Placeholder */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Activity Date</label>
                <input
                  type="date"
                  className="w-full text-[10px] px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                />
              </div>

            </div>
          </div>

        </div>

        {/* ─── WALLET ACCOUNTS TABLE & DETAILS DRAWER ─────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* Table Container (2/3 Width) */}
          <div className="xl:col-span-2 bg-bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
            
            <div className="p-5 border-b border-border flex items-center justify-between">
              <span className="text-text-white font-heading font-extrabold text-sm">Ledger Accounts</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-bold">
                {filteredWallets.length} accounts found
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border sticky top-0">
                  <tr>
                    <th className="px-5 py-4">User</th>
                    <th className="px-4 py-4">Customer ID</th>
                    <th 
                      onClick={() => { setSortField('availableBalance'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Available Balance {sortField === 'availableBalance' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">Reserved</th>
                    <th 
                      onClick={() => { setSortField('totalFunding'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Total Funding {sortField === 'totalFunding' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Last Activity</th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse bg-bg-dark-secondary/10">
                        <td className="px-5 py-4">
                          <div className="w-28 h-3 bg-border/40 rounded" />
                          <div className="w-20 h-2 bg-border/40 rounded mt-1.5" />
                        </td>
                        <td className="px-4 py-4"><div className="w-20 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-16 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-12 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-16 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-16 h-5 bg-border/40 rounded-full" /></td>
                        <td className="px-4 py-4"><div className="w-24 h-3 bg-border/40 rounded" /></td>
                        <td className="px-5 py-4 text-center"><div className="w-14 h-6 bg-border/40 rounded mx-auto" /></td>
                      </tr>
                    ))
                  ) : paginatedWallets.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                          </div>
                          <h4 className="text-text-white font-heading font-bold text-sm">No wallet records available</h4>
                          <p className="text-text-muted text-[11px] mt-1.5">
                            No balance files matched your filters. Adjust the filters or parameters to view accounts.
                          </p>
                          <button
                            onClick={handleResetFilters}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                          >
                            Refresh Wallet Data
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedWallets.map((wallet) => (
                      <tr 
                        key={wallet.id} 
                        className="hover:bg-bg-dark-secondary/30 transition-colors cursor-pointer"
                        onClick={() => { setSelectedWallet(wallet); setIsDrawerOpen(true); }}
                      >
                        <td className="px-5 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-heading font-bold text-white uppercase text-[10px] shadow-sm">
                            {wallet.avatarInitials}
                          </div>
                          <div>
                            <div className="font-semibold text-text-white">{wallet.user}</div>
                            <div className="text-[10px] text-text-muted mt-0.5">{wallet.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono text-[10px] text-text-gray">{wallet.id}</td>
                        <td className="px-4 py-4 font-bold text-text-white">₦{wallet.availableBalance.toLocaleString()}</td>
                        <td className="px-4 py-4 text-text-muted">₦{wallet.reservedBalance.toLocaleString()}</td>
                        <td className="px-4 py-4 font-bold text-text-gray">₦{wallet.totalFunding.toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            wallet.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            wallet.status === 'Frozen' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {wallet.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-text-muted whitespace-nowrap">{wallet.lastActivity}</td>
                        <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => { setSelectedWallet(wallet); setIsDrawerOpen(true); }}
                              className="p-1 rounded-md hover:bg-bg-dark-secondary text-text-gray hover:text-text-white transition-colors"
                              title="View Wallet Dashboard"
                            >
                              <EyeIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => { setAdjustTargetUser(wallet.id); setAdjustType('Credit'); setShowAdjustModal(true); }}
                              className="p-1 rounded-md hover:bg-bg-dark-secondary text-text-gray hover:text-blue-400 transition-colors"
                              title="Adjust Wallet Balances"
                            >
                              <PlusIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleFreezeWallet(wallet.id, wallet.status === 'Frozen' ? 'Active' : 'Frozen')}
                              className={`p-1 rounded-md hover:bg-bg-dark-secondary transition-colors ${wallet.status === 'Frozen' ? 'text-red-500' : 'text-text-gray hover:text-red-400'}`}
                              title={wallet.status === 'Frozen' ? 'Unfreeze Wallet' : 'Freeze Wallet'}
                            >
                              <span className="text-xs">❄️</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && sortedWallets.length > 0 && (
              <div className="p-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-text-muted">
                  Showing <span className="text-text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="text-text-white font-bold">
                    {Math.min(currentPage * itemsPerPage, sortedWallets.length)}
                  </span>{' '}
                  of <span className="text-text-white font-bold">{sortedWallets.length}</span> entries
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-white bg-bg-dark-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-card-hover"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentPage === idx + 1 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'border border-border text-text-muted hover:text-text-white hover:bg-bg-card-hover'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-text-white bg-bg-dark-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-card-hover"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Activity Logs Feed & Quick Actions (1/3 Width) */}
          <div className="space-y-6">
            
            {/* Quick Actions Panel */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="border-b border-border pb-2">
                <h3 className="text-text-white font-heading font-extrabold text-sm">Quick Actions</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Shortcuts for manual financial interventions</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <button 
                  onClick={() => { setAdjustType('Credit'); setAdjustTargetUser(wallets[0]?.id || ''); setShowAdjustModal(true); }}
                  className="p-3 bg-bg-dark-secondary/40 hover:bg-bg-dark-secondary/80 border border-border rounded-xl flex flex-col items-center gap-1.5 transition-all text-text-white font-bold"
                >
                  <span className="text-emerald-500 font-extrabold text-sm">➕</span>
                  Credit Wallet
                </button>
                <button 
                  onClick={() => { setAdjustType('Debit'); setAdjustTargetUser(wallets[0]?.id || ''); setShowAdjustModal(true); }}
                  className="p-3 bg-bg-dark-secondary/40 hover:bg-bg-dark-secondary/80 border border-border rounded-xl flex flex-col items-center gap-1.5 transition-all text-text-white font-bold"
                >
                  <span className="text-red-500 font-extrabold text-sm">➖</span>
                  Debit Wallet
                </button>
                <button 
                  onClick={() => triggerToast('Opening ledger audit list...')}
                  className="p-3 bg-bg-dark-secondary/40 hover:bg-bg-dark-secondary/80 border border-border rounded-xl flex flex-col items-center gap-1.5 transition-all text-text-white font-bold"
                >
                  <span className="text-blue-500 text-sm">📊</span>
                  Financial Reports
                </button>
                <button 
                  onClick={() => triggerToast('Redirecting to support adjust claims...')}
                  className="p-3 bg-bg-dark-secondary/40 hover:bg-bg-dark-secondary/80 border border-border rounded-xl flex flex-col items-center gap-1.5 transition-all text-text-white font-bold"
                >
                  <span className="text-amber-500 text-sm">🔧</span>
                  Review Claims
                </button>
              </div>
            </div>

            {/* Live Feed */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-text-white font-heading font-extrabold text-sm">Funding Activity Feed</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Real-time deposit ledger audits</p>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="space-y-2">
                {timelineEvents.map((evt) => (
                  <div key={evt.id} className="flex gap-2.5 p-2.5 bg-bg-dark-secondary/35 border border-border/50 rounded-xl items-start">
                    <div className={`p-2 rounded-lg text-xs ${evt.color}`}>
                      {evt.icon}
                    </div>
                    <div className="flex-1 min-w-0 text-[10px]">
                      <p className="text-text-white font-medium break-words leading-relaxed">{evt.text}</p>
                      <span className="text-text-muted block mt-0.5">{evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ─── PENDING ADJUSTMENT REVIEW QUEUE ────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-text-white font-heading font-extrabold text-sm">Pending Approval Queue</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Auditor reviews required for balance overrides &gt; ₦50,000</p>
            </div>
            <span className="text-xs font-bold text-amber-500 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              {pendingQueue.filter(p => p.status === 'Pending').length} Pending Audits
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border">
                <tr>
                  <th className="px-5 py-4">Request ID</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Action Type</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Auditor Reference</th>
                  <th className="px-4 py-4">Submitted</th>
                  <th className="px-4 py-4">Audit Status</th>
                  <th className="px-5 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {pendingQueue.map(p => (
                  <tr key={p.id} className="hover:bg-bg-dark-secondary/20 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-text-white">{p.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-text-white">{p.user}</div>
                      <div className="text-[9px] text-text-muted">{p.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        p.actionType === 'Credit' || p.actionType === 'Refund' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {p.actionType}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-text-white">₦{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-text-gray font-mono text-[10px]">{p.reference}</td>
                    <td className="px-4 py-4 text-text-muted">{p.submitted}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                        p.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                        'bg-red-500/10 text-red-400 border border-red-500/25'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {p.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveAdjustment(p.id, 'Approved')}
                              className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproveAdjustment(p.id, 'Rejected')}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-text-muted uppercase font-semibold">Audited</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── WALLET SECURITY & RISK PANEL ──────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-text-white font-heading font-extrabold text-sm flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                Wallet Security & Monitor Logs
              </h3>
              <p className="text-[10px] text-text-muted mt-0.5">Real-time alerts for manual overrides or suspicious funding events</p>
            </div>
            <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-500 font-bold px-2.5 py-0.5 rounded-full">
              SECURE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {securityLogs.map((log) => (
              <div 
                key={log.id} 
                className="bg-bg-dark-secondary/35 border border-border/50 rounded-xl p-4 flex flex-col justify-between hover:border-border-hover transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-bold uppercase">{log.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      log.riskLevel === 'Critical' ? 'bg-red-500/15 text-red-400' :
                      log.riskLevel === 'High' ? 'bg-orange-500/15 text-orange-400' :
                      log.riskLevel === 'Medium' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-blue-500/15 text-blue-400'
                    }`}>
                      {log.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-text-white font-medium leading-relaxed">{log.details}</p>
                </div>
                <div className="flex items-center justify-between mt-4 text-[9px] text-text-muted border-t border-border/40 pt-2">
                  <span>Auditor: {log.admin}</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── VISUAL FINANCIAL ANALYTICS ────────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-text-white font-heading font-extrabold text-sm">Financial Analytics</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Aggregate visual metrics across checkout gateways and user wallets</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Chart 1: Funding Trends */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Weekly Funding Channels (₦)</span>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={FUNDING_TRENDS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--bg-muted)" fontSize={10} />
                    <YAxis stroke="var(--bg-muted)" fontSize={10} tickFormatter={(v) => `₦${v/1000000}M`} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                    <Area type="monotone" dataKey="Card" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="Transfer" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                    <Area type="monotone" dataKey="USSD" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Method Distribution */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Aggregate Deposit Sources</span>
              <div className="h-60 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={FUNDING_METHOD_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {FUNDING_METHOD_PIE.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} formatter={(val) => `₦${(Number(val)/1000000).toFixed(1)}M`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend list */}
                <div className="flex flex-col gap-1.5 ml-4 whitespace-nowrap">
                  {FUNDING_METHOD_PIE.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[9px] text-text-gray">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-text-white">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 3: Balance Ranges */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Balance Distribution</span>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BALANCE_DISTRIBUTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--bg-muted)" fontSize={10} />
                    <YAxis stroke="var(--bg-muted)" fontSize={10} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                    <Bar dataKey="Accounts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </section>

        {/* ─── EXPORT CENTER PANEL ───────────────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-2">
            <h3 className="text-text-white font-heading font-extrabold text-sm">Export Center</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Quickly dispatch financial summaries to download queue</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-bg-dark-secondary/35 border border-border/50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-text-white">Daily Wallet Report</p>
                <p className="text-[9px] text-text-muted mt-0.5">Today's snapshot summary</p>
              </div>
              <button onClick={() => triggerToast('Daily report generated!')} className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg transition-colors">
                Generate
              </button>
            </div>
            <div className="p-3 bg-bg-dark-secondary/35 border border-border/50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-text-white">Funding Channel Audit</p>
                <p className="text-[9px] text-text-muted mt-0.5">Card/Transfer deposits log</p>
              </div>
              <button onClick={() => triggerToast('Funding report generated!')} className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg transition-colors">
                Generate
              </button>
            </div>
            <div className="p-3 bg-bg-dark-secondary/35 border border-border/50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-text-white">Refund Logs Ledger</p>
                <p className="text-[9px] text-text-muted mt-0.5">Reconciliation ledger report</p>
              </div>
              <button onClick={() => triggerToast('Refund report generated!')} className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg transition-colors">
                Generate
              </button>
            </div>
            <div className="p-3 bg-bg-dark-secondary/35 border border-border/50 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-bold text-text-white">Monthly Summary</p>
                <p className="text-[9px] text-text-muted mt-0.5">General financial ledger</p>
              </div>
              <button onClick={() => triggerToast('Monthly statement generated!')} className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg transition-colors">
                Generate
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* ─── DETAILS DRAWER (SLIDE OVER) ────────────────────────────────────── */}
      {isDrawerOpen && selectedWallet && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div onClick={() => setIsDrawerOpen(false)} className="flex-1" />
          
          <div className="w-full max-w-lg bg-bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-bg-dark-secondary/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-heading font-extrabold text-white text-xs shadow-xs">
                  {selectedWallet.avatarInitials}
                </div>
                <div>
                  <h3 className="text-text-white font-heading font-bold text-base">{selectedWallet.user}</h3>
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">ID: {selectedWallet.id}</span>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-text-white hover:bg-bg-dark-secondary transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              
              {/* Account Status Badge Header */}
              <div className="p-4 rounded-2xl bg-bg-dark-secondary/40 border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted tracking-wide">Status State</span>
                  <p className="text-text-white font-bold text-sm mt-0.5">{selectedWallet.status}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedWallet.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  selectedWallet.status === 'Frozen' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {selectedWallet.status}
                </span>
              </div>

              {/* Wallet Summary */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Wallet Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Available</span>
                    <span className="text-text-white font-bold text-sm">₦{selectedWallet.availableBalance.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Reserved</span>
                    <span className="text-text-white font-bold text-sm text-text-muted">₦{selectedWallet.reservedBalance.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Total Funds</span>
                    <span className="text-text-white font-bold text-sm">₦{selectedWallet.totalFunding.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* User details */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">User details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Email Profile</span>
                    <span className="text-text-white">{selectedWallet.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Linked Phone</span>
                    <span className="text-text-white">{selectedWallet.phone}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Joined Date</span>
                    <span className="text-text-white">{selectedWallet.joinedDate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Last Log Activity</span>
                    <span className="text-text-white">{selectedWallet.lastActivity}</span>
                  </div>
                </div>
              </div>

              {/* Funding Stats */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Funding Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Total Funding</span>
                    <span className="text-text-white font-bold">₦{selectedWallet.totalFunding.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Average Deposit</span>
                    <span className="text-text-white font-bold">₦{selectedWallet.averageFunding.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Largest Deposit</span>
                    <span className="text-text-white font-bold">₦{selectedWallet.largestFunding.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Spending Stats */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Spending Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Total Spending</span>
                    <span className="text-text-white font-bold">₦{selectedWallet.totalSpending.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Monthly Spend</span>
                    <span className="text-text-white font-bold">₦{(selectedWallet.totalSpending / 3).toFixed(0)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Success Rate</span>
                    <span className="text-emerald-400 font-bold">{selectedWallet.spendingSuccessRate}%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-border bg-bg-dark-secondary/30 flex gap-2">
              <button
                onClick={() => { setAdjustTargetUser(selectedWallet.id); setAdjustType('Credit'); setIsDrawerOpen(false); setShowAdjustModal(true); }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                Adjust Wallet
              </button>
              <button
                onClick={() => handleFreezeWallet(selectedWallet.id, selectedWallet.status === 'Frozen' ? 'Active' : 'Frozen')}
                className={`flex-1 py-2.5 text-xs font-semibold rounded-xl border transition-colors ${
                  selectedWallet.status === 'Frozen' 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500' 
                    : 'bg-bg-dark-secondary hover:bg-bg-card-hover text-text-white border-border'
                }`}
              >
                {selectedWallet.status === 'Frozen' ? 'Unfreeze' : 'Freeze Wallet'}
              </button>
              <button
                onClick={() => triggerToast('Opening transaction view for ' + selectedWallet.user)}
                className="px-4 py-2.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Tx Logs
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── WALLET ADJUSTMENT MODAL ────────────────────────────────────────── */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setShowAdjustModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg font-bold"
            >
              ✕
            </button>

            <h3 className="text-text-white font-heading font-extrabold text-base mb-2">Adjust Wallet Balance</h3>
            <p className="text-text-gray text-xs mb-4">
              Directly credit or debit a user's wallet. Manual ledger changes must comply with auditing guidelines.
            </p>

            <form onSubmit={handleConfirmAdjustment} className="space-y-4">
              
              {/* User search */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1.5">Target Wallet Account</label>
                <select
                  value={adjustTargetUser}
                  onChange={(e) => setAdjustTargetUser(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                  required
                >
                  <option value="" disabled>Select User Wallet</option>
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.user} (ID: {w.id} - Bal: ₦{w.availableBalance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Adjustment type */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1.5">Adjustment Type</label>
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                  {(['Credit', 'Debit', 'Refund', 'Correction'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAdjustType(type)}
                      className={`py-2 rounded-lg font-bold border transition-colors ${
                        adjustType === type 
                          ? 'bg-blue-600/10 border-blue-500 text-blue-500 shadow-xs' 
                          : 'bg-bg-dark-secondary border-border text-text-gray'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1.5">Adjustment Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 5000"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1.5">Adjustment Reason</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide details for why this override is being made..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden resize-none"
                />
              </div>

              {/* Auditor Reference */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1.5">Auditor Reference ID (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. AUDIT-99201"
                  value={adjustRef}
                  onChange={(e) => setAdjustRef(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                />
              </div>

              {/* Live Preview confirmation warning */}
              {adjustAmount && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] rounded-xl flex items-start gap-2.5">
                  <span className="text-sm">⚠️</span>
                  <div className="space-y-1">
                    <p className="font-bold">AUDITOR WARNING:</p>
                    <p className="leading-relaxed">
                      You are about to {adjustType} ₦{parseFloat(adjustAmount).toLocaleString()} for {wallets.find(w => w.id === adjustTargetUser)?.user || 'Selected User'}.
                      {parseFloat(adjustAmount) >= 50000 && ' Adjustments >= ₦50,000 will be held in the pending queue for Supervisor approval.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Verification notice checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  required
                  id="noticeConfirm"
                  checked={confirmNoticeChecked}
                  onChange={(e) => setConfirmNoticeChecked(e.target.checked)}
                  className="rounded border-border focus:ring-blue-500 text-blue-600"
                />
                <label htmlFor="noticeConfirm" className="text-[10px] text-text-muted select-none cursor-pointer">
                  I certify this ledger adjustment complies with the financial override logs.
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Confirm Adjustment
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ─── MODAL: EXPORT CENTRE ───────────────────────────────────────────── */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg"
            >
              ✕
            </button>
            
            <h3 className="text-text-white font-heading font-extrabold text-base mb-2">Export Wallet Data</h3>
            <p className="text-text-gray text-xs mb-4">
              Select export parameter format and generate standard download reports.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">File Format</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportType('csv')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${exportType === 'csv' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-bg-dark-secondary border-border text-text-gray'}`}
                  >
                    CSV Format
                  </button>
                  <button
                    onClick={() => setExportType('pdf')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${exportType === 'pdf' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-bg-dark-secondary border-border text-text-gray'}`}
                  >
                    PDF Format
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-2.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowExportModal(false);
                    triggerToast(`Generated ${exportType.toUpperCase()} file successfully.`);
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Export Now
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
