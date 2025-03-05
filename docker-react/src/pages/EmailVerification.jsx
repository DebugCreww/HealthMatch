// src/pages/EmailVerification.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Check, AlertCircle, Mail, ArrowLeft } from 'lucide-react';
import Logo from '../components/common/Logo';
import { verifyEmail, resendVerificationEmail } from '../services/authService';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'resend'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    // Se abbiamo un token nell'URL, verifichiamo subito l'email
    if (token) {
      verifyWithToken();
    } else {
      // Altrimenti, mostriamo il form per richiedere un nuovo link
      setStatus('resend');
      setLoading(false);
    }
  }, [token]);
  
  const verifyWithToken = async () => {
    setLoading(true);
    try {
      await verifyEmail(token);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setError(error.message || 'Errore durante la verifica dell\'email. Il link potrebbe essere scaduto o non valido.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendVerification = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Inserisci un indirizzo email valido');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await resendVerificationEmail(email);
      setStatus('resent');
    } catch (error) {
      setError(error.message || 'Si è verificato un errore. Riprova.');
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect al login dopo verifica riuscita
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);
  
  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <Link to="/">
          <Logo color="text-white" />
        </Link>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Verifica Email</h1>
          <p className="text-blue-100 text-sm">
            {status === 'verifying' && 'Stiamo verificando la tua email...'}
            {status === 'success' && 'Email verificata con successo!'}
            {status === 'error' && 'Si è verificato un errore durante la verifica'}
            {status === 'resend' && 'Richiedi un nuovo link di verifica'}
            {status === 'resent' && 'Link di verifica inviato!'}
          </p>
        </div>
        
        <div className="p-6">
          {/* Verificando */}
          {status === 'verifying' && loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Stiamo verificando la tua email...</p>
            </div>
          )}
          
          {/* Verifica riuscita */}
          {status === 'success' && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Email verificata con successo!</h2>
              <p className="mt-2 text-sm text-gray-500">
                Ora puoi accedere al tuo account con le tue credenziali.
                Verrai reindirizzato alla pagina di login tra pochi secondi...
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Vai al login
                </Link>
              </div>
            </div>
          )}
          
          {/* Errore di verifica */}
          {status === 'error' && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Verifica non riuscita</h2>
              <p className="mt-2 text-sm text-gray-500">
                {error || 'Il link di verifica potrebbe essere scaduto o non valido.'}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setStatus('resend')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Richiedi un nuovo link
                </button>
              </div>
            </div>
          )}
          
          {/* Form per richiedere un nuovo link */}
          {status === 'resend' && (
            <form onSubmit={handleResendVerification} className="space-y-4">
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder="nome@esempio.it"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <Link to="/login" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                  <ArrowLeft className="inline-block h-4 w-4 mr-1" />
                  Torna al login
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Invio in corso...' : 'Invia nuovo link'}
                </button>
              </div>
            </form>
          )}
          
          {/* Link inviato con successo */}
          {status === 'resent' && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Link di verifica inviato!</h2>
              <p className="mt-2 text-sm text-gray-500">
                Abbiamo inviato un nuovo link di verifica al tuo indirizzo email.
                Controlla la tua casella di posta (e la cartella spam) e segui le istruzioni nell'email.
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Torna al login
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;