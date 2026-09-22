export type NotificationCategory = 'transactions' | 'wallet' | 'security' | 'promotions' | 'system';

export interface BackendNotification {
  _id: string;
  type: string;
  category: NotificationCategory;
  title?: string;
  message?: string;
  date: string;
  isRead: boolean;
  transactionId?: string;
  device?: string;
  ip?: string;
}

export interface RawNotification {
  _id?: string;
  id?: string;
  userId?: string;
  type?: string;
  category?: NotificationCategory;
  title?: string;
  message?: string;
  date?: string;
  isRead?: boolean;
  transactionId?: string;
  device?: string;
  ip?: string;
  _doc?: RawNotification;
}
