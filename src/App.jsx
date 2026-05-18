/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RequestBlood from './pages/RequestBlood';
import Navbar from './components/Navbar';

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user?.role !== role) return <Navigate to="/" />;
  
  return children;
}

import DashboardLayout from './components/DashboardLayout';

function DashboardRoute({ children, role }) {
  return (
    <PrivateRoute role={role}>
      <DashboardLayout>{children}</DashboardLayout>
    </PrivateRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Routes>
            <Route path="/" element={<><Navbar /><LandingPage /></>} />
            <Route path="/login" element={<><Navbar /><LoginPage /></>} />
            <Route path="/signup" element={<><Navbar /><SignupPage /></>} />
            
            <Route path="/dashboard/donor/*" element={
              <DashboardRoute role="DONOR"><DonorDashboard /></DashboardRoute>
            } />
            <Route path="/dashboard/recipient/*" element={
              <DashboardRoute role="RECIPIENT"><RecipientDashboard /></DashboardRoute>
            } />
            <Route path="/dashboard/hospital/*" element={
              <DashboardRoute role="HOSPITAL"><HospitalDashboard /></DashboardRoute>
            } />
            <Route path="/dashboard/admin/*" element={
              <DashboardRoute role="ADMIN"><AdminDashboard /></DashboardRoute>
            } />
            
            <Route path="/request-blood" element={
              <DashboardRoute role="HOSPITAL"><RequestBlood /></DashboardRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
