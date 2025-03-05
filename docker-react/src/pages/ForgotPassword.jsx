// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Check } from 'lucide-react';
import Logo from '../components/common/Logo';
import { requestPasswordReset, resetPassword } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request', 'reset', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Gestisce la richiesta di reset password
  const handleRequestReset = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Inserisci un indirizzo email valido');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await requestPasswordReset(email);
      setStep('reset');
    } catch (error) {
      setError(error.message || 'Si è verificato un errore durante la richiesta. Riprova.');
    } finally {
      setLoading(false);
    }
  };
  
  // Gestisce il reset della password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('Inserisci il codice di verifica ricevuto via email');
      return;
    }
    
    if (!newPassword) {
      setError('Inserisci una nuova password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('La password deve contenere almeno 8 caratteri');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await resetPassword(token, newPassword);
      setStep('success');
    } catch (error) {
      setError(error.message || 'Si è verificato un errore durante il reset della password. Riprova.');
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
        <div className="bg-blue-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Recupero Password</h1>
          <p className="text-blue-100 text-sm">
            {step === 'request' && 'Inserisci la tua email per ricevere il link di reset password'}
            {step === 'reset' && 'Inserisci il codice di verifica ricevuto via email e la tua nuova password'}
            {step === 'success' && 'Password reimpostata con successo!'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <div className="p-6">
          {/* Step 1: Richiesta reset password */}
          {step === 'request' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
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
                  {loading ? 'Invio in corso...' : 'Invia link di reset'}
                </button>
              </div>
            </form>
          )}
          
          {/* Step 2: Reset password */}
          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  Codice di verifica
                </label>
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Inserisci il codice ricevuto via email"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nuova password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={8}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Conferma password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="pl-10 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  <ArrowLeft className="inline-block h-4 w-4 mr-1" />
                  Indietro
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Reimpostazione...' : 'Reimposta password'}
                </button>
              </div>
            </form>
          )}
          
          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Password reimpostata con successo!</h2>
              <p className="mt-2 text-sm text-gray-500">
                Ora puoi accedere al tuo account utilizzando la nuova password.
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
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;