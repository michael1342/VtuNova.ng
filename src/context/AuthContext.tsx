import { createContext, useState, useContext, useCallback } from "react";
import type { AuthContextType, LoginCredentials, LoginResponse, ProviderProps, RegistrationCredentials } from '../interface/context.interface';
import type { UserApiResponse } from '../interface/user.interface';
import http from "../api/http";
import  ApiError  from "../api/ApiError";
import  useAuthStore  from "../api/store";
import {getUser} from "../api/user";

// ── Context ───────────────────────────────────────────────────────────────────

export type { AuthContextType, LoginCredentials, ProviderProps, RegistrationCredentials } from '../interface/context.interface';

const AuthContext =
  createContext<AuthContextType | null>(null);

  const current = await getUser()

export function AuthProvider({ children }: ProviderProps) {
  const [isAuthenticated,  setIsAuthenticated]  = useState(false);
  // const currentUser = useAuthStore((state) => state.currentUser);
  const [currentUser, setCurrentUser] = useState<any | null>(current?.user)
  // const [accountBalance, setAccountBalance] = useState<number | null>(
  //    currentUser?.wallet?.balance ?? 0
  // );
  const accountBalance = currentUser?.wallet?.balance ?? 0
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setOtpId = useAuthStore((state) => state.setOtpId);

  // ── Register ────────────────────────────────────────────────────────────────
  const register = async ({
    email,
    firstName,
    lastName,
    password,
    phone,
    role,
    referralCode,
  }: RegistrationCredentials): Promise<any> => {
    try {
      const payload: Record<string, any> = {
        email,
        firstName,
        lastName,
        password,
      };
      if (phone) payload.phone = phone;
      if (role) payload.role = role;
      if (referralCode) payload.referralCode = referralCode;

      const response: any = await http.post('/auth/register', payload);
      console.log('Register response:', response);

      const user = response?.user || response?.data?.user;
      const token = response?.token || response?.data?.token;
      const otpId = response?.otpId || response?.data?.otpId;
      if (user) {
        setIsAuthenticated(true);
        setOtpId(otpId || null);
      }

      return { response, success: true, user, token, otpId };
    } catch (error: any) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
      return { success: false, error: error?.message || 'Registration failed. Please try again.' };
    }
  };


    // ── Login ────────────────────────────────────────────────────────────────────
 const login = async ({ email, password }: LoginCredentials) => {
    try {
      const response = await http.post<LoginResponse>("/auth/login", {
        email,
        password,
      }) as unknown as LoginResponse;
console.log(response)
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      setAccessToken(response.token ?? null);

      if (response.token) {
        setAccessToken(response.token);
      }

      return {response, success: true};
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          error: error.message,
        };
      }
    }
  }

  

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await http.post("/auth/logout");
     clearAuth();
      setIsAuthenticated(false);
      return {success: false}
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
    }
  }, []);

  // ── Mock Transactions ────────────────────────────────────────────────────────
  
  return (
  <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, login, register, logout, currentUser, accountBalance, response: currentUser, user: currentUser}}>
    {children}
  </AuthContext.Provider>
  )
}





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
