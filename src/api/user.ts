import http from "./http";
import ApiError from "./ApiError";
import {
  type Beneficiary,
  type User,
  type GetTransactionsResponse,
  type UserApiResponse,
  type TransactionChartResponse
} from "../interface/user.interface";

export const getTransactions = async (): Promise<GetTransactionsResponse> => {
    try {
        const response = await http.get<GetTransactionsResponse>("/users/get-transactions");
        if (!response) return { transactions: [] };
        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, transactions: [] };
        }
        return { success: false, error: (err as any)?.message || 'Failed to fetch transactions', transactions: [] };
    }
};




export const saveBenficiary = async ({ data }: Beneficiary) => {
    try {
        const response = http.post("/users/save-beneficiary", { ...data });
        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
    }
}

export const editBenficiary = async ({ data }: Beneficiary): Promise<any> => {
    try {
        // const id = data._id
        // console.log(id)
        // console.log(data)
        const response = http.patch(`/users/edit-beneficiary/${data._id}`, { ...data });
        console.log(response)
        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            console.log(err.message)
            return { success: false, error: err.message, response: [] };
        }
        // return { success: false, error: err?.message || 'Failed to edit beneficiary' };
    }
}

export const getBenficiary = async () => {
    try {
        const response = await http.get("/users/get-beneficiaries");
        return { data: response, success: true };
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, data: [] };
        }
    }
}

export const deleteBeneficiary = async (id: string) => {
    try {
        const response = http.delete(`/users/delete-beneficiary/${id}`);
        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message };
        }
    }
}

export const uploadProfilePic = async (formData: any) => {
    try {
        const response = await http.patch("/users/upload-profile-pic", formData, { headers: { "Content-Type": "multipart/form-data" } });
        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message, response: [] };
        }
    }
};

export const editProfile = async (data: User) => {
    try {
        const response = await http.patch<UserApiResponse>("/users/update-profile", {...data});
        if(!response) return 
        return {response, success: true, error: ''};
    } catch (err) {
        if(err instanceof ApiError) return {success: false, error: err.message, response: []}
    }
}

export const changePassword = async (data: User): Promise<any | undefined>=> {
    try {
        const response = await http.patch<UserApiResponse>("/auth/change-password", {...data})
        if(!response) return 
        console.log(response)
        return {response, success: true, error: ''};
    } catch (err) {
        if(err instanceof ApiError) return {success: false, error: err.message, response: []}
    }
}

export const getTransactionChart = async (year: number = new Date().getFullYear()): Promise<TransactionChartResponse> => {
    try {
        const response = await http.get<TransactionChartResponse>(`/users/transaction-chart?year=${year}`);
        if (!response) return { success: false, error: 'No data returned' };
        return response;
    } catch (err) {
        if (err instanceof ApiError) {
            return { success: false, error: err.message };
        }
        return { success: false, error: (err as any)?.message || 'Failed to fetch transaction chart data' };
    }
}