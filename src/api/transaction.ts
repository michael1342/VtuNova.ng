import http from './http';
import ApiError from './ApiError';
import type { TransactionsResponse } from '../interface/api.interface';

export type { ApiTransaction as Transaction, TransactionsResponse } from '../interface/api.interface';

export const getTransactions = async (): Promise<TransactionsResponse> => {
	try {
		const response = await http.get<TransactionsResponse>('/users/get-transactions');
		return (response as unknown as TransactionsResponse) ?? { transactions: [] };
	} catch (error) {
		if (error instanceof ApiError) {
			return { success: false, error: error.message, transactions: [] };
		}

		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch transactions',
			transactions: [],
		};
	}
};
