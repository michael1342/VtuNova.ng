import { createContext, useState, useContext, useCallback, type ReactNode } from "react";
import http from "../api/http";
import  ApiError  from "../api/ApiError";
import  useAuthStore  from "../api/store";
import {type User} from "../api/store";

// ── Context ───────────────────────────────────────────────────────────────────

type stringInfo = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type loginInfo = {
  email: string;
  password: string;
};

interface LoginResponse {
  user: User;
  token?: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: User | null;
  accountBalance: number | null;
  response: User | null;
  user: User | null;
  setAccountBalance: (amount: number | null) => void;
  register: (credentials: stringInfo) => Promise<any>;
  login: (credentials: loginInfo) => Promise<any>;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

type Node = {
  children: ReactNode;
}

// const getProfile = async (): Promise<LoginResponse | any> => {
//     try {
//       const response = await http.get("/auth/profile");
//       return response?.user
//     } catch (error) {
//       if (error instanceof ApiError) {
//         return { success: false, error: error.message };
//       }
//     }
//   };
//   const currentUser = await getProfile()
//   console.log(currentUser)

export function AuthProvider({ children }: Node) {
  const [isAuthenticated,  setIsAuthenticated]  = useState(false);
  const currentUser = useAuthStore((state) => state.currentUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser)
  const setAccountBalance = useAuthStore((state) => state.setAccountBalance)
  const accountBalance = useAuthStore((state) => state.accountBalance);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const accessToken = useAuthStore((state) => state.accessToken);

  // ── Register ────────────────────────────────────────────────────────────────
  const register =  async ({email, firstName, lastName, password}: stringInfo): Promise<any> => {
      try {
        const response = http.post('/auth/register', {email, firstName, lastName, password});
        return response
      } catch (error) {
        if(error instanceof ApiError) {
          return {success: false, error: error.message}
          // console.log(error.message)
        }
      }
    };


    // ── Login ────────────────────────────────────────────────────────────────────
 const login = async ({ email, password }: loginInfo) => {
    try {
      const response = await http.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      console.log(response)
      const { token, user}: any = response

      setAccessToken(token);
      setCurrentUser(user);
      setAccountBalance(user.wallet.balance);
      setIsAuthenticated(true);

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
    } catch (error) {
      if (error instanceof ApiError) {
        return { success: false, error: error.message };
      }
    }
  }, []);

  // ── Mock Transactions ────────────────────────────────────────────────────────
  
  return (
  <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, login, register, logout, currentUser, accountBalance, setAccountBalance}}>
    {children}
  </AuthContext.Provider>
  )
}





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
