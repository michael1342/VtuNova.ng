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
  BoltIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
export interface Customer {
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
}

export interface ElectricityPayment {
  id: string;
  reference: string;
  customer: Customer;
  provider: 'Ikeja Electric' | 'Eko Electric' | 'Abuja Electric' | 'Ibadan Electric' | 'Benin Electric' | 'Enugu Electric' | 'Jos Electric' | 'Kaduna Electric' | 'Kano Electric' | 'Port Harcourt Electric' | 'Yola Electric';
  meterNumber: string;
  meterType: 'Prepaid' | 'Postpaid';
  customerName: string;
  customerAddress: string;
  amount: number;
  costPrice: number;
  profit: number;
  token: string;
  unitsPurchased: number;
  tokenDeliveryStatus: 'Delivered' | 'Pending' | 'Failed';
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed';
  date: string;
  time: string;
  walletBefore: number;
  walletAfter: number;
  failureReason?: string;
  assignedAdmin?: string;
  timeline: {
    created: string;
    validated: string;
    processing: string;
    tokenGenerated: string;
    completed: string;
  };
}

export interface ProviderStats {
  name: string;
  txCount: number;
  revenue: number;
  successRate: number;
  avgProcessingTime: string;
  color: string;
}

export interface TokenRecord {
  token: string;
  meter: string;
  units: number;
  date: string;
  status: 'Active' | 'Used' | 'Pending';
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
const INITIAL_PAYMENTS: ElectricityPayment[] = [
  {
    id: 'SWT-EL-10045',
    reference: 'REF-EL-IKJA-884019',
    customer: {
      name: 'Michael Anazodo',
      email: 'michael@example.com',
      phone: '+234 803 111 2222',
      avatarInitials: 'MA'
    },
    provider: 'Ikeja Electric',
    meterNumber: '12345678901',
    meterType: 'Prepaid',
    customerName: 'Michael Anazodo Auditor',
    customerAddress: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos',
    amount: 5000,
    costPrice: 4750,
    profit: 250,
    token: '1234 5678 9012 3456',
    unitsPurchased: 45.2,
    tokenDeliveryStatus: 'Delivered',
    status: 'Success',
    date: '2026-06-20',
    time: '17:55:00',
    walletBefore: 9500,
    walletAfter: 4500,
    timeline: {
      created: '17:54:10',
      validated: '17:54:20',
      processing: '17:54:40',
      tokenGenerated: '17:54:55',
      completed: '17:55:00'
    }
  },
  {
    id: 'SWT-EL-10046',
    reference: 'REF-EL-EKO-093841',
    customer: {
      name: 'Chidi Benson',
      email: 'chidi.b@example.com',
      phone: '+234 803 445 7821',
      avatarInitials: 'CB'
    },
    provider: 'Eko Electric',
    meterNumber: '98765432109',
    meterType: 'Prepaid',
    customerName: 'Chidi Benson Enterprise',
    customerAddress: '15, Marina Road, Lagos Island, Lagos',
    amount: 15000,
    costPrice: 14250,
    profit: 750,
    token: '9801 2234 0918 2314',
    unitsPurchased: 135.6,
    tokenDeliveryStatus: 'Delivered',
    status: 'Success',
    date: '2026-06-20',
    time: '17:10:00',
    walletBefore: 161500,
    walletAfter: 146500,
    timeline: {
      created: '17:09:00',
      validated: '17:09:15',
      processing: '17:09:30',
      tokenGenerated: '17:09:50',
      completed: '17:10:00'
    }
  },
  {
    id: 'SWT-EL-10047',
    reference: 'REF-EL-ABJ-119280',
    customer: {
      name: 'Amara Okafor',
      email: 'amara.o@example.com',
      phone: '+234 810 984 5673',
      avatarInitials: 'AO'
    },
    provider: 'Abuja Electric',
    meterNumber: '44021948301',
    meterType: 'Prepaid',
    customerName: 'Amara Okafor residence',
    customerAddress: 'Apt 4B, Maitama Luxury Estates, Abuja',
    amount: 25000,
    costPrice: 23750,
    profit: 1250,
    token: '-',
    unitsPurchased: 0,
    tokenDeliveryStatus: 'Pending',
    status: 'Pending',
    date: '2026-06-20',
    time: '16:50:00',
    walletBefore: 270000,
    walletAfter: 245000,
    timeline: {
      created: '16:48:00',
      validated: '16:48:30',
      processing: '16:49:15',
      tokenGenerated: '-',
      completed: '-'
    }
  },
  {
    id: 'SWT-EL-10048',
    reference: 'REF-EL-PHC-882039',
    customer: {
      name: 'Tunde Bakare',
      email: 'tunde.b@example.com',
      phone: '+234 802 984 5673',
      avatarInitials: 'TB'
    },
    provider: 'Port Harcourt Electric',
    meterNumber: '55018928341',
    meterType: 'Postpaid',
    customerName: 'Tunde Bakare Retail Hub',
    customerAddress: '42, Trans-Amadi Layout, Port Harcourt',
    amount: 10000,
    costPrice: 9500,
    profit: 500,
    token: '-',
    unitsPurchased: 0,
    tokenDeliveryStatus: 'Failed',
    status: 'Failed',
    date: '2026-06-20',
    time: '15:10:00',
    walletBefore: 16000,
    walletAfter: 16000,
    failureReason: 'DisCo gateway API reported error 502: Invalid Meter credentials validation.',
    assignedAdmin: 'Aliyu Bello',
    timeline: {
      created: '15:08:00',
      validated: '15:08:45',
      processing: '15:09:30',
      tokenGenerated: '-',
      completed: '15:10:00'
    }
  },
  {
    id: 'SWT-EL-10049',
    reference: 'REF-EL-IBD-102934',
    customer: {
      name: 'Fatima Musa',
      email: 'fatima.m@example.com',
      phone: '+234 903 234 5678',
      avatarInitials: 'FM'
    },
    provider: 'Ibadan Electric',
    meterNumber: '66209483018',
    meterType: 'Prepaid',
    customerName: 'Fatima Musa Store',
    customerAddress: 'Ring Road Mall, Ibadan, Oyo State',
    amount: 3000,
    costPrice: 2850,
    profit: 150,
    token: '5561 2294 0918 3342',
    unitsPurchased: 27.2,
    tokenDeliveryStatus: 'Delivered',
    status: 'Success',
    date: '2026-06-19',
    time: '12:12:45',
    providerName: 'Ibadan DisCo Portal',
    walletBefore: 90000,
    walletAfter: 87000,
    timeline: {
      created: '12:11:30',
      validated: '12:11:45',
      processing: '12:12:10',
      tokenGenerated: '12:12:35',
      completed: '12:12:45'
    }
  },
  {
    id: 'SWT-EL-10050',
    reference: 'REF-EL-BEN-091823',
    customer: {
      name: 'Obinna Ani',
      email: 'obinna.a@example.com',
      phone: '+234 705 270 5119',
      avatarInitials: 'OA'
    },
    provider: 'Benin Electric',
    meterNumber: '77293841029',
    meterType: 'Prepaid',
    customerName: 'Obinna Ani residency',
    customerAddress: '12, Airport Road, Benin City, Edo State',
    amount: 5000,
    costPrice: 4750,
    profit: 250,
    token: '-',
    unitsPurchased: 0,
    tokenDeliveryStatus: 'Failed',
    status: 'Reversed',
    date: '2026-06-19',
    time: '09:40:00',
    walletBefore: 17000,
    walletAfter: 17000,
    failureReason: 'Benin DisCo system reports: connection timed out.',
    assignedAdmin: 'System AutoReversal',
    timeline: {
      created: '09:38:00',
      validated: '09:38:30',
      processing: '09:39:15',
      tokenGenerated: '-',
      completed: '09:40:00'
    }
  }
];

const INITIAL_PROVIDERS: ProviderStats[] = [
  { name: 'Ikeja Electric', txCount: 18240, revenue: 25800000, successRate: 99.4, avgProcessingTime: '4.2s', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { name: 'Abuja Electric', txCount: 12100, revenue: 18300000, successRate: 98.8, avgProcessingTime: '6.5s', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  { name: 'Eko Electric', txCount: 10400, revenue: 15400000, successRate: 99.1, avgProcessingTime: '4.8s', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Port Harcourt Electric', txCount: 7500, revenue: 8900000, successRate: 97.2, avgProcessingTime: '11.5s', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' }
];

const INITIAL_TOKENS: TokenRecord[] = [
  { token: '1234 5678 9012 3456', meter: '12345678901', units: 45.2, date: '2026-06-20', status: 'Active' },
  { token: '9801 2234 0918 2314', meter: '98765432109', units: 135.6, date: '2026-06-20', status: 'Active' },
  { token: '5561 2294 0918 3342', meter: '66209483018', units: 27.2, date: '2026-06-19', status: 'Used' }
];

const INITIAL_ALERTS: AlertLog[] = [
  { id: 'ALT-EL-01', title: 'Kaduna Electric Gateway Downtime', desc: 'Gateway response returns error code 503 on validation calls.', severity: 'High', timestamp: '12m ago' },
  { id: 'ALT-EL-02', title: 'Slow Token Delivery on PHEDC', desc: 'Port Harcourt DisCo average token generation latency spikes to 28s.', severity: 'Critical', timestamp: '40m ago' },
  { id: 'ALT-EL-03', title: 'Large Payment Event', desc: 'Meter 44021948301 initiated continuous purchase of ₦50,000.', severity: 'Medium', timestamp: '1h ago' }
];

const LIVE_MONITOR_EVENTS: ActivityEvent[] = [
  { id: 1, text: 'Token Generated: Ikeja Electric ₦5,000 prepaid (Units: 45.2)', time: 'Just now', icon: '⚡', color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 2, text: 'Provider Delay: Eko Electric API response lag (12s)', time: '2 mins ago', icon: '⚠️', color: 'text-amber-400 bg-amber-500/10' },
  { id: 3, text: 'Payment Retried: SWT-EL-10048 routed to alternate gateway', time: '10 mins ago', icon: '🔄', color: 'text-blue-400 bg-blue-500/10' },
  { id: 4, text: 'Refund Issued: Erroneous charge reversed for @obinna (₦5,000)', time: '20 mins ago', icon: '🔄', color: 'text-cyan-400 bg-cyan-500/10' }
];

// Recharts Charts Data
const REVENUE_ANALYTICS_DATA = [
  { name: 'Mon', Revenue: 8200000, Profit: 520000 },
  { name: 'Tue', Revenue: 9500000, Profit: 610000 },
  { name: 'Wed', Revenue: 8800000, Profit: 570000 },
  { name: 'Thu', Revenue: 10400000, Profit: 680000 },
  { name: 'Fri', Revenue: 11800000, Profit: 790000 },
  { name: 'Sat', Revenue: 13500000, Profit: 880000 },
  { name: 'Sun', Revenue: 9200000, Profit: 600000 }
];

const PROVIDER_DISTRIBUTION_PIE = [
  { name: 'Ikeja Electric', value: 18240, color: '#f59e0b' },
  { name: 'Abuja Electric', value: 12100, color: '#3b82f6' },
  { name: 'Eko Electric', value: 10400, color: '#10b981' },
  { name: 'Port Harcourt Electric', value: 7500, color: '#06b6d4' }
];

export default function AdminElectricityPayments() {
  
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [payments, setPayments] = useState<ElectricityPayment[]>(INITIAL_PAYMENTS);
  const [providers] = useState<ProviderStats[]>(INITIAL_PROVIDERS);
  const [tokens, setTokens] = useState<TokenRecord[]>(INITIAL_TOKENS);
  const [alerts, setAlerts] = useState<AlertLog[]>(INITIAL_ALERTS);
  const [timelineEvents, setTimelineEvents] = useState(LIVE_MONITOR_EVENTS);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [discoFilter, setDiscoFilter] = useState('All');
  const [meterTypeFilter, setMeterTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');

  // Sorting / Pagination
  const [sortField, setSortField] = useState<'id' | 'amount' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected state / Drawer UI / Loader / Toasts
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<ElectricityPayment | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Export options modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  // Live timeline events update simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        { text: 'Token Generated: Abuja Electric ₦10,000 prepaid (Units: 90.4)', icon: '⚡', color: 'text-emerald-400 bg-emerald-500/10' },
        { text: 'Eko Electric API Response Timeout alert (error 504)', icon: '⚠️', color: 'text-red-400 bg-red-500/10' },
        { text: 'Payment Retried: SWT-EL-10048 routed to alternate link', icon: '🔄', color: 'text-blue-400 bg-blue-500/10' }
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      const newEvent: ActivityEvent = {
        id: Date.now(),
        text: randomMsg.text,
        time: 'Just now',
        icon: randomMsg.icon,
        color: randomMsg.color
      };
      setTimelineEvents(prev => [newEvent, ...prev.slice(0, 3)]);
    }, 12500);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ─── FILTER & SORT LOGIC ──────────────────────────────────────────────────
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      // Global Search
      const searchMatch = searchQuery === '' || 
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.meterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.token.includes(searchQuery);

      // DisCo / Meter Type / Status / Provider
      const discoMatch = discoFilter === 'All' || p.provider === discoFilter;
      const typeMatch = meterTypeFilter === 'All' || p.meterType === meterTypeFilter;
      const statusMatch = statusFilter === 'All' || p.status === statusFilter;
      const providerMatch = providerFilter === 'All' || p.provider.toLowerCase().includes(providerFilter.toLowerCase());

      // Amount Bounds
      const minA = minAmount === '' ? 0 : parseFloat(minAmount);
      const maxA = maxAmount === '' ? Infinity : parseFloat(maxAmount);
      const amountMatch = p.amount >= minA && p.amount <= maxA;

      return searchMatch && discoMatch && typeMatch && statusMatch && providerMatch && amountMatch;
    });
  }, [payments, searchQuery, discoFilter, meterTypeFilter, statusFilter, minAmount, maxAmount, providerFilter]);

  const sortedPayments = useMemo(() => {
    const sorted = [...filteredPayments];
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
  }, [filteredPayments, sortField, sortDirection]);

  const paginatedPayments = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedPayments.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedPayments, currentPage]);

  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDiscoFilter('All');
    setMeterTypeFilter('All');
    setStatusFilter('All');
    setMinAmount('');
    setMaxAmount('');
    setProviderFilter('All');
    setCurrentPage(1);
    triggerToast('Filters reset successfully.');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setPayments(INITIAL_PAYMENTS);
      setLoading(false);
      triggerToast('Payments ledger updated.');
    }, 750);
  };

  // Row selections
  const handleSelectRow = (id: string) => {
    setSelectedPaymentIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPaymentIds(paginatedPayments.map(p => p.id));
    } else {
      setSelectedPaymentIds([]);
    }
  };

  const handleBulkAction = (action: string) => {
    triggerToast(`Bulk operation "${action}" applied to ${selectedPaymentIds.length} payments.`);
    setSelectedPaymentIds([]);
  };

  // Manual Retry / Refund overrides
  const handleRetryPayment = (payId: string) => {
    const generatedTokenVal = `${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`;
    
    setPayments(prev => prev.map(p => {
      if (p.id === payId) {
        return { 
          ...p, 
          status: 'Success',
          token: generatedTokenVal,
          tokenDeliveryStatus: 'Delivered',
          unitsPurchased: Math.round(p.amount / 110.5),
          assignedAdmin: undefined,
          timeline: { ...p.timeline, tokenGenerated: 'Just now', completed: 'Just now' }
        };
      }
      return p;
    }));

    // Add generated token to tokens queue list
    const meterNum = payments.find(p => p.id === payId)?.meterNumber || '12345678901';
    const newRecord: TokenRecord = {
      token: generatedTokenVal,
      meter: meterNum,
      units: Math.round((payments.find(p => p.id === payId)?.amount || 5000) / 110.5),
      date: '2026-06-20',
      status: 'Active'
    };
    setTokens(prev => [newRecord, ...prev]);

    triggerToast(`Token generated for payment ${payId}: ${generatedTokenVal}`);
    setIsDrawerOpen(false);
  };

  const handleRefundPayment = (payId: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === payId) {
        return { ...p, status: 'Reversed', tokenDeliveryStatus: 'Failed', assignedAdmin: 'System Refund' };
      }
      return p;
    }));
    triggerToast(`Reconciliation complete. Refund issued for Payment ${payId}.`);
    setIsDrawerOpen(false);
  };

  const failedPaymentsQueue = useMemo(() => {
    return payments.filter(p => p.status === 'Failed');
  }, [payments]);

  // Copy helper
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast('Copied token to clipboard!');
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 border border-blue-400 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="text-xs font-bold font-heading">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white hover:text-gray-200 text-sm">✕</button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">

        {/* ─── PAGE HEADER ────────────────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl p-6">
          <div>
            <h2 className="text-text-white font-heading font-extrabold text-2xl tracking-tight">Electricity Payments</h2>
            <p className="text-text-gray text-xs sm:text-sm mt-1 max-w-2xl">
              Monitor electricity payments, track token generation, manage failures, and oversee provider performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setExportFormat('csv'); setShowExportModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              Export Payments
            </button>
            <button
              onClick={() => { setExportFormat('pdf'); setShowExportModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <DocumentTextIcon className="w-3.5 h-3.5" />
              Generate Report
            </button>
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all ${loading ? 'opacity-55 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ─── KPI OVERVIEW CARDS ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Payments */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Payments</span>
              <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <BoltIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">48,240</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+13% wk</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,10 L10,8 L20,12 L30,5 L40,7 L50,2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Payment Volume */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Volume (₦)</span>
              <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold">₦</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦68.40M</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+16.5% month</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L12,10 L24,5 L36,7 L50,1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Successful Payments */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Success</span>
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">99.0%</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+0.1% rate</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,8 L15,8 L25,5 L35,5 L50,3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Failed Payments */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Failed</span>
              <div className="p-1.5 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                <XCircleIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">0.8%</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">-0.3% drop</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-red-500 fill-none" strokeWidth="1.5">
                  <path d="M0,3 L15,5 L30,12 L50,14" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 5: Pending Payments */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Pending</span>
              <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                <ClockIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">0.2%</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">-0.1% queue</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-amber-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L15,10 L30,10 L50,11" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 6: Platform Profit */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Profit</span>
              <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold">₦</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦4,240,000</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+11.2% margins</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L15,11 L30,5 L50,2" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* ─── PAYMENT CONTROLS TOOLBAR ──────────────────────────────────────── */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Global Search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by Transaction ID, User Profile, Meter Number, Token Ref, Payment Reference..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs pl-11 pr-4 py-3 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handleResetFilters}
                className="flex-1 lg:flex-none px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => { setExportFormat('csv'); setShowExportModal(true); }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                CSV
              </button>
              <button
                onClick={() => { setExportFormat('pdf'); setShowExportModal(true); }}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <DocumentTextIcon className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>
          </div>

          {/* Collapsible filters */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-text-white font-heading font-bold text-[11px] uppercase tracking-wider mb-3">
              <FunnelIcon className="w-3.5 h-3.5 text-blue-500" />
              Advanced Filters
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              
              {/* Distribution Company */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Distribution Company (DisCo)</label>
                <select
                  value={discoFilter}
                  onChange={(e) => { setDiscoFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All DisCos</option>
                  <option value="Ikeja Electric">Ikeja Electric</option>
                  <option value="Eko Electric">Eko Electric</option>
                  <option value="Abuja Electric">Abuja Electric</option>
                  <option value="Ibadan Electric">Ibadan Electric</option>
                  <option value="Benin Electric">Benin Electric</option>
                  <option value="Enugu Electric">Enugu Electric</option>
                  <option value="Jos Electric">Jos Electric</option>
                  <option value="Kaduna Electric">Kaduna Electric</option>
                  <option value="Kano Electric">Kano Electric</option>
                  <option value="Port Harcourt Electric">Port Harcourt Electric</option>
                  <option value="Yola Electric">Yola Electric</option>
                </select>
              </div>

              {/* Meter Type */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Meter Type</label>
                <select
                  value={meterTypeFilter}
                  onChange={(e) => { setMeterTypeFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Types</option>
                  <option value="Prepaid">Prepaid</option>
                  <option value="Postpaid">Postpaid</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Statuses</option>
                  <option value="Success">Success</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                  <option value="Reversed">Reversed</option>
                </select>
              </div>

              {/* Provider */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">API Provider</label>
                <select
                  value={providerFilter}
                  onChange={(e) => { setProviderFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Providers</option>
                  <option value="Ikeja">Ikeja DisCo Portal</option>
                  <option value="Eko">Eko DisCo Portal</option>
                  <option value="Abuja">Abuja DisCo Portal</option>
                  <option value="PHC">PHC DisCo Portal</option>
                </select>
              </div>

              {/* Amount range */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Min / Max Amt (₦)</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minAmount}
                    onChange={(e) => { setMinAmount(e.target.value); setCurrentPage(1); }}
                    className="w-full text-xs px-2 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={(e) => { setMaxAmount(e.target.value); setCurrentPage(1); }}
                    className="w-full text-xs px-2 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Date picker */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Date</label>
                <input
                  type="date"
                  className="w-full text-[10px] px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                />
              </div>

            </div>
          </div>

        </div>

        {/* ─── PAYMENTS TABLE & DETAILS DRAWER ────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* Table Container (2/3 width) */}
          <div className="xl:col-span-2 bg-bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
            
            <div className="p-5 border-b border-border flex items-center justify-between">
              <span className="text-text-white font-heading font-extrabold text-sm">Audited DisCo Ledger</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-bold">
                Showing {filteredPayments.length} results
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left border-collapse">
                <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border sticky top-0">
                  <tr>
                    <th className="px-5 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedPayments.length > 0 && paginatedPayments.every(p => selectedPaymentIds.includes(p.id))}
                        onChange={handleSelectAll}
                        className="rounded border-border focus:ring-blue-500 text-blue-600"
                      />
                    </th>
                    <th 
                      onClick={() => { setSortField('id'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Payment ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">Distribution Company (DisCo)</th>
                    <th className="px-4 py-4">Meter Number</th>
                    <th className="px-4 py-4">Meter Type</th>
                    <th 
                      onClick={() => { setSortField('amount'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">Generated Token</th>
                    <th className="px-4 py-4">Status</th>
                    <th 
                      onClick={() => { setSortField('date'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-5 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-xs">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse bg-bg-dark-secondary/10">
                        <td className="px-5 py-4 text-center"><div className="w-4 h-4 bg-border/40 rounded mx-auto" /></td>
                        <td className="px-4 py-4"><div className="w-24 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4">
                          <div className="w-28 h-3 bg-border/40 rounded" />
                          <div className="w-20 h-2 bg-border/40 rounded mt-1.5" />
                        </td>
                        <td className="px-4 py-4"><div className="w-24 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-20 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-14 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-14 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-32 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-16 h-5 bg-border/40 rounded-full" /></td>
                        <td className="px-4 py-4"><div className="w-20 h-3 bg-border/40 rounded" /></td>
                        <td className="px-5 py-4 text-center"><div className="w-12 h-6 bg-border/40 rounded mx-auto" /></td>
                      </tr>
                    ))
                  ) : paginatedPayments.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                          </div>
                          <h4 className="text-text-white font-heading font-bold text-sm">No electricity payments found</h4>
                          <p className="text-text-muted text-[11px] mt-1.5">
                            No logs matched your searching queries or DisCo filters.
                          </p>
                          <button
                            onClick={handleResetFilters}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                          >
                            Refresh Payments
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((pay) => {
                      const isSelected = selectedPaymentIds.includes(pay.id);
                      return (
                        <tr 
                          key={pay.id} 
                          className={`hover:bg-bg-dark-secondary/30 transition-colors cursor-pointer ${isSelected ? 'bg-blue-500/5' : ''}`}
                          onClick={() => { setSelectedPayment(pay); setIsDrawerOpen(true); }}
                        >
                          <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(pay.id)}
                              className="rounded border-border focus:ring-blue-500 text-blue-600"
                            />
                          </td>
                          <td className="px-4 py-4 font-mono font-bold text-blue-500">{pay.id}</td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="font-semibold text-text-white">{pay.customer.name}</div>
                            <div className="text-[10px] text-text-muted mt-0.5">{pay.customer.email}</div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-text-white">{pay.provider}</td>
                          <td className="px-4 py-4 font-mono text-text-gray">{pay.meterNumber}</td>
                          <td className="px-4 py-4 text-text-muted">{pay.meterType}</td>
                          <td className="px-4 py-4 font-bold text-text-white">₦{pay.amount.toLocaleString()}</td>
                          <td className="px-4 py-4 font-mono text-[10px] text-emerald-400 select-all" onClick={(e) => e.stopPropagation()}>
                            {pay.token !== '-' ? (
                              <div className="flex items-center gap-1">
                                <span>{pay.token}</span>
                                <button 
                                  onClick={() => handleCopyText(pay.token)}
                                  className="p-0.5 hover:bg-bg-dark-secondary rounded text-text-muted hover:text-text-white transition-colors"
                                  title="Copy Token"
                                >
                                  <DocumentDuplicateIcon className="w-3 h-3" />
                                </button>
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              pay.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                              pay.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                              pay.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                              'bg-slate-500/10 text-text-muted border border-border'
                            }`}>
                              {pay.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-text-muted whitespace-nowrap">
                            {pay.date} <span className="text-[10px] ml-1">{pay.time}</span>
                          </td>
                          <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => { setSelectedPayment(pay); setIsDrawerOpen(true); }}
                                className="p-1 rounded-md hover:bg-bg-dark-secondary text-text-gray hover:text-text-white transition-colors"
                                title="View Details"
                              >
                                <EyeIcon className="w-3.5 h-3.5" />
                              </button>
                              {pay.status === 'Failed' && (
                                <button
                                  onClick={() => handleRetryPayment(pay.id)}
                                  className="p-1 rounded-md hover:bg-bg-dark-secondary text-text-gray hover:text-blue-400 transition-colors"
                                  title="Retry Transaction Gateway"
                                >
                                  <span className="text-xs">🔄</span>
                                </button>
                              )}
                              <button
                                onClick={() => triggerToast(`Auditor receipt generated for ${pay.id}.`)}
                                className="p-1 rounded-md hover:bg-bg-dark-secondary text-text-gray hover:text-text-white transition-colors"
                                title="Get Receipt"
                              >
                                <DocumentTextIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!loading && sortedPayments.length > 0 && (
              <div className="p-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-text-muted">
                  Showing <span className="text-text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="text-text-white font-bold">
                    {Math.min(currentPage * itemsPerPage, sortedPayments.length)}
                  </span>{' '}
                  of <span className="text-text-white font-bold">{sortedPayments.length}</span> entries
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

          {/* Right column monitoring timelines */}
          <div className="space-y-6">
            
            {/* Live Token Monitor section */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="border-b border-border pb-2 flex items-center justify-between">
                <div>
                  <h3 className="text-text-white font-heading font-extrabold text-sm">Generated Tokens Monitor</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Quick reconciliation tokens audits</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {tokens.map((t, idx) => (
                  <div key={idx} className="p-3 bg-bg-dark-secondary/35 border border-border/50 rounded-xl space-y-2 hover:border-border-hover transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-400 select-all">{t.token}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        t.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                        t.status === 'Used' ? 'bg-slate-500/10 text-text-muted' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-text-muted">
                      <span>Meter: {t.meter}</span>
                      <span>Units: <span className="text-text-white font-bold">{t.units} kWh</span></span>
                    </div>
                    <div className="pt-1.5 flex justify-end gap-1.5 border-t border-border/40">
                      <button onClick={() => handleCopyText(t.token)} className="px-2 py-1 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-[9px] font-bold rounded text-text-white">
                        Copy
                      </button>
                      <button onClick={() => triggerToast('Exporting single token record...')} className="px-2 py-1 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-[9px] font-bold rounded text-text-white">
                        Export
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Monitor timeline Feed */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-text-white font-heading font-extrabold text-sm">Service Monitoring Feed</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Real-time prepaid DisCo gateways log</p>
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

        {/* ─── BULK ACTIONS BAR ──────────────────────────────────────────────── */}
        {selectedPaymentIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-bg-card border border-blue-500/30 px-6 py-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-text-white font-heading">
                {selectedPaymentIds.length} payments selected
              </span>
            </div>
            
            <div className="h-px w-full md:h-6 md:w-px bg-border/60" />

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleBulkAction('Export Selected')}
                className="px-3 py-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-[10px] font-bold rounded-lg transition-colors"
              >
                Export Selected
              </button>
              <button
                onClick={() => handleBulkAction('Retry Selected')}
                className="px-3 py-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-[10px] font-bold rounded-lg transition-colors"
              >
                Retry Selected
              </button>
              <button
                onClick={() => handleBulkAction('Mark Reviewed')}
                className="px-3 py-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-[10px] font-bold rounded-lg transition-colors"
              >
                Mark Reviewed
              </button>
              <button
                onClick={() => handleBulkAction('Generate Report')}
                className="px-3 py-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-[10px] font-bold rounded-lg transition-colors"
              >
                Generate Report
              </button>
              <button
                onClick={() => setSelectedPaymentIds([])}
                className="p-1 text-text-muted hover:text-text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ─── PROVIDER PERFORMANCE DASHBOARD ───────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="text-text-white font-heading font-extrabold text-sm">Provider Performance Dashboard</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Real-time parameters across top prepaid distribution gateways</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {providers.map((p, idx) => (
              <div 
                key={idx} 
                className="bg-bg-dark-secondary/35 border border-border/50 rounded-xl p-4 flex items-center justify-between hover:border-border-hover transition-colors"
              >
                <div className="space-y-1">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${p.color}`}>
                    {p.name}
                  </span>
                  <p className="text-xs text-text-muted mt-1">Tx Count: <span className="text-text-white font-bold">{p.txCount.toLocaleString()}</span></p>
                  <p className="text-xs text-text-muted">Rev: <span className="text-text-white font-bold">₦{(p.revenue/1000000).toFixed(1)}M</span></p>
                  <p className="text-[10px] text-text-muted">Avg Processing: <span className="text-text-white font-bold">{p.avgProcessingTime}</span></p>
                </div>
                <div className="text-right">
                  <span className="block font-heading font-extrabold text-lg text-emerald-400">{p.successRate}%</span>
                  <span className="text-[9px] text-emerald-400/80 font-semibold">Gateway Online</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FAILED PAYMENTS ACTION QUEUE ──────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-text-white font-heading font-extrabold text-sm">Failed Payments Action Queue</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Review and reconcile gateway-failed prepaid bill payment tickets</p>
            </div>
            <span className="text-xs font-bold text-red-500 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              {failedPaymentsQueue.length} Active Failures
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border">
                <tr>
                  <th className="px-5 py-4">Payment ID</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">DisCo Provider</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Failure Reason</th>
                  <th className="px-4 py-4">Assigned Auditor</th>
                  <th className="px-5 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {failedPaymentsQueue.map(pay => (
                  <tr key={pay.id} className="hover:bg-bg-dark-secondary/20 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-text-white">{pay.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-text-white">{pay.customer.name}</div>
                      <div className="text-[9px] text-text-muted">{pay.customer.email}</div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-text-white">{pay.provider}</td>
                    <td className="px-4 py-4 font-bold text-text-white">₦{pay.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-red-400 max-w-xs truncate" title={pay.failureReason}>{pay.failureReason}</td>
                    <td className="px-4 py-4 text-text-muted">{pay.assignedAdmin || 'Unassigned'}</td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleRetryPayment(pay.id)}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                        >
                          Retry
                        </button>
                        <button
                          onClick={() => handleRefundPayment(pay.id)}
                          className="px-2.5 py-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── VISUAL REVENUE & VOLUME ANALYTICS ──────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-text-white font-heading font-extrabold text-sm">Revenue & DisCo Analytics</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Aggregate performance graphs across electricity gateways</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Chart 1: Revenue Stack */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Weekly DisCo Revenue (₦)</span>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_ANALYTICS_DATA}>
                    <defs>
                      <linearGradient id="elecGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--bg-muted)" fontSize={10} />
                    <YAxis stroke="var(--bg-muted)" fontSize={10} tickFormatter={(v) => `₦${v/1000000}M`} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                    <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#elecGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Provider share */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">DisCo provider shares (Volume)</span>
              <div className="h-60 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PROVIDER_DISTRIBUTION_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {PROVIDER_DISTRIBUTION_PIE.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} formatter={(val) => `${val} orders`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend list */}
                <div className="flex flex-col gap-1.5 ml-4 whitespace-nowrap">
                  {PROVIDER_DISTRIBUTION_PIE.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[9px] text-text-gray">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-text-white">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 3: Commission Profit */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Commission Profit margins (₦)</span>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_ANALYTICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--bg-muted)" fontSize={10} />
                    <YAxis stroke="var(--bg-muted)" fontSize={10} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                    <Bar dataKey="Profit" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </section>

        {/* ─── ALERTS CENTER PANEL ───────────────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <h3 className="text-text-white font-heading font-extrabold text-sm flex items-center gap-2">
              <BoltIcon className="w-4 h-4 text-blue-500" />
              Prepaid DisCo Alerts Center
            </h3>
            <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-500 font-bold px-2.5 py-0.5 rounded-full">
              {alerts.length} Warnings Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="bg-bg-dark-secondary/35 border border-border/50 rounded-xl p-4 flex flex-col justify-between hover:border-border-hover transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-bold uppercase">{alert.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      alert.severity === 'Critical' ? 'bg-red-500/15 text-red-400 border border-red-500/25' :
                      alert.severity === 'High' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25' :
                      'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-text-white">{alert.title}</p>
                  <p className="text-[11px] text-text-gray leading-relaxed">{alert.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4 text-[9px] text-text-muted border-t border-border/40 pt-2">
                  <span>Auditor alert</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ─── DETAILS DRAWER (SLIDE OVER) ────────────────────────────────────── */}
      {isDrawerOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div onClick={() => setIsDrawerOpen(false)} className="flex-1" />
          
          <div className="w-full max-w-lg bg-bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-bg-dark-secondary/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center font-heading font-extrabold text-blue-500 text-xs shadow-xs">
                  EL
                </div>
                <div>
                  <h3 className="text-text-white font-heading font-bold text-base">Payment Details</h3>
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">ID: {selectedPayment.id}</span>
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
              
              {/* Status block */}
              <div className="p-4 rounded-2xl bg-bg-dark-secondary/40 border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted tracking-wide">Status State</span>
                  <p className="text-text-white font-bold text-sm mt-0.5">{selectedPayment.status}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedPayment.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  selectedPayment.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  selectedPayment.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-slate-500/10 text-text-muted border border-border'
                }`}>
                  {selectedPayment.status}
                </span>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Payment Summary</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Payment ID</span>
                    <span className="text-text-white font-mono font-bold">{selectedPayment.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Gateway Reference</span>
                    <span className="text-text-white font-mono">{selectedPayment.reference}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Created Time</span>
                    <span className="text-text-white">{selectedPayment.date} at {selectedPayment.time}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">API DisCo Gateway</span>
                    <span className="text-text-white">{selectedPayment.provider}</span>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Customer details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">User Name</span>
                    <span className="text-text-white font-bold">{selectedPayment.customer.name}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Email Profile</span>
                    <span className="text-text-white">{selectedPayment.customer.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Linked Phone</span>
                    <span className="text-text-white">{selectedPayment.customer.phone}</span>
                  </div>
                </div>
              </div>

              {/* DisCo Specs */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Electricity specifications</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Distribution Company</span>
                    <span className="text-text-white font-bold">{selectedPayment.provider}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Meter Type</span>
                    <span className="text-text-white font-bold">{selectedPayment.meterType}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Meter Number</span>
                    <span className="text-text-white font-mono">{selectedPayment.meterNumber}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">DisCo Account Name</span>
                    <span className="text-text-white">{selectedPayment.customerName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Account Address</span>
                    <span className="text-text-white text-[11px] leading-relaxed">{selectedPayment.customerAddress}</span>
                  </div>
                </div>
              </div>

              {/* Token Details */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Token specifications</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div className="col-span-2">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Generated Token Code</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-emerald-400 text-sm">
                      <span>{selectedPayment.token}</span>
                      {selectedPayment.token !== '-' && (
                        <button onClick={() => handleCopyText(selectedPayment.token)} className="p-0.5 hover:bg-bg-dark-secondary rounded text-text-muted hover:text-text-white transition-colors">
                          <DocumentDuplicateIcon className="w-4.5 h-4.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Purchased Units</span>
                    <span className="text-text-white font-bold">{selectedPayment.unitsPurchased || '-'} kWh</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Delivery Status</span>
                    <span className={`font-semibold ${selectedPayment.tokenDeliveryStatus === 'Delivered' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {selectedPayment.tokenDeliveryStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial values */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Financial details</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Cost Price</span>
                    <span className="text-text-white">₦{selectedPayment.costPrice}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Selling Price</span>
                    <span className="text-text-white font-bold">₦{selectedPayment.amount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Profit Share</span>
                    <span className="text-emerald-400 font-bold">₦{selectedPayment.profit}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">User Bal Before</span>
                    <span className="text-text-muted">₦{selectedPayment.walletBefore.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">User Bal After</span>
                    <span className="text-text-white font-bold">₦{selectedPayment.walletAfter.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Failure logs if any */}
              {selectedPayment.status === 'Failed' && selectedPayment.failureReason && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-500 text-xs space-y-1">
                  <span className="font-bold uppercase text-[10px]">Failure Log:</span>
                  <p className="leading-relaxed">{selectedPayment.failureReason}</p>
                </div>
              )}

              {/* Stepper timeline */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Processing Timeline</h4>
                
                <div className="relative pl-6 space-y-4 text-xs">
                  <div className="absolute left-2.5 top-1.5 bottom-1.5 w-0.5 bg-border" />
                  
                  <div className="relative flex gap-3">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-blue-500 border border-bg-card" />
                    <div>
                      <span className="font-semibold text-text-white block">Payment Created</span>
                      <span className="text-[10px] text-text-muted">{selectedPayment.date} at {selectedPayment.timeline.created}</span>
                    </div>
                  </div>

                  <div className="relative flex gap-3">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-indigo-500 border border-bg-card" />
                    <div>
                      <span className="font-semibold text-text-white block">Meter Number Validated</span>
                      <span className="text-[10px] text-text-muted">{selectedPayment.date} at {selectedPayment.timeline.validated}</span>
                    </div>
                  </div>

                  <div className="relative flex gap-3">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-cyan-400 border border-bg-card" />
                    <div>
                      <span className="font-semibold text-text-white block">Processing at API Gateway</span>
                      <span className="text-[10px] text-text-muted">{selectedPayment.date} at {selectedPayment.timeline.processing}</span>
                    </div>
                  </div>

                  <div className="relative flex gap-3">
                    <div className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border border-bg-card ${
                      selectedPayment.status === 'Success' ? 'bg-emerald-500' :
                      selectedPayment.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <span className="font-semibold text-text-white block">Token Generation Complete</span>
                      <span className="text-[10px] text-text-muted">{selectedPayment.date} at {selectedPayment.timeline.completed}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Drawer Actions Footer */}
            <div className="p-6 border-t border-border bg-bg-dark-secondary/30 flex gap-2">
              <button
                onClick={() => triggerToast(`Receipt requested for order ${selectedPayment.id}`)}
                className="flex-1 py-2.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                View Receipt
              </button>
              {selectedPayment.status === 'Failed' ? (
                <>
                  <button
                    onClick={() => handleRetryPayment(selectedPayment.id)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                  >
                    Retry Ticket
                  </button>
                  <button
                    onClick={() => handleRefundPayment(selectedPayment.id)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                  >
                    Refund ticket
                  </button>
                </>
              ) : (
                <>
                  {selectedPayment.token !== '-' && (
                    <button
                      onClick={() => handleCopyText(selectedPayment.token)}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                    >
                      Copy Token
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setPayments(prev => prev.map(p => p.id === selectedPayment.id ? { ...p, failureReason: 'Flagged by manual auditor review.' } : p));
                      triggerToast(`Payment ${selectedPayment.id} flagged for review.`);
                      setIsDrawerOpen(false);
                    }}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                  >
                    Flag Payment
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL: EXPORT HUB ──────────────────────────────────────────────── */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg"
            >
              ✕
            </button>
            
            <h3 className="text-text-white font-heading font-extrabold text-base mb-2">Export Electricity Payments</h3>
            <p className="text-text-gray text-xs mb-4">
              Select export parameter format and generate standard download reports.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">File Format</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportFormat('csv')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${exportFormat === 'csv' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-bg-dark-secondary border-border text-text-gray'}`}
                  >
                    CSV Format
                  </button>
                  <button
                    onClick={() => setExportFormat('pdf')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${exportFormat === 'pdf' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-bg-dark-secondary border-border text-text-gray'}`}
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
                    triggerToast(`Generated ${exportFormat.toUpperCase()} payments sheet.`);
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
