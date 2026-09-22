import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { getNotifications, clearNotifications as apiClearNotifications, readNotification, readOneNotification, deleteNotification as apiDeleteNotification, markOneAsUnread } from '../api/notification.ts';
import type { NotificationContextProps } from '../interface/context.interface';
import type { BackendNotification, RawNotification } from '../interface/notification.interface';
export type { BackendNotification } from '../interface/notification.interface';

// ─── Backend Shapes ───────────────────────────────────────────────────────────
const notificationTypeDetails: Record<string, { category: BackendNotification['category']; title: string; message: string }> = {
  loginAlert: {
    category: 'security',
    title: 'New Login Detected',
    message: 'A new login was detected on your VtuNova account.',
  },
};

const normalizeNotification = (raw: RawNotification): BackendNotification => {
  const notification = raw._doc ?? raw;
  const type = notification.type ?? 'system';
  const details = notificationTypeDetails[type] ?? {
    category: notification.category ?? 'system',
    title: notification.title ?? 'Account Notification',
    message: notification.message ?? 'You have a new account notification.',
  };

  return {
    _id: notification._id ?? notification.id ?? crypto.randomUUID(),
    type,
    category: notification.category ?? details.category,
    title: notification.title ?? details.title,
    message: notification.message ?? details.message,
    date: notification.date ?? new Date().toISOString(),
    isRead: notification.isRead ?? false,
    transactionId: notification.transactionId,
    device: notification.device,
    ip: notification.ip,
  };
};

// ─── Context Shape ────────────────────────────────────────────────────────────
const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);

  const [isEmptyState, setIsEmptyState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fetchInFlight = useRef<Promise<void> | null>(null);

  const fetchNotifications = useCallback((): Promise<void> => {
    if (fetchInFlight.current) return fetchInFlight.current;

    const request = (async () => {
      setIsLoading(true);
      try {
        const result = await getNotifications();
        if (result?.success && result.data) {
          const data = result.data as unknown;
          const records = Array.isArray(data)
            ? data.flatMap((item: any) => item.notifications ?? item)
            : (data as any).notifications ?? [data];
          setNotifications(records.map((item: RawNotification) => normalizeNotification(item)));
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
        throw new Error('Failed to fetch notifications');
      } finally {
        setIsLoading(false);
        fetchInFlight.current = null;
      }
    })();

    fetchInFlight.current = request;
    return request;
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = useMemo(() => {
    if (isEmptyState) return 0;
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications, isEmptyState]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => notification._id === id ? { ...notification, isRead: true } : notification)
    );
    readOneNotification(id).catch((err) => {
      console.error('Failed to mark notification as read', err);
    });
  };

  const markAsUnread = async (id: string) => {
    // setNotifications((prev) =>
    //   prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
    // );
    try {
      await markOneAsUnread(id);
    } catch (err) {
      console.error('Failed to mark notification as unread', err);
    }
  };

  const deleteNotification = async (id: string): Promise<void> => {
    try {
      const response = await apiDeleteNotification(id);
     if(response?.success) {
        setNotifications((prev) => prev.filter((notification) => notification._id !== id));
     }
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
    // setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = async () => {
    // setNotifications([]);
    try {
      await apiClearNotifications();
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isEmptyState,
        isLoading,
        setIsEmptyState,
        markAsRead,
        markAsUnread,
        deleteNotification,
        markAllAsRead,
        clearNotifications,
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
