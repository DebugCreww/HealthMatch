// src/services/authService.js
import { toast } from 'react-toastify';

// Costanti
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

/**
 * Servizio per la gestione dell'autenticazione
 */

// Funzione per il login
export const login = async (email, password, userType) => {
  try {
    // Simulazione di login per lo sviluppo
    if (email === 'dottore@example.com' && password === 'password123' && userType === 'professionista') {
      const userData = {
        id: '789012',
        name: 'Dott. Antonio Bianchi',
        email,
        userType: 'professionista',
        specialty: 'Cardiologia',
        token: 'fake-jwt-token-professionista-12345'
      };
      
      // Salva i dati utente nel localStorage
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      localStorage.setItem(AUTH_TOKEN_KEY, userData.token);
      
      return userData;
    } 
    else if (email === 'paziente@example.com' && password === 'password123' && userType === 'paziente') {
      const userData = {
        id: '123456',
        name: 'Mario Rossi',
        email,
        userType: 'paziente',
        token: 'fake-jwt-token-paziente-12345'
      };
      
      // Salva i dati utente nel localStorage
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      localStorage.setItem(AUTH_TOKEN_KEY, userData.token);
      
      return userData;
    }
    else {
      throw new Error('Credenziali non valide');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Credenziali non valide. Riprova.');
  }
};

// Funzione per la registrazione
export const register = async (userData) => {
  try {
    // Simulazione registrazione
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
      token: `fake-jwt-token-${userData.userType}-${Date.now()}`
    };
    
    // In un'implementazione reale, qui la password verrebbe hashata sul server
    
    toast.success("Registrazione completata! Ora puoi accedere.");
    return newUser;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Errore durante la registrazione');
  }
};

// Funzione per il logout
export const logout = () => {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Verifica se l'utente è autenticato
export const isAuthenticated = () => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return !!token;
};

// Ottieni dati utente corrente
export const getCurrentUser = () => {
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Verifica se l'utente è un professionista
export const isProfessional = () => {
  const user = getCurrentUser();
  return user?.userType === 'professionista';
};

// Esporta il servizio completo
export default { login, register, logout, isAuthenticated, getCurrentUser, isProfessional };