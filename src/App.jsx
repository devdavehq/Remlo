import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import InvitePage from './pages/InvitePage'
import DashboardPage from './pages/DashboardPage'

import { ToastProvider } from './toast/ToastProvider'
import { useEffect } from "react";


export default function App() {
  useEffect(() => {
    const initCSRF = async () => {
      try {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/sanctum/csrf-cookie`, {
          credentials: "include",
        });
      } catch (err) {
        console.log("CSRF init failed:", err);
      }
    };

    initCSRF();
  }, []);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/forgot' element={<ForgotPasswordPage />} />
          <Route path='/invite' element={<InvitePage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
