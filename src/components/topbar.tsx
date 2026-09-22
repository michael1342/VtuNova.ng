import { useTheme } from '../context/themeContext';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import {
  BellIcon,
  PhoneIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { formatAmount } from '../utils/formatter.ts';
import Badge from './ui/Badge';
import type { TopbarProps } from '../interface/components.interface';

// Derive notification category
// Format relative or compact timestamp for topbar preview
function formatNotificationTime(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

const Topbar = ({ mobileMenuOpen, setMobileMenuOpen }: TopbarProps) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentUser, accountBalance } = useAuth();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Resolve dynamic title and subtitle based on path
  const getHeaderDetails = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      return { title: 'Dashboard', desc: 'Overview of your account' };
    } else if (path.includes('/buy/airtime')) {
      return { title: 'Buy Airtime', desc: 'Top up mobile airtime instantly' };
    } else if (path.includes('/buy/data')) {
      return { title: 'Buy Data Bundle', desc: 'Purchase high-speed internet data' };
    } else if (path.includes('/buy/electricity')) {
      return { title: 'Electricity Bills', desc: 'Pay utility bills seamlessly' };
    } else if (path.includes('/buy/cable')) {
      return { title: 'Cable TV Subscription', desc: 'Renew your cable subscription' };
    } else if (path.includes('/fund')) {
      return { title: 'Fund Wallet', desc: 'Add money to your VtuNova wallet' };
    } else if (path.includes('/transactions')) {
      return { title: 'Transactions', desc: 'Track and manage your transaction history' };
    } else if (path.includes('/referrals')) {
      return { title: 'Referral Program', desc: 'Invite friends to VtuNova and earn rewards when they join and transact' };
    } else if (path.includes('/notifications')) {
      return { title: 'Notifications', desc: 'Stay updated with transactions, wallet activity, account alerts, and important updates' };
    } else if (path.includes('/profile')) {
      return { title: 'My Profile', desc: 'Manage your personal information, account details, security settings, and preferences' };
    } else if (path.includes('/settings')) {
      return { title: 'Settings', desc: 'Customize your VtuNova account experience, security, notifications, and preferences' };
    }
    return { title: 'VtuNova', desc: 'VTU & Financial Services' };
  };

  const { title, desc } = getHeaderDetails();

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'transactions':
        return <PhoneIcon className="w-4 h-4 text-blue-400" />;
      case 'wallet':
        return <CreditCardIcon className="w-4 h-4 text-emerald-400" />;
      case 'security':
        return <ShieldCheckIcon className="w-4 h-4 text-amber-400" />;
      case 'promotions':
        return <BellIcon className="w-4 h-4 text-purple-400" />;
      case 'system':
        return <Cog6ToothIcon className="w-4 h-4 text-cyan-400" />;
      default:
        return <BellIcon className="w-4 h-4 text-text-muted" />;
    }
  };

  // Get top 5 recent notifications
  const recentNotifications = useMemo(() => {
    return (notifications || []).slice(0, 5);
  }, [notifications]);

  return (
    <header className="sticky top-0 z-20 bg-bg-dark-secondary backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 py-4.5 transition-colors duration-200">
      {/* Left — Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-white hover:border-border-hover transition-all duration-200"
          aria-label="Toggle Menu"
        >
          <span className="text-base sm:text-lg font-bold leading-none">
            {mobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
        <div>
          <h1 className="text-text-white font-bold text-sm sm:text-lg leading-none font-['Space_Grotesk']">
            {title}
          </h1>
          <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 hidden sm:block">{desc}</p>
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            id="topbar-search"
            type="text"
            placeholder="Search transactions..."
            className="bg-bg-card border border-border text-sm text-text-white placeholder-text-muted rounded-lg pl-9 pr-4 py-2 w-52 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>

        {/* Theme Toggle */}
        <button
          id="topbar-theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-bg-card border border-border flex items-center justify-center text-text-gray hover:text-text-white hover:border-border-hover transition-all duration-200"
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

        {/* Bell Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="topbar-notifications"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-bg-card border flex items-center justify-center transition-all duration-200 ${
              dropdownOpen
                ? 'text-text-white border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                : 'text-text-gray hover:text-text-white border-border hover:border-border-hover'
            }`}
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5">
                <Badge variant="primary" size="sm" count={unreadCount} maxCount={9} ring />
              </span>
            )}
          </button>

          {/* Dropdown Modal Container */}
          {dropdownOpen && (
            <div className="fixed inset-x-4 top-[60px] sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 w-auto sm:w-96 bg-bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
              {/* Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-text-white font-['Space_Grotesk']">
                    Notifications
                  </h3>
                  {unreadCount > 0 ? (
                    <p className="text-[10px] text-blue-500 font-semibold mt-0.5">
                      You have {unreadCount} unread alert{unreadCount > 1 ? 's' : ''}
                    </p>
                  ) : (
                    <p className="text-[10px] text-text-muted mt-0.5">
                      All caught up!
                    </p>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-[10px] font-bold text-text-muted hover:text-blue-500 transition-colors flex items-center gap-1"
                  >
                    <CheckIcon className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[320px] overflow-y-auto divide-y divide-border/60">
                {recentNotifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-white font-['Space_Grotesk']">
                        No notifications yet
                      </p>
                      <p className="text-[10px] text-text-muted max-w-[200px] mx-auto mt-0.5">
                        Your transaction and account alerts will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  recentNotifications.map((item) => {
                    const title = item.title ?? '';
                    const message = item.message ?? '';
                    const category = item.category;
                    const time = formatNotificationTime(item.date);

                    return (
                      <div
                        key={item._id}
                        onClick={() => {
                          if (!item.isRead) {
                            markAsRead(item._id);
                          }
                        }}
                        className={`p-3.5 flex gap-3 hover:bg-bg-dark-secondary/60 cursor-pointer transition-colors group relative ${
                          item.isRead ? '' : 'bg-blue-500/[0.04]'
                        }`}
                      >
                        {/* Unread dot indicator */}
                        {!item.isRead && (
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                        )}

                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          item.isRead ? 'bg-bg-dark-secondary/60 border-border' : 'bg-blue-500/10 border-blue-500/20'
                        }`}>
                          {renderCategoryIcon(category)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-[11px] font-bold truncate transition-colors ${
                              item.isRead ? 'text-text-white group-hover:text-blue-400' : 'text-blue-400'
                            }`}>
                              {title}
                            </h4>
                            <span className="text-[9px] text-text-muted font-mono whitespace-nowrap shrink-0">
                              {time}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-gray line-clamp-2 leading-relaxed">
                            {message}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-bg-dark-secondary/50 border-t border-border text-center">
                <Link
                  to="/user/notifications"
                  onClick={() => setDropdownOpen(false)}
                  className="inline-block text-[10px] font-bold text-blue-500 hover:underline py-1"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Wallet Balance */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-bg-card border border-border rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-emerald-400">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </svg>
          <span className="text-text-white font-bold text-xs sm:text-sm font-['Space_Grotesk'] hidden min-[400px]:inline">{formatAmount(accountBalance, true)}</span>
        </div>

        {/* Avatar */}
        <Link
          to="/user/profile"
          id="topbar-avatar"
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-[11px] sm:text-xs ring-2 ring-transparent hover:ring-blue-500/50 transition-all duration-200 uppercase overflow-hidden shrink-0"
          aria-label="User profile"
          title={currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName || ''}` : 'User Profile'}
        >
          {(currentUser as any)?.profilePic?.url ? (
            <img
              src={`http://localhost:3000/${(currentUser as any).profilePic.url}`}
              alt={currentUser?.firstName?.[0] ?? 'U'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide broken image to reveal initials fallback
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          {/* Initials fallback — visible when no image or image fails to load */}
          {/* <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {currentUser?.firstName?.[0] ?? ''}{currentUser?.lastName?.[0] ?? ''}
          </span> */}
        </Link>
      </div>
    </header>
  );
};

export default Topbar;
