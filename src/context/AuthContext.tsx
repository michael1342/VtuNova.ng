import { createContext, useState, useContext, useCallback, type ReactNode } from "react";

const ACCOUNT_KEY = "swiftTopup_key";
const SESSION_KEY = "swiftTopup_session";

type stringInfo = {
  id?: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role?: string;
  username?: string;
  createdAt?: string;
}

const saveAccount = (accounts: stringInfo[]) => {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
};

const getAccount = (): stringInfo[] => {
    try {
        return JSON.parse(localStorage.getItem(ACCOUNT_KEY) || "[]");
    } catch (error) {
        console.error("Error parsing account from localStorage:", error);
        return [];
    }
  }

const getSession = () => {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
};
 type sessionUser = Omit<stringInfo, 'password'>
const saveSession  = (user: sessionUser) => localStorage.setItem(SESSION_KEY, JSON.stringify(user));
const clearSession = ()     => localStorage.removeItem(SESSION_KEY);

// ── Context ───────────────────────────────────────────────────────────────────

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (credentials: { email: string; password?: string }) => { success: boolean; error?: string ; user?: any };
  register: (user: stringInfo) => { success: boolean; error?: string; user?: any };
  logout: () => void;
  currentUser: Omit<stringInfo, 'password'> | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<Omit<stringInfo, 'password'> | null>>;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

type Node = {
  children: ReactNode;
}

export function AuthProvider({ children }: Node) {
  // Rehydrate from localStorage on first load
  const [currentUser,      setCurrentUser]      = useState(() => getSession());
  const [isAuthenticated,  setIsAuthenticated]  = useState(() => !!getSession());

  // ── Register ────────────────────────────────────────────────────────────────
  const register = useCallback(({ email, password, firstName, lastName, role }: stringInfo) => {
//   type Account = {
//   id: string;
//   balance: number;
//   email: string
// };

const accounts: stringInfo[] = getAccount();

    // Validate uniqueness
    if (accounts.find(a => a.email?.toLowerCase() === email?.toLowerCase())) {
      return { success: false, error: 'An account with that email already exists.' };
    }

    const newUser = {
      id:         `u_${Date.now()}`,
      email:      email.trim().toLowerCase() || '',
      password,                                   // NOTE: plaintext only for demo
      firstName:  firstName|| 'User',
      lastName:   lastName  || '',
      username:   email.split('@')[0].replace(/[^a-z0-9_]/gi, '_').toLowerCase() || '',
      role: role?.trim().toLowerCase() || 'user',
      createdAt:  new Date().toISOString(),
    };

    // type sessionUser = Omit<stringInfo, 'password'>
    saveAccount([...accounts, newUser]);
     // Strip password before storing in session
    const { password: _pw, ...sessionUser } = newUser;
    saveSession(sessionUser);
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
    }, []);


    // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(({ email, password }: { email: string; password?: string }) => {
    const accounts = getAccount();
    const found    = accounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { password: _pw, ...sessionUser } = found;
    saveSession(sessionUser);
    setCurrentUser(sessionUser);
    setIsAuthenticated(true);
    return { success: true, user: sessionUser };
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    clearSession();
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Mock Transactions ────────────────────────────────────────────────────────

// const MOCK_TRANSACTIONS: Transaction[] = [
//   {
//     id: 'txn_2024_001',
//     refNo: 'RPT20240613_001',
//     service: 'Buy Data',
//     recipient: '08034457821',
//     amount: 500,
//     fee: 50,
//     status: 'Success',
//     date: '2024-06-13',
//     time: '08:15:32',
//     details: {
//       provider: 'MTN',
//       plan: '500MB',
//     },
//   },
//   {
//     id: 'txn_2024_002',
//     refNo: 'RPT20240613_002',
//     service: 'Buy Airtime',
//     recipient: '08029845673',
//     amount: 1000,
//     fee: 25,
//     status: 'Pending',
//     date: '2024-06-13',
//     time: '09:22:45',
//     details: {
//       provider: 'GLO',
//     },
//   },
//   {
//     id: 'txn_2024_003',
//     refNo: 'RPT20240612_003',
//     service: 'Buy Electricity',
//     recipient: '1234567890',
//     amount: 5000,
//     fee: 100,
//     status: 'Failed',
//     date: '2024-06-12',
//     time: '14:30:12',
//     details: {
//       provider: 'AEDC',
//     },
//   },
//   {
//     id: 'txn_2024_004',
//     refNo: 'RPT20240612_004',
//     service: 'Buy Cable Subscription',
//     recipient: '9876543210',
//     amount: 4500,
//     fee: 0,
//     status: 'Success',
//     date: '2024-06-12',
//     time: '18:45:00',
//     details: {
//       provider: 'DSTV',
//       plan: 'Yanga',
//     },
//   },
//   {
//     id: 'txn_2024_005',
//     refNo: 'RPT20240611_005',
//     service: 'Buy Data',
//     recipient: '09032345678',
//     amount: 2000,
//     fee: 50,
//     status: 'Reversed',
//     date: '2024-06-11',
//     time: '11:20:30',
//     details: {
//       provider: 'AIRTEL',
//       plan: '1GB',
//     },
//   },
// ];
  
  return (
  <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, login, register, logout, currentUser, setCurrentUser}}>
    {children}
  </AuthContext.Provider>
  )
}





export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
