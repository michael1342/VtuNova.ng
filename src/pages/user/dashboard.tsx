import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { getTransactions, getTransactionChart } from '../../api/user';
import paginate from '../../utils/pagination.ts';
import { formatAmount } from '../../utils/formatter.ts';
import useAuthStore from '../../api/store';
import { useNotifications, type BackendNotification, type BackendTransaction } from '../../context/NotificationContext';
import { type MonthlyChartItem } from '../../interface/user.interface';


// ─── Notification Helpers ─────────────────────────────────────────────────────

function deriveNotificationTitle(n: BackendNotification, tx?: BackendTransaction): string {
  if (n.title) return n.title;
  if (!tx) return 'Notification';
  const isDeposit = tx.service?.toLowerCase() === 'deposit' || tx.service?.toLowerCase() === 'fund';
  const succeeded = tx.status?.toLowerCase() === 'success' || tx.status?.toLowerCase() === 'successful';
  if (isDeposit) return succeeded ? 'Deposit Successful' : 'Deposit Failed';
  return succeeded ? `${tx.service ?? 'Purchase'} Successful` : `${tx.service ?? 'Purchase'} Failed`;
}

function deriveNotificationDesc(n: BackendNotification, tx?: BackendTransaction): string {
  if (n.message) return n.message;
  if (!tx) return 'You have a new update.';
  const isDeposit = tx.service?.toLowerCase() === 'deposit' || tx.service?.toLowerCase() === 'fund';
  const succeeded = tx.status?.toLowerCase() === 'success' || tx.status?.toLowerCase() === 'successful';
  const amtStr = tx.amount != null ? formatAmount(tx.amount, true) : 'an amount';
  if (isDeposit) {
    return succeeded
      ? `${amtStr} added to wallet balance`
      : `Deposit of ${amtStr} failed`;
  }
  return succeeded
    ? `${amtStr} ${tx.service ?? 'purchase'} delivered`
    : `Payment of ${amtStr} failed`;
}

function deriveNotificationType(n: BackendNotification, tx?: BackendTransaction): 'success' | 'info' | 'warning' {
  if (tx) {
    const status = tx.status?.toLowerCase();
    if (status === 'failed' || status === 'reversed') return 'warning';
    if (status === 'success' || status === 'successful') return 'success';
  }
  const cat = n.category?.toLowerCase() || '';
  if (cat === 'transactions' || cat === 'wallet') return 'success';
  if (cat === 'promotions' || cat === 'warning') return 'warning';
  return 'info';
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Just now';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}


// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

const StatCard = ({ label, value, change, positive, icon, iconBg }: StatCardProps) => (
  <div className="bg-bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-border-hover transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${positive ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}
      >
        {change}
      </span>
    </div>
    <div>
      <div className="text-xs text-text-muted mb-0.5">{label}</div>
      <div className="text-xl font-bold text-text-white font-['Space_Grotesk']">{value}</div>
    </div>
  </div>
);

// ─── Quick Action Button ──────────────────────────────────────────────────────

interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  to: string;
}

const QuickAction = ({ label, icon, iconBg, to }: QuickActionProps) => (
  <Link
    to={to}
    className="flex flex-col items-center gap-2.5 bg-bg-card border border-border rounded-xl p-4 hover:border-border-hover hover:bg-bg-card-hover transition-all duration-200 group w-full"
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
      {icon}
    </div>
    <span className="text-xs text-text-gray group-hover:text-text-white transition-colors">{label}</span>
  </Link>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    failed: 'text-red-400 bg-red-500/10 border-red-500/20',
    abandoned: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
  };
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${map[status] ?? 'text-text-muted bg-zinc-500/10'}`}>
      {status}
    </span>
  );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-dark-secondary border border-border rounded-lg px-3 py-2 text-xs text-text-white shadow-xl space-y-0.5">
        <div className="text-text-muted font-medium">{data.monthName || label}</div>
        <div className="font-bold text-primary-light">{data.totalTransactions ?? payload[0].value} transactions</div>
        {data.totalAmount != null && (
          <div className="text-[11px] text-emerald-400 font-semibold font-mono">
            {formatAmount(data.totalAmount, true)}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const ServicePieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-dark-secondary border border-border rounded-xl p-3 text-xs text-text-white shadow-2xl space-y-1.5 z-50">
        <div className="flex items-center gap-1.5 font-semibold text-text-white">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          <span>{data.name}</span>
        </div>
        <div className="text-text-muted text-[11px] flex justify-between gap-3">
          <span>Share:</span>
          <span className="font-bold text-text-white">{data.value}%</span>
        </div>
        <div className="text-text-muted text-[11px] flex justify-between gap-3">
          <span>Transactions:</span>
          <span className="font-semibold text-text-white">{data.count}</span>
        </div>
        <div className="text-text-muted text-[11px] flex justify-between gap-3">
          <span>Total Spend:</span>
          <span className="font-semibold text-emerald-400 font-mono">{formatAmount(data.amount, true)}</span>
        </div>
      </div>
    );
  }
  return null;
};

// ─── Dashboard Page ───────────────────────────────────────────────────────────

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const accountBalance = useAuthStore((state) => state.accountBalance);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  // ─── Chart States ───────────────────────────────────────────────────────────
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [chartData, setChartData] = useState<MonthlyChartItem[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(true);
  const [chartMetric, setChartMetric] = useState<'transactions' | 'amount'>('transactions');
  const [serviceMetric, setServiceMetric] = useState<'amount' | 'count'>('count');

  const { notifications, transactions, unreadCount, isLoading: isLoadingNotifications, markAsRead } = useNotifications();

  const txMap = useMemo(() => {
    const map = new Map<string, BackendTransaction>();
    (transactions || []).forEach((tx) => {
      if (tx._id) map.set(tx._id, tx);
    });
    return map;
  }, [transactions]);

  const dashboardNotifications = useMemo(() => {
    return (notifications || []).slice(0, 4);
  }, [notifications]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        if (res?.transactions && Array.isArray(res.transactions) && res.transactions.length > 0) {
          setAllTransactions(res.transactions);
        }

      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoadingChart(true);
        const res = await getTransactionChart(selectedYear);
        if (res?.data?.monthlyData && Array.isArray(res.data.monthlyData)) {
          setChartData(res.data.monthlyData);
        }
      } catch (error) {
        console.error('Error fetching transaction chart data:', error);
      } finally {
        setIsLoadingChart(false);
      }
    };
    fetchChartData();
  }, [selectedYear]);

  const monthlyChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return defaultMonths.map((m) => ({
        month: m,
        monthName: m,
        value: 0,
        totalTransactions: 0,
        totalAmount: 0,
        successfulTransactions: 0,
      }));
    }
    return chartData.map((item) => ({
      month: item.shortMonth,
      monthName: item.monthName,
      value: chartMetric === 'transactions' ? item.totalTransactions : item.totalAmount,
      totalTransactions: item.totalTransactions,
      totalAmount: item.totalAmount,
      successfulTransactions: item.successfulTransactions,
    }));
  }, [chartData, chartMetric]);

  const { serviceBreakdown, totalSpend, totalServiceTxns, topService } = useMemo(() => {
    const categories: Record<string, { name: string; amount: number; count: number; color: string }> = {
      Airtime: { name: 'Airtime', amount: 0, count: 0, color: '#3b82f6' },
      Data: { name: 'Data', amount: 0, count: 0, color: '#10b981' },
      Electricity: { name: 'Electricity', amount: 0, count: 0, color: '#f59e0b' },
      'Cable TV': { name: 'Cable TV', amount: 0, count: 0, color: '#a855f7' },
      Deposit: { name: 'Deposit', amount: 0, count: 0, color: '#ec4899' },
    };

    let totalSpendCalc = 0;
    let totalTxnsCalc = 0;

    (allTransactions || []).forEach((tx) => {
      const s = (tx.service || '').toLowerCase();
      const amt = Number(tx.amount) || 0;
      const isSuccess = (tx.status || '').toLowerCase() === 'success';

      let key = '';
      if (s.includes('airtime')) key = 'Airtime';
      else if (s.includes('data')) key = 'Data';
      else if (s.includes('elect')) key = 'Electricity';
      else if (s.includes('cable') || s.includes('tv')) key = 'Cable TV';
      else if (s.includes('deposit') || s.includes('fund') || s.includes('wallet')) key = 'Deposit';

      if (key && categories[key]) {
        categories[key].count++;
        totalTxnsCalc++;
        if (isSuccess) {
          categories[key].amount += amt;
          totalSpendCalc += amt;
        }
      }
    });

    const breakdown = Object.values(categories).map((item) => {
      const percentage =
        serviceMetric === 'amount'
          ? totalSpendCalc > 0
            ? Math.round((item.amount / totalSpendCalc) * 100)
            : 0
          : totalTxnsCalc > 0
          ? Math.round((item.count / totalTxnsCalc) * 100)
          : 0;

      return {
        ...item,
        value: percentage,
        percentage,
      };
    });

    // Find top used service by current metric
    const sorted = [...breakdown].sort((a, b) => b.value - a.value);
    const top = sorted[0]?.value > 0 ? sorted[0] : null;

    return {
      serviceBreakdown: breakdown,
      totalSpend: totalSpendCalc,
      totalServiceTxns: totalTxnsCalc,
      topService: top,
    };
  }, [allTransactions, serviceMetric]);




  const paginatedTransactions = useMemo(() => {
    return paginate(allTransactions, currentPage, pageSize);
  }, [allTransactions, currentPage, pageSize]);

  const totalPages = Math.ceil(allTransactions.length / pageSize) || 1;

  const handlePaginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary overflow-y-auto">

      {/* ── Main Content ── */}
      <main className="flex-1 p-6 space-y-5">

        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-2xl p-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-text-white text-xl font-bold font-['Space_Grotesk'] flex flex-wrap items-center gap-2">
                Welcome Back, {currentUser?.firstName || 'User'} 👋
                <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                  Verified
                </span>
              </h2>
              <p className="text-text-gray text-sm mt-1">Manage your wallet, airtime purchases, data subscriptions, and bill payments from one place.</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) || 'N/A'}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  Last login: {currentUser ? new Date(currentUser?.lastLogin).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  }) : 'N/A'}
                </span>
              </div>
            </div>
            <Link to="/user/fund" className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
              Fund Wallet
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Wallet Balance"
            value={formatAmount(accountBalance || 0, true)}
            change="+12.4%"
            positive={true}
            iconBg="bg-blue-500/15"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="w-4 h-4">
                <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
              </svg>
            }
          />
          <StatCard
            label="Total Transactions"
            value={formatAmount(allTransactions.length, false) || '0'}
            change="+8.1%"
            positive={true}
            iconBg="bg-purple-500/15"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" className="w-4 h-4">
                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            }
          />
          <StatCard
            label="Successful Purchases"
            value={formatAmount(allTransactions.filter((transaction) => transaction.status === 'success').length, false) || '0'}
            change="+5.3%"
            positive={true}
            iconBg="bg-emerald-500/15"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
          />
          <StatCard
            label="Referral Earnings"
            value={formatAmount(currentUser?.wallet.referralEarnings || '0', true)}
            change="-8.6%"
            positive={false}
            iconBg="bg-pink-500/15"
            icon={
              <svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" className="w-4 h-4">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            }
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <div className="mb-4">
            <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Quick Actions</h3>
            <p className="text-xs text-text-muted mt-0.5">One-click navigation</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <QuickAction
              label="Buy Airtime"
              iconBg="bg-blue-500/15"
              to="/user/buy/airtime"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="w-5 h-5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.5 11.5a19.79 19.79 0 01-3.07-8.67A2 2 0 013.41 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.37a16 16 0 006.72 6.72l1.74-1.74a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              }
            />

            <QuickAction
              label="Buy Data"
              iconBg="bg-emerald-500/15"
              to="/user/buy/data"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" className="w-5 h-5">
                  <path d="M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M10.54 16.1a6 6 0 012.92 0M12 20h.01" />
                </svg>
              }
            />
            <QuickAction
              label="Pay Electricity"
              iconBg="bg-amber-500/15"
              to="/user/buy/electricity"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="w-5 h-5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              }
            />
            <QuickAction
              label="Subscribe TV"
              iconBg="bg-purple-500/15"
              to="/user/buy/cable"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" className="w-5 h-5">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3l-4 4-4-4" />
                </svg>
              }
            />
            <QuickAction
              label="Fund Wallet"
              iconBg="bg-pink-500/15"
              to="/user/fund"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" className="w-5 h-5">
                  <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Monthly Transactions Chart */}
          <div className="lg:col-span-3 bg-bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Monthly Transactions</h3>
                <p className="text-xs text-text-muted mt-0.5">Transaction volume over time</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-bg-dark-secondary border border-border rounded-lg p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setChartMetric('transactions')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      chartMetric === 'transactions' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-white'
                    }`}
                  >
                    Count
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric('amount')}
                    className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                      chartMetric === 'amount' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-white'
                    }`}
                  >
                    Amount
                  </button>
                </div>
                <div className="flex items-center gap-1.5 bg-bg-dark-secondary border border-border rounded-lg px-2.5 py-1 text-xs text-text-gray">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-text-muted">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-transparent text-text-white text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value={currentYear} className="bg-bg-dark-secondary text-text-white">{currentYear}</option>
                    <option value={currentYear - 1} className="bg-bg-dark-secondary text-text-white">{currentYear - 1}</option>
                    <option value={currentYear - 2} className="bg-bg-dark-secondary text-text-white">{currentYear - 2}</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoadingChart ? (
              <div className="h-[220px] flex items-center justify-center bg-bg-dark-secondary/30 rounded-xl animate-pulse">
                <div className="text-xs text-text-muted flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading chart data...
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyChartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#71717a', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#txGrad)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#3b82f6', stroke: '#1d4ed8', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Service Usage Donut Card */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 flex flex-col justify-between">
            {/* Header & Metric Switch */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Service Usage</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {topService ? `Top: ${topService.name} (${topService.value}%)` : 'Breakdown across services'}
                </p>
              </div>
              <div className="flex items-center bg-bg-dark-secondary border border-border rounded-lg p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setServiceMetric('amount')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    serviceMetric === 'amount' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-white'
                  }`}
                >
                  Amount
                </button>
                <button
                  type="button"
                  onClick={() => setServiceMetric('count')}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    serviceMetric === 'count' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-white'
                  }`}
                >
                  Count
                </button>
              </div>
            </div>

            {totalServiceTxns > 0 ? (
              <div className="flex-1 flex flex-col justify-between">
                {/* Donut Chart with Center Summary */}
                <div className="relative flex items-center justify-center py-1">
                  <ResponsiveContainer width="100%" height={145}>
                    <PieChart>
                      <Pie
                        data={serviceBreakdown.filter((s) => (serviceMetric === 'amount' ? s.amount > 0 : s.count > 0))}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {serviceBreakdown.filter((s) => (serviceMetric === 'amount' ? s.amount > 0 : s.count > 0)).map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<ServicePieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[9px] text-text-muted font-medium uppercase tracking-wider">
                      {serviceMetric === 'amount' ? 'Total Spent' : 'Total Txns'}
                    </span>
                    <span className="text-xs font-bold text-text-white font-['Space_Grotesk']">
                      {serviceMetric === 'amount' ? formatAmount(totalSpend, true) : totalServiceTxns}
                    </span>
                  </div>
                </div>

                {/* Clean Breakdown Rows */}
                <div className="space-y-1.5 pt-2 border-t border-border mt-2">
                  {serviceBreakdown.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-xs py-0.5 hover:bg-bg-dark-secondary/40 px-1 rounded transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="font-medium text-text-gray truncate text-[11px]">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-text-muted">
                          {serviceMetric === 'amount' ? formatAmount(s.amount, true) : `${s.count} txns`}
                        </span>
                        <span className="text-[10px] font-semibold text-text-white bg-bg-dark-secondary px-1.5 py-0.5 rounded border border-border min-w-[32px] text-center">
                          {s.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center bg-bg-dark-secondary/30 rounded-xl border border-border/50 space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-white">No Service Activity Yet</p>
                  <p className="text-[10px] text-text-muted mt-0.5 max-w-[200px]">Perform transactions like Airtime or Data to view your breakdown.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Recent Transactions + Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Recent Transactions */}
          <div className="lg:col-span-3 bg-bg-card border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Recent Transactions</h3>
                <p className="text-xs text-text-muted mt-0.5">Your latest activity</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/user/transactions" className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors mr-2">
                  View All
                </Link>
                <button className="flex items-center gap-1.5 text-xs text-text-gray hover:text-text-white bg-bg-dark-secondary border border-border rounded-lg px-2.5 py-1.5 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filter
                </button>
                <button className="flex items-center gap-1.5 text-xs text-text-gray hover:text-text-white bg-bg-dark-secondary border border-border rounded-lg px-2.5 py-1.5 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {['Transaction ID', 'Service', 'Recipient', 'Amount', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left text-text-muted font-medium py-2 pr-4 last:pr-0 whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedTransactions?.map((tx: any, i: number) => {
                    const txId = tx._id
                      ? '#TX-' + tx._id.slice(0, 8).toUpperCase().replace(/(.{4})/g, '$1-')
                      : tx.id || `#TX-${(currentPage - 1) * pageSize + i + 1}`;
                    return (
                      <tr key={tx._id || tx.id || i} className="border-b border-border hover:bg-bg-card-hover transition-colors">
                        <td className="py-3 pr-4 text-blue-400 font-monox whitespace-nowrap">{txId}</td>
                        <td className="py-3 pr-4 text-text-white whitespace-nowrap">{tx.service}</td>
                        <td className="py-3 pr-4 text-text-gray font-mono whitespace-nowrap">{currentUser?.firstName}</td>
                        <td className="py-3 pr-4 text-text-white font-semibold whitespace-nowrap">{formatAmount(tx.amount, true)}</td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          <StatusBadge status={(tx.status || '').toLowerCase()} />
                        </td>
                        <td className="py-3 text-text-muted">
                          {tx.paidAt
                            ? new Date(tx.paidAt).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                            : tx.date || '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-border select-none">
              <span className="text-xs text-text-muted">
                Showing {allTransactions.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
                {Math.min(currentPage * pageSize, allTransactions.length)} of {allTransactions.length} items
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePaginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-lg bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:bg-bg-card-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous Page"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePaginate(page)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${currentPage === page
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                        : 'bg-bg-dark-secondary border border-border text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePaginate(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="w-7 h-7 rounded-lg bg-bg-dark-secondary border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:bg-bg-card-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next Page"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-text-white font-semibold text-sm font-['Space_Grotesk']">Notifications</h3>
                <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full">
                  {unreadCount > 0 ? `${unreadCount} new` : 'All caught up'}
                </span>
              </div>
              <Link to="/user/notifications" className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-3 flex-1">
              {isLoadingNotifications ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3 bg-bg-dark-secondary border border-border rounded-xl p-3 animate-pulse">
                      <div className="w-7 h-7 rounded-lg bg-white/10 shrink-0 mt-0.5" />
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="h-3 w-28 bg-white/10 rounded" />
                        <div className="h-2.5 w-40 bg-white/5 rounded" />
                      </div>
                      <div className="h-2.5 w-10 bg-white/5 rounded shrink-0" />
                    </div>
                  ))}
                </div>
              ) : dashboardNotifications.length > 0 ? (
                dashboardNotifications.map((n) => {
                  const tx = n.transactionId ? txMap.get(n.transactionId) : undefined;
                  const title = deriveNotificationTitle(n, tx);
                  const desc = deriveNotificationDesc(n, tx);
                  const type = deriveNotificationType(n, tx);
                  const time = formatRelativeTime(n.date);

                  const iconMap: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
                    success: {
                      color: 'text-emerald-400',
                      bg: 'bg-emerald-500/10',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ),
                    },
                    info: {
                      color: 'text-blue-400',
                      bg: 'bg-blue-500/10',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                        </svg>
                      ),
                    },
                    warning: {
                      color: 'text-amber-400',
                      bg: 'bg-amber-500/10',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><path d="M12 9v4M12 17h.01" />
                        </svg>
                      ),
                    },
                  };
                  const style = iconMap[type] ?? iconMap.info;

                  return (
                    <Link
                      to="/user/notifications"
                      key={n._id}
                      onClick={() => !n.isRead && markAsRead(n._id)}
                      className={`flex items-start gap-3 bg-bg-dark-secondary border border-border rounded-xl p-3 hover:bg-bg-card-hover transition-colors cursor-pointer block ${
                        !n.isRead ? 'border-primary/30' : ''
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg ${style.bg} ${style.color} flex items-center justify-center shrink-0 mt-0.5`}>
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-text-white flex items-center gap-1.5">
                          <span className="truncate">{title}</span>
                          {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                        </div>
                        <div className="text-[11px] text-text-muted mt-0.5 truncate">{desc}</div>
                      </div>
                      <span className="text-[10px] text-text-muted shrink-0">{time}</span>
                    </Link>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center bg-bg-dark-secondary/40 border border-border/50 rounded-xl space-y-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-white">No Notifications</div>
                    <div className="text-[11px] text-text-muted mt-0.5">You're all caught up with your updates.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating help button */}
      <Link to="/main/help" className="fixed bottom-6 right-6 w-11 h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all duration-200 hover:scale-110 z-50">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
        </svg>
      </Link>
    </div>
  );
};

export default Dashboard;
