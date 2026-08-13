
export interface PaymentData {
    amount: number;
    email?: string;
    phone?: string;
    name?: string;
}

export interface Payment {
    amount: number;
}