import { createContext, useState, useContext, useCallback, useEffect, useRef } from "react";
import type { AuthContextType, LoginCredentials, LoginResponse, ProviderProps, RegistrationCredentials } from '../interface/context.interface';
import type { User, UserApiResponse } from '../interface/user.interface';
import http from "../api/http";
import  ApiError  from "../api/ApiError";
import  useAuthStore  from "../api/store";
import {getUser} from "../api/user";
import { googleOAuth as requestGoogleOAuth } from "../api/auth";
import posthog from '../posthog';
import { posthogLog } from '../posthogLogger';

// ── Context ───────────────────────────────────────────────────────────────────

export type { AuthContextType, LoginCredentials, ProviderProps, RegistrationCredentials } from '../interface/context.interface';

const AuthContext =
  createContext<AuthContextType | null>(null);

  const current = await getUser()

export function AuthProvider({ children }: ProviderProps) {
  const [isAuthenticated,  setIsAuthenticated]  = useState(false);
  // const currentUser = useAuthStore((state) => state.currentUser);
  const [currentUser, setCurrentUser] = useState<User | null>(current?.user || null)
  const identifiedUserId = useRef<string | null>(null);

  const identifyUser = useCallback((user: User | null | undefined) => {
    const distinctId = user?._id || user?.id;
    if (!distinctId || identifiedUserId.current === distinctId) return;

    if (identifiedUserId.current) posthog.reset();

    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    posthog.identify(distinctId, {
      ...(user.email ? { email: user.email } : {}),
      ...(name ? { name } : {}),
      ...(user.role ? { role: user.role } : {}),
    });
    identifiedUserId.current = distinctId;
  }, []);

  useEffect(() => {
    identifyUser(currentUser);
  }, [currentUser, identifyUser]);

  // const [accountBalance, setAccountBalance] = useState<number | null>(
  //    currentUser?.wallet?.balance ?? 0
  // );
  const calculated = currentUser?.wallet?.balance - currentUser?.wallet?.reserved
  const accountBalance = calculated
  const setAccountBalance = (balance: number | null) => {
    if (balance === null) return;
    setCurrentUser((user: any) => {
      if (!user || !user.wallet || typeof user.wallet !== 'object') return user;
      return {
        ...user,
        wallet: {
          ...user.wallet,
          balance: balance + (user.wallet.reserved || 0),
        },
      };
    });
  };
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
      identifyUser(response.user);
      setIsAuthenticated(true);
      posthogLog.info('user_authentication_succeeded', { method: 'password' });
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

  const googleOAuth = async (token: string) => {
    const result = await requestGoogleOAuth(token);
    if (!result.success) return result;

    const response = result.response;
    const user = response.user || response.data?.user || response as UserApiResponse['response'];
    const accessToken = response.token || response.data?.token || user.token || null;
    const otpId = response.otpId || response.data?.otpId || user.otpId;

    if (user.email) {
      setCurrentUser(user);
      identifyUser(user);
      setIsAuthenticated(true);
      posthogLog.info('user_authentication_succeeded', { method: 'google' });
      setAccessToken(accessToken);
    }

    return {
      ...result,
      response: {
        ...user,
        ...(otpId ? { otpId } : {}),
        ...(accessToken ? { token: accessToken } : {}),
      },
    };
  };


  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await http.post("/auth/logout");
      posthog.reset();
      identifiedUserId.current = null;
      clearAuth();
      setCurrentUser(null);
      setIsAuthenticated(false);
      return {success: false}
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
    }
  }, [clearAuth]);

  // ── Mock Transactions ────────────────────────────────────────────────────────
  
  return (
  <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, login, register, googleOAuth, logout, currentUser, accountBalance, setAccountBalance, response: currentUser, user: currentUser}}>
    {children}
  </AuthContext.Provider>
  )
}





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
