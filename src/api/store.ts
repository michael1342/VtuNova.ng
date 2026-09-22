import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../interface/store.interface';
// import {useAuth} from '../context/AuthContext';

// const {currentUser} = useAuth();

export type { StoreUser as User, AuthState } from '../interface/store.interface';


const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      otpId: null,

      setAccessToken: (token) =>
        set({ accessToken: token }),

      setOtpId: (otpId) =>
        set({ otpId: otpId }),

      clearAuth: () =>
        set({
          accessToken: null,
          otpId: null
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);


export default useAuthStore
