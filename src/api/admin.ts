import type {
    AdminTransaction,
    RefundRequest,
    UserAccount,
    UserActivityEvent,
} from '../interface/admin.interface';
import { adminDelete, adminGet, adminGetList, adminPatch, adminPost, type AdminQuery } from './adminHttp';
import http from './http';

export type CreateAdminUserPayload = Pick<
    UserAccount,
    'firstName' | 'lastName' | 'email' | 'phone' | 'role'
>;

export type UpdateAdminUserPayload = Partial<
    Pick<
        UserAccount,
        | 'firstName'
        | 'lastName'
        | 'phone'
        | 'role'
        | 'status'
        | 'emailVerified'
        | 'phoneVerified'
        | 'identityVerified'
        | 'verificationStatus'
    >
>;

export const getAdminUsers = (params?: AdminQuery) =>
    adminGetList<UserAccount>('/users', 'users', params);

export const getAdminUserCount = () => adminGet<number>('/counts/users');

export const getAdminTransactionCount = () => adminGet<number>('/counts/transactions');

export const getAdminPendingReviewCount = () => adminGet<number>('/counts/pending-review');

export const getAdminSuspendedCount = () => adminGet<number>('/counts/suspended');

export const getAdminNewUsersCount = () => adminGet<number>('/counts/new-users');

export const createAdminUser = (payload: CreateAdminUserPayload) =>
    adminPost<UserAccount>('/users', payload);

export const updateAdminUser = (userId: string, payload: UpdateAdminUserPayload) =>
    adminPatch<UserAccount>(`/users/update/${encodeURIComponent(userId)}`, payload);

export const suspendUser = (userId: string) =>
    adminPatch<UserAccount>(`/users/suspend/${encodeURIComponent(userId)}`);

export const activateUser = (userId: string) =>
    adminPatch<UserAccount>(`/users/activate/${encodeURIComponent(userId)}`);

export const deleteAdminUser = (userId: string) =>
    adminDelete(`/users/delete/${encodeURIComponent(userId)}`);

export const getAdminUserActivity = (userId: string) =>
    adminGet<UserActivityEvent[]>(`/users/${encodeURIComponent(userId)}/activity`);

export const adjustAdminUserWallet = (
    userId: string,
    payload: { action: 'credit' | 'debit'; amount: number; reason: string },
) => adminPatch('/wallet-adjustments', { userId, actionType: payload.action === 'credit' ? 'Credit' : 'Debit', amount: payload.amount, reason: payload.reason });

export const sendAdminUserNotification = (
    userId: string,
    payload: { title: string; message: string },
) => adminPost(`/users/${encodeURIComponent(userId)}/notifications`, payload);

export const getAdminTransactions = (params?: AdminQuery) =>
    adminGetList<AdminTransaction>('/transactions', 'transactions', params);

export const getAdminRefundRequests = (params?: AdminQuery) =>
    adminGetList<RefundRequest>('/refund-requests', 'refundRequests', params);

export const reviewAdminRefundRequest = (
    requestId: string,
    payload: { status: 'Approved' | 'Rejected'; reason?: string },
) => adminPatch<RefundRequest>(`/refund-requests/${encodeURIComponent(requestId)}`, payload);