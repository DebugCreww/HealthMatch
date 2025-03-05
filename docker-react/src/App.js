import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import ProfessionalDashboard from './pages/Dashboard/ProfessionalDashboard';
import SearchPage from './pages/Search/index';
import { isAuthenticated, isProfessional } from './services/auth';
import './index.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Chiave pubblica di Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Componente per rotte protette
const ProtectedRoute = ({ element, allowedUserType }) => {
  const user = JSON.parse(localStorage.getItem('authUser') || '{}');
  const authenticated = isAuthenticated();
  const hasCorrectRole = !allowedUserType || user.userType === allowedUserType;
  
  return authenticated && hasCorrectRole ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<SearchPage />} />
          <Route 
            path="/dashboard/paziente" 
            element={<ProtectedRoute element={<PatientDashboard />} allowedUserType="paziente" />} 
          />
          <Route 
            path="/dashboard/professionista" 
            element={<ProtectedRoute element={<ProfessionalDashboard />} allowedUserType="professionista" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Elements>
    </Router>
  );
}

export default App;