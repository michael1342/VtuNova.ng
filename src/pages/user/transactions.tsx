import React, { useState, useMemo, useEffect } from 'react';
import { formatAmount, formatId, formatDate } from '../../utils/formatter';
import { getTransactions, getTransactionChart, generateTransactionReceipt } from '../../api/user';
import { type Transaction, type TransactionReceipt, type MonthlyChartItem } from '../../interface/user.interface';
import { useAuth } from '../../context/AuthContext';

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
  return date.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
}

const Transactions = () => {
  // Transactions State
  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  const [chartData, setChartData] = useState<MonthlyChartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [, setDateRange] = useState<string>('Last 30 Days');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  // Table State
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Interaction Modals/Drawer
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptTransaction, setReceiptTransaction] = useState<TransactionReceipt | Transaction | null>(null);
  const [isReceiptLoading, setIsReceiptLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [txnRes, chartRes] = await Promise.allSettled([
          getTransactions(),
          getTransactionChart(new Date().getFullYear()),
        ]);

        if (txnRes.status === 'fulfilled' && txnRes.value?.transactions) {
          setTransactionsList(txnRes.value.transactions);
        }
        if (chartRes.status === 'fulfilled' && chartRes.value?.data?.monthlyData) {
          setChartData(chartRes.value.data.monthlyData);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Dynamic Overview Stats
  const stats = useMemo(() => {
    const totalCount = transactionsList.length;

    // Successful transactions
    const successfulTxns = transactionsList.filter(
      (t) => t.status?.toLowerCase() === 'success' || t.status?.toLowerCase() === 'delivered'
    );

    // Total spent (purchases, excluding deposits)
    const purchases = successfulTxns.filter(
      (t) =>
        t.service?.toLowerCase() !== 'deposit' &&
        t.service?.toLowerCase() !== 'fund' &&
        t.service?.toLowerCase() !== 'wallet funding'
    );
    const totalSpent = purchases.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    // Total funding / deposits
    const fundings = successfulTxns.filter(
      (t) =>
        t.service?.toLowerCase() === 'deposit' ||
        t.service?.toLowerCase() === 'fund' ||
        t.service?.toLowerCase() === 'wallet funding'
    );
    const totalFunded = fundings.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

    const successRate = totalCount > 0 ? ((successfulTxns.length / totalCount) * 100).toFixed(1) : '100';

    return {
      totalCount,
      totalSpent,
      totalSuccessful: successfulTxns.length,
      successRate,
      totalFunded,
    };
  }, [transactionsList]);

  // Dynamic Monthly Spending Chart Calculation
  const monthlySpendingList = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (chartData && chartData.length > 0) {
      const maxVal = Math.max(...chartData.map((d) => d.totalAmount || d.successfulAmount || 0), 1);
      return chartData.map((d) => {
        const amt = d.successfulAmount || d.totalAmount || 0;
        return {
          month: d.shortMonth || monthNames[d.month - 1] || `${d.month}`,
          amount: amt,
          count: d.totalTransactions || 0,
          val: maxVal > 0 && amt > 0 ? Math.max(Math.round((amt / maxVal) * 100), 8) : 4,
        };
      });
    }

    // Fallback computed from transactionsList
    const monthlyMap: Record<number, { amount: number; count: number }> = {};
    for (let i = 0; i < 12; i++) {
      monthlyMap[i] = { amount: 0, count: 0 };
    }

    transactionsList.forEach((tx) => {
      const dateStr = tx.paidAt || tx.createdAt || tx.date;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const m = d.getMonth();
          const amt = Number(tx.amount) || 0;
          const isSuccess = tx.status?.toLowerCase() === 'success' || tx.status?.toLowerCase() === 'delivered';
          if (isSuccess && monthlyMap[m]) {
            monthlyMap[m].amount += amt;
            monthlyMap[m].count += 1;
          }
        }
      }
    });

    const maxAmt = Math.max(...Object.values(monthlyMap).map((m) => m.amount), 1);
    return monthNames.map((name, idx) => {
      const item = monthlyMap[idx] || { amount: 0, count: 0 };
      return {
        month: name,
        amount: item.amount,
        count: item.count,
        val: maxAmt > 0 && item.amount > 0 ? Math.max(Math.round((item.amount / maxAmt) * 100), 8) : 4,
      };
    });
  }, [chartData, transactionsList]);

  // Dynamic Service Breakdown & Insights Calculation
  const { serviceBreakdown, topService, highestTxn, avgSpending } = useMemo(() => {
    const categories: Record<string, { label: string; amount: number; count: number; bg: string }> = {
      Airtime: { label: 'Airtime', amount: 0, count: 0, bg: 'bg-accent-orange' },
      Data: { label: 'Data', amount: 0, count: 0, bg: 'bg-primary' },
      Electricity: { label: 'Electricity', amount: 0, count: 0, bg: 'bg-accent-green' },
      'Cable TV': { label: 'Cable TV', amount: 0, count: 0, bg: 'bg-accent-purple' },
      'Wallet Funding': { label: 'Wallet Funding', amount: 0, count: 0, bg: 'bg-pink-500' },
    };

    let totalServiceSpend = 0;
    let highest: Transaction | null = null;

    transactionsList.forEach((tx) => {
      const s = (tx.service || '').toLowerCase();
      const amt = Number(tx.amount) || 0;
      const isSuccess = tx.status?.toLowerCase() === 'success' || tx.status?.toLowerCase() === 'delivered';

      let key = 'Airtime';
      if (s.includes('airtime')) key = 'Airtime';
      else if (s.includes('data')) key = 'Data';
      else if (s.includes('elect')) key = 'Electricity';
      else if (s.includes('cable') || s.includes('tv')) key = 'Cable TV';
      else if (s.includes('deposit') || s.includes('fund') || s.includes('wallet')) key = 'Wallet Funding';
      else key = 'Data';

      if (categories[key]) {
        categories[key].count += 1;
        if (isSuccess) {
          categories[key].amount += amt;
          totalServiceSpend += amt;
        }
      }

      if (!highest || amt > (highest.amount || 0)) {
        highest = tx;
      }
    });

    const breakdown = Object.values(categories).map((item) => {
      const pct = totalServiceSpend > 0 ? Math.round((item.amount / totalServiceSpend) * 100) : 0;
      return {
        ...item,
        val: `${pct}%`,
        amt: formatAmount(item.amount, true) || `₦${item.amount.toLocaleString()}`,
        pct,
      };
    });

    const sortedBySpend = [...breakdown].sort((a, b) => b.amount - a.amount);
    const top = sortedBySpend[0] && sortedBySpend[0].amount > 0 ? sortedBySpend[0] : breakdown[0];

    const successfulPurchases = transactionsList.filter(
      (t) =>
        (t.status?.toLowerCase() === 'success' || t.status?.toLowerCase() === 'delivered') &&
        t.service?.toLowerCase() !== 'deposit' &&
        t.service?.toLowerCase() !== 'fund'
    );
    const avg =
      successfulPurchases.length > 0
        ? Math.round(totalServiceSpend / successfulPurchases.length)
        : 0;

    return {
      serviceBreakdown: breakdown,
      topService: top,
      highestTxn: highest as Transaction | null,
      avgSpending: avg,
    };
  }, [transactionsList]);

  // Recent Activity Timeline from live transactions
  const recentActivities = useMemo(() => {
    return [...transactionsList]
      .sort((a, b) => {
        const dateA = a.paidAt || a.createdAt || a.date || '';
        const dateB = b.paidAt || b.createdAt || b.date || '';
        return dateB.localeCompare(dateA);
      })
      .slice(0, 4);
  }, [transactionsList]);

  // Filter handlers
  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedTypes([]);
    setSelectedStatus('All');
    setDateRange('Last 30 Days');
    setMinAmount('');
    setMaxAmount('');
    setCurrentPage(1);
  };

  // Filter calculation
  const filteredTransactions = useMemo(() => {
    return transactionsList.filter((txn) => {
      // Search Match
      const matchesSearch =
        txn._id?.toLowerCase().includes(search.toLowerCase()) ||
        txn.id?.toLowerCase().includes(search.toLowerCase()) ||
        txn.recipient?.toLowerCase().includes(search.toLowerCase()) ||
        txn.refNo?.toLowerCase().includes(search.toLowerCase()) ||
        txn.reference?.toLowerCase().includes(search.toLowerCase());

      // Type Match
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(txn.service);

      // Status Match
      const matchesStatus =
        selectedStatus === 'All' || txn.status === selectedStatus;

      // Amount Range Match
      const matchesMin = minAmount === '' || txn.amount >= Number(minAmount);
      const matchesMax = maxAmount === '' || txn.amount <= Number(maxAmount);

      return matchesSearch && matchesType && matchesStatus && matchesMin && matchesMax;
    });
  }, [transactionsList, search, selectedTypes, selectedStatus, minAmount, maxAmount]);

  // Sorting calculation
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      // Date sort
      const dateA = a.paidAt || a.createdAt || a.date || '';
      const dateB = b.paidAt || b.createdAt || b.date || '';
      return sortOrder === 'asc'
        ? dateA.localeCompare(dateB)
        : dateB.localeCompare(dateA);
    });
  }, [filteredTransactions, sortBy, sortOrder]);

  // Pagination calculation
  const itemsPerPage = 5;
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedTransactions, currentPage]);

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const handleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(paginatedTransactions.map((t) => (t._id || t.id || '')));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleRowClick = (txn: Transaction) => {
    setActiveTransaction(txn);
    setShowDrawer(true);
  };

  const triggerReceipt = async (txn: Transaction, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReceiptTransaction(txn);
    setShowReceipt(true);
    const txId = txn._id || txn.id;
    if (txId) {
      setIsReceiptLoading(true);
      try {
        const response = await generateTransactionReceipt(txId);
        if (response && response.success) {
          const receiptData = response.receipt || response.data || response.transaction;
          if (receiptData) {
            setReceiptTransaction(receiptData);
          }
        }
      } catch (err) {
        console.error('Failed to generate receipt from API:', err);
      } finally {
        setIsReceiptLoading(false);
      }
    }
  };

  
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary text-text-gray transition-colors font-sans">

      {/* ── Main Container ── */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-white font-['Space_Grotesk']">Transactions</h2>
            <p className="text-xs text-text-muted mt-1">Track, manage, and monitor all wallet funding and service purchases in one place.</p>
          </div>
          
          <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-semibold">
            {['✓ Real-Time Tracking', '✓ Secure Records', '✓ Download Receipts', '✓ Complete Transaction History'].map((badge, idx) => (
              <span key={idx} className="bg-bg-card border border-border px-3 py-1 rounded-full text-text-gray">
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* ── Overview Statistics Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted font-medium">Total Transactions</span>
              <span className="p-1.5 rounded-lg bg-primary-glow text-primary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-text-white font-['Space_Grotesk']">
                {stats.totalCount.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-accent-green font-semibold mt-1">
                <span>{stats.totalSuccessful} completed</span>
                <span className="text-text-muted font-normal">all-time</span>
              </div>
            </div>
            {/* Sparkline */}
            <div className="mt-3 h-7 w-full overflow-hidden">
              <svg className="w-full h-full text-primary" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q15,5 30,12 T60,5 T90,15 L100,10" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted font-medium">Total Spending</span>
              <span className="p-1.5 rounded-lg bg-accent-cyan-glow text-accent-cyan">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 20V4M18 8l-6-6-6 6" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-text-white font-['Space_Grotesk']">
                {formatAmount(stats.totalSpent, true) || `₦${stats.totalSpent.toLocaleString()}`}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-accent-green font-semibold mt-1">
                <span>Avg {formatAmount(avgSpending, true)}</span>
                <span className="text-text-muted font-normal">per purchase</span>
              </div>
            </div>
            {/* Sparkline */}
            <div className="mt-3 h-7 w-full overflow-hidden">
              <svg className="w-full h-full text-accent-cyan" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,10 Q20,18 40,8 T80,5 T100,12" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted font-medium">Successful Transactions</span>
              <span className="p-1.5 rounded-lg bg-accent-green-glow text-accent-green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-text-white font-['Space_Grotesk']">
                {stats.totalSuccessful.toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-accent-green font-semibold mt-1">
                <span>{stats.successRate}%</span>
                <span className="text-text-muted font-normal">Success Rate</span>
              </div>
            </div>
            {/* Sparkline */}
            <div className="mt-3 h-7 w-full overflow-hidden">
              <svg className="w-full h-full text-accent-green" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,5 L20,5 L45,6 L70,4 L100,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-muted font-medium">Wallet Funding</span>
              <span className="p-1.5 rounded-lg bg-accent-purple-glow text-accent-purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold text-text-white font-['Space_Grotesk']">
                {formatAmount(stats.totalFunded, true) || `₦${stats.totalFunded.toLocaleString()}`}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-accent-green font-semibold mt-1">
                <span>Deposited</span>
                <span className="text-text-muted font-normal">to wallet</span>
              </div>
            </div>
            {/* Sparkline */}
            <div className="mt-3 h-7 w-full overflow-hidden">
              <svg className="w-full h-full text-accent-purple" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,18 Q30,5 60,15 T100,5" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Advanced Filter Section ── */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="text-sm font-bold text-text-white font-['Space_Grotesk']">Filter Options</h3>
            <button
              onClick={handleResetFilters}
              type="button"
              className="text-xs text-primary hover:text-primary-hover font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Input Search */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider">Search</label>
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="ID, phone, meter..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-bg-dark-secondary border border-border rounded-xl text-text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider">Transaction Type</label>
              <div className="flex flex-wrap gap-1">
                {['Airtime', 'Data', 'Electricity', 'Cable TV', 'Wallet Funding'].map((type) => {
                  const isSel = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleTypeToggle(type)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                        isSel
                          ? 'bg-primary border-primary text-white'
                          : 'bg-bg-dark border-border text-text-gray hover:border-border-hover'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-bg-dark-secondary border border-border rounded-xl text-text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Reversed">Reversed</option>
              </select>
            </div>

            {/* Amount Range Filter */}
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider">Amount Range (₦)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-dark-secondary border border-border rounded-xl text-text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                />
                <span className="text-text-muted text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-bg-dark-secondary border border-border rounded-xl text-text-white placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── Main Transactions Table / Data Section ── */}
        <div className="bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          
          {/* Table Toolbar Actions */}
          <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-dark-secondary">
            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <span>{sortedTransactions.length} items found</span>
              {selectedRows.length > 0 && (
                <span className="bg-primary-glow text-primary px-2 py-0.5 rounded-full text-[10px]">
                  {selectedRows.length} selected
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border border-border bg-bg-card text-xs text-text-gray hover:bg-bg-card-hover font-semibold transition-colors flex items-center gap-1.5"
                onClick={() => {
                  const headers = 'Transaction ID,Service,Recipient,Amount,Status,Date,RefNo\n';
                  const rows = sortedTransactions
                    .map((t) => `${t._id || t.id},${t.service},${t.recipient},${t.amount},${t.status},${t.paidAt || t.createdAt || t.date},${t.refNo || t.reference}`)
                    .join('\n');
                  const blob = new Blob([headers + rows], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `VtuNova_Transactions_${Date.now()}.csv`;
                  a.click();
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-3.5 h-3.5 text-text-muted">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {paginatedTransactions.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-bg-dark-secondary border-b border-border text-text-muted font-semibold select-none">
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={
                          paginatedTransactions.length > 0 &&
                          selectedRows.length === paginatedTransactions.length
                        }
                        className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                    </th>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Recipient</th>
                    <th className="p-4 cursor-pointer hover:bg-bg-card-hover transition-colors" onClick={() => handleSort('amount')}>
                      <div className="flex items-center gap-1">
                        Amount
                        {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="p-4">Status</th>
                    <th className="p-4 cursor-pointer hover:bg-bg-card-hover transition-colors" onClick={() => handleSort('date')}>
                      <div className="flex items-center gap-1">
                        Date & Time
                        {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </div>
                    </th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-text-gray">
                  {paginatedTransactions.map((txn) => (
                    <tr
                      key={txn._id || txn.id}
                      onClick={() => handleRowClick(txn)}
                      className="hover:bg-bg-card-hover transition-colors cursor-pointer group"
                    >
                      <td className="p-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(txn._id || txn.id || '')}
                          onChange={(e) => handleSelectRow(e, txn._id || txn.id || '')}
                          className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-bold text-text-white">{formatId(txn._id || txn.id || '')}</td>
                      <td className="p-4 font-semibold text-text-gray">{txn.service}</td>
                      <td className="p-4 text-text-muted font-medium">{txn.recipient ?? 'N/A'}</td>
                      <td className="p-4 font-extrabold text-text-white font-['Space_Grotesk']">
                        {formatAmount(txn.amount, true) || `₦${txn.amount?.toLocaleString()}`}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            txn.status === 'success' || txn.status === 'delivered'
                              ? 'bg-accent-green-glow border-accent-green text-accent-green'
                              : txn.status === 'pending'
                              ? 'bg-accent-orange-glow border-accent-orange text-accent-orange'
                              : txn.status === 'failed'
                              ? 'bg-red-50 border-red-200 text-red-500'
                              : 'bg-bg-dark border-border text-text-muted'
                          }`}
                        >
                          {txn.status === 'delivered' ? 'Success' : txn.status}
                        </span>
                      </td>
                      <td className="p-4 text-text-muted font-medium">
                        <span className="text-[10px] opacity-75 ml-1">{formatDate(txn.paidAt || txn.createdAt || txn.date || '')} </span>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => triggerReceipt(txn, e)}
                          className="px-2.5 py-1.5 rounded-lg border border-border bg-bg-card hover:bg-bg-card-hover hover:border-border-hover text-[11px] font-bold text-primary transition-all shadow-sm"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Empty state layout */
              <div className="py-16 px-4 text-center max-w-sm mx-auto space-y-4">
                <div className="w-16 h-16 bg-primary-glow text-primary rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                    <circle cx="12" cy="12" r="10" /><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text-white">
                    {isLoading ? 'Loading transactions...' : 'No transactions found'}
                  </h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    {isLoading
                      ? 'Please wait while we fetch your latest transaction records.'
                      : 'Your transaction history will appear here after your first purchase or wallet funding.'}
                  </p>
                </div>
                {!isLoading && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-md transition-all"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Table Pagination footer */}
          {totalPages > 1 && (
            <div className="px-5 py-4 border-t border-border flex items-center justify-between text-xs text-text-muted select-none">
              <span>
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedTransactions.length)} of{' '}
                {sortedTransactions.length} payments
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-bg-card text-text-gray font-semibold hover:bg-bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold transition-all ${
                      currentPage === idx + 1
                        ? 'bg-primary text-white'
                        : 'bg-bg-card border border-border text-text-gray hover:bg-bg-card-hover'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-2.5 py-1.5 rounded-lg border border-border bg-bg-card text-text-gray font-semibold hover:bg-bg-card-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Spending Analytics & Quick Insights Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart card container */}
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-text-white font-['Space_Grotesk']">Spending Analytics</h3>
              <span className="text-[11px] text-text-muted font-medium">Year {new Date().getFullYear()}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Dynamic SVG Sparkline columns (Monthly Spending Chart) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">Monthly Spending Chart</span>
                  <span className="text-[10px] text-accent-green font-bold">₦{stats.totalSpent.toLocaleString()} Total</span>
                </div>
                <div className="h-32 border border-border bg-bg-dark-secondary rounded-xl p-3 flex items-end gap-2 justify-between">
                  {monthlySpendingList.slice(-6).map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                      <div className="w-full bg-primary-glow group-hover:bg-primary rounded-t-md transition-all duration-300 relative" style={{ height: `${item.val}%` }}>
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-text-white text-bg-dark text-[8px] font-bold px-1.5 py-0.5 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          ₦{item.amount.toLocaleString()} ({item.count} txns)
                        </span>
                      </div>
                      <span className="text-[9px] text-text-muted font-bold">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Service Breakdown Chart component */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">Service Breakdown Chart</span>
                  <span className="text-[10px] text-text-muted font-semibold">{transactionsList.length} total txns</span>
                </div>
                <div className="space-y-2.5">
                  {serviceBreakdown.map((serv, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-text-gray">{serv.label}</span>
                        <span className="text-text-muted font-bold">{serv.amt} ({serv.val})</span>
                      </div>
                      <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                        <div className={`h-full ${serv.bg} transition-all duration-500`} style={{ width: serv.val }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Quick Insights Widget Card */}
          <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-text-white font-['Space_Grotesk'] border-b border-border pb-3">Transaction Insights</h3>
            
            <div className="space-y-3">
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3 space-y-1">
                <span className="text-[10px] text-text-muted font-bold block">Most Purchased Service</span>
                <span className="text-xs font-bold block font-['Space_Grotesk'] text-text-white">
                  {topService?.label || 'Data Bundles'}
                </span>
                <span className="text-[10px] text-text-muted block">
                  {topService?.val ? `${topService.val} of total spend (${topService.amt})` : 'Based on transaction volume'}
                </span>
              </div>

              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3 space-y-1">
                <span className="text-[10px] text-text-muted font-bold block">Highest Transaction</span>
                <span className="text-xs font-bold block font-['Space_Grotesk'] text-text-white">
                  {highestTxn ? `${formatAmount(highestTxn.amount, true)} (${highestTxn.service})` : '₦0.00'}
                </span>
                <span className="text-[10px] text-text-muted block">
                  {highestTxn?.paidAt || highestTxn?.createdAt || highestTxn?.date
                    ? formatRelativeTime(highestTxn.paidAt || highestTxn.createdAt || highestTxn.date)
                    : 'No recorded payments yet'}
                </span>
              </div>

              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3 space-y-1">
                <span className="text-[10px] text-text-muted font-bold block">Average Spending</span>
                <span className="text-xs font-bold block font-['Space_Grotesk'] text-text-white">
                  {formatAmount(avgSpending, true) || `₦${avgSpending.toLocaleString()}`}
                </span>
                <span className="text-[10px] text-text-muted block">Per completed transaction</span>
              </div>

              <div className="bg-bg-dark-secondary border border-border rounded-xl p-3 space-y-1">
                <span className="text-[10px] text-text-muted font-bold block">Transaction Health</span>
                <span className="text-xs font-bold block font-['Space_Grotesk'] text-accent-green">
                  {stats.successRate}% Success Rate
                </span>
                <span className="text-[10px] text-text-muted block">
                  {stats.totalSuccessful} out of {stats.totalCount} successful
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── Recent Activity Timeline layout ── */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-text-white font-['Space_Grotesk'] border-b border-border pb-3">Recent Activity Timeline</h3>
          
          {recentActivities.length > 0 ? (
            <div className="relative border-l-2 border-border pl-6 space-y-6 ml-2 text-xs py-1">
              {recentActivities.map((tx, idx) => {
                const isSuccess = tx.status?.toLowerCase() === 'success' || tx.status?.toLowerCase() === 'delivered';
                const isPending = tx.status?.toLowerCase() === 'pending';
                const rawDate = tx.paidAt || tx.createdAt || tx.date;
                const formattedDate = rawDate ? formatRelativeTime(rawDate) : 'Recently';

                return (
                  <div key={tx._id || tx.id || idx} className="relative group cursor-pointer" onClick={() => handleRowClick(tx)}>
                    <span
                      className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSuccess
                          ? 'bg-accent-green-glow border-accent-green'
                          : isPending
                          ? 'bg-accent-orange-glow border-accent-orange'
                          : 'bg-red-500/20 border-red-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSuccess
                            ? 'bg-accent-green'
                            : isPending
                            ? 'bg-accent-orange'
                            : 'bg-red-500'
                        }`}
                      />
                    </span>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-text-white group-hover:text-primary transition-colors">
                          {tx.service} {isSuccess ? 'Successful' : isPending ? 'Processing' : (tx.status || 'Failed')}
                        </span>
                        <span className="text-[10px] font-bold text-text-white font-['Space_Grotesk']">
                          {formatAmount(tx.amount, true) || `₦${tx.amount?.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="text-[10px] text-text-muted">{formattedDate} • Ref: {tx.refNo || tx.reference || formatId(tx._id || tx.id || '')}</div>
                      <p className="text-text-muted mt-1">
                        {tx.description || `${formatAmount(tx.amount, true) || `₦${tx.amount}`} ${tx.service} ${tx.recipient ? `sent to ${tx.recipient}` : ''}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-text-muted py-4">No recent activity found. Transactions will appear here as they occur.</p>
          )}
        </div>

      </main>

      {/* ── Transaction Details Drawer Slide-out ── */}
      {showDrawer && activeTransaction && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-bg-dark-secondary/60 backdrop-blur-sm transition-opacity"
              onClick={() => setShowDrawer(false)}
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-300 ease-in-out bg-bg-card shadow-xl flex flex-col h-full border-l border-border">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-bg-dark-secondary">
                  <h3 className="text-sm font-bold text-text-white font-['Space_Grotesk']">Transaction Details</h3>
                  <button
                    onClick={() => setShowDrawer(false)}
                    className="p-1 rounded-lg text-text-muted hover:text-text-white hover:bg-bg-card-hover transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Details Scroll Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                  {/* Status Box */}
                  <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase tracking-wider block">Status</span>
                      <span className="text-sm font-bold text-text-white block mt-0.5">{activeTransaction.status}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        activeTransaction.status === 'Success' || activeTransaction.status === 'delivered'
                          ? 'bg-accent-green-glow border-accent-green text-accent-green'
                          : activeTransaction.status === 'Pending'
                          ? 'bg-accent-orange-glow border-accent-orange text-accent-orange'
                          : activeTransaction.status === 'Failed'
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-bg-dark border-border text-text-muted'
                      }`}
                    >
                      {activeTransaction.status === 'delivered' ? 'Success' : activeTransaction.status}
                    </span>
                  </div>

                  {/* Transaction Information */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border pb-1">Transaction Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Transaction ID</span>
                        <span className="font-mono font-bold text-text-white">{formatId(activeTransaction._id ?? activeTransaction.id ?? '')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Reference Number</span>
                        <span className="font-mono text-text-gray">{activeTransaction.refNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Date & Time</span>
                        <span className="font-semibold text-text-white">{new Date(activeTransaction.paidAt ?? activeTransaction.date ?? new Date().toISOString()).toLocaleDateString("en-NG", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})} • {new Date(activeTransaction.paidAt ?? activeTransaction.date ?? new Date().toISOString()).toLocaleTimeString("en-NG", {
  hour: "2-digit",
  minute: "2-digit",
})}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Information */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border pb-1">Service Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Service Type</span>
                        <span className="font-bold text-primary">{activeTransaction.service}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Recipient Details</span>
                        <span className="font-semibold text-text-white">{activeTransaction.recipient}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="text-text-muted">Amount</span>
                        <span className="font-extrabold text-text-white font-['Space_Grotesk']">₦{activeTransaction.amount.toLocaleString()}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Service Fee</span>
                        <span className="font-medium text-text-gray">₦{activeTransaction.fee}.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border pb-1">Payment Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Payment Method</span>
                        <span className="font-medium text-text-gray">{activeTransaction.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Wallet Balance Before</span>
                        <span className="font-medium text-text-gray">₦{activeTransaction.balanceBefore}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Wallet Balance After</span>
                        <span className="font-bold text-text-white">₦{activeTransaction.balanceAfter}.00</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer buttons */}
                <div className="p-4 border-t border-border bg-bg-dark-secondary flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => triggerReceipt(activeTransaction, e)}
                    className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold shadow-sm transition-colors text-center"
                  >
                    Download Receipt
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('Support ticket raised. Our team will contact you shortly.')}
                    className="flex-1 py-2 rounded-xl border border-border bg-bg-card hover:bg-bg-card-hover text-text-gray font-semibold transition-colors text-center"
                  >
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Download Receipt Modal ── */}
      {showReceipt && (receiptTransaction || activeTransaction) && (() => {
        const txn = receiptTransaction || activeTransaction!;
        const rawDate = txn.paidAt || txn.createdAt || txn.date;
        const formattedDateStr = rawDate
          ? `${new Date(rawDate).toLocaleDateString("en-NG", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })} • ${new Date(rawDate).toLocaleTimeString("en-NG", {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : 'N/A';

        const isSuccess =
          txn.status?.toLowerCase() === 'success' ||
          txn.status?.toLowerCase() === 'delivered';
        const isPending = txn.status?.toLowerCase() === 'pending';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-bg-dark-secondary/70 backdrop-blur-sm"
              onClick={() => setShowReceipt(false)}
            />

            <div className="bg-bg-card border border-border rounded-2xl max-w-md w-full shadow-2xl relative overflow-hidden z-10 animate-[fadeIn_.2s_ease]">
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2 border-b border-border">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  Transaction Receipt
                </span>
                <button
                  type="button"
                  onClick={() => setShowReceipt(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-white hover:bg-bg-card-hover transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs text-text-gray max-h-[80vh] overflow-y-auto print:p-0">
                {/* Receipt Branding & Header */}
                <div className="text-center space-y-1.5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-glow text-primary mb-1">
                    {isSuccess ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-accent-green">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-text-white font-['Space_Grotesk'] tracking-tight">
                    VtuNova
                  </h3>
                  <span className="text-[11px] text-text-muted block font-medium">
                    {txn.service} Transaction Receipt
                  </span>
                  {isReceiptLoading && (
                    <span className="inline-block text-[10px] text-primary animate-pulse font-semibold">
                      Fetching latest receipt details from server...
                    </span>
                  )}
                </div>

                {/* Amount Highlight */}
                <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 text-center space-y-0.5">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                    Total Amount
                  </span>
                  <div className="text-2xl font-black text-text-white font-['Space_Grotesk']">
                    {formatAmount(txn.amount, true) || `₦${txn.amount?.toLocaleString()}`}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-bold border ${
                      isSuccess
                        ? 'bg-accent-green-glow border-accent-green text-accent-green'
                        : isPending
                        ? 'bg-accent-orange-glow border-accent-orange text-accent-orange'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {isSuccess ? 'Payment Successful' : isPending ? 'Pending' : (txn.status || 'Failed')}
                  </span>
                </div>

                {/* Receipt Details Breakdown */}
                <div className="border-y border-dashed border-border py-4 space-y-2.5">
                  <div className="flex justify-between gap-4">
                    <span className="text-text-muted">Transaction ID</span>
                    <span className="font-mono font-bold text-text-white text-right">
                      {formatId(txn._id || txn.id || '')}
                    </span>
                  </div>

                  {(txn.refNo || txn.reference) && (
                    <div className="flex justify-between gap-4">
                      <span className="text-text-muted">Reference</span>
                      <span className="font-mono text-text-gray text-right">
                        {txn.refNo || txn.reference}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <span className="text-text-muted">Service</span>
                    <span className="font-bold text-text-white text-right">
                      {txn.service}
                    </span>
                  </div>

                  {txn.recipient && (
                    <div className="flex justify-between gap-4">
                      <span className="text-text-muted">Recipient</span>
                      <span className="font-medium text-text-white text-right">
                        {txn.recipient}
                      </span>
                    </div>
                  )}

                  {'token' in txn && txn.token && (
                    <div className="flex justify-between gap-4 bg-primary/10 p-2 rounded-lg border border-primary/20">
                      <span className="text-primary font-bold">Electricity Token</span>
                      <span className="font-mono font-bold text-primary text-right tracking-wider">
                        {txn.token}
                      </span>
                    </div>
                  )}

                  {'unitsPurchased' in txn && txn.unitsPurchased && (
                    <div className="flex justify-between gap-4">
                      <span className="text-text-muted">Units Purchased</span>
                      <span className="font-semibold text-text-white text-right">
                        {txn.unitsPurchased} kWh
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between gap-4">
                    <span className="text-text-muted">Date & Time</span>
                    <span className="font-semibold text-text-white text-right">
                      {formattedDateStr}
                    </span>
                  </div>

                  {(txn.paymentMethod || txn.method) && (
                    <div className="flex justify-between gap-4">
                      <span className="text-text-muted">Payment Method</span>
                      <span className="font-medium text-text-white text-right">
                        {txn.paymentMethod || txn.method}
                      </span>
                    </div>
                  )}

                  {txn.fee !== undefined && (
                    <div className="flex justify-between gap-4">
                      <span className="text-text-muted">Service Fee</span>
                      <span className="font-medium text-text-gray text-right">
                        {txn.fee ? `₦${txn.fee.toLocaleString()}` : 'Free'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Notes & Actions */}
                <p className="text-[10px] text-text-muted text-center leading-relaxed">
                  Thank you for using VtuNova. For support inquiries, reach out at{' '}
                  <span className="text-primary font-medium">help@vtunova.com</span>
                </p>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4 h-4">
                      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                      <path d="M6 14h12v8H6z" />
                    </svg>
                    Print / Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReceipt(false)}
                    className="px-4 py-2.5 rounded-xl border border-border bg-bg-dark-secondary hover:bg-bg-card-hover text-text-gray font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};

export default Transactions;
