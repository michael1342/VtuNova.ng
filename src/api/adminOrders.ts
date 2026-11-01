import type {
    AirtimeOrder,
    CableSubscription,
    DataOrder,
    ElectricityPayment,
    AdminOrderStatus,
} from '../interface/admin-orders.interface';
import { adminGetList, adminPatch, adminPost, type AdminQuery } from './adminHttp';

export const getAdminAirtimeOrders = (params?: AdminQuery) =>
    adminGetList<AirtimeOrder>('/orders/airtime', 'orders', params);

export const getAdminDataOrders = (params?: AdminQuery) =>
    adminGetList<DataOrder>('/orders/data', 'orders', params);

export const getAdminCableSubscriptions = (params?: AdminQuery) =>
    adminGetList<CableSubscription>('/orders/cable', 'subscriptions', params);

export const getAdminElectricityPayments = (params?: AdminQuery) =>
    adminGetList<ElectricityPayment>('/orders/electricity', 'payments', params);

export const updateAdminOrderStatus = (orderId: string, status: AdminOrderStatus) =>
    adminPatch(`/orders/${encodeURIComponent(orderId)}/status`, { status });

export const retryAdminOrder = (orderId: string) =>
    adminPost(`/orders/${encodeURIComponent(orderId)}/retry`);