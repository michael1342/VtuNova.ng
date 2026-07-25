import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Squares2X2Icon,
  ListBulletIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import {
  Squares2X2Icon as Squares2X2SolidIcon,
  ListBulletIcon as ListBulletSolidIcon,
  UserCircleIcon as UserCircleSolidIcon,
  Cog6ToothIcon as Cog6ToothSolidIcon
} from '@heroicons/react/24/solid';

const BottomNav = () => {
  const location = useLocation();
  const { currentUser } = useAuth() as {
    currentUser: { role?: string } | null;
  };

  if (!currentUser) return null;

  const role = currentUser.role?.toLowerCase().trim() || 'user';
  
  const navItems = [
    {
      label: 'Home',
      path: `/${role}/dashboard`,
      icon: <Squares2X2Icon className="w-6 h-6" />,
      activeIcon: <Squares2X2SolidIcon className="w-6 h-6" />
    },
    {
      label: 'History',
      path: `/${role}/transactions`,
      icon: <ListBulletIcon className="w-6 h-6" />,
      activeIcon: <ListBulletSolidIcon className="w-6 h-6" />
    },
    {
      label: 'Profile',
      path: role === 'admin' ? '/admin/users' : '/user/profile',
      icon: <UserCircleIcon className="w-6 h-6" />,
      activeIcon: <UserCircleSolidIcon className="w-6 h-6" />
    },
    {
      label: 'Settings',
      path: `/${role}/settings`,
      icon: <Cog6ToothIcon className="w-6 h-6" />,
      activeIcon: <Cog6ToothSolidIcon className="w-6 h-6" />
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-dark-secondary border-t border-border px-6 py-2 flex justify-between items-center pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center p-1 rounded-lg transition-colors ${
              isActive ? 'text-blue-400' : 'text-text-gray hover:text-text-white'
            }`}
          >
            {isActive ? item.activeIcon : item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;