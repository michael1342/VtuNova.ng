import { getTransactions } from "../api/user";
import { type Transaction } from "../interface/user.interface";

const transactions = await getTransactions();

export const totalTransactions = (): number => {
    return transactions?.transactions?.length ?? 0;
};

export const totalSuccessfulTransactions = (): number => {
    return (transactions?.transactions ?? []).filter((transaction: Transaction) => (transaction.status || '').toLowerCase() === 'success').length;
};

export const totalAmountSpent = (): number => {
    const successfulTransactions = (transactions?.transactions ?? []).filter((transaction: Transaction) => (transaction.service || '').toLowerCase() !== 'deposit' && (transaction.status || '').toLowerCase() === 'success');
    return successfulTransactions.reduce((total: number, transaction: Transaction) => total + (transaction.amount || 0), 0);
};

export const totalAmountReceived = (): number => {
    const successfulTransactions = (transactions?.transactions ?? []).filter((transaction: Transaction) => (transaction.status || '').toLowerCase() === 'success');
    return successfulTransactions.reduce((total: number, transaction: Transaction) => total + (transaction.amount || 0), 0);
};


