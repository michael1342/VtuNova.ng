import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { getNotifications, clearNotifications as apiClearNotifications, readNotification, deleteNotification as apiDeleteNotification, markOneAsUnread } from '../api/notification.ts';

// ─── Backend Shapes ───────────────────────────────────────────────────────────
export interface BackendNotification {
  _id: string;
  category: 'transactions' | 'wallet' | 'security' | 'promotions' | 'system';
  title?: string;
  message?: string;
  date: string;
  isRead: boolean;
  transactionId?: string;
}

export interface BackendTransaction {
  _id: string;
  service?: string;
  amount?: number;
  status?: string;
  date?: string;
  [key: string]: any;
}

// ─── Context Shape ────────────────────────────────────────────────────────────
interface NotificationContextProps {
  notifications: BackendNotification[];
  transactions: BackendTransaction[];
  unreadCount: number;
  isEmptyState: boolean;
  isLoading: boolean;
  setIsEmptyState: React.Dispatch<React.SetStateAction<boolean>>;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  deleteNotification: (id: string) => void;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => void;
  restoreMockNotifications: () => void;
  refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [transactions, setTransactions] = useState<BackendTransaction[]>([]);
  const [isEmptyState, setIsEmptyState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const result = await getNotifications();
      if (result?.success && result.data) {
        const data = result.data as any;
        setNotifications(data.notifications ?? []);
        setTransactions(data.transactions ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(() => {
    if (isEmptyState) return 0;
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications, isEmptyState]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAsUnread = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
    );
    try {
      await markOneAsUnread(id);
    } catch (err) {
      console.error('Failed to mark notification as unread', err);
    }
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    try {
      await apiDeleteNotification(id);
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await readNotification();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
    // Optimistic update regardless of API result
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = async () => {
    setNotifications([]);
    try {
      await apiClearNotifications();
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  const restoreMockNotifications = () => {
    fetchNotifications();
    setIsEmptyState(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        transactions,
        unreadCount,
        isEmptyState,
        isLoading,
        setIsEmptyState,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
        clearNotifications,
        restoreMockNotifications,
        refetch: fetchNotifications,
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
