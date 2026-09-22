import type React from 'react';

export interface Beneficiary {
  _id?: string;
  id?: string;
  name: string;
  number: string;
  phone?: string;
  network: string;
  service?: string;
  success?: boolean;
  error?: string;
}

export interface BackendVariation {
  variation_code: string;
  name: string;
  variation_amount: string | number;
  fixedPrice?: string;
  [key: string]: unknown;
}

export interface FormattedPlan {
  variation_code: string;
  rawName: string;
  name: string;
  amount: number;
  fixedPrice: string;
  dataSize: string;
  validity: string;
  category: 'daily' | 'weekly' | 'monthly';
}

export interface CablePackage {
  id: string;
  name: string;
  price: number;
  channels: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

export interface QuickActionProps {
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  to: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'danger';
}

export interface ProfileActivityEvent {
  id: string;
  type: 'profile' | 'security' | 'wallet' | 'transaction' | 'referral';
  description: string;
  time: string;
}

export interface ReferralUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  transactions: number;
  status: 'Active' | 'Pending' | 'Inactive';
  rewardEarned: number;
}

export interface ReferralActivityEvent {
  id: string;
  type: 'joined' | 'credited' | 'active' | 'bonus';
  title: string;
  description: string;
  time: string;
  amount?: number;
}

export type SettingsTab = 'general' | 'security' | 'notifications' | 'wallet' | 'privacy' | 'connected' | 'support';

export interface DeviceSession {
  id: string;
  browser: string;
  os: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ConnectedAccount {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  detail: string;
}

export interface SettingsState {
  language: string;
  currency: string;
  dateFormat: string;
  timeZone: string;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  transactionAlerts: boolean;
  walletUpdates: boolean;
  securityAlerts: boolean;
  promotions: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  autoSaveBeneficiaries: boolean;
  transactionConfirmation: boolean;
  walletFundingReminder: boolean;
  dailyLimit: string;
  monthlyLimit: string;
  profileVisibility: boolean;
  activityVisibility: boolean;
  analyticsTracking: boolean;
  personalizedRecommendations: boolean;
  dataSharing: boolean;
  preferredContact: string;
}

export interface VerificationState {
  email?: string;
  otpId?: string;
}
