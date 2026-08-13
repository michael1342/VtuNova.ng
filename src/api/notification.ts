import http from './http'
import ApiError from './ApiError'


export const getNotifications = async () => {
    try {
        const response = await http.get("/notifications/get-notifications");
        if(!response) throw new ApiError({message: 'No notifications found'})
        if(!response) return null
        return { data: response, success: true };
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, data: [] };
        }
    }
}

export const clearNotifications = async () => {
    try {
        const response = await http.delete("/notifications/clear-notifications");
        return { data: response, success: true };
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, data: [] };
        }
    }
}

export const readNotification = async (): Promise<any | undefined> => {
    try {
        const response = await http.patch(`/notifications/read-notification`);
        if (!response) return null
        return { data: response, success: true };
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, data: [] };
        }
    }
}

export const readOneNotification = async (id: string): Promise<any | undefined> => {
    try {
        const response = await http.patch(`/notifications/read-one-notification/${id}`)
        if (!response) return null
        return { data: response, success: true}
    } catch (err) {
        if(err instanceof ApiError) return {success: false, error: err.message, data: []}
    }
}

export const markOneAsUnread = async (id: string): Promise<any | undefined> => {
    try {
        const response = await http.patch(`/notifications/unread-notification/${id}`)
        if (!response) return null
        return { data: response, success: true}
    } catch (err) {
        if(err instanceof ApiError) return {success: false, error: err.message, data: []}
    }
}

export const deleteNotification = async (id: string): Promise<any | undefined> => {
    try {
        const response = await http.delete(`/notifications/delete-notification/${id}`);
        if (!response) return null
        return { data: response, success: true };
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, data: [] };
        }
    }
}