import type { SupportTicket, TicketMessage } from '../interface/admin.interface';
import { adminGet, adminGetList, adminPatch, adminPost, type AdminQuery } from './adminHttp';

export const getAdminSupportTickets = (params?: AdminQuery) =>
    adminGetList<SupportTicket>('/support/tickets', 'tickets', params);

export const getAdminTicketMessages = (ticketId: string) =>
    adminGetList<TicketMessage>(`/support/tickets/${encodeURIComponent(ticketId)}/messages`, 'messages');

export const createAdminSupportTicket = (ticket: Pick<
    SupportTicket,
    'customerEmail' | 'subject' | 'description' | 'category'
>) => adminPost<SupportTicket>('/support/tickets', ticket);

export const updateAdminSupportTicket = (
    ticketId: string,
    changes: Partial<Pick<SupportTicket, 'status' | 'assignedTo'>>,
) => adminPatch<SupportTicket>(`/support/tickets/${encodeURIComponent(ticketId)}`, changes);

export const sendAdminTicketReply = (
    ticketId: string,
    reply: { message?: string; internalNote?: string; status: SupportTicket['status']; assignedTo?: string },
) => adminPost(`/support/tickets/${encodeURIComponent(ticketId)}/messages`, reply);