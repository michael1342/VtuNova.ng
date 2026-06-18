import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';



// ─── Mock Data ────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  refNo: string;
  service: string;
  recipient: string;
  amount: number;
  fee: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed';
  date: string;
  time: string;
  paymentMethod: string;
  balanceBefore: number;
  balanceAfter: number;
}

// Initial Data representing realistic logs
const initialTransactions: Transaction[] = [
  {
    id: 'SWT-2026-00124',
    refNo: 'TXN9283749201',
    service: 'Airtime',
    recipient: '08012345678',
    amount: 1000,
    fee: 0,
    status: 'Success',
    date: '12 Jun 2026',
    time: '10:24 AM',
    paymentMethod: 'Wallet Balance',
    balanceBefore: 151000,
    balanceAfter: 150000,
  },
  {
    id: 'SWT-2026-00125',
    refNo: 'TXN8374829103',
    service: 'Electricity',
    recipient: 'Meter 123456789',
    amount: 5000,
    fee: 100,
    status: 'Pending',
    date: '12 Jun 2026',
    time: '09:15 AM',
    paymentMethod: 'Wallet Balance',
    balanceBefore: 156100,
    balanceAfter: 151000,
  },
  {
    id: 'SWT-2026-00126',
    refNo: 'TXN3748291034',
    service: 'Cable TV',
    recipient: 'DSTV 1234567890',
    amount: 7500,
    fee: 0,
    status: 'Success',
    date: '11 Jun 2026',
    time: '01:20 PM',
    paymentMethod: 'Wallet Balance',
    balanceBefore: 163600,
    balanceAfter: 156100,
  },
  {
    id: 'SWT-2026-00127',
    refNo: 'TXN2837482910',
    service: 'Wallet Funding',
    recipient: 'Wallet Balance',
    amount: 15000,
    fee: 0,
    status: 'Success',
    date: '11 Jun 2026',
    time: '10:42 AM',
    paymentMethod: 'Bank Transfer (Sterling)',
    balanceBefore: 148600,
    balanceAfter: 163600,
  },
  {
    id: 'SWT-2026-00128',
    refNo: 'TXN1928374810',
    service: 'Data',
    recipient: '09011951195',
    amount: 2000,
    fee: 0,
    status: 'Success',
    date: '10 Jun 2026',
    time: '06:12 PM',
    paymentMethod: 'Wallet Balance',
    balanceBefore: 150600,
    balanceAfter: 148600,
  },
  {
    id: 'SWT-2026-00129',
    refNo: 'TXN0928374819',
    service: 'Airtime',
    recipient: '08108642864',
    amount: 500,
    fee: 0,
    status: 'Failed',
    date: '09 Jun 2026',
    time: '08:30 AM',
    paymentMethod: 'Wallet Balance',
    balanceBefore: 150600,
    balanceAfter: 150600,
  },
  {
    id: 'SWT-2026-00130',
    refNo: 'TXN9182736450',
    service: 'Wallet Funding',
    recipient: 'Wallet Balance',
    amount: 5000,
    fee: 0,
    status: 'Success',
    date: '08 Jun 2026',
    time: '04:15 PM',
    paymentMethod: 'Card (Mastercard)',
    balanceBefore: 145600,
    balanceAfter: 150600,
  },
  {
    id: 'SWT-2026-00131',
    refNo: 'TXN8172635449',
    service: 'Electricity',
    recipient: 'Meter 109876543',
    amount: 10000,
    fee: 100,
    status: 'Reversed',
    date: '07 Jun 2026',
    time: '11:05 AM',
    paymentMethod: 'Wallet Balance',
    balanceBefore: 145600,
    balanceAfter: 145600,
  },
];

const Transactions = () => {
  // Filters State
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [dateRange, setDateRange] = useState<string>('Last 30 Days');
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
  const [receiptTransaction, setReceiptTransaction] = useState<Transaction | null>(null);

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
    return initialTransactions.filter((txn) => {
      // Search Match
      const matchesSearch =
        txn.id.toLowerCase().includes(search.toLowerCase()) ||
        txn.recipient.toLowerCase().includes(search.toLowerCase()) ||
        txn.refNo.toLowerCase().includes(search.toLowerCase());

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
  }, [search, selectedTypes, selectedStatus, minAmount, maxAmount]);

  // Sorting calculation
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      // Date sort (simple lexicographical for demo logs)
      return sortOrder === 'asc'
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
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
      setSelectedRows(paginatedTransactions.map((t) => t.id));
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

  const triggerReceipt = (txn: Transaction, e: React.MouseEvent) => {
    e.stopPropagation();
    setReceiptTransaction(txn);
    setShowReceipt(true);
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
              <span className="text-2xl font-bold text-text-white font-['Space_Grotesk']">1,284</span>
              <div className="flex items-center gap-1 text-[10px] text-accent-green font-semibold mt-1">
                <span>+12.4%</span>
                <span className="text-text-muted font-normal">this month</span>
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
              <span className="text-2xl font-bold text-text-white font-['Space_Grotesk']">₦485,000</span>
              <div className="flex items-center gap-1 text-[10px] text-accent-green font-semibold mt-1">
                <span>+8.2%</span>
                <span className="text-text-muted font-normal">vs last month</span>
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
              <span className="text-2xl font-bold text-text-white font-['Space_Grotesk']">1,230</span>
              <div className="flex items-center gap-1 text-[10px] text-accent-green font-semibold mt-1">
                <span>98.6%</span>
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
              <span className="text-2xl font-bold text-text-white font-['Space_Grotesk']">₦620,000</span>
              <div className="flex items-center gap-1 text-[10px] text-accent-green font-semibold mt-1">
                <span>+15.7%</span>
                <span className="text-text-muted font-normal">this month</span>
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
                    .map((t) => `${t.id},${t.service},${t.recipient},${t.amount},${t.status},${t.date},${t.refNo}`)
                    .join('\n');
                  const blob = new Blob([headers + rows], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `SwiftTopup_Transactions_${Date.now()}.csv`;
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
                      key={txn.id}
                      onClick={() => handleRowClick(txn)}
                      className="hover:bg-bg-card-hover transition-colors cursor-pointer group"
                    >
                      <td className="p-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(txn.id)}
                          onChange={(e) => handleSelectRow(e, txn.id)}
                          className="rounded border-border text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="p-4 font-bold text-text-white">{txn.id}</td>
                      <td className="p-4 font-semibold text-text-gray">{txn.service}</td>
                      <td className="p-4 text-text-muted font-medium">{txn.recipient}</td>
                      <td className="p-4 font-extrabold text-text-white font-['Space_Grotesk']">
                        ₦{txn.amount.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            txn.status === 'Success'
                              ? 'bg-accent-green-glow border-accent-green text-accent-green'
                              : txn.status === 'Pending'
                              ? 'bg-accent-orange-glow border-accent-orange text-accent-orange'
                              : txn.status === 'Failed'
                              ? 'bg-red-50 border-red-200 text-red-500'
                              : 'bg-bg-dark border-border text-text-muted'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </td>
                      <td className="p-4 text-text-muted font-medium">
                        {txn.date} <span className="text-[10px] opacity-75 ml-1">{txn.time}</span>
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
                  <h4 className="text-sm font-bold text-text-white">No transactions found</h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">
                    Your transaction history will appear here after your first purchase or wallet funding.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="py-2.5 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-md transition-all"
                >
                  Start Using SwiftTopup
                </button>
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
            <h3 className="text-sm font-bold text-text-white font-['Space_Grotesk'] border-b border-border pb-3">Spending Analytics</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* SVG Sparkline columns (Monthly Spending Chart) */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">Monthly Spending Chart</span>
                <div className="h-32 border border-border bg-bg-dark-secondary rounded-xl p-3 flex items-end gap-3 justify-between">
                  {[
                    { month: 'Jan', val: 40 },
                    { month: 'Feb', val: 55 },
                    { month: 'Mar', val: 75 },
                    { month: 'Apr', val: 48 },
                    { month: 'May', val: 90 },
                    { month: 'Jun', val: 100 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                      <div className="w-full bg-primary-glow group-hover:bg-primary rounded-t-md transition-colors relative" style={{ height: `${item.val}%` }}>
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-text-white text-bg-dark text-[8px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          ₦{item.val * 500}
                        </span>
                      </div>
                      <span className="text-[9px] text-text-muted font-bold">{item.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Breakdown Chart component */}
              <div className="space-y-3">
                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">Service Breakdown Chart</span>
                <div className="space-y-2.5">
                  {[
                    { label: 'Airtime', val: '25%', bg: 'bg-accent-orange', amt: '₦120k' },
                    { label: 'Data', val: '35%', bg: 'bg-primary', amt: '₦170k' },
                    { label: 'Electricity', val: '30%', bg: 'bg-accent-green', amt: '₦145k' },
                    { label: 'Cable TV', val: '10%', bg: 'bg-accent-purple', amt: '₦50k' },
                  ].map((serv, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-semibold text-text-gray">{serv.label}</span>
                        <span className="text-text-muted font-bold">{serv.amt} ({serv.val})</span>
                      </div>
                      <div className="w-full h-2 bg-bg-dark rounded-full overflow-hidden">
                        <div className={`h-full ${serv.bg}`} style={{ width: serv.val }} />
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
              {[
                { title: 'Most Purchased Service', value: 'Data Bundles', label: '35% of total budget' },
                { title: 'Highest Transaction', value: '₦20,000 (Electricity)', label: 'Yesterday • Abuja Electric' },
                { title: 'Average Daily Spending', value: '₦8,500 / day', label: 'Updated today' },
                { title: 'Monthly Spending Trend', value: '+12.4% Increase', isGreen: true, label: 'Upward trajectory' },
              ].map((ins, idx) => (
                <div key={idx} className="bg-bg-dark-secondary border border-border rounded-xl p-3 space-y-1">
                  <span className="text-[10px] text-text-muted font-bold block">{ins.title}</span>
                  <span className={`text-xs font-bold block font-['Space_Grotesk'] ${ins.isGreen ? 'text-accent-green' : 'text-text-white'}`}>
                    {ins.value}
                  </span>
                  <span className="text-[10px] text-text-muted block">{ins.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Recent Activity Timeline layout ── */}
        <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-text-white font-['Space_Grotesk'] border-b border-border pb-3">Recent Activity Timeline</h3>
          
          <div className="relative border-l-2 border-border pl-6 space-y-6 ml-2 text-xs py-1">
            {/* item 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-accent-green-glow border-2 border-accent-green flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              </span>
              <div className="space-y-0.5">
                <span className="font-bold text-text-white">Airtime Purchase Successful</span>
                <div className="text-[10px] text-text-muted">Today • 10:24 AM</div>
                <p className="text-text-muted mt-1">₦1,000 airtime sent to MTN line 08012345678</p>
              </div>
            </div>

            {/* item 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-accent-green-glow border-2 border-accent-green flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              </span>
              <div className="space-y-0.5">
                <span className="font-bold text-text-white">Electricity Payment Successful</span>
                <div className="text-[10px] text-text-muted">Yesterday • 05:45 PM</div>
                <p className="text-text-muted mt-1">Token generated successfully for Meter number 123456789</p>
              </div>
            </div>

            {/* item 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary-glow border-2 border-primary flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              </span>
              <div className="space-y-0.5">
                <span className="font-bold text-text-white">DSTV Subscription Renewed</span>
                <div className="text-[10px] text-text-muted">Yesterday • 01:20 PM</div>
                <p className="text-text-muted mt-1">Compact Package activated on Smart Card 1234567890</p>
              </div>
            </div>
          </div>
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
                        activeTransaction.status === 'Success'
                          ? 'bg-accent-green-glow border-accent-green text-accent-green'
                          : activeTransaction.status === 'Pending'
                          ? 'bg-accent-orange-glow border-accent-orange text-accent-orange'
                          : activeTransaction.status === 'Failed'
                          ? 'bg-red-50 border-red-200 text-red-500'
                          : 'bg-bg-dark border-border text-text-muted'
                      }`}
                    >
                      {activeTransaction.status}
                    </span>
                  </div>

                  {/* Transaction Information */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border pb-1">Transaction Information</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Transaction ID</span>
                        <span className="font-mono font-bold text-text-white">{activeTransaction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Reference Number</span>
                        <span className="font-mono text-text-gray">{activeTransaction.refNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Date & Time</span>
                        <span className="font-semibold text-text-white">{activeTransaction.date} • {activeTransaction.time}</span>
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
                        <span className="font-medium text-text-gray">₦{activeTransaction.fee.toLocaleString()}.00</span>
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
                        <span className="font-medium text-text-gray">₦{activeTransaction.balanceBefore.toLocaleString()}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Wallet Balance After</span>
                        <span className="font-bold text-text-white">₦{activeTransaction.balanceAfter.toLocaleString()}.00</span>
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
      {showReceipt && receiptTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-bg-dark-secondary/60 backdrop-blur-sm" onClick={() => setShowReceipt(false)} />
          
          <div className="bg-bg-card border border-border rounded-2xl max-w-sm w-full shadow-2xl relative overflow-hidden animate-[fadeIn_.2s_ease]">
            {/* Modal content area */}
            <div className="p-6 space-y-6 text-xs text-text-gray">
              
              {/* Receipt Branding */}
              <div className="text-center space-y-1">
                <span className="text-lg font-extrabold text-primary font-['Space_Grotesk'] tracking-tight">SwiftTopup</span>
                <span className="text-[10px] text-text-muted block uppercase tracking-wider font-semibold">Transaction Receipt</span>
              </div>

              {/* Receipt details */}
              <div className="border-y border-dashed border-border py-4 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-text-muted">Transaction ID</span>
                  <span className="font-mono font-bold text-text-white">{receiptTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Reference Number</span>
                  <span className="font-mono text-text-gray">{receiptTransaction.refNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Service</span>
                  <span className="font-bold text-text-white">{receiptTransaction.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Recipient</span>
                  <span className="font-medium text-text-white">{receiptTransaction.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Date & Time</span>
                  <span className="font-semibold text-text-white">{receiptTransaction.date} • {receiptTransaction.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <span className="font-bold text-accent-green">{receiptTransaction.status}</span>
                </div>
              </div>

              {/* Total amount bar */}
              <div className="bg-bg-dark-secondary border border-border rounded-xl p-4 flex justify-between items-center">
                <span className="text-text-muted font-bold uppercase tracking-wider text-[10px]">Total Paid</span>
                <span className="text-lg font-extrabold text-text-white font-['Space_Grotesk']">
                  ₦{(receiptTransaction.amount + receiptTransaction.fee).toLocaleString()}.00
                </span>
              </div>

              <p className="text-[10px] text-text-muted text-center leading-relaxed">
                Thank you for using SwiftTopup. For support inquiries, contact help@swifttopup.com
              </p>
            </div>

            {/* Modal Footer actions */}
            <div className="px-5 py-4 border-t border-border bg-bg-dark-secondary flex gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('Receipt downloaded successfully!');
                  setShowReceipt(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-xs shadow-sm transition-colors text-center"
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={() => setShowReceipt(false)}
                className="px-4 py-2.5 rounded-xl border border-border bg-bg-card hover:bg-bg-card-hover text-text-gray font-semibold text-xs transition-colors text-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Transactions;
