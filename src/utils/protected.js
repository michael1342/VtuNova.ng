import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import react from 'react'

export default function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    //  return ( 
    //  <Navigate to="/" replace />
    // );
     return navigate('/');
    
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // return <Navigate to="/unauthorized" replace />;
    return navigate('/unauthorized');
  }

  return children;
}