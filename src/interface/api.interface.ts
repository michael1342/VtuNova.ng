export interface OtpPayload {
  email: string;
  otp?: string;
  otpId?: string;
}

export interface PaymentInitResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  response?: unknown;
}

export interface VtuResponse {
  success: boolean;
  error?: string;
  message?: string;
  response: any;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

export interface PaymentAuthorizationResponse {
  authorization_url?: string;
  data?: { authorization_url?: string };
}

export interface ApiTransaction {
  _id: string;
  service?: string;
  amount?: number;
  status?: string;
  date?: string;
  [key: string]: unknown;
}

export interface TransactionsResponse {
  success?: boolean;
  transactions: ApiTransaction[];
  total?: number;
  count?: number;
  message?: string;
  error?: string;
}
