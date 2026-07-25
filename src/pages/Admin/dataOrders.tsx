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
  SignalIcon
} from '@heroicons/react/24/outline';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
interface DataOrder {
  id: string;
  reference: string;
  user: string;
  email: string;
  phone: string;
  network: 'MTN' | 'Airtel' | 'Glo' | '9mobile';
  recipient: string;
  bundleName: string;
  bundleCategory: 'Daily' | 'Weekly' | 'Monthly' | 'SME' | 'Corporate' | 'Unlimited';
  validity: string;
  amount: number;
  costPrice: number;
  profit: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed';
  date: string;
  time: string;
  provider: string;
  walletBefore: number;
  walletAfter: number;
  failureReason?: string;
  assignedAdmin?: string;
  timeline: {
    created: string;
    submitted: string;
    processing: string;
    delivered: string;
    completed: string;
  };
}

interface NetworkStats {
  name: 'MTN' | 'Airtel' | 'Glo' | '9mobile';
  orders: number;
  revenue: number;
  successRate: number;
  avgDeliveryTime: string;
  color: string;
}

interface PopularPlan {
  name: string;
  network: 'MTN' | 'Airtel' | 'Glo' | '9mobile';
  orders: number;
  revenue: number;
  trend: string;
  badgeColor: string;
}

interface AlertLog {
  id: string;
  title: string;
  desc: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
}

interface ActivityEvent {
  id: number;
  text: string;
  time: string;
  icon: string;
  color: string;
}

// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_ORDERS: DataOrder[] = [
  {
    id: 'SWT-DT-10045',
    reference: 'REF-DT-MTN-884021',
    user: 'Michael Anazodo',
    email: 'michael@example.com',
    phone: '+234 803 111 2222',
    network: 'MTN',
    recipient: '08012345678',
    bundleName: '10GB Monthly',
    bundleCategory: 'Monthly',
    validity: '30 Days',
    amount: 3000,
    costPrice: 2850,
    profit: 150,
    status: 'Success',
    date: '2026-06-20',
    time: '17:50:00',
    provider: 'MTN SME Link',
    walletBefore: 6500,
    walletAfter: 3500,
    timeline: {
      created: '17:49:15',
      submitted: '17:49:25',
      processing: '17:49:40',
      delivered: '17:49:55',
      completed: '17:50:00'
    }
  },
  {
    id: 'SWT-DT-10046',
    reference: 'REF-DT-AIR-992014',
    user: 'Chidi Benson',
    email: 'chidi.b@example.com',
    phone: '+234 803 445 7821',
    network: 'Airtel',
    recipient: '09022233344',
    bundleName: '5GB Weekly',
    bundleCategory: 'Weekly',
    validity: '7 Days',
    amount: 1500,
    costPrice: 1425,
    profit: 75,
    status: 'Success',
    date: '2026-06-20',
    time: '17:15:30',
    provider: 'Airtel Corporate Portal',
    walletBefore: 148000,
    walletAfter: 146500,
    timeline: {
      created: '17:14:45',
      submitted: '17:15:00',
      processing: '17:15:15',
      delivered: '17:15:25',
      completed: '17:15:30'
    }
  },
  {
    id: 'SWT-DT-10047',
    reference: 'REF-DT-GLO-289410',
    user: 'Amara Okafor',
    email: 'amara.o@example.com',
    phone: '+234 810 984 5673',
    network: 'Glo',
    recipient: '08051112222',
    bundleName: 'Glo Monthly 12GB',
    bundleCategory: 'Monthly',
    validity: '30 Days',
    amount: 2500,
    costPrice: 2350,
    profit: 150,
    status: 'Pending',
    date: '2026-06-20',
    time: '17:05:00',
    provider: 'Glo SME API',
    walletBefore: 247500,
    walletAfter: 245000,
    timeline: {
      created: '17:04:10',
      submitted: '17:04:30',
      processing: '17:04:55',
      delivered: '-',
      completed: '-'
    }
  },
  {
    id: 'SWT-DT-10048',
    reference: 'REF-DT-9MB-330491',
    user: 'Tunde Bakare',
    email: 'tunde.b@example.com',
    phone: '+234 802 984 5673',
    network: '9mobile',
    recipient: '08098765432',
    bundleName: 'Unlimited Daily',
    bundleCategory: 'Unlimited',
    validity: '24 Hours',
    amount: 5000,
    costPrice: 4750,
    profit: 250,
    status: 'Failed',
    date: '2026-06-20',
    time: '16:22:15',
    provider: '9mobile Direct Gateway',
    walletBefore: 11000,
    walletAfter: 11000,
    failureReason: 'Gateway provider reported timeout responding to product request code.',
    assignedAdmin: 'Aliyu Bello',
    timeline: {
      created: '16:21:00',
      submitted: '16:21:20',
      processing: '16:21:50',
      delivered: '-',
      completed: '16:22:15'
    }
  },
  {
    id: 'SWT-DT-10049',
    reference: 'REF-DT-MTN-330912',
    user: 'Fatima Musa',
    email: 'fatima.m@example.com',
    phone: '+234 903 234 5678',
    network: 'MTN',
    recipient: '08039998888',
    bundleName: '40GB Corporate Gift',
    bundleCategory: 'Corporate',
    validity: '30 Days',
    amount: 10000,
    costPrice: 9400,
    profit: 600,
    status: 'Success',
    date: '2026-06-20',
    time: '14:15:30',
    provider: 'MTN SME Link',
    walletBefore: 97000,
    walletAfter: 87000,
    timeline: {
      created: '14:14:30',
      submitted: '14:14:45',
      processing: '14:15:10',
      delivered: '14:15:25',
      completed: '14:15:30'
    }
  },
  {
    id: 'SWT-DT-10050',
    reference: 'REF-DT-AIR-092834',
    user: 'Obinna Ani',
    email: 'obinna.a@example.com',
    phone: '+234 705 270 5119',
    network: 'Airtel',
    recipient: '09012345678',
    bundleName: '1.5GB Daily',
    bundleCategory: 'Daily',
    validity: '24 Hours',
    amount: 500,
    costPrice: 475,
    profit: 25,
    status: 'Reversed',
    date: '2026-06-19',
    time: '11:45:00',
    provider: 'Airtel Corporate Portal',
    walletBefore: 12500,
    walletAfter: 12500,
    failureReason: 'Airtel API returned code 422: Destination number is inactive.',
    assignedAdmin: 'System AutoReversal',
    timeline: {
      created: '11:43:50',
      submitted: '11:44:05',
      processing: '11:44:30',
      delivered: '-',
      completed: '11:45:00'
    }
  },
  {
    id: 'SWT-DT-10051',
    reference: 'REF-DT-GLO-119280',
    user: 'Aisha Yusuf',
    email: 'aisha.y@example.com',
    phone: '+234 803 112 3456',
    network: 'Glo',
    recipient: '08159998888',
    bundleName: 'Glo Monthly 12GB',
    bundleCategory: 'Monthly',
    validity: '30 Days',
    amount: 2500,
    costPrice: 2350,
    profit: 150,
    status: 'Success',
    date: '2026-06-19',
    time: '09:22:15',
    provider: 'Glo SME API',
    walletBefore: 322500,
    walletAfter: 320000,
    timeline: {
      created: '09:21:00',
      submitted: '09:21:20',
      processing: '09:21:45',
      delivered: '09:22:10',
      completed: '09:22:15'
    }
  }
];

const INITIAL_NETWORK_STATS: NetworkStats[] = [
  { name: 'MTN', orders: 32400, revenue: 21300000, successRate: 99.3, avgDeliveryTime: '5.2s', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  { name: 'Airtel', orders: 18500, revenue: 12150000, successRate: 99.0, avgDeliveryTime: '6.4s', color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  { name: 'Glo', orders: 10200, revenue: 6850000, successRate: 98.4, avgDeliveryTime: '9.5s', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  { name: '9mobile', orders: 3720, revenue: 2300000, successRate: 96.5, avgDeliveryTime: '11.8s', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' }
];

const POPULAR_PLANS: PopularPlan[] = [
  { name: 'MTN 10GB Monthly', network: 'MTN', orders: 4520, revenue: 13500000, trend: '+18%', badgeColor: 'text-amber-500 bg-amber-500/10' },
  { name: 'Airtel 5GB Weekly', network: 'Airtel', orders: 3210, revenue: 7800000, trend: '+12%', badgeColor: 'text-red-500 bg-red-500/10' },
  { name: 'Glo Monthly 12GB', network: 'Glo', orders: 2842, revenue: 6100000, trend: '+9.4%', badgeColor: 'text-emerald-500 bg-emerald-500/10' }
];

const INITIAL_ALERTS: AlertLog[] = [
  { id: 'ALT-DT-01', title: '9mobile SME Gateway Latency', desc: 'Average delivery response latency increased to 24 seconds.', severity: 'High', timestamp: '12m ago' },
  { id: 'ALT-DT-02', title: 'Glo Dual Delivery Failure', desc: 'GLO corporate API failed on 5 consecutive data bundles.', severity: 'High', timestamp: '35m ago' },
  { id: 'ALT-DT-03', title: 'MTN API Downtime', desc: 'MTN Corporate Gifting gateway reported connection reset errors.', severity: 'Critical', timestamp: '1h ago' }
];

const LIVE_MONITOR_EVENTS: ActivityEvent[] = [
  { id: 1, text: 'Data Bundle Delivered: MTN 10GB to 0803•••1122', time: 'Just now', icon: '⚡', color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 2, text: 'Provider Delay: Airtel SME Gateway lag detected (18s)', time: '3 mins ago', icon: '⚠️', color: 'text-amber-400 bg-amber-500/10' },
  { id: 3, text: 'Order Retried: SWT-DT-10048 routed to backup portal', time: '8 mins ago', icon: '🔄', color: 'text-blue-400 bg-blue-500/10' },
  { id: 4, text: 'Refund Issued: ₦5,000 to USR-001248 wallet balance', time: '14 mins ago', icon: '🔄', color: 'text-cyan-400 bg-cyan-500/10' }
];

// Recharts Charts Data
const REVENUE_ANALYTICS_DATA = [
  { name: 'Mon', Revenue: 5200000, Profit: 312000 },
  { name: 'Tue', Revenue: 6100000, Profit: 366000 },
  { name: 'Wed', Revenue: 5800000, Profit: 348000 },
  { name: 'Thu', Revenue: 6400000, Profit: 384000 },
  { name: 'Fri', Revenue: 7100000, Profit: 426000 },
  { name: 'Sat', Revenue: 8500000, Profit: 510000 },
  { name: 'Sun', Revenue: 6200000, Profit: 372000 }
];

const NETWORK_DISTRIBUTION_PIE = [
  { name: 'MTN', value: 32400, color: '#f59e0b' },
  { name: 'Airtel', value: 18500, color: '#ef4444' },
  { name: 'Glo', value: 10200, color: '#10b981' },
  { name: '9mobile', value: 3720, color: '#06b6d4' }
];

export default function AdminDataOrders() {
  
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [orders, setOrders] = useState<DataOrder[]>(INITIAL_ORDERS);
  const [networkStats] = useState<NetworkStats[]>(INITIAL_NETWORK_STATS);
  const [popularPlans] = useState<PopularPlan[]>(POPULAR_PLANS);
  const [alerts, setAlerts] = useState<AlertLog[]>(INITIAL_ALERTS);
  const [timelineEvents, setTimelineEvents] = useState(LIVE_MONITOR_EVENTS);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [networkFilter, setNetworkFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [providerFilter, setProviderFilter] = useState('All');

  // Sorting / Pagination
  const [sortField, setSortField] = useState<'id' | 'amount' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected Order Drawer / Loaders / Toasts
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<DataOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Export options modal
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  // Live timeline simulated feed
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        { text: 'Airtel Data Bundle Delivered: 5GB Weekly to 0902•••1094', icon: '⚡', color: 'text-emerald-400 bg-emerald-500/10' },
        { text: 'MTN Order Delivered: 10GB Monthly to 0803•••9920', icon: '⚡', color: 'text-emerald-400 bg-emerald-500/10' },
        { text: '9mobile SME Gateway Lagging: response delay at 18s', icon: '⚠️', color: 'text-amber-400 bg-amber-500/10' },
        { text: 'Data Bundle Failed: Glo SME ₦2,500 order timed out', icon: '❌', color: 'text-red-400 bg-red-500/10' }
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
    }, 13000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ─── FILTER & SORT LOGIC ──────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Global Search
      const searchMatch = searchQuery === '' || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.bundleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery);

      // Network / Category / Status / Provider
      const netMatch = networkFilter === 'All' || order.network.toLowerCase() === networkFilter.toLowerCase();
      const catMatch = categoryFilter === 'All' || order.bundleCategory === categoryFilter;
      const statusMatch = statusFilter === 'All' || order.status === statusFilter;
      const providerMatch = providerFilter === 'All' || order.provider.toLowerCase().includes(providerFilter.toLowerCase());

      // Amount range
      const minA = minAmount === '' ? 0 : parseFloat(minAmount);
      const maxA = maxAmount === '' ? Infinity : parseFloat(maxAmount);
      const amountMatch = order.amount >= minA && order.amount <= maxA;

      return searchMatch && netMatch && catMatch && statusMatch && providerMatch && amountMatch;
    });
  }, [orders, searchQuery, networkFilter, categoryFilter, statusFilter, minAmount, maxAmount, providerFilter]);

  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
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
  }, [filteredOrders, sortField, sortDirection]);

  const paginatedOrders = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedOrders.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedOrders, currentPage]);

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Reset filter controls
  const handleResetFilters = () => {
    setSearchQuery('');
    setNetworkFilter('All');
    setCategoryFilter('All');
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
      setOrders(INITIAL_ORDERS);
      setLoading(false);
      triggerToast('Data orders log updated.');
    }, 750);
  };

  // Row selection handlers
  const handleSelectRow = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(paginatedOrders.map(o => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleBulkAction = (action: string) => {
    triggerToast(`Bulk operation "${action}" applied to ${selectedOrderIds.length} orders.`);
    setSelectedOrderIds([]);
  };

  // Failed queue interventions
  const handleRetryOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status: 'Success', 
          assignedAdmin: undefined,
          timeline: { ...o.timeline, completed: 'Just now', delivered: 'Just now', processing: 'Just now' }
        };
      }
      return o;
    }));
    triggerToast(`Retried data order ${orderId} successfully. Delivery receipt dispatched.`);
    setIsDrawerOpen(false);
  };

  const handleRefundOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'Reversed', assignedAdmin: 'System Refund' };
      }
      return o;
    }));
    triggerToast(`Data order ${orderId} reversed. Recredit amount of ₦${orders.find(o => o.id === orderId)?.amount} logged.`);
    setIsDrawerOpen(false);
  };

  const failedOrdersQueue = useMemo(() => {
    return orders.filter(o => o.status === 'Failed');
  }, [orders]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      
      {/* Toast Alert Banner */}
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
            <h2 className="text-text-white font-heading font-extrabold text-2xl tracking-tight">Data Orders</h2>
            <p className="text-text-gray text-xs sm:text-sm mt-1 max-w-2xl">
              Monitor data purchases, track delivery performance, manage failures, and analyze service operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setExportFormat('csv'); setShowExportModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              Export Orders
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
          
          {/* Card 1: Total Data Orders */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Orders</span>
              <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <SignalIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">64,820</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+14% wk</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,10 L10,8 L20,12 L30,5 L40,7 L50,2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Total Data Volume */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Volume (₦)</span>
              <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold">₦</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦42.60M</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+16.2% month</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L12,10 L24,5 L36,7 L50,1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Successful Orders */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Success</span>
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">99.1%</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+0.1% rate</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,8 L15,8 L25,5 L35,5 L50,3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Failed Orders */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Failed</span>
              <div className="p-1.5 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                <XCircleIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">0.7%</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">-0.3% drop</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-red-500 fill-none" strokeWidth="1.5">
                  <path d="M0,3 L15,5 L30,12 L50,14" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 5: Pending Orders */}
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
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦3,120,000</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+9.8% profit</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L15,11 L30,5 L50,2" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* ─── DATA CONTROLS TOOLBAR ─────────────────────────────────────────── */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by Transaction ID, User, Recipient Phone, Bundle, Order Reference..."
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
              
              {/* Network */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Network</label>
                <select
                  value={networkFilter}
                  onChange={(e) => { setNetworkFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Networks</option>
                  <option value="MTN">MTN</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Glo">Glo</option>
                  <option value="9mobile">9mobile</option>
                </select>
              </div>

              {/* Data Category */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All categories</option>
                  <option value="Daily">Daily Plans</option>
                  <option value="Weekly">Weekly Plans</option>
                  <option value="Monthly">Monthly Plans</option>
                  <option value="SME">SME Bundles</option>
                  <option value="Corporate">Corporate Gifts</option>
                  <option value="Unlimited">Unlimited Plans</option>
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
                  <option value="SME Link">MTN SME Link</option>
                  <option value="Corporate Portal">Airtel Corporate</option>
                  <option value="SME API">Glo SME API</option>
                  <option value="Direct Gateway">9mobile Gateway</option>
                </select>
              </div>

              {/* Amount Range */}
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

              {/* Date Filter */}
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

        {/* ─── DATA ORDERS TABLE & DRAWER ────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* Table Container (2/3 width) */}
          <div className="xl:col-span-2 bg-bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
            
            <div className="p-5 border-b border-border flex items-center justify-between">
              <span className="text-text-white font-heading font-extrabold text-sm">Bundle Ledger Logs</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-bold">
                Showing {filteredOrders.length} orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border sticky top-0">
                  <tr>
                    <th className="px-5 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedOrders.length > 0 && paginatedOrders.every(o => selectedOrderIds.includes(o.id))}
                        onChange={handleSelectAll}
                        className="rounded border-border focus:ring-blue-500 text-blue-600"
                      />
                    </th>
                    <th 
                      onClick={() => { setSortField('id'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Order ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">Network</th>
                    <th className="px-4 py-4">Recipient</th>
                    <th className="px-4 py-4">Bundle</th>
                    <th 
                      onClick={() => { setSortField('amount'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">Profit</th>
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
                        <td className="px-4 py-4"><div className="w-12 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-20 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-20 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-14 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-10 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-16 h-5 bg-border/40 rounded-full" /></td>
                        <td className="px-5 py-4 text-center"><div className="w-12 h-6 bg-border/40 rounded mx-auto" /></td>
                      </tr>
                    ))
                  ) : paginatedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                          </div>
                          <h4 className="text-text-white font-heading font-bold text-sm">No data orders found</h4>
                          <p className="text-text-muted text-[11px] mt-1.5">
                            No logs matched your searching queries or network filters.
                          </p>
                          <button
                            onClick={handleResetFilters}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                          >
                            Refresh Orders
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order) => {
                      const isSelected = selectedOrderIds.includes(order.id);
                      return (
                        <tr 
                          key={order.id} 
                          className={`hover:bg-bg-dark-secondary/30 transition-colors cursor-pointer ${isSelected ? 'bg-blue-500/5' : ''}`}
                          onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); }}
                        >
                          <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(order.id)}
                              className="rounded border-border focus:ring-blue-500 text-blue-600"
                            />
                          </td>
                          <td className="px-4 py-4 font-mono font-bold text-blue-500">{order.id}</td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="font-semibold text-text-white">{order.user}</div>
                            <div className="text-[10px] text-text-muted mt-0.5">{order.email}</div>
                          </td>
                          <td className="px-4 py-4 font-bold text-text-white">{order.network}</td>
                          <td className="px-4 py-4 font-mono text-text-gray">{order.recipient}</td>
                          <td className="px-4 py-4 text-text-white">{order.bundleName}</td>
                          <td className="px-4 py-4 font-bold text-text-white">₦{order.amount.toLocaleString()}</td>
                          <td className="px-4 py-4 text-text-muted">₦{order.profit}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                              order.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                              order.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                              'bg-slate-500/10 text-text-muted border border-border'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-text-muted whitespace-nowrap">
                            {order.date} <span className="text-[10px] ml-1">{order.time}</span>
                          </td>
                          <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => { setSelectedOrder(order); setIsDrawerOpen(true); }}
                                className="p-1 rounded-md hover:bg-bg-dark-secondary text-text-gray hover:text-text-white transition-colors"
                                title="View Details"
                              >
                                <EyeIcon className="w-3.5 h-3.5" />
                              </button>
                              {order.status === 'Failed' && (
                                <button
                                  onClick={() => handleRetryOrder(order.id)}
                                  className="p-1 rounded-md hover:bg-bg-dark-secondary text-text-gray hover:text-blue-400 transition-colors"
                                  title="Retry Transaction Gateway"
                                >
                                  <span className="text-xs">🔄</span>
                                </button>
                              )}
                              <button
                                onClick={() => triggerToast(`Auditor receipt generated for ${order.id}.`)}
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
            {!loading && sortedOrders.length > 0 && (
              <div className="p-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-text-muted">
                  Showing <span className="text-text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="text-text-white font-bold">
                    {Math.min(currentPage * itemsPerPage, sortedOrders.length)}
                  </span>{' '}
                  of <span className="text-text-white font-bold">{sortedOrders.length}</span> entries
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

          {/* Popular Plans List & Service Monitoring Timeline (1/3 width) */}
          <div className="space-y-6">
            
            {/* Popular Plans Widget */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="border-b border-border pb-2">
                <h3 className="text-text-white font-heading font-extrabold text-sm">Popular Data Plans</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Top performing products by subscription volumes</p>
              </div>

              <div className="space-y-2 text-xs">
                {popularPlans.map((plan, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-bg-dark-secondary/35 border border-border/50 rounded-xl hover:border-border-hover transition-colors">
                    <div>
                      <p className="font-bold text-text-white">{plan.name}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">Orders: <span className="text-text-white font-bold">{plan.orders}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-text-white">₦{(plan.revenue / 1000000).toFixed(1)}M</p>
                      <span className="text-[9px] text-emerald-400 font-semibold">{plan.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monitoring timeline feed */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-text-white font-heading font-extrabold text-sm">Service Monitoring Feed</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Real-time bundle gateways activities feed</p>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="space-y-2 text-[10px]">
                {timelineEvents.map((evt) => (
                  <div key={evt.id} className="flex gap-2.5 p-2.5 bg-bg-dark-secondary/35 border border-border/50 rounded-xl items-start">
                    <div className={`p-2 rounded-lg text-xs ${evt.color}`}>
                      {evt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
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
        {selectedOrderIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-bg-card border border-blue-500/30 px-6 py-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-text-white font-heading">
                {selectedOrderIds.length} orders selected
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
                onClick={() => setSelectedOrderIds([])}
                className="p-1 text-text-muted hover:text-text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ─── TELECOM NETWORK DATA PERFORMANCE ──────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-3">
            <h3 className="text-text-white font-heading font-extrabold text-sm">Network Data Delivery Performance</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Real-time parameters across core data subscription routers</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {networkStats.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-bg-dark-secondary/35 border border-border/50 rounded-xl p-4 flex items-center justify-between hover:border-border-hover transition-colors"
              >
                <div className="space-y-1">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    stat.name === 'MTN' ? 'bg-amber-500/10 text-amber-400' :
                    stat.name === 'Airtel' ? 'bg-red-500/10 text-red-400' :
                    stat.name === 'Glo' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-cyan-500/10 text-cyan-400'
                  }`}>
                    {stat.name}
                  </span>
                  <p className="text-xs text-text-muted mt-1">Orders: <span className="text-text-white font-bold">{stat.orders.toLocaleString()}</span></p>
                  <p className="text-xs text-text-muted">Rev: <span className="text-text-white font-bold">₦{(stat.revenue/1000000).toFixed(1)}M</span></p>
                  <p className="text-[10px] text-text-muted">Avg Latency: <span className="text-text-white font-bold">{stat.avgDeliveryTime}</span></p>
                </div>
                <div className="text-right">
                  <span className="block font-heading font-extrabold text-lg text-emerald-400">{stat.successRate}%</span>
                  <span className="text-[9px] text-emerald-400/80 font-semibold">Gateway Ok</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FAILED ORDERS ACTION QUEUE ────────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-text-white font-heading font-extrabold text-sm">Failed Orders Action Queue</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Review and reconcile gateway-failed data bundle queries</p>
            </div>
            <span className="text-xs font-bold text-red-500 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              {failedOrdersQueue.length} Active Failures
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Network</th>
                  <th className="px-4 py-4">Bundle</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Failure Reason</th>
                  <th className="px-4 py-4">Assigned Auditor</th>
                  <th className="px-5 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {failedOrdersQueue.map(order => (
                  <tr key={order.id} className="hover:bg-bg-dark-secondary/20 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-text-white">{order.id}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-text-white">{order.user}</div>
                      <div className="text-[9px] text-text-muted">{order.email}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-[10px] font-extrabold uppercase text-text-white">{order.network}</span>
                    </td>
                    <td className="px-4 py-4 text-text-gray font-medium">{order.bundleName}</td>
                    <td className="px-4 py-4 font-bold text-text-white">₦{order.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-red-400 max-w-xs truncate" title={order.failureReason}>{order.failureReason}</td>
                    <td className="px-4 py-4 text-text-muted">{order.assignedAdmin || 'Unassigned'}</td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleRetryOrder(order.id)}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                        >
                          Retry
                        </button>
                        <button
                          onClick={() => handleRefundOrder(order.id)}
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
            <h3 className="text-text-white font-heading font-extrabold text-sm">Revenue & Network Analytics</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Performance statistics across channels and profit metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Chart 1: Revenue Stack */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Weekly Data Revenue trends (₦)</span>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_ANALYTICS_DATA}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--bg-muted)" fontSize={10} />
                    <YAxis stroke="var(--bg-muted)" fontSize={10} tickFormatter={(v) => `₦${v/1000000}M`} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                    <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#revGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Network Distribution Share */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Telecom share (Orders count)</span>
              <div className="h-60 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={NETWORK_DISTRIBUTION_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {NETWORK_DISTRIBUTION_PIE.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} formatter={(val) => `${val} orders`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend list */}
                <div className="flex flex-col gap-1.5 ml-4 whitespace-nowrap">
                  {NETWORK_DISTRIBUTION_PIE.map((item, idx) => (
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

        {/* ─── SYSTEM ALERTS LOG ─────────────────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <h3 className="text-text-white font-heading font-extrabold text-sm flex items-center gap-2">
              <span className="text-xs">⚠️</span>
              Service Alerts Center
            </h3>
            <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-500 font-bold px-2.5 py-0.5 rounded-full">
              {alerts.length} Incidents Active
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
                  <span>Incident Logged</span>
                  <span>{alert.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ─── DETAILS DRAWER (SLIDE OVER) ────────────────────────────────────── */}
      {isDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div onClick={() => setIsDrawerOpen(false)} className="flex-1" />
          
          <div className="w-full max-w-lg bg-bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-bg-dark-secondary/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center font-heading font-extrabold text-blue-500 text-xs shadow-xs">
                  DT
                </div>
                <div>
                  <h3 className="text-text-white font-heading font-bold text-base">Order Details</h3>
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">ID: {selectedOrder.id}</span>
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
              
              {/* Status Block */}
              <div className="p-4 rounded-2xl bg-bg-dark-secondary/40 border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted tracking-wide">Status State</span>
                  <p className="text-text-white font-bold text-sm mt-0.5">{selectedOrder.status}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedOrder.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  selectedOrder.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  selectedOrder.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-slate-500/10 text-text-muted border border-border'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Order Summary</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Order ID</span>
                    <span className="text-text-white font-mono font-bold">{selectedOrder.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Gateway Reference</span>
                    <span className="text-text-white font-mono">{selectedOrder.reference}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Created Time</span>
                    <span className="text-text-white">{selectedOrder.date} at {selectedOrder.time}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">API Gateway Router</span>
                    <span className="text-text-white">{selectedOrder.provider}</span>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Customer details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">User Name</span>
                    <span className="text-text-white font-bold">{selectedOrder.user}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Email Profile</span>
                    <span className="text-text-white">{selectedOrder.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Linked Phone</span>
                    <span className="text-text-white">{selectedOrder.phone}</span>
                  </div>
                </div>
              </div>

              {/* Purchase info */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Data Bundle details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Network Carrier</span>
                    <span className="text-text-white font-bold">{selectedOrder.network}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Bundle Product Name</span>
                    <span className="text-text-white font-bold">{selectedOrder.bundleName}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Bundle Category</span>
                    <span className="text-text-white">{selectedOrder.bundleCategory}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Validity Span</span>
                    <span className="text-text-white">{selectedOrder.validity}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Recipient Phone Number</span>
                    <span className="text-text-white font-mono">{selectedOrder.recipient}</span>
                  </div>
                </div>
              </div>

              {/* Financial values */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Financial details</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Cost Price</span>
                    <span className="text-text-white">₦{selectedOrder.costPrice}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Selling Price</span>
                    <span className="text-text-white font-bold">₦{selectedOrder.amount}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Profit Share</span>
                    <span className="text-emerald-400 font-bold">₦{selectedOrder.profit}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">User Bal Before</span>
                    <span className="text-text-muted">₦{selectedOrder.walletBefore.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">User Bal After</span>
                    <span className="text-text-white font-bold">₦{selectedOrder.walletAfter.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Failure logs if any */}
              {selectedOrder.status === 'Failed' && selectedOrder.failureReason && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-500 text-xs space-y-1">
                  <span className="font-bold uppercase text-[10px]">Failure Log:</span>
                  <p className="leading-relaxed">{selectedOrder.failureReason}</p>
                </div>
              )}

              {/* Stepper reconciliations */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Processing Timeline</h4>
                
                <div className="relative pl-6 space-y-4 text-xs">
                  <div className="absolute left-2.5 top-1.5 bottom-1.5 w-0.5 bg-border" />
                  
                  <div className="relative flex gap-3">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-blue-500 border border-bg-card" />
                    <div>
                      <span className="font-semibold text-text-white block">Order Created</span>
                      <span className="text-[10px] text-text-muted">{selectedOrder.date} at {selectedOrder.timeline.created}</span>
                    </div>
                  </div>

                  <div className="relative flex gap-3">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-cyan-400 border border-bg-card" />
                    <div>
                      <span className="font-semibold text-text-white block">Submitted to Gateway Router</span>
                      <span className="text-[10px] text-text-muted">{selectedOrder.date} at {selectedOrder.timeline.submitted}</span>
                    </div>
                  </div>

                  <div className="relative flex gap-3">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-amber-400 border border-bg-card" />
                    <div>
                      <span className="font-semibold text-text-white block">Processing at Carrier Gateway</span>
                      <span className="text-[10px] text-text-muted">{selectedOrder.date} at {selectedOrder.timeline.processing}</span>
                    </div>
                  </div>

                  <div className="relative flex gap-3">
                    <div className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border border-bg-card ${
                      selectedOrder.status === 'Success' ? 'bg-emerald-500' :
                      selectedOrder.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <span className="font-semibold text-text-white block">Reconciliation Finished</span>
                      <span className="text-[10px] text-text-muted">{selectedOrder.date} at {selectedOrder.timeline.completed}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-border bg-bg-dark-secondary/30 flex gap-2">
              <button
                onClick={() => triggerToast(`Receipt requested for order ${selectedOrder.id}`)}
                className="flex-1 py-2.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                View Receipt
              </button>
              {selectedOrder.status === 'Failed' ? (
                <>
                  <button
                    onClick={() => handleRetryOrder(selectedOrder.id)}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                  >
                    Retry Order
                  </button>
                  <button
                    onClick={() => handleRefundOrder(selectedOrder.id)}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                  >
                    Refund Order
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, failureReason: 'Manually flagged by auditor.' } : o));
                    triggerToast(`Order ${selectedOrder.id} flagged for review.`);
                    setIsDrawerOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Flag Order
                </button>
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
            
            <h3 className="text-text-white font-heading font-extrabold text-base mb-2">Export Data Orders</h3>
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
                    triggerToast(`Generated ${exportFormat.toUpperCase()} orders sheet.`);
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
