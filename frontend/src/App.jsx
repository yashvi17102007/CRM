import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login'; 
import SignUp from './SignUp'; // Signup page import kiya
import ReceptionDash from './pages/ReceptionDash';
import CounsellorDash from './pages/CounsellorDash';
import SalesDash from './pages/SalesDash';
import OwnerDash from './pages/OwnerDash';

// ProtectedRoute Logic: Sirf login aur sahi role wale users ko andar jane dega
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Access Denied: Aapko is page ki permission nahi hai!</h1>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Sabke liye open hain */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<SignUp />} />

        {/* Private Routes - Role ke basis par entry milegi */}
        <Route 
          path="/reception-dash" 
          element={
            <ProtectedRoute allowedRoles={['receptionist', 'owner']}>
              <ReceptionDash />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/counsellor-dash" 
          element={
            <ProtectedRoute allowedRoles={['counsellor', 'owner']}>
              <CounsellorDash />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/sales-dash" 
          element={
            <ProtectedRoute allowedRoles={['sales', 'owner']}>
              <SalesDash />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/owner-dash" 
          element={
            <ProtectedRoute allowedRoles={['owner']}>
              <OwnerDash />
            </ProtectedRoute>
          } 
        />

        {/* 404 Page - Galat URL par ye dikhega */}
        <Route path="*" element={<h2 style={{ textAlign: 'center', marginTop: '50px' }}>404: Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;