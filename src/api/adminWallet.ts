import type { PendingAdjustment, WalletAccount } from '../interface/admin.interface';
import { adminGetList, adminPatch, adminPost, type AdminQuery } from './adminHttp';

export type WalletStatus = WalletAccount['status'];
export type WalletAdjustmentType = PendingAdjustment['actionType'];

export const getAdminWallets = (params?: AdminQuery) =>
    adminGetList<WalletAccount>('/wallets', 'wallets', params);

export const getAdminWalletAdjustments = (params?: AdminQuery) =>
    adminGetList<PendingAdjustment>('/wallet-adjustments', 'adjustments', params);

export const createAdminWalletAdjustment = (payload: {
    userId: string;
    actionType: WalletAdjustmentType;
    amount: number;
    reason: string;
    reference?: string;
}) => adminPost<PendingAdjustment>('/wallet-adjustments', payload);

export const reviewAdminWalletAdjustment = (
    adjustmentId: string,
    payload: { status: 'Approved' | 'Rejected'; reason?: string },
) => adminPatch<PendingAdjustment>(`/wallet-adjustments/${encodeURIComponent(adjustmentId)}`, payload);

export const updateAdminWalletStatus = (walletId: string, status: WalletStatus) =>
    adminPatch<WalletAccount>(`/wallets/${encodeURIComponent(walletId)}/status`, { status });