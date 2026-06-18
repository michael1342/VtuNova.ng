import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
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
import Settings from './pages/user/settings'
import Login from './pages/login'
import Unauthorized from './pages/unauthorized'
import './App.css'

// const {currentUser} = useAuth();

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    //  return navigate('/');
    return (
    <Navigate to="/" replace />
    );
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // return navigate('/unauthorized');
     return <Navigate to="/unauthorized" replace />;
  }

  return children;
}


function App() {
  return (
    <>
      <AuthProvider>
      <ThemeProvider>
      <NotificationProvider>
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
            <Route path="/user/settings" element={<ProtectedRoute allowedRoles={['user']}>
              <Settings />
            </ProtectedRoute>} />
          </Route>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
      </NotificationProvider>
      </ThemeProvider>
      </AuthProvider>
    </>
  )
}

export default App
