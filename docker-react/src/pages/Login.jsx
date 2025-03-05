import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import LoginHeader from '../components/auth/LoginHeader';
import { login } from '../services/auth';
import Logo from '../components/common/Logo';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      // Chiamata al servizio di autenticazione
      const user = await login(userData.email, userData.password, userData.userType);
      
      // Reindirizzamento in base al tipo di utente
      if (user.userType === 'paziente') {
        navigate('/Dashboard/paziente');
      } else {
        navigate('/Dashboard/professionista');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Credenziali non valide. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link to="/">
          <Logo color="text-white" />
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <LoginHeader />
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        <LoginForm onSubmit={handleLogin} isLoading={loading} />
      </div>
    </div>
  );
};

export default Login;