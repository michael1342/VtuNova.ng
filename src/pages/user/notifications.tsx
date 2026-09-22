import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getTransactions } from '../../api/transaction';
import type { ToastMessage } from '../../interface/user-page.interface';
import type { BackendNotification } from '../../interface/notification.interface';
import type { ApiTransaction as Transaction } from '../../interface/api.interface';

import {
  BellIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  PhoneIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  Cog6ToothIcon,
  ArrowUpRightIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { formatAmount, formatDate, formatId } from '../../utils/formatter';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Notifications() {
  const {
    notifications,
    refetch,
    isEmptyState,
    isLoading,
    markAsRead: contextMarkAsRead,
    markAsUnread: contextMarkAsUnread,
    deleteNotification: contextDeleteNotification,
    markAllAsRead: contextMarkAllAsRead,
    clearNotifications: contextClearNotifications,
  } = useNotifications();

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    getTransactions()
      .then((result) => setTransactions(result.transactions ?? []))
      .catch((error) => console.error('Failed to fetch transactions', error));
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const txMap = useMemo(() => {
    const map = new Map<string, Transaction>();
    transactions.forEach((tx) => map.set(tx._id, tx));
    return map;
  }, [transactions]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'transactions' | 'wallet' | 'security' | 'promotions' | 'system'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'read' | 'unread'>('All');

  // Detail Drawer
  const [selectedNotification, setSelectedNotification] = useState<BackendNotification | null>(null);
  console.log('selectedNotification:', selectedNotification);

  // Custom Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Setting Toggles State
  const [preferences, setPreferences] = useState({
    transactionAlerts: true,
    walletUpdates: true,
    securityAlerts: true,
    promoMessages: false,
    emailAlerts: true,
    pushAlerts: true,
  });

  // --- Helpers ---
  const showToast = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    const newId = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id: newId, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newId));
    }, 2800);
  };

  const markAsRead = (id: string) => {
    contextMarkAsRead(id);
    if (selectedNotification && selectedNotification._id === id) {
      setSelectedNotification(prev => prev ? { ...prev, isRead: true } : null);
    }
    showToast('Notification marked as read', 'success');
  };

  const markAsUnread = (id: string) => {
    contextMarkAsUnread(id);
    // if (selectedNotification && selectedNotification._id === id) {
    //   setSelectedNotification(prev => prev ? { ...prev, isRead: false } : null);
    // }
    showToast('Notification marked as unread', 'info');
  };

  const deleteNotification = async (id: string) => {
    await contextDeleteNotification(id);
    if (selectedNotification?._id === id) {
      setSelectedNotification(null);
    }
    showToast('Notification deleted successfully', 'danger');
  };

  const markAllAsRead = async () => {
    await contextMarkAllAsRead();
    showToast('All notifications marked as read', 'success');
  };
useEffect(() => {
  const markAllAsRead = async () => {
   await contextMarkAllAsRead();
  // showToast('All notifications marked as read', 'success');
  }
  markAllAsRead();
}, [])

  const clearNotifications = () => {
    contextClearNotifications();
    setSelectedNotification(null);
    showToast('All notifications cleared', 'info');
  };

  const handlePreferenceToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast('Notification preferences updated!', 'success');
      return updated;
    });
  };

  // --- Overview Card Calculations ---
  const unreadCount = useMemo(() => {
    if (isEmptyState) return 0;
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications, isEmptyState]);

  const todayCount = useMemo(() => {
    if (isEmptyState) return 0;
    const today = new Date().toISOString().split('T')[0];
    return notifications.filter((n) => n.date?.startsWith(today)).length;
  }, [notifications, isEmptyState]);

  const transactionAlertCount = useMemo(() => {
    if (isEmptyState) return 0;
    return notifications.filter((n) => n.type === 'transactions').length;
  }, [notifications, isEmptyState]);

  const systemUpdateCount = useMemo(() => {
    if (isEmptyState) return 0;
    return notifications.filter((n) => {
      const cat = n.type;
      return cat === 'system' || cat === 'security';
    }).length;
  }, [notifications, isEmptyState]);

  // --- Filtering Notifications ---
  const filteredFeed = useMemo(() => {
    if (isEmptyState) return [];
    return notifications.filter((n) => {
      const tx = n.transactionId ? txMap.get(n.transactionId) : undefined;
      const title = n.title?.toLowerCase() ?? '';
      const message = n.message?.toLowerCase() ?? '';
      const txId = n.transactionId ?? '';
      const service = tx?.service ?? '';

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        title.includes(q) ||
        message.includes(q) ||
        txId.toLowerCase().includes(q) ||
        service.toLowerCase().includes(q);

      const cat = n.category;
      const matchesCategory = categoryFilter === 'All' || cat === categoryFilter;

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'read' && n.isRead) ||
        (statusFilter === 'unread' && !n.isRead);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [notifications, searchQuery, categoryFilter, statusFilter, isEmptyState, txMap]);

  // Grouped Filtered List
  const groupedNotifications = useMemo(() => {
    const todayDate = new Date();
const today = todayDate.toISOString().split('T')[0];

const yesterdayDate = new Date(todayDate);
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterday = yesterdayDate.toISOString().split('T')[0];

    return {
      today: filteredFeed.filter((n) => n.date?.startsWith(today)),
      yesterday: filteredFeed.filter((n) => n.date?.startsWith(yesterday)),
      older: filteredFeed.filter((n) => !n.date?.startsWith(today) && !n.date?.startsWith(yesterday)),
     
    };
   
  }, [filteredFeed]);

  // Helper render icons based on category
  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'transactions':
        return <PhoneIcon className="w-5 h-5 text-blue-500" />;
      case 'wallet':
        return <CreditCardIcon className="w-5 h-5 text-emerald-500" />;
      case 'security':
        return <ShieldCheckIcon className="w-5 h-5 text-amber-500" />;
      case 'promotions':
        return <BellIcon className="w-5 h-5 text-purple-500" />;
      case 'system':
        return <Cog6ToothIcon className="w-5 h-5 text-cyan-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-text-muted" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-bg-dark-secondary text-text-gray font-sans transition-colors duration-200">

      <div className="p-6 space-y-6 max-w-7xl mx-auto w-full relative">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-white font-['Space_Grotesk'] leading-tight">
              Notifications
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Stay updated with transactions, wallet activity, account alerts, and important updates.
            </p>
          </div>
          {/* Header badges */}
          <div className="grid grid-cols-2 sm:flex items-center gap-x-4 gap-y-2 text-xs font-semibold text-blue-500 bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-blue-400" />
              <span>Real-Time Updates</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-blue-400" />
              <span>Smart Alerts</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-blue-400" />
              <span>Secure Logs</span>
            </div>
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <CheckCircleIcon className="w-4 h-4 shrink-0 text-blue-400" />
              <span>Instant Tracking</span>
            </div>
          </div>
        </div>

        {/* ── Overview Analytic Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Card 1: Unread */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-border-hover transition-all">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <BellIcon className="w-5 h-5" />
              </div>
              {unreadCount > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping absolute top-4 right-4" />
              )}
            </div>
            <div className="mt-4">
              <div className="text-xs text-text-muted">Unread Alerts</div>
              <div className="text-3xl font-extrabold text-text-white font-['Space_Grotesk'] mt-0.5">
                {isLoading ? <span className="text-sm text-text-muted">...</span> : unreadCount}
              </div>
            </div>
          </div>

          {/* Card 2: Today */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-border-hover transition-all">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <ClockIcon className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-xs text-text-muted">Today's Alerts</div>
              <div className="text-3xl font-extrabold text-text-white font-['Space_Grotesk'] mt-0.5">
                {isLoading ? <span className="text-sm text-text-muted">...</span> : todayCount}
              </div>
            </div>
          </div>

          {/* Card 3: Transaction Alerts */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-border-hover transition-all">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <CreditCardIcon className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-xs text-text-muted">Transactions</div>
              <div className="text-3xl font-extrabold text-text-white font-['Space_Grotesk'] mt-0.5">
                {isLoading ? <span className="text-sm text-text-muted">...</span> : transactionAlertCount}
              </div>
            </div>
          </div>

          {/* Card 4: Account Security/System Updates */}
          <div className="bg-bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm hover:border-border-hover transition-all">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <div className="text-xs text-text-muted">Account Updates</div>
              <div className="text-3xl font-extrabold text-text-white font-['Space_Grotesk'] mt-0.5">
                {isLoading ? <span className="text-sm text-text-muted">...</span> : systemUpdateCount}
              </div>
            </div>
          </div>

        </div>

        {/* ── Toolbar Controls ── */}
        <div className="bg-bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Search & Filters */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-1.5">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                <MagnifyingGlassIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search txId, service or content..."
                className="w-full bg-bg-dark-secondary border border-border text-xs text-text-white placeholder-text-muted rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">All Categories</option>
              <option value="transactions">Transactions Only</option>
              <option value="wallet">Wallet Credited</option>
              <option value="security">Security Alerts</option>
              <option value="promotions">Promotions</option>
              <option value="system">System Logs</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-bg-dark-secondary border border-border text-xs text-text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500/50"
            >
              <option value="All">Read &amp; Unread</option>
              <option value="read">Read Only</option>
              <option value="unread">Unread Only</option>
            </select>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={markAllAsRead}
              // disabled={unreadCount === 0}
              className="bg-bg-dark-secondary hover:bg-bg-card-hover border border-border text-text-white font-bold rounded-xl px-3.5 py-2.5 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <CheckIcon className="w-4 h-4" />
              <span>Mark All Read</span>
            </button>

            <button
              onClick={clearNotifications}
              disabled={isEmptyState || notifications.length === 0}
              className="bg-bg-dark-secondary hover:bg-red-500/10 border border-border hover:border-red-500/30 text-text-white hover:text-red-400 font-bold rounded-xl px-3.5 py-2.5 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <TrashIcon className="w-4 h-4" />
              <span>Clear Feed</span>
            </button>
          </div>
        </div>

        {/* ── Main Notifications & Sidebar Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* 1. Feed list container */}
          <div className="lg:col-span-2 space-y-6">

            {/* Loading State */}
            {isLoading ? (
              <div className="bg-bg-card border border-border rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-sm min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 animate-pulse">
                  <BellIcon className="w-8 h-8" />
                </div>
                <p className="text-xs text-text-muted">Loading notifications…</p>
              </div>
            ) : isEmptyState || notifications.length === 0 ? (
              <div className="bg-bg-card border border-border rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-sm min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <BellIcon className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">
                    You're all caught up!
                  </h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    New transactions, account security alerts, and promotional announcements will appear here in real-time.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/user/dashboard"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs rounded-xl px-4 py-2.5 transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                  
                </div>
              </div>
            ) : (
              // Grouped Render
              (['today', 'yesterday', 'older'] as const).map((group) => {
                const groupItems = groupedNotifications[group];
                if (groupItems.length === 0) return null;
                return (
                  <div key={group} className="space-y-3">
                    <h3 className="text-xs font-bold text-text-white font-['Space_Grotesk'] uppercase tracking-wider pl-1.5">
                      {group === 'today' ? 'Today' : group === 'yesterday' ? 'Yesterday' : 'Older'}
                    </h3>

                    <div className="space-y-2">
                      {groupItems.map((item) => {
                        const title = item.title ?? '';
                        const message = item.message ?? '';
                        const category = item.category;
                        const type = item.type;
                        const displayDate = item.date ? formatDate(item.date) : '';
                        const txIdDisplay = item.transactionId ? formatId(item.transactionId) : undefined;

                        return (
                          <div
                            key={item.type}
                            onClick={() => setSelectedNotification(item)}
                            className={`bg-bg-card border rounded-2xl p-4 flex gap-4 hover:border-border-hover hover:shadow-md cursor-pointer transition-all duration-200 group relative ${item.isRead ? 'border-border' : 'border-blue-500/20 bg-blue-500/[0.02]'
                              }`}
                          >
                            {/* Unread circle badge */}
                            {!item.isRead && (
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                            )}

                            {/* Icon Container */}
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${item.isRead ? 'bg-bg-dark-secondary border-border' : 'bg-blue-500/10 border-blue-500/20'
                              }`}>
                              {renderCategoryIcon(type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-text-white truncate group-hover:text-blue-500 transition-colors">
                                  {title}
                                </h4>
                                <span className="text-[10px] text-text-muted font-mono whitespace-nowrap shrink-0">
                                  {displayDate}
                                </span>
                              </div>
                              <p className="text-[11px] text-text-gray line-clamp-2 leading-relaxed">
                                {message}
                              </p>

                              {/* Action Metadata Info */}
                              <div className="flex items-center justify-between pt-2">
                                <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">
                                  Category: {category}
                                </span>

                                <div className="flex items-center gap-3">
                                  {txIdDisplay && (
                                    <span className="text-[10px] font-mono text-blue-500 font-semibold">
                                      {txIdDisplay}
                                    </span>
                                  )}

                                  <span className="text-[10px] font-semibold text-blue-500 group-hover:underline flex items-center gap-0.5">
                                    <span>Details</span>
                                    <ArrowUpRightIcon className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}

          </div>

          {/* 2. Right-side Panel (Preferences & Timeline & Quick Actions) */}
          <div className="space-y-6">

            {/* Quick Actions Shortcuts */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-text-white font-bold text-xs font-['Space_Grotesk']">Quick Links</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Navigate around VtuNova services</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/user/transactions"
                  className="bg-bg-dark-secondary border border-border rounded-xl p-3 hover:bg-bg-card-hover text-center space-y-1 hover:border-border-hover transition-colors"
                >
                  <ClockIcon className="w-5 h-5 mx-auto text-blue-500" />
                  <div className="text-[11px] font-bold text-text-white">Transactions</div>
                </Link>
                <Link
                  to="/user/fund"
                  className="bg-bg-dark-secondary border border-border rounded-xl p-3 hover:bg-bg-card-hover text-center space-y-1 hover:border-border-hover transition-colors"
                >
                  <CreditCardIcon className="w-5 h-5 mx-auto text-emerald-500" />
                  <div className="text-[11px] font-bold text-text-white">Fund Wallet</div>
                </Link>
                <Link
                  to="/user/buy/airtime"
                  className="bg-bg-dark-secondary border border-border rounded-xl p-3 hover:bg-bg-card-hover text-center space-y-1 hover:border-border-hover transition-colors"
                >
                  <PhoneIcon className="w-5 h-5 mx-auto text-purple-500" />
                  <div className="text-[11px] font-bold text-text-white">Airtime</div>
                </Link>
                <button
                  onClick={() => {
                    setCategoryFilter('All');
                    setStatusFilter('unread');
                    showToast('Filtered feed by unread', 'info');
                  }}
                  className="bg-bg-dark-secondary border border-border rounded-xl p-3 hover:bg-bg-card-hover text-center space-y-1 hover:border-border-hover transition-colors w-full"
                >
                  <BellIcon className="w-5 h-5 mx-auto text-cyan-500" />
                  <div className="text-[11px] font-bold text-text-white">Filter Unread</div>
                </button>
              </div>
            </div>

            {/* Notification Preferences Settings Card */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-text-white font-bold text-xs font-['Space_Grotesk']">Preferences</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Toggle alert and notifications channels</p>
              </div>

              <div className="space-y-3">
                {/* Transaction alerts */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-white">Transaction Alerts</div>
                    <div className="text-[10px] text-text-muted">Debit/Credit alerts</div>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('transactionAlerts')}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.transactionAlerts ? 'bg-blue-500' : 'bg-zinc-600'
                      }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${preferences.transactionAlerts ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                {/* Wallet updates */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-white">Wallet Funding</div>
                    <div className="text-[10px] text-text-muted">Funding confirmation notifications</div>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('walletUpdates')}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.walletUpdates ? 'bg-blue-500' : 'bg-zinc-600'
                      }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${preferences.walletUpdates ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                {/* Security Alerts */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-white">Security Alerts</div>
                    <div className="text-[10px] text-text-muted">New logins and logins logs</div>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('securityAlerts')}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.securityAlerts ? 'bg-blue-500' : 'bg-zinc-600'
                      }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${preferences.securityAlerts ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                {/* Promotional Messages */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-white">Promotions</div>
                    <div className="text-[10px] text-text-muted">Cashback and discount announcements</div>
                  </div>
                  <button
                    onClick={() => handlePreferenceToggle('promoMessages')}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.promoMessages ? 'bg-blue-500' : 'bg-zinc-600'
                      }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${preferences.promoMessages ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                  </button>
                </div>

                <div className="pt-2 border-t border-border space-y-2.5">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-white font-semibold">Email Updates</span>
                    <button
                      onClick={() => handlePreferenceToggle('emailAlerts')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.emailAlerts ? 'bg-blue-500' : 'bg-zinc-600'
                        }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${preferences.emailAlerts ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                    </button>
                  </div>

                  {/* Push Notifications */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-white font-semibold">Push Alerts</span>
                    <button
                      onClick={() => handlePreferenceToggle('pushAlerts')}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${preferences.pushAlerts ? 'bg-blue-500' : 'bg-zinc-600'
                        }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${preferences.pushAlerts ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Account Activity Log Timeline — derived from real notifications */}
            <div className="bg-bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <div>
                <h3 className="text-text-white font-bold text-xs font-['Space_Grotesk']">Recent Activity Timeline</h3>
                <p className="text-[10px] text-text-muted mt-0.5">Logs of recent account audit actions</p>
              </div>

              <div className="relative border-l border-border pl-4 ml-2.5 space-y-4">
                {isLoading ? (
                  <p className="text-[11px] text-text-muted">Loading…</p>
                ) : notifications.length === 0 ? (
                  <p className="text-[11px] text-text-muted">No recent activity.</p>
                ) : (
                  notifications.slice(0, 5).map((n, i) => {
                    const title = n.title ?? '';
                    const displayDate = n.date ? formatDate(n.date) : '';
                    return (
                      <div key={n._id ?? i} className="relative">
                        <span className="absolute -left-[22px] top-1.5 w-3 h-3 rounded-full border border-bg-card bg-blue-500" />
                        <div className="text-[11px] leading-snug">
                          <div className="flex justify-between font-semibold text-text-white">
                            <span>{title}</span>
                          </div>
                          <span className="text-[9px] text-text-muted font-mono">{displayDate}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ── DETAIL SLIDE-OUT DRAWER ── */}
      {selectedNotification && (() => {
        const tx = selectedNotification.transactionId ? txMap.get(selectedNotification.transactionId) : undefined;
        const title = selectedNotification.title ?? 'Account Notification';
        const message = selectedNotification.message ?? 'You have a new account notification.';
        const category = selectedNotification.category;
        const txIdDisplay = selectedNotification.transactionId ? formatId(selectedNotification.transactionId) : undefined;
        const displayDate = selectedNotification.date ? formatDate(selectedNotification.date) : '';
        const amountDisplay = tx?.amount != null ? formatAmount(tx.amount, true) : undefined;
        

        return (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fade-in">
            {/* Overlay dismissal */}
            <div className="absolute inset-0" onClick={() => setSelectedNotification(null)} />

            <div className="bg-bg-card border-l border-border w-full max-w-md h-full shadow-2xl relative flex flex-col justify-between z-10 animate-slide-in">
              {/* Drawer Header */}
              <div className="p-5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-blue-500" />
                  <h3 className="text-text-white font-bold text-sm font-['Space_Grotesk']">
                    Alert Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-white hover:bg-bg-dark-secondary transition-all"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                <div className="space-y-2">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${selectedNotification.isRead
                    ? 'text-text-muted bg-bg-dark-secondary border-border'
                    : 'text-blue-500 bg-blue-500/10 border-blue-500/20'
                    }`}>
                    {selectedNotification.isRead ? 'Read Log' : 'Unread Notification'}
                  </span>

                  <h2 className="text-lg font-bold text-text-white leading-snug font-['Space_Grotesk']">
                    {title}
                  </h2>
                  <div className="text-[10px] text-text-muted font-mono">
                    Received: {displayDate}
                  </div>
                </div>

                {/* Message Details container */}
                <div className="bg-bg-dark-secondary rounded-xl p-4 border border-border">
                  <p className="text-xs text-text-white leading-relaxed whitespace-pre-wrap">
                    {message}
                  </p>
                </div>

                {/* Related Transaction metadata card */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-text-white">
                    {category === 'security' ? 'Security Activity' : 'Transaction Logs Info'}
                  </h4>

                  <div className="bg-bg-dark-secondary rounded-xl p-4 border border-border space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Activity:</span>
                      <span className="font-semibold text-text-white capitalize">{selectedNotification.type}</span>
                    </div>
                    {selectedNotification.device && (
                      <div className="flex justify-between gap-4">
                        <span className="text-text-muted">Device:</span>
                        <span className="font-semibold text-text-white text-right break-words">{selectedNotification.device}</span>
                      </div>
                    )}
                    {selectedNotification.ip && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">IP Address:</span>
                        <span className="font-semibold text-text-white font-mono">{selectedNotification.ip}</span>
                      </div>
                    )}
                    {category !== 'security' && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Target Service:</span>
                        <span className="font-semibold text-text-white">{tx?.service ?? 'System Action'}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-muted">Transaction ID:</span>
                      <span className="font-semibold text-blue-500 font-mono">{txIdDisplay ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Category:</span>
                      <span className="font-semibold text-text-white capitalize">{category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Status:</span>
                      <span className={`font-semibold capitalize ${tx?.status?.toLowerCase() === 'success' || tx?.status?.toLowerCase() === 'successful' ? 'text-emerald-400' : tx?.status ? 'text-red-400' : 'text-text-muted'}`}>
                        {tx?.status ?? 'N/A'}
                      </span>
                    </div>
                    {amountDisplay && (
                      <div className="flex justify-between border-t border-border/60 pt-2.5">
                        <span className="text-text-muted font-semibold">Value:</span>
                        <span className="font-bold text-emerald-400 font-mono">{amountDisplay}</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-border bg-bg-dark-secondary flex flex-col gap-2">
                {selectedNotification.isRead ? (
                  <button
                    onClick={() => markAsUnread(selectedNotification._id)}
                    className="w-full bg-bg-card hover:bg-bg-card-hover border border-border text-text-white font-semibold rounded-xl py-2 px-4 text-xs transition-all flex items-center justify-center gap-1"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    <span>Mark as Unread</span>
                  </button>
                ) : (
                  <button
                    onClick={() => markAsRead(selectedNotification._id)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl py-2 px-4 text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <EnvelopeOpenIcon className="w-4 h-4" />
                    <span>Mark as Read</span>
                  </button>
                )}

                {(category === 'transactions' || category === 'wallet') && selectedNotification.transactionId && (
                  <Link
                    to="/user/transactions"
                    className="w-full bg-bg-card hover:bg-bg-card-hover border border-border text-text-white font-semibold rounded-xl py-2 px-4 text-xs text-center transition-all flex items-center justify-center gap-1"
                  >
                    <ArrowUpRightIcon className="w-4 h-4 text-blue-500" />
                    <span>Open Related Page</span>
                  </Link>
                )}

                <button
                  onClick={() => deleteNotification(selectedNotification._id)}
                  className="w-full hover:bg-red-500/10 text-red-500 font-semibold rounded-xl py-2 px-4 text-xs transition-all flex items-center justify-center gap-1"
                >
                  <TrashIcon className="w-4 h-4" />
                  <span>Delete Notification</span>
                </button>

                <button
                  onClick={() => setSelectedNotification(null)}
                  className="w-full bg-bg-dark-secondary hover:underline text-text-gray font-semibold rounded-xl py-2 text-xs transition-all"
                >
                  Close Drawer
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── TOAST SYSTEM overlay ── */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs text-white font-semibold min-w-[200px] animate-slide-in pointer-events-auto ${toast.type === 'success'
              ? 'bg-emerald-500 border-emerald-500/20 shadow-emerald-500/10'
              : toast.type === 'info'
                ? 'bg-blue-500 border-blue-500/20 shadow-blue-500/10'
                : 'bg-red-500 border-red-500/20 shadow-red-500/10'
              }`}
          >
            <CheckCircleIcon className="w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
