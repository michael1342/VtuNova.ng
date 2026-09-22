import ApiError from './ApiError';
import http from './http';
import { type User } from '../interface/user.interface';
import type { OtpPayload } from '../interface/api.interface';

export type { OtpPayload } from '../interface/api.interface';

export const verifyOtp = async (data: OtpPayload) => {
    try {
        const response = await http.post<User>("/auth/verify-otp", {...data});
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if(err instanceof ApiError) return {success: false, error: err.message, response: []}
        return {success: false, error: (err as any)?.message || 'Failed to fetch user data', response: {} as User };
    }
}

export const resendOtp = async (data: OtpPayload) => {
    try {
        const response = await http.post<User>("/auth/resend-otp", {...data});
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if(err instanceof ApiError) return {success: false, error: err.message, response: []}
        return {success: false, error: (err as any)?.message || 'Failed to fetch user data', response: {} as User };
    }
}