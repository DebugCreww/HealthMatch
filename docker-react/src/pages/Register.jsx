import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import RegisterHeader from '../components/auth/RegisterHeader';
import Logo from '../components/common/Logo';
import { register } from '../services/auth';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleRegister = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      // Chiamata al servizio di registrazione
      const user = await register(userData);
      
      alert("Registrazione avvenuta con successo! Ora puoi accedere.");
      
      // Reindirizzamento alla pagina di login dopo la registrazione
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message || 'Si è verificato un errore durante la registrazione. Riprova.');
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
        <RegisterHeader />
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        <RegisterForm onSubmit={handleRegister} isLoading={loading} />
      </div>
    </div>
  );
};

export default Register;