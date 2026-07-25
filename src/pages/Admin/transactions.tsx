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
  ListBulletIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  FlagIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
interface Transaction {
  id: string;
  reference: string;
  user: string;
  email: string;
  phone: string;
  service: 'Airtime' | 'Data' | 'Electricity' | 'Cable TV' | 'Wallet Funding';
  recipient: string;
  amount: number;
  fee: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed';
  date: string;
  time: string;
  provider: string;
  paymentMethod: 'Wallet' | 'Card' | 'Bank Transfer';
  walletBefore: number;
  walletAfter: number;
  riskScore?: 'Low' | 'Medium' | 'High' | 'Critical';
  flaggedReason?: string;
  timeline: {
    created: string;
    processing: string;
    completed: string;
    updated: string;
  };
}

interface RefundRequest {
  id: string;
  txId: string;
  user: string;
  amount: number;
  reason: string;
  submitted: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface FlaggedTx {
  id: string;
  txId: string;
  user: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  reason: string;
  assignedAdmin: string;
  status: 'Reviewed' | 'Under Investigation' | 'Suspended';
}

// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'SWT-TX-10984',
    reference: 'REF-MTN-8849102',
    user: 'Michael Anazodo',
    email: 'michael@example.com',
    phone: '+234 803 111 2222',
    service: 'Airtime',
    recipient: '08012345678',
    amount: 1000,
    fee: 0,
    status: 'Success',
    date: '2026-06-20',
    time: '17:30:15',
    provider: 'MTN',
    paymentMethod: 'Wallet',
    walletBefore: 4500,
    walletAfter: 3500,
    timeline: {
      created: '17:30:00',
      processing: '17:30:05',
      completed: '17:30:15',
      updated: '17:30:15'
    }
  },
  {
    id: 'SWT-TX-10985',
    reference: 'REF-GLO-2894103',
    user: 'Chidi Benson',
    email: 'chidi.b@example.com',
    phone: '+234 803 445 7821',
    service: 'Data',
    recipient: '08051112222',
    amount: 3500,
    fee: 0,
    status: 'Success',
    date: '2026-06-20',
    time: '16:45:00',
    provider: 'GLO',
    paymentMethod: 'Wallet',
    walletBefore: 150000,
    walletAfter: 146500,
    timeline: {
      created: '16:44:30',
      processing: '16:44:45',
      completed: '16:45:00',
      updated: '16:45:00'
    }
  },
  {
    id: 'SWT-TX-10986',
    reference: 'REF-AEDC-9844105',
    user: 'Amara Okafor',
    email: 'amara.o@example.com',
    phone: '+234 810 984 5673',
    service: 'Electricity',
    recipient: 'Meter: 44021948301',
    amount: 25000,
    fee: 100,
    status: 'Pending',
    date: '2026-06-20',
    time: '16:12:30',
    provider: 'AEDC',
    paymentMethod: 'Card',
    walletBefore: 245000,
    walletAfter: 245000,
    timeline: {
      created: '16:12:00',
      processing: '16:12:15',
      completed: '-',
      updated: '16:12:30'
    }
  },
  {
    id: 'SWT-TX-10987',
    reference: 'REF-DSTV-2311492',
    user: 'Tunde Bakare',
    email: 'tunde.b@example.com',
    phone: '+234 802 984 5673',
    service: 'Cable TV',
    recipient: 'SmartCard: 1029384756',
    amount: 9500,
    fee: 50,
    status: 'Failed',
    date: '2026-06-20',
    time: '15:20:10',
    provider: 'DSTV',
    paymentMethod: 'Wallet',
    walletBefore: 14000,
    walletAfter: 14000,
    timeline: {
      created: '15:19:30',
      processing: '15:19:45',
      completed: '15:20:10',
      updated: '15:20:10'
    }
  },
  {
    id: 'SWT-TX-10988',
    reference: 'REF-PSTK-0092812',
    user: 'Fatima Musa',
    email: 'fatima.m@example.com',
    phone: '+234 903 234 5678',
    service: 'Wallet Funding',
    recipient: 'Wallet Balance',
    amount: 50000,
    fee: 0,
    status: 'Success',
    date: '2026-06-20',
    time: '14:05:40',
    provider: 'Paystack',
    paymentMethod: 'Bank Transfer',
    walletBefore: 37000,
    walletAfter: 87000,
    timeline: {
      created: '14:05:00',
      processing: '14:05:15',
      completed: '14:05:40',
      updated: '14:05:40'
    }
  },
  {
    id: 'SWT-TX-10989',
    reference: 'REF-MTN-3349108',
    user: 'Obinna Ani',
    email: 'obinna.a@example.com',
    phone: '+234 705 270 5119',
    service: 'Data',
    recipient: '08039998888',
    amount: 1500,
    fee: 0,
    status: 'Reversed',
    date: '2026-06-19',
    time: '11:42:15',
    provider: 'MTN',
    paymentMethod: 'Wallet',
    walletBefore: 13500,
    walletAfter: 13500,
    timeline: {
      created: '11:40:00',
      processing: '11:40:30',
      completed: '11:41:10',
      updated: '11:42:15'
    }
  },
  {
    id: 'SWT-TX-10990',
    reference: 'REF-AIR-2234091',
    user: 'Aisha Yusuf',
    email: 'aisha.y@example.com',
    phone: '+234 803 112 3456',
    service: 'Airtime',
    recipient: '09022233344',
    amount: 5000,
    fee: 0,
    status: 'Success',
    date: '2026-06-19',
    time: '09:15:30',
    provider: 'Airtel',
    paymentMethod: 'Wallet',
    walletBefore: 325000,
    walletAfter: 320000,
    timeline: {
      created: '09:15:00',
      processing: '09:15:10',
      completed: '09:15:30',
      updated: '09:15:30'
    }
  },
  {
    id: 'SWT-TX-10991',
    reference: 'REF-EKEDC-109823',
    user: 'Grace Emmanuel',
    email: 'grace.e@example.com',
    phone: '+234 905 678 1234',
    service: 'Electricity',
    recipient: 'Meter: 54109827301',
    amount: 15000,
    fee: 100,
    status: 'Success',
    date: '2026-06-18',
    time: '18:50:00',
    provider: 'EKEDC',
    paymentMethod: 'Card',
    walletBefore: 110000,
    walletAfter: 95000,
    timeline: {
      created: '18:49:00',
      processing: '18:49:30',
      completed: '18:50:00',
      updated: '18:50:00'
    }
  },
  {
    id: 'SWT-TX-10992',
    reference: 'REF-GOTV-2894101',
    user: 'David Mark',
    email: 'david.m@example.com',
    phone: '+234 812 345 6789',
    service: 'Cable TV',
    recipient: 'IUC: 203984110',
    amount: 4000,
    fee: 50,
    status: 'Success',
    date: '2026-06-18',
    time: '12:10:45',
    provider: 'GOTV',
    paymentMethod: 'Wallet',
    walletBefore: 4000,
    walletAfter: 0,
    timeline: {
      created: '12:10:00',
      processing: '12:10:20',
      completed: '12:10:45',
      updated: '12:10:45'
    }
  }
];

const INITIAL_REFUNDS: RefundRequest[] = [
  { id: 'REF-REQ-01', txId: 'SWT-TX-10987', user: 'Tunde Bakare', amount: 9500, reason: 'Cable TV subscription failed but wallet was debited.', submitted: '2026-06-20', status: 'Pending' },
  { id: 'REF-REQ-02', txId: 'SWT-TX-10989', user: 'Obinna Ani', amount: 1500, reason: 'Data bundle delivery timed out. Autoreversal failed.', submitted: '2026-06-19', status: 'Approved' },
  { id: 'REF-REQ-03', txId: 'SWT-TX-10991', user: 'Grace Emmanuel', amount: 15000, reason: 'Duplicate card charge occurred during electricity funding.', submitted: '2026-06-18', status: 'Pending' }
];

const INITIAL_FLAGGED: FlaggedTx[] = [
  { id: 'FLG-01', txId: 'SWT-TX-10986', user: 'Amara Okafor', riskLevel: 'Medium', reason: 'High amount electricity payment via newly linked card.', assignedAdmin: 'Chidera Obi', status: 'Under Investigation' },
  { id: 'FLG-02', txId: 'SWT-TX-10988', user: 'Fatima Musa', riskLevel: 'High', reason: 'Instant wallet funding of ₦50,000 from unverified source.', assignedAdmin: 'Super Admin', status: 'Under Investigation' },
  { id: 'FLG-03', txId: 'SWT-TX-10992', user: 'David Mark', riskLevel: 'Critical', reason: 'Wallet balance drained immediately to zero via Cable TV subscription.', assignedAdmin: 'Aliyu Bello', status: 'Suspended' }
];

const LIVE_MONITOR_EVENTS = [
  { id: 1, type: 'funding', text: 'Wallet Funded: @michael credited ₦20,000 via Paystack', time: 'Just now', icon: '💳', color: 'text-emerald-400 bg-emerald-500/10' },
  { id: 2, type: 'purchase', text: 'Data Purchase Completed: @chidi purchased MTN 10GB Data', time: '2 mins ago', icon: '📶', color: 'text-blue-400 bg-blue-500/10' },
  { id: 3, type: 'purchase', text: 'Electricity Payment Delivered: @amara purchased AEDC ₦25,000 token', time: '4 mins ago', icon: '⚡', color: 'text-amber-400 bg-amber-500/10' },
  { id: 4, type: 'purchase', text: 'Cable Subscription Activated: @tunde renewed DSTV Compact (₦9,500)', time: '8 mins ago', icon: '📺', color: 'text-cyan-400 bg-cyan-500/10' },
  { id: 5, type: 'reversed', text: 'Transaction Reversed: Refunded ₦1,500 to @obinna for failed Data order', time: '15 mins ago', icon: '🔄', color: 'text-red-400 bg-red-500/10' }
];

// Recharts Charts Data
const TRANSACTION_VOLUME_DATA = [
  { name: 'Mon', Volume: 12000000, Count: 18200 },
  { name: 'Tue', Volume: 14500000, Count: 21100 },
  { name: 'Wed', Volume: 13200000, Count: 19800 },
  { name: 'Thu', Volume: 15800000, Count: 22400 },
  { name: 'Fri', Volume: 18900000, Count: 26800 },
  { name: 'Sat', Volume: 22400000, Count: 31200 },
  { name: 'Sun', Volume: 17400000, Count: 24500 }
];

const SERVICE_DISTRIBUTION_DATA = [
  { name: 'Airtime', value: 4850000, color: '#3b82f6' },
  { name: 'Data', value: 6200000, color: '#06b6d4' },
  { name: 'Electricity', value: 5400000, color: '#10b981' },
  { name: 'Cable TV', value: 2000000, color: '#f59e0b' },
  { name: 'Wallet Funding', value: 65800000, color: '#8b5cf6' }
];

const REFUND_TRENDS_DATA = [
  { name: 'Jun 14', Requested: 45000, Approved: 45000 },
  { name: 'Jun 15', Requested: 82000, Approved: 32000 },
  { name: 'Jun 16', Requested: 15000, Approved: 15000 },
  { name: 'Jun 17', Requested: 9500, Approved: 9500 },
  { name: 'Jun 18', Requested: 15000, Approved: 0 },
  { name: 'Jun 19', Requested: 1500, Approved: 1500 },
  { name: 'Jun 20', Requested: 24500, Approved: 9500 }
];

export default function AdminTransactions() {
  
  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [refunds, setRefunds] = useState<RefundRequest[]>(INITIAL_REFUNDS);
  const [flagged, setFlagged] = useState<FlaggedTx[]>(INITIAL_FLAGGED);
  const [liveEvents, setLiveEvents] = useState(LIVE_MONITOR_EVENTS);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [providerFilter, setProviderFilter] = useState<string>('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('All');

  // Sorting & Pagination States
  const [sortField, setSortField] = useState<'id' | 'amount' | 'date'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selection & UI States
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modal for Custom Statement Export
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');

  // Live Activity Feed Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const eventTypes = [
        { text: 'Airtime Purchased: @fatima bought MTN ₦500 Airtime', icon: '📶', color: 'text-blue-400 bg-blue-500/10' },
        { text: 'Wallet Funded: @tunde credited ₦5,000 via Card', icon: '💳', color: 'text-emerald-400 bg-emerald-500/10' },
        { text: 'Cable Subscription Activated: @grace renewed GOTV Jolli (₦4,000)', icon: '📺', color: 'text-cyan-400 bg-cyan-500/10' },
        { text: 'Electricity Payment: Meter 89201 credited ₦10,000', icon: '⚡', color: 'text-amber-400 bg-amber-500/10' }
      ];
      const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const newEvent = {
        id: Date.now(),
        type: 'purchase',
        text: randomEvent.text,
        time: 'Just now',
        icon: randomEvent.icon,
        color: randomEvent.color
      };

      setLiveEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Show Toast Toast Notification Helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ─── FILTER & SORT LOGIC ──────────────────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Global Search
      const searchMatch = searchQuery === '' || 
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.phone.includes(searchQuery) ||
        tx.recipient.toLowerCase().includes(searchQuery.toLowerCase());

      // Dropdown Filters
      const serviceMatch = serviceFilter === 'All' || tx.service === serviceFilter;
      const statusMatch = statusFilter === 'All' || tx.status === statusFilter;
      const providerMatch = providerFilter === 'All' || tx.provider.toLowerCase() === providerFilter.toLowerCase();
      const paymentMatch = paymentMethodFilter === 'All' || tx.paymentMethod === paymentMethodFilter;

      // Numeric Amount Filters
      const minAmt = minAmount === '' ? 0 : parseFloat(minAmount);
      const maxAmt = maxAmount === '' ? Infinity : parseFloat(maxAmount);
      const amountMatch = tx.amount >= minAmt && tx.amount <= maxAmt;

      // Date Range Filters
      const txDateObj = new Date(tx.date);
      const startObj = startDate === '' ? null : new Date(startDate);
      const endObj = endDate === '' ? null : new Date(endDate);
      let dateMatch = true;
      if (startObj) dateMatch = dateMatch && txDateObj >= startObj;
      if (endObj) dateMatch = dateMatch && txDateObj <= endObj;

      return searchMatch && serviceMatch && statusMatch && providerMatch && paymentMatch && amountMatch && dateMatch;
    });
  }, [transactions, searchQuery, serviceFilter, statusFilter, minAmount, maxAmount, startDate, endDate, providerFilter, paymentMethodFilter]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    sorted.sort((a, b) => {
      if (sortField === 'id') {
        return sortDirection === 'asc' 
          ? a.id.localeCompare(b.id) 
          : b.id.localeCompare(a.id);
      } else if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        // Date sorting
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return sortDirection === 'asc' 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime();
      }
    });
    return sorted;
  }, [filteredTransactions, sortField, sortDirection]);

  // Pagination bounds
  const paginatedTransactions = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(startIdx, startIdx + itemsPerPage);
  }, [sortedTransactions, currentPage]);

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  // Reset filter controls
  const handleResetFilters = () => {
    setSearchQuery('');
    setServiceFilter('All');
    setStatusFilter('All');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
    setProviderFilter('All');
    setPaymentMethodFilter('All');
    setCurrentPage(1);
    triggerToast('Filters reset successfully.');
  };

  // Run simulated loading refresh
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setTransactions(INITIAL_TRANSACTIONS);
      setLoading(false);
      triggerToast('Transactions refreshed successfully.');
    }, 850);
  };

  // Export handlers
  const handleExportCSV = () => {
    triggerToast('Generating CSV report... Check Downloads folder.');
  };

  const handleExportPDF = () => {
    triggerToast('Generating PDF statement... Check Downloads folder.');
  };

  // Bulk actions handlers
  const handleSelectRow = (id: string) => {
    setSelectedTxIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedTransactions.map(tx => tx.id);
      setSelectedTxIds(allIds);
    } else {
      setSelectedTxIds([]);
    }
  };

  const handleBulkAction = (action: string) => {
    triggerToast(`Bulk operation "${action}" applied to ${selectedTxIds.length} transactions.`);
    setSelectedTxIds([]);
  };

  // Refund actions
  const handleRefundAction = (reqId: string, status: 'Approved' | 'Rejected') => {
    setRefunds(prev => prev.map(req => req.id === reqId ? { ...req, status } : req));
    
    const request = refunds.find(r => r.id === reqId);
    if (request && status === 'Approved') {
      // Find matching transaction and change to Reversed
      setTransactions(prev => prev.map(tx => tx.id === request.txId ? { ...tx, status: 'Reversed' } : tx));
      triggerToast(`Refund approved. Wallet credited ₦${request.amount.toLocaleString()} for ${request.user}.`);
    } else {
      triggerToast(`Refund request ${status.toLowerCase()} successfully.`);
    }
  };

  // Risk flagging
  const handleFlagTransaction = (txId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === txId) {
        const isFlagged = tx.riskScore === 'Critical';
        return { 
          ...tx, 
          riskScore: isFlagged ? 'Low' : 'Critical',
          flaggedReason: isFlagged ? undefined : 'Flagged manually by Admin auditor' 
        };
      }
      return tx;
    }));
    
    // Add to flagged section if not already present
    const txObj = transactions.find(t => t.id === txId);
    if (txObj) {
      const isAlreadyFlagged = flagged.some(f => f.txId === txId);
      if (!isAlreadyFlagged) {
        const newFlagged: FlaggedTx = {
          id: `FLG-${Math.floor(Math.random() * 90) + 10}`,
          txId: txObj.id,
          user: txObj.user,
          riskLevel: 'Critical',
          reason: 'Flagged manually by Admin auditor',
          assignedAdmin: 'Current Admin',
          status: 'Under Investigation'
        };
        setFlagged(prev => [newFlagged, ...prev]);
        triggerToast(`Transaction ${txId} flagged for security review.`);
      } else {
        setFlagged(prev => prev.filter(f => f.txId !== txId));
        triggerToast(`Flag dismissed for Transaction ${txId}.`);
      }
    }
    
    // Close Drawer
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      
      {/* Toast Alert Notification */}
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
            <h2 className="text-text-white font-heading font-extrabold text-2xl tracking-tight">Transactions</h2>
            <p className="text-text-gray text-xs sm:text-sm mt-1 max-w-2xl">
              Monitor, review, export, and manage all platform transactions in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => { setExportFormat('csv'); setShowExportModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <ArrowDownTrayIcon className="w-3.5 h-3.5" />
              Export Report
            </button>
            <button
              onClick={() => { setExportFormat('pdf'); setShowExportModal(true); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-bg-card hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <DocumentTextIcon className="w-3.5 h-3.5" />
              Generate Statement
            </button>
            <button
              onClick={handleRefresh}
              className={`flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ─── KPI OVERVIEW ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          
          {/* Card 1: Total Transactions */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Total Tx</span>
              <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <ListBulletIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">125,482</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+11% this wk</span>
                {/* SVG Mini Sparkline */}
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,10 L10,8 L20,12 L30,5 L40,7 L50,2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 2: Transaction Volume */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Vol (₦)</span>
              <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
                <span className="text-xs font-extrabold">₦</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦84.25M</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+14% month</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L12,10 L24,5 L36,7 L50,1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 3: Successful */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Success</span>
              <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">98.7%</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+0.3% rate</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,8 L15,8 L25,5 L35,5 L50,3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 4: Failed */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between hover:scale-102 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Failed</span>
              <div className="p-1.5 rounded-xl bg-red-500/10 text-red-500 group-hover:scale-110 transition-transform">
                <XCircleIcon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">1.1%</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">-0.4% drop</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-red-500 fill-none" strokeWidth="1.5">
                  <path d="M0,3 L15,5 L30,12 L50,14" />
                </svg>
              </div>
            </div>
          </div>

          {/* Card 5: Pending */}
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
              <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                <span className="text-xs font-bold">₦</span>
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-text-white font-heading font-extrabold text-lg sm:text-xl">₦4.58M</h3>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-400 font-bold">+9.5% profit</span>
                <svg viewBox="0 0 50 15" className="w-10 h-4 stroke-emerald-500 fill-none" strokeWidth="1.5">
                  <path d="M0,12 L15,11 L30,5 L50,2" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* ─── TRANSACTION CONTROLS / TOOLBAR ─────────────────────────────────── */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Global Search */}
            <div className="relative w-full lg:flex-1">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by Transaction ID, User, Email, Phone, Reference..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full text-xs pl-11 pr-4 py-3 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden focus:border-blue-500 transition-colors"
              />
            </div>
            
            {/* Quick Actions / Apply Filters Buttons */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <button
                onClick={handleResetFilters}
                className="flex-1 lg:flex-none px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleExportCSV}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <ArrowDownTrayIcon className="w-3.5 h-3.5" />
                CSV
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <DocumentTextIcon className="w-3.5 h-3.5" />
                PDF
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Filters Section */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-text-white font-heading font-bold text-[11px] uppercase tracking-wider mb-3">
              <FunnelIcon className="w-3.5 h-3.5 text-blue-500" />
              Advanced Filters
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              
              {/* Type Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Type</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => { setServiceFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Types</option>
                  <option value="Airtime">Airtime</option>
                  <option value="Data">Data</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Cable TV">Cable TV</option>
                  <option value="Wallet Funding">Wallet Funding</option>
                </select>
              </div>

              {/* Status Filter */}
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

              {/* Provider Filter */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Provider</label>
                <select
                  value={providerFilter}
                  onChange={(e) => { setProviderFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Providers</option>
                  <option value="MTN">MTN</option>
                  <option value="GLO">GLO</option>
                  <option value="Airtel">Airtel</option>
                  <option value="AEDC">AEDC</option>
                  <option value="EKEDC">EKEDC</option>
                  <option value="DSTV">DSTV</option>
                  <option value="GOTV">GOTV</option>
                  <option value="Paystack">Paystack</option>
                </select>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Payment Method</label>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => { setPaymentMethodFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                >
                  <option value="All">All Methods</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              {/* Amount Range */}
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Min / Max Amt</label>
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

              {/* Date Range */}
              {/* <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Date Range</label>
                <div className="flex gap-1">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                    className="w-full text-[10px] px-1.5 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                    className="w-full text-[10px] px-1.5 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden"
                  />
                </div>
              </div> */}

            </div>
          </div>

        </div>

        {/* ─── MAIN TRANSACTIONS TABLE & DETAILS DRAWER ───────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* Table Container (2/3 width) */}
          <div className="xl:col-span-2 bg-bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
            
            <div className="p-5 border-b border-border flex items-center justify-between">
              <span className="text-text-white font-heading font-extrabold text-sm">Recent Ledger Entries</span>
              <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-full font-bold">
                Showing {filteredTransactions.length} results
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left border-collapse">
                <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border sticky top-0">
                  <tr>
                    <th className="px-5 py-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedTransactions.length > 0 && paginatedTransactions.every(tx => selectedTxIds.includes(tx.id))}
                        onChange={handleSelectAll}
                        className="rounded border-border focus:ring-blue-500 text-blue-600"
                      />
                    </th>
                    <th 
                      onClick={() => { setSortField('id'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Transaction ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">User</th>
                    <th className="px-4 py-4">Service</th>
                    <th className="px-4 py-4">Recipient</th>
                    <th 
                      onClick={() => { setSortField('amount'); setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc'); }}
                      className="px-4 py-4 cursor-pointer hover:text-text-white select-none transition-colors"
                    >
                      Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-4">Fee</th>
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
                    // Skeleton Loaders
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse bg-bg-dark-secondary/10">
                        <td className="px-5 py-4 text-center"><div className="w-4 h-4 bg-border/40 rounded mx-auto" /></td>
                        <td className="px-4 py-4"><div className="w-24 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4">
                          <div className="w-28 h-3 bg-border/40 rounded" />
                          <div className="w-20 h-2 bg-border/40 rounded mt-1.5" />
                        </td>
                        <td className="px-4 py-4"><div className="w-16 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-20 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-14 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-10 h-3 bg-border/40 rounded" /></td>
                        <td className="px-4 py-4"><div className="w-16 h-5 bg-border/40 rounded-full" /></td>
                        <td className="px-4 py-4"><div className="w-20 h-3 bg-border/40 rounded" /></td>
                        <td className="px-5 py-4 text-center"><div className="w-12 h-6 bg-border/40 rounded mx-auto" /></td>
                      </tr>
                    ))
                  ) : paginatedTransactions.length === 0 ? (
                    // Empty State inside table viewport
                    <tr>
                      <td colSpan={10} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                          </div>
                          <h4 className="text-text-white font-heading font-bold text-sm">No transactions found</h4>
                          <p className="text-text-muted text-[11px] mt-1.5">
                            Try adjusting your filters, search terms, or reset the search query to show all logs.
                          </p>
                          <button
                            onClick={handleResetFilters}
                            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
                          >
                            Refresh Data
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedTransactions.map((tx) => {
                      const isSelected = selectedTxIds.includes(tx.id);
                      return (
                        <tr 
                          key={tx.id} 
                          className={`hover:bg-bg-dark-secondary/30 transition-colors cursor-pointer ${isSelected ? 'bg-blue-500/5' : ''}`}
                          onClick={() => { setSelectedTx(tx); setIsDrawerOpen(true); }}
                        >
                          <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectRow(tx.id)}
                              className="rounded border-border focus:ring-blue-500 text-blue-600"
                            />
                          </td>
                          <td className="px-4 py-4 font-mono font-bold text-blue-500">{tx.id}</td>
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                            <div className="font-semibold text-text-white">{tx.user}</div>
                            <div className="text-[10px] text-text-muted mt-0.5">{tx.email}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              tx.service === 'Wallet Funding' ? 'bg-purple-500/10 text-purple-400' :
                              tx.service === 'Electricity' ? 'bg-amber-500/10 text-amber-400' :
                              tx.service === 'Cable TV' ? 'bg-cyan-500/10 text-cyan-400' :
                              tx.service === 'Data' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'
                            }`}>
                              {tx.service}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-mono text-[11px] text-text-gray">{tx.recipient}</td>
                          <td className="px-4 py-4 font-bold text-text-white">₦{tx.amount.toLocaleString()}</td>
                          <td className="px-4 py-4 text-text-muted">₦{tx.fee}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                              tx.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                              tx.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/25' :
                              'bg-slate-500/10 text-text-muted border border-border'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${
                                tx.status === 'Success' ? 'bg-emerald-400' :
                                tx.status === 'Pending' ? 'bg-amber-400' :
                                tx.status === 'Failed' ? 'bg-red-400' :
                                'bg-text-muted'
                              }`} />
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-text-muted whitespace-nowrap">
                            {tx.date} <span className="text-[10px] ml-1">{tx.time}</span>
                          </td>
                          <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => { setSelectedTx(tx); setIsDrawerOpen(true); }}
                                className="p-1 rounded-md hover:bg-bg-dark-secondary text-text-gray hover:text-text-white transition-colors"
                                title="View Details"
                              >
                                <EyeIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleFlagTransaction(tx.id)}
                                className={`p-1 rounded-md hover:bg-bg-dark-secondary transition-colors ${tx.riskScore === 'Critical' ? 'text-red-500' : 'text-text-gray hover:text-red-400'}`}
                                title="Flag Transaction"
                              >
                                <FlagIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => triggerToast(`Receipt generated for transaction ${tx.id}.`)}
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

            {/* Pagination Controls */}
            {!loading && sortedTransactions.length > 0 && (
              <div className="p-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-[11px] text-text-muted">
                  Showing <span className="text-text-white font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="text-text-white font-bold">
                    {Math.min(currentPage * itemsPerPage, sortedTransactions.length)}
                  </span>{' '}
                  of <span className="text-text-white font-bold">{sortedTransactions.length}</span> entries
                </span>
                
                <div className="flex items-center gap-1.5">
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

          {/* Monitoring Panel & Live Activity (1/3 width) */}
          <div className="space-y-6">
            
            {/* Live Feed Container */}
            <div className="bg-bg-card border border-border rounded-2xl shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-text-white font-heading font-extrabold text-sm">Live Activity Monitor</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">Real-time VTU gateway transactions feed</p>
                </div>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              <div className="space-y-2">
                {liveEvents.map((evt) => (
                  <div 
                    key={evt.id} 
                    className="flex gap-3 p-3 bg-bg-dark-secondary/40 border border-border/50 rounded-xl items-start hover:bg-bg-dark-secondary/80 transition-all duration-200"
                  >
                    <div className={`p-2 rounded-xl text-sm ${evt.color}`}>
                      {evt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-text-white font-medium leading-relaxed break-words">{evt.text}</p>
                      <span className="text-[9px] text-text-muted mt-1 block">{evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Export Hub */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="border-b border-border pb-2">
                <h3 className="text-text-white font-heading font-extrabold text-sm">Export Center</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Quickly dispatch financial summaries to download queue</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-bg-dark-secondary/35 border border-border/50 rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-text-white">Daily Transactions</p>
                    <p className="text-[9px] text-text-muted">Today's snapshot summary</p>
                  </div>
                  <button onClick={() => triggerToast('Daily report generated!')} className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg transition-colors">
                    Download
                  </button>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-bg-dark-secondary/35 border border-border/50 rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-text-white">Weekly Summary</p>
                    <p className="text-[9px] text-text-muted">Trailing 7 days activity</p>
                  </div>
                  <button onClick={() => triggerToast('Weekly summary generated!')} className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg transition-colors">
                    Download
                  </button>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-bg-dark-secondary/35 border border-border/50 rounded-xl">
                  <div>
                    <p className="text-xs font-semibold text-text-white">Monthly Revenue</p>
                    <p className="text-[9px] text-text-muted">Financial reconciliation ledger</p>
                  </div>
                  <button onClick={() => triggerToast('Monthly ledger generated!')} className="px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 text-[10px] font-bold rounded-lg transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ─── BULK ACTIONS FLOATING ACTION BAR ────────────────────────────────── */}
        {selectedTxIds.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-bg-card border border-blue-500/30 px-6 py-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-text-white font-heading">
                {selectedTxIds.length} transactions selected
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
                onClick={() => handleBulkAction('Flag Selected')}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-colors"
              >
                Flag Transactions
              </button>
              <button
                onClick={() => handleBulkAction('Archive')}
                className="px-3 py-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-[10px] font-bold rounded-lg transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => setSelectedTxIds([])}
                className="p-1 text-text-muted hover:text-text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ─── VISUAL FINANCIAL ANALYTICS ────────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl p-5 space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="text-text-white font-heading font-extrabold text-sm">Financial Analytics</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Performance distribution, refund patterns, and volume metrics</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Chart 1: Volume */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Transaction Volume (₦)</span>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRANSACTION_VOLUME_DATA}>
                    <defs>
                      <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--bg-muted)" fontSize={10} />
                    <YAxis stroke="var(--bg-muted)" fontSize={10} tickFormatter={(v) => `₦${v/1000000}M`} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                    <Area type="monotone" dataKey="Volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#volGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Service Distribution */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Service Revenue Distribution</span>
              <div className="h-60 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={SERVICE_DISTRIBUTION_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {SERVICE_DISTRIBUTION_DATA.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} formatter={(val) => `₦${(Number(val)).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend list */}
                <div className="flex flex-col gap-1.5 ml-4">
                  {SERVICE_DISTRIBUTION_DATA.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[9px] text-text-gray">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-semibold text-text-white">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart 3: Refund & Dispute Trends */}
            <div className="bg-bg-dark-secondary/30 border border-border/50 rounded-xl p-4 space-y-3">
              <span className="text-[11px] font-bold text-text-white uppercase font-heading tracking-wider">Refund Request Metrics</span>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REFUND_TRENDS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--bg-muted)" fontSize={10} />
                    <YAxis stroke="var(--bg-muted)" fontSize={10} tickFormatter={(v) => `₦${v}`} />
                    <Tooltip contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }} />
                    <Bar dataKey="Requested" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </section>

        {/* ─── REFUND REQUESTS QUEUE ──────────────────────────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border">
            <h3 className="text-text-white font-heading font-extrabold text-sm">Refund Requests Queue</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Review customer-disputed and failed transaction claims</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border">
                <tr>
                  <th className="px-5 py-4">Request ID</th>
                  <th className="px-4 py-4">Transaction ID</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Reason</th>
                  <th className="px-4 py-4">Submitted Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-5 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {refunds.map(req => (
                  <tr key={req.id} className="hover:bg-bg-dark-secondary/20 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-text-white">{req.id}</td>
                    <td className="px-4 py-4 font-mono text-blue-500">{req.txId}</td>
                    <td className="px-4 py-4 font-semibold text-text-white">{req.user}</td>
                    <td className="px-4 py-4 font-bold text-text-white">₦{req.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 text-text-gray max-w-xs truncate" title={req.reason}>{req.reason}</td>
                    <td className="px-4 py-4 text-text-muted">{req.submitted}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                        req.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/25' :
                        'bg-red-500/10 text-red-400 border border-red-500/25'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        {req.status === 'Pending' ? (
                          <>
                            <button
                              onClick={() => handleRefundAction(req.id, 'Approved')}
                              className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRefundAction(req.id, 'Rejected')}
                              className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-text-muted uppercase font-semibold">Reconciled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── SUSPICIOUS & FLAGGED TRANSACTIONS SECTION ─────────────────────── */}
        <section className="bg-bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-text-white font-heading font-extrabold text-sm">Suspicious & Flagged Transactions</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Review transactions marked for risk or security audit</p>
            </div>
            <span className="text-xs font-bold text-red-500 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
              {flagged.length} Active Incidents
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead className="bg-bg-dark-secondary/50 text-[10px] uppercase font-bold text-text-muted border-b border-border">
                <tr>
                  <th className="px-5 py-4">Incident ID</th>
                  <th className="px-4 py-4">Transaction ID</th>
                  <th className="px-4 py-4">User</th>
                  <th className="px-4 py-4">Risk Level</th>
                  <th className="px-4 py-4">Flag Reason</th>
                  <th className="px-4 py-4">Assigned Auditor</th>
                  <th className="px-4 py-4">Audit Status</th>
                  <th className="px-5 py-4 text-center font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {flagged.map(incident => (
                  <tr key={incident.id} className="hover:bg-bg-dark-secondary/20 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-text-white">{incident.id}</td>
                    <td className="px-4 py-4 font-mono text-blue-500">{incident.txId}</td>
                    <td className="px-4 py-4 font-semibold text-text-white">{incident.user}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        incident.riskLevel === 'Critical' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                        incident.riskLevel === 'High' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20' :
                        incident.riskLevel === 'Medium' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                        'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                      }`}>
                        ⚠️ {incident.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-text-gray max-w-xs truncate" title={incident.reason}>{incident.reason}</td>
                    <td className="px-4 py-4 text-text-muted">{incident.assignedAdmin}</td>
                    <td className="px-4 py-4">
                      <span className="text-text-white font-medium">{incident.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setFlagged(prev => prev.filter(f => f.id !== incident.id));
                            triggerToast(`Incident ${incident.id} cleared and archived.`);
                          }}
                          className="px-2.5 py-1.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white text-[10px] font-bold rounded-lg transition-colors"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => triggerToast(`Incident ${incident.id} escalated to Director Auditor.`)}
                          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
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
        </section>

      </main>

      {/* ─── TRANSACTION DETAIL DRAWER (SLIDE OVER) ─────────────────────────── */}
      {isDrawerOpen && selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          {/* Backdrop closer clicker */}
          <div onClick={() => setIsDrawerOpen(false)} className="flex-1" />
          
          <div className="w-full max-w-lg bg-bg-card border-l border-border h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-bg-dark-secondary/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/25 flex items-center justify-center font-heading font-extrabold text-blue-500 shadow-xs">
                  TX
                </div>
                <div>
                  <h3 className="text-text-white font-heading font-bold text-base">Transaction Details</h3>
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">ID: {selectedTx.id}</span>
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
              
              {/* Status Header Block */}
              <div className="p-4 rounded-2xl bg-bg-dark-secondary/40 border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted tracking-wide">Status Flag</span>
                  <p className="text-text-white font-bold text-sm mt-0.5">{selectedTx.status}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  selectedTx.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  selectedTx.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                  selectedTx.status === 'Failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                  'bg-slate-500/10 text-text-muted border border-border'
                }`}>
                  {selectedTx.status}
                </span>
              </div>

              {/* Transaction Summary Grid */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Transaction Summary</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Transaction ID</span>
                    <span className="text-text-white font-mono font-bold">{selectedTx.id}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Gateway Reference</span>
                    <span className="text-text-white font-mono">{selectedTx.reference}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Created Time</span>
                    <span className="text-text-white">{selectedTx.date} at {selectedTx.time}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Risk Indicator</span>
                    <span className={`font-bold ${selectedTx.riskScore === 'Critical' ? 'text-red-500' : 'text-emerald-400'}`}>
                      {selectedTx.riskScore || 'Low'} Risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer details */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Customer details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">User Name</span>
                    <span className="text-text-white font-bold">{selectedTx.user}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Email Profile</span>
                    <span className="text-text-white">{selectedTx.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Linked Phone</span>
                    <span className="text-text-white">{selectedTx.phone}</span>
                  </div>
                </div>
              </div>

              {/* Service details */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Service details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Service Type</span>
                    <span className="text-text-white font-bold">{selectedTx.service}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Gateway Provider</span>
                    <span className="text-text-white">{selectedTx.provider}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Recipient Number/Meter</span>
                    <span className="text-text-white font-mono">{selectedTx.recipient}</span>
                  </div>
                </div>
              </div>

              {/* Financial details */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Financial details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Order Amount</span>
                    <span className="text-text-white font-bold text-sm">₦{selectedTx.amount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Commission Fee</span>
                    <span className="text-text-white">₦{selectedTx.fee}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Wallet Bal Before</span>
                    <span className="text-text-muted">₦{selectedTx.walletBefore.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-text-muted uppercase font-semibold">Wallet Bal After</span>
                    <span className="text-text-white font-bold">₦{selectedTx.walletAfter.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Stepper */}
              <div className="space-y-4">
                <h4 className="text-text-white font-heading font-bold text-xs uppercase tracking-wider border-b border-border/50 pb-1.5">Reconciliation Timeline</h4>
                
                <div className="relative pl-6 space-y-4">
                  {/* Vertical bar */}
                  <div className="absolute left-2.5 top-1.5 bottom-1.5 w-0.5 bg-border" />
                  
                  {/* Step 1: Created */}
                  <div className="relative flex gap-3 text-xs">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-blue-500 border border-bg-card" />
                    <div>
                      <span className="font-semibold text-text-white block">Transaction Initialized</span>
                      <span className="text-[10px] text-text-muted">{selectedTx.date} at {selectedTx.timeline.created}</span>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="relative flex gap-3 text-xs">
                    <div className="absolute -left-[21px] w-2.5 h-2.5 rounded-full bg-cyan-400 border border-bg-card" />
                    <div>
                      <span className="font-semibold text-text-white block">Processing at API Gateway</span>
                      <span className="text-[10px] text-text-muted">{selectedTx.date} at {selectedTx.timeline.processing}</span>
                    </div>
                  </div>

                  {/* Step 3: Finished */}
                  <div className="relative flex gap-3 text-xs">
                    <div className={`absolute -left-[21px] w-2.5 h-2.5 rounded-full border border-bg-card ${
                      selectedTx.status === 'Success' ? 'bg-emerald-500' :
                      selectedTx.status === 'Pending' ? 'bg-amber-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <span className="font-semibold text-text-white block">Reconciliation Finished</span>
                      <span className="text-[10px] text-text-muted">{selectedTx.date} at {selectedTx.timeline.completed}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Drawer footer actions */}
            <div className="p-6 border-t border-border bg-bg-dark-secondary/30 flex gap-2">
              <button
                onClick={() => triggerToast(`Receipt requested for transaction ${selectedTx.id}`)}
                className="flex-1 py-2.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                View Receipt
              </button>
              <button
                onClick={() => triggerToast(`Downloading transaction ${selectedTx.id} details PDF.`)}
                className="flex-1 py-2.5 bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Download Record
              </button>
              <button
                onClick={() => handleFlagTransaction(selectedTx.id)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
              >
                Flag
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ─── MODAL: EXPORT HUB ──────────────────────────────────────────────── */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg"
            >
              ✕
            </button>
            
            <h3 className="text-text-white font-heading font-extrabold text-base mb-2">Export Transaction Statement</h3>
            <p className="text-text-gray text-xs mb-4">
              Select output parameters for generating audits. Selected records will compile and download instantly.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">File Format</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportFormat('csv')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${exportFormat === 'csv' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-bg-dark-secondary border-border text-text-gray'}`}
                  >
                    CSV (Excel Sheets)
                  </button>
                  <button
                    onClick={() => setExportFormat('pdf')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${exportFormat === 'pdf' ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'bg-bg-dark-secondary border-border text-text-gray'}`}
                  >
                    PDF (Bank Statement Style)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-text-muted uppercase mb-1">Row Limit</label>
                <select className="w-full text-xs px-3 py-2 bg-bg-dark-secondary text-text-white border border-border rounded-xl focus:outline-hidden">
                  <option>Current Filter View ({filteredTransactions.length} entries)</option>
                  <option>Latest 100 entries</option>
                  <option>Latest 500 entries</option>
                  <option>Latest 1000 entries</option>
                  <option>All transactions (125,482 entries)</option>
                </select>
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
                    if (exportFormat === 'csv') handleExportCSV();
                    else handleExportPDF();
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
