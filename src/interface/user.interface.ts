
export interface BeneficiaryData {
  name: string;
  phone: string;
  service: string;
  _id: string;
  id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Beneficiary {
  data: BeneficiaryData;
}

export interface UserWallet {
  balance: number;
  referralEarnings?: number;
  cashback?: number;
  totalFunded?: number;
  totalSpent?: number;
  [key: string]: any;
}

export interface User {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  wallet?: UserWallet | number;
  balance?: number;
  walletBalance?: number;
  transactionsCount?: number;
  verificationStatus?: 'Verified' | 'Pending' | 'Unverified' | string;
  status?: string;
  role?: string;
  joinedDate?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  identityVerified?: boolean;
  identityDocUrl?: string;
  referralCode?: string;
  lastLogin?: string;
  dateOfBirth?: string;
  address?: string;
  profilePic?: string | { url?: string };
  referrals?: number | unknown[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
  otpId?: string;
}


export interface UserApiResponse {
  response: User;
  success: boolean;
  error?: string;
  user?: User;
  current?: User
}

export interface Transaction {
  _id?: string;
  id?: string;
  userId?: string;
  service: string;
  recipient?: string;
  amount: number;
  fee?: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed' | 'success' | 'pending' | 'failed' | 'reversed' | string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  time?: string;
  method?: string;
  paymentMethod?: string;
  channel?: string;
  refNo?: string;
  reference?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  description?: string;
}

export interface GetTransactionsResponse {
  success?: boolean;
  transactions: Transaction[];
  total?: number;
  count?: number;
  message?: string;
  error?: string;
}

export interface FundingHistoryItem {
  _id?: string;
  id?: string;
  method?: string;
  paymentMethod?: string;
  service?: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed' | 'success' | 'pending' | 'failed' | 'reversed' | string;
  paidAt?: string;
  createdAt?: string;
  date?: string;
  reference?: string;
  channel?: string;
}

export interface MonthlyChartItem {
  month: number;
  monthName: string;
  shortMonth: string;
  totalAmount: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  successfulAmount: number;
}

export interface ChartSummary {
  totalAmount: number;
  totalTransactions: number;
  successfulAmount: number;
  successfulTransactions: number;
}

export interface TransactionChartData {
  year: number;
  summary: ChartSummary;
  monthlyData: MonthlyChartItem[];
}

export interface TransactionChartResponse {
  data?: TransactionChartData;
  success?: boolean;
  error?: string;
}

export interface TransactionReceipt {
  _id?: string;
  id?: string;
  transactionId?: string;
  reference?: string;
  refNo?: string;
  service: string;
  recipient?: string;
  recipientName?: string;
  amount: number;
  fee?: number;
  totalAmount?: number;
  status: 'Success' | 'Pending' | 'Failed' | 'Reversed' | 'success' | 'pending' | 'failed' | 'reversed' | 'delivered' | string;
  paymentMethod?: string;
  method?: string;
  channel?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  description?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  time?: string;
  token?: string;
  unitsPurchased?: number;
  meterNumber?: string;
  meterType?: string;
  network?: string;
  plan?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  senderName?: string;
  user?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  issuedAt?: string;
  generatedAt?: string;
}

export interface GenerateReceiptResponse {
  success?: boolean;
  receipt?: TransactionReceipt;
  data?: TransactionReceipt;
  transaction?: TransactionReceipt;
  message?: string;
  error?: string;
}

