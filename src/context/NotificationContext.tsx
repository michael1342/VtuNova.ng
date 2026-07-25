import React, { createContext, useContext, useState, useMemo } from 'react';

export interface NotificationItem {
  id: string;
  category: 'transactions' | 'wallet' | 'security' | 'promotions' | 'system';
  title: string;
  message: string;
  time: string;
  dateGroup: 'Today' | 'Yesterday' | 'Older';
  read: boolean;
  txId?: string;
  service?: string;
  amount?: string;
}

interface NotificationContextProps {
  notifications: NotificationItem[];
  unreadCount: number;
  isEmptyState: boolean;
  setIsEmptyState: React.Dispatch<React.SetStateAction<boolean>>;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  restoreMockNotifications: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'transactions',
    title: 'Airtime Purchase Successful',
    message: 'Your ₦1,000 airtime purchase for MTN (0803••4321) was completed successfully. Cashback of ₦15 has been credited to your wallet.',
    time: '10:24 AM',
    dateGroup: 'Today',
    read: false,
    txId: 'TX-98031',
    service: 'MTN Airtime',
    amount: '₦1,000',
  },
  {
    id: 'notif-2',
    category: 'wallet',
    title: 'Wallet Credited',
    message: '₦20,000 has been successfully added to your VtuNova wallet via Bank Transfer transfer source.',
    time: '8:14 AM',
    dateGroup: 'Today',
    read: false,
    txId: 'TX-98232',
    service: 'Bank Transfer Funding',
    amount: '₦20,000',
  },
  {
    id: 'notif-3',
    category: 'security',
    title: 'New Login Detected',
    message: 'Your VtuNova account was accessed from a new device (Chrome, Windows) in Lagos, Nigeria. If this was not you, lock your credentials immediately.',
    time: '6:32 AM',
    dateGroup: 'Today',
    read: false,
    txId: 'SEC-89102',
    service: 'Account Security Logs',
    amount: '-',
  },
  {
    id: 'notif-4',
    category: 'transactions',
    title: 'Electricity Token Generated',
    message: 'Your payment of ₦5,000 for Ikeja Electric Prepaid Meter was successful. Token: 9801 - 2293 - 0984 - 2314 - 1109.',
    time: 'Yesterday, 4:15 PM',
    dateGroup: 'Yesterday',
    read: true,
    txId: 'TX-98086',
    service: 'Ikeja Electric (IKEDC)',
    amount: '₦5,000',
  },
  {
    id: 'notif-5',
    category: 'transactions',
    title: 'Subscription Renewed',
    message: 'DSTV Compact package subscription renewed successfully. Next billing date: 13 July 2026.',
    time: 'Yesterday, 11:20 AM',
    dateGroup: 'Yesterday',
    read: true,
    txId: 'TX-98027',
    service: 'DSTV Subscription',
    amount: '₦9,500',
  },
  {
    id: 'notif-6',
    category: 'promotions',
    title: '₦100 Data Cashback Offer!',
    message: 'Enjoy up to ₦100 instant discount on all data bundle orders above ₦1,500 placed before midnight today.',
    time: '3 days ago',
    dateGroup: 'Older',
    read: true,
    txId: 'PRO-2201',
    service: 'Weekend Special Promo',
    amount: '-',
  },
  {
    id: 'notif-7',
    category: 'system',
    title: 'Scheduled System Upgrade',
    message: 'We will be conducting critical server updates on Sunday, June 14, from 2:00 AM to 3:30 AM. Airtime and data purchase services may experience short lag intervals.',
    time: '4 days ago',
    dateGroup: 'Older',
    read: true,
    txId: 'SYS-0931',
    service: 'Core Platform Updates',
    amount: '-',
  },
];

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isEmptyState, setIsEmptyState] = useState(false);

  const unreadCount = useMemo(() => {
    if (isEmptyState) return 0;
    return notifications.filter((n) => !n.read).length;
  }, [notifications, isEmptyState]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAsUnread = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const restoreMockNotifications = () => {
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsEmptyState(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isEmptyState,
        setIsEmptyState,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
        clearNotifications,
        restoreMockNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
