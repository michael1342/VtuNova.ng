import { useState, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';


import {
  Squares2X2Icon,
  PhoneIcon,
  SignalIcon,
  BoltIcon,
  TvIcon,
  CreditCardIcon,
  ListBulletIcon,
  UsersIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  ShieldCheckIcon
  // ChevronRightIcon,
  // ChevronLeftIcon,
} from '@heroicons/react/24/outline';

// solid icons
import {
  Squares2X2Icon as Squares2X2SolidIcon,
  PhoneIcon as PhoneSolidIcon,
  SignalIcon as SignalSolidIcon,
  BoltIcon as BoltSolidIcon,
  TvIcon as TvSolidIcon,
  CreditCardIcon as CreditCardSolidIcon,
  ListBulletIcon as ListBulletSolidIcon,
  UsersIcon as UsersSolidIcon,
  BellIcon as BellSolidIcon,
  UserCircleIcon as UserCircleSolidIcon,
  Cog6ToothIcon as Cog6ToothSolidIcon,
  ChartBarIcon as ChartBarSolidIcon,
  ShieldCheckIcon as ShieldCheckSolidIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import Badge from './ui/Badge';

import type { NavItem } from '../interface/components.interface';

const navItems: Record<string, NavItem[]> = {
  user: [
    {
      label: 'Dashboard',
      path: '/user/dashboard',
      icon: <Squares2X2Icon className="w-4 h-4" />,
      activeIcon: <Squares2X2SolidIcon className="w-4 h-4" />
    },
    {
      label: 'Buy Airtime',
      path: '/user/buy/airtime',
      icon: <PhoneIcon className="w-4 h-4" />,
      activeIcon: <PhoneSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Buy Data',
      path: '/user/buy/data',
      icon: <SignalIcon className="w-4 h-4" />,
      activeIcon: <SignalSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Electricity Bills',
      path: '/user/buy/electricity',
      icon: <BoltIcon className="w-4 h-4" />,
      activeIcon: <BoltSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Cable TV',
      path: '/user/buy/cable',
      icon: <TvIcon className="w-4 h-4" />,
      activeIcon: <TvSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Fund Wallet',
      path: '/user/fund',
      icon: <CreditCardIcon className="w-4 h-4" />,
      activeIcon: <CreditCardSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Transactions',
      path: '/user/transactions',
      icon: <ListBulletIcon className="w-4 h-4" />,
      activeIcon: <ListBulletSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Referrals',
      path: '/user/referrals',
      icon: <UsersIcon className="w-4 h-4" />,
      activeIcon: <UsersSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Notifications',
      path: '/user/notifications',
      icon: <BellIcon className="w-4 h-4" />,
      activeIcon: <BellSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Profile',
      path: '/user/profile',
      icon: <UserCircleIcon className="w-4 h-4" />,
      activeIcon: <UserCircleSolidIcon className="w-4 h-4" />
    },
    {
      label: 'Settings',
      path: '/user/settings',
      icon: <Cog6ToothIcon className="w-4 h-4" />,
      activeIcon: <Cog6ToothSolidIcon className="w-4 h-4" />
    },
  ],

  admin: [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <Squares2X2Icon className="w-4 h-4" />,
      activeIcon: <Squares2X2SolidIcon className="w-4 h-4" />,
      category: 'Overview'
    },
    {
      label: 'Users',
      path: '/admin/users',
      icon: <UsersIcon className="w-4 h-4" />,
      activeIcon: <UsersSolidIcon className="w-4 h-4" />,
      category: 'Operations'
    },
    {
      label: 'Transactions',
      path: '/admin/transactions',
      icon: <ListBulletIcon className="w-4 h-4" />,
      activeIcon: <ListBulletSolidIcon className="w-4 h-4" />,
      category: 'Operations'
    },
    {
      label: 'Wallet',
      path: '/admin/wallet',
      icon: <CreditCardIcon className="w-4 h-4" />,
      activeIcon: <CreditCardSolidIcon className="w-4 h-4" />,
      category: 'Operations'
    },
    {
      label: 'Airtime',
      path: '/admin/services/airtime',
      icon: <PhoneIcon className="w-4 h-4" />,
      activeIcon: <PhoneSolidIcon className="w-4 h-4" />,
      category: 'Services'
    },
    {
      label: 'Data',
      path: '/admin/services/data',
      icon: <SignalIcon className="w-4 h-4" />,
      activeIcon: <SignalSolidIcon className="w-4 h-4" />,
      category: 'Services'
    },
    {
      label: 'Electricity',
      path: '/admin/services/electricity',
      icon: <BoltIcon className="w-4 h-4" />,
      activeIcon: <BoltSolidIcon className="w-4 h-4" />,
      category: 'Services'
    },
    {
      label: 'Cable TV',
      path: '/admin/services/cable',
      icon: <TvIcon className="w-4 h-4" />,
      activeIcon: <TvSolidIcon className="w-4 h-4" />,
      category: 'Services'
    },
    {
      label: 'Notifications',
      path: '/admin/notifications',
      icon: <BellIcon className="w-4 h-4" />,
      activeIcon: <BellSolidIcon className="w-4 h-4" />,
      category: 'Management'
    },
    {
      label: 'Referrals',
      path: '/admin/referrals',
      icon: <UsersIcon className="w-4 h-4" />,
      activeIcon: <UsersSolidIcon className="w-4 h-4" />,
      category: 'Management'
    },
    {
      label: 'Analytics',
      path: '/admin/analytics',
      icon: <ChartBarIcon className="w-4 h-4" />,
      activeIcon: <ChartBarSolidIcon className="w-4 h-4" />,
      category: 'Management'
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: <Cog6ToothIcon className="w-4 h-4" />,
      activeIcon: <Cog6ToothSolidIcon className="w-4 h-4" />,
      category: 'System'
    },
    {
      label: 'Support',
      path: '/admin/support',
      icon: <QuestionMarkCircleIcon className="w-4 h-4" />,
      activeIcon: <QuestionMarkCircleIcon className="w-4 h-4" />,
      category: 'System'
    },
    {
      label: 'Roles',
      path: '/admin/roles',
      icon: <ShieldCheckIcon className="w-4 h-4" />,
      activeIcon: <ShieldCheckSolidIcon className="w-4 h-4" />,
      category: 'System'
    }
  ]
};

const Sidebar = () => {
  const [_, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [collapsed,] = useState(false);

  // type roleProp = {
  //   role: string;
  // }

  // const formatRole = ({role}: roleProp) =>
  // role
  //   .replace(/([a-z])([A-Z])/g, '$1 $2')
  //   .replace(/[-_]/g, ' ')
  //   .replace(/\s+/g, ' ')
  //   .trim()
  //   .toUpperCase();

  const { currentUser, logout } = useAuth() as {
    currentUser: { role?: string } | null;
    logout: (() => void) | null;
  };
  // const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigate = useNavigate()

  const { unreadCount } = useNotifications();

  if (currentUser == null) {
    return;
  }

  const newRole = currentUser.role?.toLowerCase().trim() || 'user';
  // const normalizedRole = newRole.replace(/[\s_-]/g, '');
  // const displayRole = formatRole(newRole);

  const handleLogout = () => {
    logout?.()
    setMobileMenuOpen?.(false);
    return navigate('/login')
  }

  // const role = 'user'; // hardcoded for now, replace with dynamic role from auth context


  return (
    <div
      className={`flex flex-col h-full bg-bg-dark-secondary border-r border-border transition-all duration-300 ${collapsed ? ' w-1  md:w-56 ' : 'w-56 '} shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center py-2 px-3 border-b border-border h-[72px] overflow-hidden">
        <Logo collapsed={collapsed} />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {(() => {
          let lastCategory: string | undefined = undefined;
          return navItems[newRole]?.map((item) => {
            const isActive = location.pathname === item.path;
            const showCategory = item.category && item.category !== lastCategory;
            if (item.category) {
              lastCategory = item.category;
            }
            return (
              <Fragment key={item.path}>
                {showCategory && !collapsed && (
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4 mt-4 mb-2">
                    {item.category}
                  </p>
                )}
                <Link
                  to={item.path}
                  onClick={() => setMobileMenuOpen?.(false)}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-blue-500/15 text-blue-400 font-medium'
                      : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                    }`}
                >
                  <span className={`shrink-0 relative ${isActive ? 'text-blue-400' : 'text-text-muted group-hover:text-text-white'}`}>
                    {item.icon}
                    {collapsed && item.path.includes('/notifications') && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1">
                        <Badge variant="primary" dot size="sm" ping />
                      </span>
                    )}
                  </span>
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.path.includes('/notifications') && unreadCount > 0 && (
                    <Badge variant="primary" size="sm" count={unreadCount} className="ml-auto" />
                  )}
                  {isActive && !collapsed && !item.path.includes('/notifications') && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </Link>
              </Fragment>
            );
          });
        })()}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border py-3 px-2 space-y-1">
        <Link
          to="/main/help"
          onClick={() => setMobileMenuOpen?.(false)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-text-gray hover:text-text-white hover:bg-bg-card-hover transition-all duration-200"
        >
          <QuestionMarkCircleIcon className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Help & Support</span>}
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200" onClick={handleLogout}>
          <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;