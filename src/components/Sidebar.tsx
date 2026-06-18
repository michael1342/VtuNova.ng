import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const navItems = {
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
    path: '/admin-dashboard',
    icon: <Squares2X2Icon className="w-4 h-4" />,
    activeIcon: <Squares2X2SolidIcon className="w-4 h-4" />
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: <UsersIcon className="w-4 h-4" />,
    activeIcon: <UsersSolidIcon className="w-4 h-4" />
  },
  {
    label: 'Transactions',
    path: '/admin/transactions',
    icon: <ListBulletIcon className="w-4 h-4" />,
    activeIcon: <ListBulletSolidIcon className="w-4 h-4" />
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: <Cog6ToothIcon className="w-4 h-4" />,
    activeIcon: <Cog6ToothSolidIcon className="w-4 h-4" />
  }
]
};

const Sidebar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const formatRole = (role) =>
  role
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();

  const { currentUser, logout, getInitials } = useAuth();
  const navigate = useNavigate()

  if (currentUser == null) {
    return ;
  }

  const role = currentUser.role?.toLowerCase().trim() || 'user';
  const normalizedRole = role.replace(/[\s_-]/g, '');
  const displayRole = formatRole(role);

  const handleLogout = () => {
    logout()
    setMobileMenuOpen?.(false);
    return navigate('/login')
  }

  // const role = 'user'; // hardcoded for now, replace with dynamic role from auth context


  return (
    <div
      className={`flex flex-col h-full bg-bg-dark-secondary border-r border-border transition-all duration-300 ${collapsed ? ' w-1  md:w-56 ': 'w-56 '} shrink-0`}
      
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <BoltIcon className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-text-white font-bold text-sm leading-none">SwiftTopup</div>
            <div className="text-[10px] text-text-muted mt-0.5">VTU Platform</div>
          </div>
        )}
        {/* <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-text-muted hover:text-text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button> */}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
        {navItems[role]?.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen?.(false)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200 group relative
                ${isActive
                  ? 'bg-blue-500/15 text-blue-400 font-medium'
                  : 'text-text-gray hover:text-text-white hover:bg-bg-card-hover'
                }`}
            >
              <span className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-text-muted group-hover:text-text-white'}`}>
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}
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