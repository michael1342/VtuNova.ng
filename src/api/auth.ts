import ApiError from './ApiError';
import http from './http';
import { type User } from '../interface/user.interface';
import type { OtpPayload } from '../interface/api.interface';

export type { OtpPayload } from '../interface/api.interface';

export interface PasswordResetVerificationResponse {
    resetToken: string;
}

export interface ResetPasswordPayload {
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
}

type OtpServiceResponse = User & { success?: boolean; error?: string };

export const verifyOtp = async (data: OtpPayload) => {
    try {
        const response = await http.post<User>("/auth/verify-otp", { ...data });
        if (!response) return
        return { response, success: true, error: '' };
    } catch (err) {
        if (err instanceof ApiError) return { success: false, error: err.message, response: [] }
        return { success: false, error: (err as any)?.message || 'Failed to fetch user data', response: {} as User };
    }
}

export const resendOtp = async (data: OtpPayload) => {
    try {
        console.log('data', data);
        const response = await http.post<User>("/auth/resend-otp", { ...data }) as unknown as OtpServiceResponse;
        if (!response.success) return { success: false, error: response?.error || 'Failed to resend OTP', response: {} as User };
        return { response, success: true, error: '' };
    } catch (err) {
        if (err instanceof ApiError) return { success: false, error: err.message, response: [] }
        return { success: false, error: (err as any)?.message || 'Failed to fetch user data', response: {} as User };
    }
}

export const requestPasswordReset = async (data: OtpPayload) => {
    try {
        const response = await http.post<User>("/auth/forgot-password", { ...data });
        if (!response) return
        return { response, success: true, error: '' };
    } catch (err) {
        if (err instanceof ApiError) return { success: false, error: err.message, response: [] }
        return { success: false, error: (err as any)?.message || 'Failed to fetch user data', response: {} as User };
    }
}

export const verifyPasswordResetOtp = async (data: OtpPayload): Promise<
    | { response: PasswordResetVerificationResponse; success: true; error: '' }
    | { success: false; error: string }
> => {
    try {
        const response = await http.post<PasswordResetVerificationResponse>("/auth/verify-password-reset-otp", { ...data }) as unknown as PasswordResetVerificationResponse;
        return { response, success: true, error: '' };
    } catch (err) {
        if (err instanceof ApiError) return { success: false, error: err.message };
        return { success: false, error: (err as any)?.message || 'Unable to verify the reset code.' };
    }
}

export const resetPassword = async (data: ResetPasswordPayload) => {
    try {
        const response = await http.post<User>("/auth/reset-password", { ...data });
        if (!response) return
        return { response, success: true, error: '' };
    } catch (err) {
        if (err instanceof ApiError) return { success: false, error: err.message, response: [] }
        return { success: false, error: (err as any)?.message || 'Failed to fetch user data', response: {} as User };
    }
}