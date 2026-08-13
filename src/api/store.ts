import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import {useAuth} from '../context/AuthContext';

// const {currentUser} = useAuth();

export interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   phone: string;
   walletBalance: number;
   transactionsCount: number;
   verificationStatus: 'Verified' | 'Pending' | 'Unverified';
   status: string;
   role: string;
   joinedDate: string;
   emailVerified: boolean;
   phoneVerified: boolean;
   identityVerified: boolean;
   identityDocUrl?: string;
   wallet: any;
   referralCode: string;
   referrals: any;
   notifications: any;
   transactions: any;
   isActive: boolean;
   createdAt: string;
   token: string
}

interface AuthState {
  accessToken: string | null;
  currentUser: User | null;
  accountBalance: number | null;
  setAccessToken: (token: string | null) => void;
  setCurrentUser: (user: User) => void;
  setAccountBalance: (amount: number | null) => void;
  clearAuth: () => void;
}


const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      currentUser: null,
      accountBalance: null,

      setAccessToken: (token) =>
        set({ accessToken: token }),

      setCurrentUser: (user) =>
        set({ currentUser: user }),

      setAccountBalance: (amount) =>
        set({accountBalance: amount}),

      clearAuth: () =>
        set({
          accessToken: null,
          currentUser: null,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);


export default useAuthStore
