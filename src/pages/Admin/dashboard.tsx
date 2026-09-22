import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/themeContext';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import type { AdminDashboardTransaction as Transaction, AlertItem, ServiceData } from '../../interface/admin.interface';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
// ─── INITIAL MOCK DATA ───────────────────────────────────────────────────────
const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-98201', user: 'Chidi Benson', email: 'chidi.b@example.com', service: 'Electricity', amount: 15000, status: 'Success', time: '14:22:10', date: '2026-06-20' },
  { id: 'TXN-98202', user: 'Amara Okafor', email: 'amara.o@example.com', service: 'Data', amount: 3500, status: 'Success', time: '14:19:05', date: '2026-06-20' },
  { id: 'TXN-98203', user: 'Tunde Bakare', email: 'tunde.b@example.com', service: 'Airtime', amount: 2000, status: 'Failed', time: '14:15:30', date: '2026-06-20' },
  { id: 'TXN-98204', user: 'Fatima Musa', email: 'fatima.m@example.com', service: 'Cable TV', amount: 9500, status: 'Success', time: '14:02:11', date: '2026-06-20' },
  { id: 'TXN-98205', user: 'Obinna Ani', email: 'obinna.a@example.com', service: 'Data', amount: 5000, status: 'Pending', time: '13:58:45', date: '2026-06-20' },
  { id: 'TXN-98206', user: 'Aisha Yusuf', email: 'aisha.y@example.com', service: 'Electricity', amount: 25000, status: 'Success', time: '13:44:12', date: '2026-06-20' },
  { id: 'TXN-98207', user: 'David Mark', email: 'david.m@example.com', service: 'Airtime', amount: 1000, status: 'Success', time: '13:30:00', date: '2026-06-20' },
  { id: 'TXN-98208', user: 'Grace Emmanuel', email: 'grace.e@example.com', service: 'Cable TV', amount: 14000, status: 'Success', time: '13:15:10', date: '2026-06-20' },
  { id: 'TXN-98209', user: 'Yusuf Ibrahim', email: 'yusuf.i@example.com', service: 'Data', amount: 8000, status: 'Failed', time: '13:02:55', date: '2026-06-20' },
];

const REVENUE_TIMELINE = {
  Daily: [
    { name: '08:00', Revenue: 120000, Profit: 30000, Expenses: 90000, Transactions: 450 },
    { name: '10:00', Revenue: 280000, Profit: 75000, Expenses: 205000, Transactions: 980 },
    { name: '12:00', Revenue: 450000, Profit: 112000, Expenses: 338000, Transactions: 1420 },
    { name: '14:00', Revenue: 620000, Profit: 155000, Expenses: 465000, Transactions: 1980 },
    { name: '16:00', Revenue: 850000, Profit: 210000, Expenses: 640000, Transactions: 2450 },
    { name: '18:00', Revenue: 1100000, Profit: 280000, Expenses: 820000, Transactions: 3100 },
  ],
  Weekly: [
    { name: 'Mon', Revenue: 2100000, Profit: 520000, Expenses: 1580000, Transactions: 14200 },
    { name: 'Tue', Revenue: 2400000, Profit: 610000, Expenses: 1790000, Transactions: 15800 },
    { name: 'Wed', Revenue: 2800000, Profit: 720000, Expenses: 2080000, Transactions: 18900 },
    { name: 'Thu', Revenue: 2600000, Profit: 650000, Expenses: 1950000, Transactions: 17200 },
    { name: 'Fri', Revenue: 3100000, Profit: 790000, Expenses: 2310000, Transactions: 21000 },
    { name: 'Sat', Revenue: 3500000, Profit: 880000, Expenses: 2620000, Transactions: 23500 },
    { name: 'Sun', Revenue: 1950000, Profit: 410000, Expenses: 1540000, Transactions: 14882 },
  ],
  Monthly: [
    { name: 'Jan', Revenue: 14500000, Profit: 3400000, Expenses: 11100000, Transactions: 98000 },
    { name: 'Feb', Revenue: 15200000, Profit: 3700000, Expenses: 11500000, Transactions: 104000 },
    { name: 'Mar', Revenue: 17800000, Profit: 4200000, Expenses: 13600000, Transactions: 118000 },
    { name: 'Apr', Revenue: 16900000, Profit: 3950000, Expenses: 12950000, Transactions: 112000 },
    { name: 'May', Revenue: 19100000, Profit: 4800000, Expenses: 14300000, Transactions: 129000 },
    { name: 'Jun', Revenue: 18450000, Profit: 4580000, Expenses: 13870000, Transactions: 125482 },
  ],
  Yearly: [
    { name: '2023', Revenue: 142000000, Profit: 31000000, Expenses: 111000000, Transactions: 890000 },
    { name: '2024', Revenue: 189000000, Profit: 42000000, Expenses: 147000000, Transactions: 1190000 },
    { name: '2025', Revenue: 215000000, Profit: 49000000, Expenses: 166000000, Transactions: 1350000 },
    { name: '2026 (YTD)', Revenue: 112000000, Profit: 26000000, Expenses: 86000000, Transactions: 740000 },
  ],
};

const INITIAL_SERVICE_PERFORMANCE: ServiceData[] = [
  { name: 'Airtime', volume: 64210, revenue: 4850000, successRate: 99.1, trend: '+4.2%', color: '#3b82f6' },
  { name: 'Data', volume: 42180, revenue: 6200000, successRate: 98.8, trend: '+8.7%', color: '#06b6d4' },
  { name: 'Electricity', volume: 11092, revenue: 5400000, successRate: 99.5, trend: '+11.1%', color: '#10b981' },
  { name: 'Cable TV', volume: 8000, revenue: 2000000, successRate: 99.8, trend: '+2.4%', color: '#f59e0b' },
];

const INITIAL_ALERTS: AlertItem[] = [
  { id: '1', title: 'High Failed Transactions', desc: 'MTN Data bundle API gateway returned error 504 on 12 transactions.', severity: 'high', time: '10m ago' },
  { id: '2', title: 'Low Wallet Reserve', desc: 'Ikeja Electric prepaid reserve wallet is below ₦500,000 threshold.', severity: 'warning', time: '45m ago' },
  { id: '3', title: 'Large Refund Request', desc: 'User @c_benson requested refund of ₦15,000 for electricity ticket.', severity: 'info', time: '1h ago' },
  { id: '4', title: 'New Support Ticket', desc: 'Agent assignment pending for ticket #SUP-8722 regarding referral bonus.', severity: 'info', time: '2h ago' },
];

const LEADERBOARD_USERS = [
  { rank: 1, name: 'Chidi Benson', handle: '@c_benson', transactions: 482, spent: '₦1,820,000', rate: '100%' },
  { rank: 2, name: 'Amara Okafor', handle: '@amara_ok', transactions: 395, spent: '₦1,450,000', rate: '99.4%' },
  { rank: 3, name: 'Tunde Bakare', handle: '@tunde_bak', transactions: 312, spent: '₦1,120,000', rate: '98.7%' },
  { rank: 4, name: 'Fatima Musa', handle: '@fatima_m', transactions: 288, spent: '₦950,000', rate: '99.1%' },
];

const ACTIVITY_TIMELINE = [
  { id: 1, type: 'registration', text: 'New user registered: Emmanuel Adebayo', time: 'Just now', icon: '👤', color: 'bg-blue-500/10 text-blue-500' },
  { id: 2, type: 'funding', text: 'Wallet funded: @amara_ok credited ₦150,000 via Paystack', time: '12 mins ago', icon: '💳', color: 'bg-emerald-500/10 text-emerald-500' },
  { id: 3, type: 'purchase', text: 'Electricity bill purchased: Meter 984412 (₦20,000)', time: '22 mins ago', icon: '⚡', color: 'bg-amber-500/10 text-amber-500' },
  { id: 4, type: 'admin', text: 'Admin Action: Config modified for GLO Airtime commission', time: '1 hour ago', icon: '⚙️', color: 'bg-purple-500/10 text-purple-500' },
  { id: 5, type: 'reversed', text: 'Transaction Reversed: Refunded ₦500 for failed MTN Data subscription', time: '2 hours ago', icon: '🔄', color: 'bg-red-500/10 text-red-500' },
];

export default function AdminDashboard() {
  // const { currentUser, logout } = useAuth() as { currentUser: any; logout: () => void };
  // const { theme, toggleTheme } = useTheme();
  // const navigate = useNavigate();

  // ─── STATE MANAGEMENT ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Users' | 'Transactions' | 'Wallet' | 'Airtime' | 'Data' | 'Electricity' | 'Cable TV' | 'Notifications' | 'Referrals' | 'Analytics' | 'Settings' | 'Support' | 'Roles'>('Dashboard');
  // const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  
  // Simulation & Data States
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [serviceStats, setServiceStats] = useState<ServiceData[]>(INITIAL_SERVICE_PERFORMANCE);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [timeline, setTimeline] = useState(ACTIVITY_TIMELINE);
  const [revenueFilter, setRevenueFilter] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Success' | 'Pending' | 'Failed'>('All');
  const [serviceFilter, setServiceFilter] = useState<'All' | 'Airtime' | 'Data' | 'Electricity' | 'Cable TV'>('All');
  const [sortingField, setSortingField] = useState<'id' | 'amount' | 'time'>('time');
  const [sortingDirection, setSortingDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Stats Counters (Dynamically Calculated or Simulated)
  const [totalRevenueVal, setTotalRevenueVal] = useState(18450000);
  const [totalTransactionsVal, setTotalTransactionsVal] = useState(125482);
  const [totalUsersVal, setTotalUsersVal] = useState(12840);
  const [walletFundingVal, setWalletFundingVal] = useState(52000000);
  const [platformProfitVal, setPlatformProfitVal] = useState(4580000);
  const [successRateVal] = useState(99.3);

  // Modals / Dropdowns
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const handleSort = (field: 'id' | 'amount' | 'time') => {
    if (sortingField === field) {
      setSortingDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortingField(field);
      setSortingDirection('desc');
    }
  };

  // Modal forms states
  const [formData, setFormData] = useState({
    userEmail: '',
    userFirstName: '',
    userLastName: '',
    walletAmount: '',
    walletAction: 'credit' as 'credit' | 'debit',
    notificationTitle: '',
    notificationBody: '',
    notificationTarget: 'all',
  });

  // ─── SIMULATION GATEWAY (LIVE UPDATE EFFECT) ────────────────────────────────
  useEffect(() => {
    if (!isAutoRefresh || isEmptyState) return;

    const interval = setInterval(() => {
      // Create random incoming transaction
      const firstNames = ['Yemi', 'Zainab', 'Kofi', 'Tari', 'Emeka', 'Halima', 'Bose', 'Chioma'];
      const lastNames = ['Adeoye', 'Balogun', 'Mensah', 'Douglas', 'Chukwu', 'Sani', 'Ogunleye', 'Nwachukwu'];
      const services: ('Airtime' | 'Data' | 'Electricity' | 'Cable TV')[] = ['Airtime', 'Data', 'Electricity', 'Cable TV'];
      const statuses: ('Success' | 'Pending' | 'Failed')[] = ['Success', 'Success', 'Success', 'Pending', 'Failed'];
      
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const randomService = services[Math.floor(Math.random() * services.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomAmount = Math.floor(Math.random() * 8 + 1) * 1000 + (randomService === 'Electricity' ? 8000 : 500);
      const newTxId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
      const timeStr = new Date().toLocaleTimeString('en-GB');
      
      const newTx: Transaction = {
        id: newTxId,
        user: `${randomFirstName} ${randomLastName}`,
        email: `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@example.com`,
        service: randomService,
        amount: randomAmount,
        status: randomStatus,
        time: timeStr,
        date: new Date().toISOString().split('T')[0]
      };

      // Add to list and shift oldest
      setTransactions((prev) => [newTx, ...prev.slice(0, 15)]);

      // Update counters
      setTotalTransactionsVal((prev) => prev + 1);
      setTotalRevenueVal((prev) => prev + randomAmount);
      if (randomStatus === 'Success') {
        setPlatformProfitVal((prev) => prev + Math.floor(randomAmount * 0.085));
        setWalletFundingVal((prev) => prev + (randomService === 'Data' ? randomAmount : 0));
      }

      // Add to Activity timeline
      const timelineItems = [
        {
          id: Date.now(),
          type: 'purchase',
          text: `${randomFirstName} ${randomLastName} purchased ${randomService} for ₦${randomAmount.toLocaleString()}`,
          time: 'Just now',
          icon: randomService === 'Electricity' ? '⚡' : randomService === 'Data' ? '📶' : randomService === 'Airtime' ? '📞' : '📺',
          color: randomStatus === 'Success' ? 'bg-emerald-500/10 text-emerald-500' : randomStatus === 'Failed' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
        }
      ];
      setTimeline((prev) => [timelineItems[0], ...prev.slice(0, 7)]);

      // Update service performance stats
      setServiceStats((prev) =>
        prev.map((s) => {
          if (s.name === randomService) {
            const nextVol = s.volume + 1;
            const nextRev = s.revenue + randomAmount;
            return {
              ...s,
              volume: nextVol,
              revenue: nextRev,
            };
          }
          return s;
        })
      );
    }, 9000);

    return () => clearInterval(interval);
  }, [isAutoRefresh, isEmptyState]);

  // ─── FILTER & SEARCH LOGIC ─────────────────────────────────────────────────
  const processedTransactions = useMemo(() => {
    if (isEmptyState) return [];

    let result = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.user.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (serviceFilter !== 'All') {
      result = result.filter((t) => t.service === serviceFilter);
    }

    result.sort((a, b) => {
      let valA = a[sortingField];
      let valB = b[sortingField];
      if (typeof valA === 'string') {
        return sortingDirection === 'asc'
          ? valA.localeCompare(valB as string)
          : (valB as string).localeCompare(valA);
      }
      return sortingDirection === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

    return result;
  }, [transactions, searchQuery, statusFilter, serviceFilter, sortingField, sortingDirection, isEmptyState]);

  const paginatedTransactions = useMemo(() => {
    const itemsPerPage = 5;
    const start = (currentPage - 1) * itemsPerPage;
    return processedTransactions.slice(start, start + itemsPerPage);
  }, [processedTransactions, currentPage]);

  const totalPages = Math.ceil(processedTransactions.length / 5) || 1;

  // ─── ACTIONS HANDLERS ──────────────────────────────────────────────────────
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userEmail || !formData.userFirstName) return;

    setTotalUsersVal((prev) => prev + 1);
    setTimeline((prev) => [
      {
        id: Date.now(),
        type: 'registration',
        text: `Admin added user: ${formData.userFirstName} ${formData.userLastName} (${formData.userEmail})`,
        time: 'Just now',
        icon: '👤',
        color: 'bg-blue-500/10 text-blue-500',
      },
      ...prev,
    ]);

    // Cleanup and Notification trigger
    alert(`Successfully registered ${formData.userFirstName} ${formData.userLastName}!`);
    setActiveModal(null);
    setFormData((prev) => ({ ...prev, userEmail: '', userFirstName: '', userLastName: '' }));
  };

  const handleWalletAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(formData.walletAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    const formattedAmount = `₦${amountNum.toLocaleString()}`;
    if (formData.walletAction === 'credit') {
      setWalletFundingVal((prev) => prev + amountNum);
      setTimeline((prev) => [
        {
          id: Date.now(),
          type: 'funding',
          text: `Admin credited wallet: Added ${formattedAmount} to balance`,
          time: 'Just now',
          icon: '💳',
          color: 'bg-emerald-500/10 text-emerald-500',
        },
        ...prev,
      ]);
    } else {
      setWalletFundingVal((prev) => Math.max(0, prev - amountNum));
      setTimeline((prev) => [
        {
          id: Date.now(),
          type: 'reversed',
          text: `Admin debited wallet: Removed ${formattedAmount} from reserve balance`,
          time: 'Just now',
          icon: '🔄',
          color: 'bg-red-500/10 text-red-500',
        },
        ...prev,
      ]);
    }

    alert(`Successfully completed ${formData.walletAction} of ${formattedAmount}.`);
    setActiveModal(null);
    setFormData((prev) => ({ ...prev, walletAmount: '' }));
  };

  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.notificationTitle || !formData.notificationBody) return;

    const newAlert: AlertItem = {
      id: `alert-${Date.now()}`,
      title: formData.notificationTitle,
      desc: formData.notificationBody,
      severity: 'info',
      time: 'Just now',
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setActiveModal(null);
    setFormData((prev) => ({ ...prev, notificationTitle: '', notificationBody: '' }));
    alert('Broadcast Notification dispatched to all system channels.');
  };

  const handleRefundTransaction = (txnId: string) => {
    const txn = transactions.find((t) => t.id === txnId);
    if (!txn) return;

    // Change status
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: 'Failed' } : t))
    );

    // Timeline event
    setTimeline((prev) => [
      {
        id: Date.now(),
        type: 'reversed',
        text: `Refund Processed: Returned ₦${txn.amount.toLocaleString()} to ${txn.user}`,
        time: 'Just now',
        icon: '🔄',
        color: 'bg-red-500/10 text-red-500',
      },
      ...prev,
    ]);

    alert(`Transaction ${txnId} successfully refunded and marked as Failed.`);
  };

  // Sparkline Chart Data for KPIs
  const miniSparklineData = [
    { value: 400 },
    { value: 480 },
    { value: 420 },
    { value: 500 },
    { value: 550 },
    { value: 520 },
    { value: 600 },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">
      {/* ─── SCROLLABLE PAGE CONTAINER ─── */}
      <main className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          
          {/* ─── DASHBOARD MAIN HEADER & HEALTH ─── */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl p-6">
            <div>
              <h2 className="text-text-white font-heading font-extrabold text-2xl tracking-tight">Admin Dashboard</h2>
              <p className="text-text-gray text-xs sm:text-sm mt-1 max-w-2xl">
                Monitor transactions, users, revenue, wallet activity, and service performance across VtuNova.
              </p>
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                ✓ Platform Healthy
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-cyan-500/10 border-cyan-500/20 text-cyan-400 flex items-center gap-1.5 shadow-xs">
                ✓ Services Online
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400 flex items-center gap-1.5 shadow-xs">
                ✓ Secure Operations
              </span>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-purple-500/10 border-purple-500/20 text-purple-400 flex items-center gap-1.5 shadow-xs">
                ✓ Real-Time Monitoring
              </span>
            </div>
          </div>

          {/* SIMULATOR CONTROLS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-bg-card border border-border rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-white flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isAutoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-500'}`} />
                Live Demo Simulation
              </span>
              <button
                onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors
                  ${isAutoRefresh
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
              >
                {isAutoRefresh ? 'Pause Sandbox' : 'Resume Sandbox'}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEmptyState(!isEmptyState)}
                className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-colors
                  ${isEmptyState
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-bg-dark-secondary border-border text-text-gray hover:bg-bg-card-hover'
                  }`}
              >
                {isEmptyState ? 'Populate Mock Data' : 'Simulate Empty State'}
              </button>
            </div>
          </div>

          {/* ─── TOP STATISTICS KPI SECTION (6 CARDS) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            
            {/* CARD 1: Total Revenue */}
            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-blue-500/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">Total Revenue</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center gap-0.5">
                  ↑ 18%
                </span>
              </div>
              <div className="my-3">
                <span className="text-xl xl:text-lg 2xl:text-xl font-heading font-extrabold text-text-white">
                  ₦{isEmptyState ? '0' : totalRevenueVal.toLocaleString()}
                </span>
                <p className="text-[10px] text-text-muted mt-0.5">Gross collections</p>
              </div>
              <div className="h-6 mt-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniSparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CARD 2: Total Transactions */}
            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-cyan-500/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">Transactions</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  ↑ 9%
                </span>
              </div>
              <div className="my-3">
                <span className="text-xl xl:text-lg 2xl:text-xl font-heading font-extrabold text-text-white">
                  {isEmptyState ? '0' : totalTransactionsVal.toLocaleString()}
                </span>
                <p className="text-[10px] text-text-muted mt-0.5">Total VTU calls</p>
              </div>
              <div className="h-6 mt-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniSparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CARD 3: Total Users */}
            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-emerald-500/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">Total Users</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  ↑ 15%
                </span>
              </div>
              <div className="my-3">
                <span className="text-xl xl:text-lg 2xl:text-xl font-heading font-extrabold text-text-white">
                  {isEmptyState ? '0' : totalUsersVal.toLocaleString()}
                </span>
                <p className="text-[10px] text-text-muted mt-0.5">Active accounts</p>
              </div>
              <div className="h-6 mt-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniSparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CARD 4: Wallet Funding */}
            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-purple-500/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">Wallet Funding</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  ↑ 11%
                </span>
              </div>
              <div className="my-3">
                <span className="text-xl xl:text-lg 2xl:text-xl font-heading font-extrabold text-text-white">
                  ₦{isEmptyState ? '0' : walletFundingVal.toLocaleString()}
                </span>
                <p className="text-[10px] text-text-muted mt-0.5">Reserve balance</p>
              </div>
              <div className="h-6 mt-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniSparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#a855f7" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CARD 5: Platform Profit */}
            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-amber-500/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">Platform Profit</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  ↑ 7%
                </span>
              </div>
              <div className="my-3">
                <span className="text-xl xl:text-lg 2xl:text-xl font-heading font-extrabold text-text-white">
                  ₦{isEmptyState ? '0' : platformProfitVal.toLocaleString()}
                </span>
                <p className="text-[10px] text-text-muted mt-0.5">Estimated margin</p>
              </div>
              <div className="h-6 mt-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniSparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CARD 6: Success Rate */}
            <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-lg hover:border-teal-500/35 transition-all duration-300 group hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted font-medium">Success Rate</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  ↑ 0.6%
                </span>
              </div>
              <div className="my-3">
                <span className="text-xl xl:text-lg 2xl:text-xl font-heading font-extrabold text-text-white">
                  {isEmptyState ? '0%' : `${successRateVal}%`}
                </span>
                <p className="text-[10px] text-text-muted mt-0.5">API connection health</p>
              </div>
              <div className="h-6 mt-1 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniSparklineData}>
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* ─── MAIN CONTENT LAYOUT GRID ─── */}
          {isEmptyState ? (
            <div className="bg-bg-card border border-border rounded-2xl p-16 flex flex-col items-center justify-center text-center shadow-xs">
              <span className="text-4xl mb-4">📭</span>
              <h3 className="text-text-white font-heading font-bold text-lg">No Data Available</h3>
              <p className="text-text-muted text-xs sm:text-sm mt-1 max-w-sm">
                Sandbox empty state is active. Click refresh or populate stats to run the mock transactions.
              </p>
              <button
                onClick={() => { setIsEmptyState(false); setTransactions(INITIAL_TRANSACTIONS); }}
                className="mt-5 text-xs text-white bg-blue-600 hover:bg-blue-500 font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Refresh Dashboard
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT & CENTER COLUMNS (SPAN 2) */}
              <div className="lg:col-span-2 space-y-6">

                {/* Section A: Revenue Analytics Chart */}
                <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-text-white font-heading font-bold text-base">Revenue Overview</h3>
                      <p className="text-text-muted text-xs mt-0.5">Platform volume, profitability, and operational expense tracking.</p>
                    </div>

                    {/* Timeline Filter */}
                    <div className="flex items-center gap-1 bg-bg-dark-secondary p-1 rounded-xl border border-border self-start">
                      {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setRevenueFilter(mode)}
                          className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium
                            ${revenueFilter === mode
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-text-muted hover:text-text-white'
                            }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recharts Area Chart */}
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={REVENUE_TIMELINE[revenueFilter]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="profitGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: 'var(--color-bg-card)',
                            borderColor: 'var(--color-border)',
                            borderRadius: '12px',
                            color: 'var(--color-text-white)',
                            fontSize: '12px'
                          }}
                        />
                        <Area type="monotone" dataKey="Revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#revGlow)" />
                        <Area type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#profitGlow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Analytics Metrics Footer */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Revenue</p>
                      <p className="text-base font-heading font-extrabold text-text-white mt-1">₦{totalRevenueVal.toLocaleString()}</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Profit Margin</p>
                      <p className="text-base font-heading font-extrabold text-emerald-400 mt-1">₦{platformProfitVal.toLocaleString()}</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Expenses</p>
                      <p className="text-base font-heading font-extrabold text-amber-500 mt-1">₦{(totalRevenueVal - platformProfitVal).toLocaleString()}</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">API Transactions</p>
                      <p className="text-base font-heading font-extrabold text-cyan-400 mt-1">{totalTransactionsVal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Section B: Recent Transactions Table */}
                <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs w-full ">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-text-white font-heading font-bold text-base">Recent Transactions Table</h3>
                      <p className="text-text-muted text-xs mt-0.5">Admin-only operations table. Export, Flag or Refund purchases.</p>
                    </div>
                    
                    {/* Search & Action Bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        placeholder="Search TXID, User..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs px-3 py-2 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500"
                      />

                      {/* Service Filter */}
                      <select
                        value={serviceFilter}
                        onChange={(e: any) => setServiceFilter(e.target.value)}
                        className="text-xs px-2.5 py-2 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                      >
                        <option value="All">All Services</option>
                        <option value="Airtime">Airtime</option>
                        <option value="Data">Data</option>
                        <option value="Electricity">Electricity</option>
                        <option value="Cable TV">Cable TV</option>
                      </select>

                      {/* Status Filter */}
                      <select
                        value={statusFilter}
                        onChange={(e: any) => setStatusFilter(e.target.value)}
                        className="text-xs px-2.5 py-2 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                      >
                        <option value="All">All Statuses</option>
                        <option value="Success">Success</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  {/* Main Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          {['Transaction ID', 'User / Account', 'Service', 'Amount', 'Status', 'Date / Time', 'Actions'].map((h) => (
                            <th key={h} className="text-left text-text-muted font-semibold py-3 pr-4 last:pr-0 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {paginatedTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-bg-dark-secondary/50 transition-colors">
                            <td className="py-3.5 pr-4 text-blue-500 font-mono font-medium">{tx.id}</td>
                            <td className="py-3.5 pr-4">
                              <p className="text-text-white font-medium">{tx.user}</p>
                              <p className="text-[10px] text-text-muted">{tx.email}</p>
                            </td>
                            <td className="py-3.5 pr-4">
                              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-medium">
                                {tx.service}
                              </span>
                            </td>
                            <td className="py-3.5 pr-4 text-text-white font-bold">₦{tx.amount.toLocaleString()}</td>
                            <td className="py-3.5 pr-4">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border
                                ${tx.status === 'Success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : ''}
                                ${tx.status === 'Pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                                ${tx.status === 'Failed' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                              `}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="py-3.5 pr-4 text-text-muted">
                              <p>{tx.date}</p>
                              <p className="text-[10px]">{tx.time}</p>
                            </td>
                            <td className="py-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => alert(`Details: Transaction ${tx.id} was processed securely via gateway. Amount: ₦${tx.amount}`)}
                                  className="px-2 py-1 bg-bg-dark-secondary text-text-white rounded-md hover:bg-border transition-colors border border-border"
                                >
                                  View
                                </button>
                                {tx.status === 'Success' && (
                                  <button
                                    onClick={() => handleRefundTransaction(tx.id)}
                                    className="px-2 py-1 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-colors border border-red-500/10"
                                  >
                                    Refund
                                  </button>
                                )}
                                <button
                                  onClick={() => alert(`Flagged transaction ${tx.id} for fraud review.`)}
                                  className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md hover:bg-amber-500/20 transition-colors border border-amber-500/10"
                                >
                                  Flag
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination control */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <span className="text-xs text-text-muted">
                      Showing {paginatedTransactions.length} of {processedTransactions.length} items
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-bg-dark-secondary text-text-muted hover:text-text-white disabled:opacity-50 disabled:hover:text-text-muted rounded-lg border border-border transition-colors"
                      >
                        Prev
                      </button>
                      <span className="text-xs text-text-white font-semibold px-2">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-bg-dark-secondary text-text-muted hover:text-text-white disabled:opacity-50 disabled:hover:text-text-muted rounded-lg border border-border transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT SIDEBAR COLUMN (SPAN 1) */}
              <div className="space-y-6">

                {/* Alerts Center Widget */}
                <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-text-white font-heading font-bold text-sm">Alerts Center</h3>
                      <p className="text-[11px] text-text-muted mt-0.5">Critical operations log</p>
                    </div>
                    <button
                      onClick={() => setAlerts([])}
                      className="text-[11px] text-blue-500 font-semibold hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {alerts.length === 0 ? (
                      <div className="py-6 text-center text-xs text-text-muted">✓ No active alerts. All operations clean.</div>
                    ) : (
                      alerts.map((al) => (
                        <div key={al.id} className="flex gap-3 bg-bg-dark-secondary/60 border border-border p-3.5 rounded-xl">
                          <span className="text-base mt-0.5">
                            {al.severity === 'high' ? '🚨' : al.severity === 'warning' ? '⚠️' : 'ℹ️'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs font-bold leading-none ${al.severity === 'high' ? 'text-red-500' : al.severity === 'warning' ? 'text-amber-500' : 'text-blue-500'}`}>
                                {al.title}
                              </p>
                              <span className="text-[9px] text-text-muted shrink-0">{al.time}</span>
                            </div>
                            <p className="text-[10px] text-text-muted mt-1.5 leading-relaxed">{al.desc}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Service Performance Widget */}
                <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
                  <div className="mb-4">
                    <h3 className="text-text-white font-heading font-bold text-sm">Service Performance</h3>
                    <p className="text-[11px] text-text-muted mt-0.5">VTU API uptime & commission flow</p>
                  </div>

                  <div className="space-y-3">
                    {serviceStats.map((srv) => (
                      <div key={srv.name} className="border border-border bg-bg-dark-secondary/50 rounded-xl p-3 flex items-center justify-between hover:border-blue-500/25 transition-all">
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: srv.color }} />
                          <div>
                            <h4 className="text-xs font-bold text-text-white">{srv.name}</h4>
                            <p className="text-[10px] text-text-muted mt-0.5">{srv.volume.toLocaleString()} txs</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-text-white">₦{srv.revenue.toLocaleString()}</p>
                          <p className="text-[9px] text-emerald-400 font-semibold mt-0.5">{srv.successRate}% Success</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leaderboard Widget */}
                <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
                  <div className="mb-4">
                    <h3 className="text-text-white font-heading font-bold text-sm">Top Customer Rankings</h3>
                    <p className="text-[11px] text-text-muted mt-0.5">Top transaction spenders this cycle</p>
                  </div>

                  <div className="space-y-3">
                    {LEADERBOARD_USERS.map((usr) => (
                      <div key={usr.rank} className="flex items-center justify-between text-xs py-1 border-b border-border/40 last:border-0 pb-2 last:pb-0">
                        <div className="flex items-center gap-3">
                          <span className="font-heading font-bold text-blue-500 text-sm w-4">{usr.rank}</span>
                          <div>
                            <p className="text-text-white font-semibold">{usr.name}</p>
                            <p className="text-[10px] text-text-muted">{usr.handle}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-text-white">{usr.spent}</p>
                          <p className="text-[9px] text-text-muted">{usr.transactions} transactions</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-xs">
                  <div className="mb-4">
                    <h3 className="text-text-white font-heading font-bold text-sm">Activity Timeline</h3>
                    <p className="text-[11px] text-text-muted mt-0.5">Real-time system events</p>
                  </div>

                  <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {timeline.slice(0, 5).map((evt) => (
                      <div key={evt.id} className="flex gap-3 relative z-10">
                        <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-xs shrink-0 shadow-xs ${evt.color}`}>
                          {evt.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-text-white leading-relaxed">{evt.text}</p>
                          <span className="text-[9px] text-text-muted block mt-1">{evt.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ─── SYSTEM HEALTH & NETWORKS SECTION ─── */}
          <section className="bg-bg-card border border-border rounded-2xl p-6 shadow-xs">
            <div className="mb-6">
              <h3 className="text-text-white font-heading font-bold text-base">System Infrastructure Uptime</h3>
              <p className="text-text-muted text-xs mt-0.5">Real-time ping stats across external VTU providers and local databases.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-white">API Gateway</span>
                  <p className="text-[10px] text-text-muted mt-1">MTN / GLO / Airtel VTU</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                  <span className="text-[10px] text-text-muted">45ms</span>
                </div>
              </div>

              <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-white">Core Database</span>
                  <p className="text-[10px] text-text-muted mt-1">PostgreSQL Master</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                  <span className="text-[10px] text-text-muted">12ms</span>
                </div>
              </div>

              <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-white">Payment Processor</span>
                  <p className="text-[10px] text-text-muted mt-1">Paystack / Monnify API</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                  <span className="text-[10px] text-text-muted">98ms</span>
                </div>
              </div>

              <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-white">Notification Worker</span>
                  <p className="text-[10px] text-text-muted mt-1">SMS / Email Dispatch</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Slow
                  </span>
                  <span className="text-[10px] text-text-muted">450ms</span>
                </div>
              </div>

              <div className="bg-bg-dark-secondary/50 border border-border rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-text-white">Electricity Gateway</span>
                  <p className="text-[10px] text-text-muted mt-1">AEDC / IKEDC Bilers</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                  <span className="text-[10px] text-text-muted">180ms</span>
                </div>
              </div>

            </div>
          </section>

        </main>

      {/* ─── MODAL DIALOGUES ─────────────────────────────────────────────────── */}
      
      {/* 1. Modal: Add User */}
      {activeModal === 'addUser' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="text-text-white font-heading font-bold text-base mb-4">Add User Account</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1.5">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John"
                  value={formData.userFirstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userFirstName: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1.5">Last Name</label>
                <input
                  type="text"
                  placeholder="e.g. Doe"
                  value={formData.userLastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userLastName: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.userEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, userEmail: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Adjust Wallet */}
      {activeModal === 'walletAdjust' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="text-text-white font-heading font-bold text-base mb-4">Adjust System Wallet Balance</h3>
            <form onSubmit={handleWalletAdjust} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1.5">Action Type</label>
                <select
                  value={formData.walletAction}
                  onChange={(e: any) => setFormData((prev) => ({ ...prev, walletAction: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                >
                  <option value="credit">Credit Balance (Fund System)</option>
                  <option value="debit">Debit Balance (Reduce Reserve)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1.5">Amount (₦)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500000"
                  value={formData.walletAmount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, walletAmount: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                Apply Balance Change
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: Broadcast Notification */}
      {activeModal === 'broadcast' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-white text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="text-text-white font-heading font-bold text-base mb-4">Broadcast System Notification</h3>
            <form onSubmit={handleBroadcastNotification} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1.5">Notification Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MTN API Gateway Issue"
                  value={formData.notificationTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notificationTitle: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1.5">Target Audience</label>
                <select
                  value={formData.notificationTarget}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notificationTarget: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden"
                >
                  <option value="all">All Platform Users</option>
                  <option value="agents">API Agents Only</option>
                  <option value="admins">System Admins Only</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted uppercase mb-1.5">Message Body</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Detailed description or alert text..."
                  value={formData.notificationBody}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notificationBody: e.target.value }))}
                  className="w-full text-xs px-3.5 py-2.5 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
              >
                Send Broadcast
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── FLOATING SHORTCUTS COMMAND MENU ──────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setFloatingMenuOpen(!floatingMenuOpen)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 flex items-center justify-center transition-all duration-200 hover:scale-115"
          title="Floating Command Menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`w-5 h-5 transition-transform duration-300 ${floatingMenuOpen ? 'rotate-45' : ''}`}>
            <path d="M12 5v14M5 12l7-7 7 7" />
          </svg>
        </button>

        {floatingMenuOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-bg-card border border-border rounded-2xl shadow-2xl p-4 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="border-b border-border pb-2">
              <p className="text-xs font-bold text-text-white">Admin Command Center</p>
              <p className="text-[10px] text-text-muted">Quick operational shortcuts</p>
            </div>
            
            <input
              type="text"
              placeholder="Search shortcuts or commands..."
              value={quickSearchQuery}
              onChange={(e) => setQuickSearchQuery(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-border rounded-xl bg-bg-dark-secondary text-text-white focus:outline-hidden focus:border-blue-500"
            />

            <div className="space-y-1">
              <button
                onClick={() => { setActiveModal('addUser'); setFloatingMenuOpen(false); }}
                className="w-full flex items-center justify-between text-xs text-text-white hover:bg-bg-card-hover p-2 rounded-lg transition-colors text-left"
              >
                <span>➕ Create User Profile</span>
                <kbd className="text-[9px] bg-bg-dark-secondary px-1.5 py-0.5 rounded border border-border">Ctrl+U</kbd>
              </button>
              <button
                onClick={() => { setActiveModal('broadcast'); setFloatingMenuOpen(false); }}
                className="w-full flex items-center justify-between text-xs text-text-white hover:bg-bg-card-hover p-2 rounded-lg transition-colors text-left"
              >
                <span>📢 Send Global Notice</span>
                <kbd className="text-[9px] bg-bg-dark-secondary px-1.5 py-0.5 rounded border border-border">Ctrl+B</kbd>
              </button>
              <button
                onClick={() => { alert('Exporting platform audit logs...'); setFloatingMenuOpen(false); }}
                className="w-full flex items-center justify-between text-xs text-text-white hover:bg-bg-card-hover p-2 rounded-lg transition-colors text-left"
              >
                <span>📥 Export Financial Logs</span>
                <kbd className="text-[9px] bg-bg-dark-secondary px-1.5 py-0.5 rounded border border-border">Ctrl+E</kbd>
              </button>
              <button
                onClick={() => { alert('Fetching backend microservices debug logs...'); setFloatingMenuOpen(false); }}
                className="w-full flex items-center justify-between text-xs text-text-white hover:bg-bg-card-hover p-2 rounded-lg transition-colors text-left"
              >
                <span>⚙️ Show System Logs</span>
                <kbd className="text-[9px] bg-bg-dark-secondary px-1.5 py-0.5 rounded border border-border">Ctrl+L</kbd>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
