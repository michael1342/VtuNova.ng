import type {
    FailedNotification,
    NotificationActivityLog,
    NotificationCampaign,
    NotificationTemplate,
} from '../interface/admin.interface';
import { adminGetList, adminPatch, adminPost, type AdminQuery } from './adminHttp';

export const getAdminCampaigns = (params?: AdminQuery) =>
    adminGetList<NotificationCampaign>('/notifications/campaigns', 'campaigns', params);

export const getAdminNotificationFailures = (params?: AdminQuery) =>
    adminGetList<FailedNotification>('/notifications/failures', 'failures', params);

export const getAdminNotificationTemplates = (params?: AdminQuery) =>
    adminGetList<NotificationTemplate>('/notifications/templates', 'templates', params);

export const getAdminNotificationActivity = (params?: AdminQuery) =>
    adminGetList<NotificationActivityLog>('/notifications/activity', 'activity', params);

export const createAdminCampaign = (campaign: Omit<NotificationCampaign, 'id' | 'sentCount' | 'timeline'>) =>
    adminPost<NotificationCampaign>('/notifications/campaigns', campaign);

export type SendAdminNotificationPayload = { userId: string; title: string; message: string };

export const sendAdminNotification = (payload: SendAdminNotificationPayload) =>
    adminPost('/notifications', payload);

export const updateAdminCampaignStatus = (
    campaignId: string,
    status: NotificationCampaign['status'],
) => adminPatch<NotificationCampaign>(`/notifications/campaigns/${encodeURIComponent(campaignId)}/status`, { status });

export const retryAdminNotification = (notificationId: string) =>
    adminPost(`/notifications/failures/${encodeURIComponent(notificationId)}/retry`);