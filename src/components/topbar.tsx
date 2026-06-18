import { useTheme } from '../context/themeContext';
import { useLocation, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import {
  BellIcon,
  PhoneIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface TopbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
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
      return { title: 'Fund Wallet', desc: 'Add money to your SwiftTopup wallet' };
    } else if (path.includes('/transactions')) {
      return { title: 'Transactions', desc: 'Track and manage your transaction history' };
    } else if (path.includes('/referrals')) {
      return { title: 'Referral Program', desc: 'Invite friends to SwiftTopup and earn rewards when they join and transact' };
    } else if (path.includes('/notifications')) {
      return { title: 'Notifications', desc: 'Stay updated with transactions, wallet activity, account alerts, and important updates' };
    } else if (path.includes('/profile')) {
      return { title: 'My Profile', desc: 'Manage your personal information, account details, security settings, and preferences' };
    } else if (path.includes('/settings')) {
      return { title: 'Settings', desc: 'Customize your SwiftTopup account experience, security, notifications, and preferences' };
    }
    return { title: 'SwiftTopup', desc: 'VTU & Financial Services' };
  };

  const { title, desc } = getHeaderDetails();

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'transactions':
        return <PhoneIcon className="w-4 h-4 text-blue-500" />;
      case 'wallet':
        return <CreditCardIcon className="w-4 h-4 text-emerald-500" />;
      case 'security':
        return <ShieldCheckIcon className="w-4 h-4 text-amber-500" />;
      case 'promotions':
        return <BellIcon className="w-4 h-4 text-purple-500" />;
      case 'system':
        return <Cog6ToothIcon className="w-4 h-4 text-cyan-500" />;
      default:
        return <BellIcon className="w-4 h-4 text-text-muted" />;
    }
  };

  // Get top 5 recent notifications
  const recentNotifications = notifications.slice(0, 5);

  return (
    <header className="sticky top-0 z-20 bg-bg-dark-secondary backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 py-3 transition-colors duration-200">
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
            /* Sun icon — shown in dark mode to switch to light */
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
            /* Moon icon — shown in light mode to switch to dark */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>

        {/* Bell */}
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
              <>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
              </>
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
                  {unreadCount > 0 && (
                    <p className="text-[10px] text-blue-500 font-semibold mt-0.5">
                      You have {unreadCount} unread alert{unreadCount > 1 ? 's' : ''}
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
                        All caught up!
                      </p>
                      <p className="text-[10px] text-text-muted max-w-[200px] mx-auto mt-0.5">
                        No new notifications at the moment.
                      </p>
                    </div>
                  </div>
                ) : (
                  recentNotifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        markAsRead(item.id);
                      }}
                      className={`p-3.5 flex gap-3 hover:bg-bg-dark-secondary/40 cursor-pointer transition-colors group relative ${
                        item.read ? '' : 'bg-blue-500/[0.01]'
                      }`}
                    >
                      {/* Unread dot indicator */}
                      {!item.read && (
                        <span className="absolute left-2 top-[22px] w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}

                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        item.read ? 'bg-bg-dark-secondary/60 border-border' : 'bg-blue-500/10 border-blue-500/20'
                      }`}>
                        {renderCategoryIcon(item.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-[11px] font-bold text-text-white truncate group-hover:text-blue-500 transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[9px] text-text-muted font-mono whitespace-nowrap shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-gray line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))
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
          <span className="text-text-white font-bold text-xs sm:text-sm font-['Space_Grotesk'] hidden min-[400px]:inline">₦150,000.00</span>
        </div>

        {/* Avatar */}
        <button
          id="topbar-avatar"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm hover:ring-2 hover:ring-blue-500/50 transition-all duration-200"
          aria-label="User profile"
        >
          M
        </button>
      </div>
    </header>
  );
};

export default Topbar;
