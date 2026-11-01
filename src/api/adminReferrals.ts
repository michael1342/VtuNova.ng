import type { Campaign, FraudRecord, Payout, Referral, RewardConfig } from '../interface/admin.interface';
import { adminGet, adminGetList, adminPatch, adminPost, type AdminQuery } from './adminHttp';

export const getAdminReferrals = (params?: AdminQuery) =>
    adminGetList<Referral>('/referrals', 'referrals', params);

export const getAdminReferralCampaigns = (params?: AdminQuery) =>
    adminGetList<Campaign>('/referrals/campaigns', 'campaigns', params);

export const getAdminReferralPayouts = (params?: AdminQuery) =>
    adminGetList<Payout>('/referrals/payouts', 'payouts', params);

export const getAdminReferralFraudRecords = (params?: AdminQuery) =>
    adminGetList<FraudRecord>('/referrals/fraud-records', 'records', params);

export const getAdminRewardConfig = () =>
    adminGet<RewardConfig>('/referrals/reward-config');

export const createAdminReferralCampaign = (campaign: Omit<Campaign, 'id' | 'participants' | 'spent' | 'conversionRate'>) =>
    adminPost<Campaign>('/referrals/campaigns', campaign);

export const updateAdminReferral = (
    referralId: string,
    changes: Partial<Pick<Referral, 'status' | 'earnings'>>,
) => adminPatch<Referral>(`/referrals/${encodeURIComponent(referralId)}`, changes);

export const updateAdminReferralCampaign = (campaignId: string, status: Campaign['status']) =>
    adminPatch<Campaign>(`/referrals/campaigns/${encodeURIComponent(campaignId)}`, { status });

export const updateAdminReferralPayout = (payoutId: string, status: Payout['status']) =>
    adminPatch<Payout>(`/referrals/payouts/${encodeURIComponent(payoutId)}`, { status });

export const payAdminReferralPayout = (payoutId: string) =>
    adminPost(`/referrals/payouts/${encodeURIComponent(payoutId)}/pay`);

export const updateAdminFraudRecord = (recordId: string, status: FraudRecord['status']) =>
    adminPatch<FraudRecord>(`/referrals/fraud-records/${encodeURIComponent(recordId)}`, { status });

export const updateAdminRewardConfig = (config: RewardConfig) =>
    adminPatch<RewardConfig>('/referrals/reward-config', config);