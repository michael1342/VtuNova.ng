export interface StoreUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  walletBalance: number;
  transactionsCount: number;
  verificationStatus: 'Verified' | 'Pending' | 'Unverified';
  status: string;
  role: string;
  joinedDate: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  identityVerified: boolean;
  identityDocUrl?: string;
  wallet: unknown;
  referralCode: string;
  referrals: unknown;
  notifications: unknown;
  transactions: unknown;
  isActive: boolean;
  createdAt: string;
  token: string;
}

export interface AuthState {
  accessToken: string | null;
  otpId: string | null;
  setAccessToken: (token: string | null) => void;
  setOtpId: (otpId: string | null) => void;
  clearAuth: () => void;
}
