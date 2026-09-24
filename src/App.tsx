import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/themeContext'
import { NotificationProvider } from './context/NotificationContext'
// import ProtectedRoute from './utils/protected'
import MainLayout from './components/MainLayout'
import LandingPage from './pages/landingPage'
import Register from './pages/register'
import Dashboard from './pages/user/dashboard'
import BuyAirtime from './pages/user/buyAirtime'
import BuyData from './pages/user/buyData'
import BuyElectricity from './pages/user/buyElectricity'
import BuyCableSubscription from './pages/user/buyCableSubscription'
import FundWallet from './pages/user/fundWallet'
import Transactions from './pages/user/transactions'
import Referrals from './pages/user/referral'
import Notifications from './pages/user/notifications'
import Profile from './pages/user/profile'
import Login from './pages/login'
import VerifyOtp from './pages/verifyOtp'
import Unauthorized from './pages/unauthorized'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/Admin/dashboard'
import AdminUserManagement from './pages/Admin/user'
import AdminTransactions from './pages/Admin/transactions'
import AdminWalletManagement from './pages/Admin/wallet'
import AdminAirtimeOrders from './pages/Admin/airtimeOrders'
import AdminDataOrders from './pages/Admin/dataOrders'
import AdminElectricityPayments from './pages/Admin/electricityPayments'
import AdminCableSubscriptions from './pages/Admin/cableSubscriptions'
import AdminNotifications from './pages/Admin/adminNotifications'
import AdminReferralManagement from './pages/Admin/referralManagement'
import AdminAnalytics from './pages/Admin/adminAnalytics'
import AdminSettings from './pages/Admin/adminSettings'
import AdminSupport from './pages/Admin/adminSupport'
import './App.css'
import type { ProtectedRouteProps } from './interface/components.interface';

// const {currentUser} = useAuth();

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {

  const { currentUser } = useAuth()

  if (!currentUser) {
    //  return navigate('/');
    return (
      <Navigate to="/" replace />
    );
  }

  if (!currentUser.role || !allowedRoles.includes(currentUser.role)) {
    // return navigate('/unauthorized');
    return <Navigate to="/login" replace />;
  }

  return children;
}

// type ProtectedRouteProps = {
//   allowedRoles: string[];
//   children: ReactNode;
// };

// const ProtectedRoute = ({
//   allowedRoles,
//   children,
// }: ProtectedRouteProps) => 


function App() {
  return (
    <>
     <NotificationProvider>
      <AuthProvider>
        <ThemeProvider>
         
            <Router>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route element={<MainLayout />}>
                  <Route index path="/user/dashboard" element={<ProtectedRoute allowedRoles={['user']}>
                    <Dashboard />
                  </ProtectedRoute>} />
                  <Route path="/user/buy/airtime" element={<ProtectedRoute allowedRoles={['user']}>
                    <BuyAirtime />
                  </ProtectedRoute>} />
                  <Route path="/user/buy/data" element={<ProtectedRoute allowedRoles={['user']}>
                    <BuyData />
                  </ProtectedRoute>} />
                  <Route path="/user/buy/electricity" element={<ProtectedRoute allowedRoles={['user']}>
                    <BuyElectricity />
                  </ProtectedRoute>} />
                  <Route path="/user/buy/cable" element={<ProtectedRoute allowedRoles={['user']}>
                    <BuyCableSubscription />
                  </ProtectedRoute>} />
                  <Route path="/user/fund" element={<ProtectedRoute allowedRoles={['user']}>
                    <FundWallet />
                  </ProtectedRoute>} />
                  <Route path="/user/transactions" element={<ProtectedRoute allowedRoles={['user']}>
                    <Transactions />
                  </ProtectedRoute>} />
                  <Route path="/user/referrals" element={<ProtectedRoute allowedRoles={['user']}>
                    <Referrals />
                  </ProtectedRoute>} />
                  <Route path="/user/notifications" element={<ProtectedRoute allowedRoles={['user']}>
                    <Notifications />
                  </ProtectedRoute>} />
                  <Route path="/user/profile" element={<ProtectedRoute allowedRoles={['user']}>
                    <Profile />
                  </ProtectedRoute>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}>
                    <AdminUserManagement />
                  </ProtectedRoute>} />
                  <Route path="/admin/transactions" element={<ProtectedRoute allowedRoles={['admin']}><AdminTransactions /></ProtectedRoute>} />
                  <Route path="/admin/wallet" element={<ProtectedRoute allowedRoles={['admin']}><AdminWalletManagement /></ProtectedRoute>} />
                  <Route path="/admin/services/airtime" element={<ProtectedRoute allowedRoles={['admin']}><AdminAirtimeOrders /></ProtectedRoute>} />
                  <Route path="/admin/services/data" element={<ProtectedRoute allowedRoles={['admin']}><AdminDataOrders /></ProtectedRoute>} />
                  <Route path="/admin/services/electricity" element={<ProtectedRoute allowedRoles={['admin']}><AdminElectricityPayments /></ProtectedRoute>} />
                  <Route path="/admin/services/cable" element={<ProtectedRoute allowedRoles={['admin']}><AdminCableSubscriptions /></ProtectedRoute>} />
                  <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><AdminNotifications /></ProtectedRoute>} />
                  <Route path="/admin/referrals" element={<ProtectedRoute allowedRoles={['admin']}><AdminReferralManagement /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalytics /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
                  <Route path="/admin/support" element={<ProtectedRoute allowedRoles={['admin']}><AdminSupport /></ProtectedRoute>} />
                  <Route path="/admin/roles" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                </Route>
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          
        </ThemeProvider>
      </AuthProvider>
      </NotificationProvider>
    </>
  )
}

export default App
