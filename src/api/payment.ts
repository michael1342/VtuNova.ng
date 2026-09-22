import http from './http'
import ApiError from './ApiError'
import { type Payment } from '../interface/payment.interface'
import type { PaymentInitResponse } from '../interface/api.interface'

export type { PaymentInitResponse } from '../interface/api.interface'

class PaymentApi {
    reference: string = ''
 
    async initializePayment({ amount }: Payment): Promise<PaymentInitResponse> {
        try {
            const response: any = await http.post('/payments/initiate-payment', { amount })
            console.log(response)
            if (response?.data?.reference) {
                this.reference = response.data.reference;
            } 
            return {response, success: true }
        } catch (err: any) {
            if (err instanceof ApiError) {
                return { success: false, error: err.message, response: [] }
            }
            return { success: false, error: err?.message || 'Failed to initialize payment.' }
        }
    }

    async verifyPayment(): Promise<PaymentInitResponse> {
        try {
            const endpoint = this.reference ? `/transactions/verify/${this.reference}` : '/paystack/verify-payment';
            const response: any = await http.post(endpoint)

            if(response?.data?.status === 'success') {
            return { data: response, success: true }
            }

            return { data: response, success: false }
        } catch (err: any) {
            if (err instanceof ApiError) {
                return { success: false, error: err.message, data: [] }
            }
            return { success: false, error: err?.message || 'Failed to verify payment.' }
        }
    }
}

export default new PaymentApi()