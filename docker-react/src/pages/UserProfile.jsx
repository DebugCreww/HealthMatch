// src/pages/Profile/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, 
  Calendar, Lock, Shield, 
  Camera, Save, X
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getCurrentUser, updateUserProfile, changePassword, isAuthenticated, logout } from '../../services/authService';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Italia',
    birthDate: '',
    gender: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    shareProfile: false,
    shareHealthData: false,
    receiveEmails: true,
    receiveSMS: false,
    twoFactorAuth: false
  });
  
  // Carica i dati dell'utente
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const userData = getCurrentUser();
    if (!userData) {
      navigate('/login');
      return;
    }
    
    setUser(userData);
    
    // Popola il form con i dati utente
    setFormData({
      name: userData.name || '',
      surname: userData.surname || '',
      email: userData.email || '',
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      postalCode: userData.postalCode || '',
      country: userData.country || 'Italia',
      birthDate: userData.birthDate || '',
      gender: userData.gender || ''
    });
    
    // In un'app reale, qui caricheremmo anche le impostazioni privacy dal server
    // Per ora usiamo valori predefiniti
  }, [navigate]);
  
  // Gestisce gli aggiornamenti dei campi nei form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Salva le informazioni personali
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser);
      toast.success('Informazioni personali aggiornate con successo!');
    } catch (error) {
      toast.error('Errore durante l\'aggiornamento del profilo');
    } finally {
      setLoading(false);
    }
  };
  
  // Cambia la password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Le password non coincidono');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('La password deve contenere almeno 8 caratteri');
      return;
    }
    
    setLoading(true);
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Svuota i campi dopo il cambio
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password aggiornata con successo!');
    } catch (error) {
      toast.error('Errore durante il cambio password');
    } finally {
      setLoading(false);
    }
  };
  
  // Salva le impostazioni privacy
  const handlePrivacySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In un'app reale, qui invieremmo i dati al server
      // Per ora, simuliamo una chiamata di successo
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success('Impostazioni privacy aggiornate con successo!');
    } catch (error) {
      toast.error('Errore durante l\'aggiornamento delle impostazioni');
    } finally {
      setLoading(false);
    }
  };
  
  // Gestisce la chiusura dell'account
  const handleCloseAccount = () => {
    if (window.confirm('Sei sicuro di voler chiudere il tuo account? Questa azione non può essere annullata.')) {
      // In un'app reale, qui invieremmo una richiesta al server
      // Per ora, facciamo logout
      logout();
      navigate('/');
      toast.info('Il tuo account è stato chiuso');
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="relative mb-4">
                    <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                    <button 
                      className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-gray-300 shadow-sm"
                      title="Cambia foto profilo"
                    >
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <h2 className="text-lg font-medium">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                
                <div className="space-y-1">
                  <button
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'personal' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('personal')}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Informazioni personali
                  </button>
                  <button
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'security' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('security')}
                  >
                    <Lock className="mr-3 h-5 w-5" />
                    Sicurezza e password
                  </button>
                  <button
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeTab === 'privacy' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('privacy')}
                  >
                    <Shield className="mr-3 h-5 w-5" />
                    Privacy
                  </button>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button 
                    className="w-full text-left text-sm text-red-600 hover:text-red-800 flex items-center"
                    onClick={handleCloseAccount}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Chiudi il mio account
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="bg-white shadow rounded-lg">
                {/* Tab: Informazioni personali */}
                {activeTab === 'personal' && (
                  <form onSubmit={handlePersonalInfoSubmit}>
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Informazioni personali</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Aggiorna i tuoi dati personali e le informazioni di contatto.
                      </p>
                      
                      <div className="mt-6 grid grid-cols-6 gap-6">
                        {/* Nome */}
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Nome
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        {/* Cognome */}
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                            Cognome
                          </label>
                          <input
                            type="text"
                            name="surname"
                            id="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        {/* Email */}
                        <div className="col-span-6 sm:col-span-4">
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              disabled
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">L'email non può essere modificata.</p>
                        </div>
                        
                        {/* Telefono */}
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Telefono
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="phone"
                              id="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        {/* Data di nascita */}
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                            Data di nascita
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="date"
                              name="birthDate"
                              id="birthDate"
                              value={formData.birthDate}
                              onChange={handleChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        {/* Genere */}
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                            Genere
                          </label>
                          <select
                            id="gender"
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Seleziona</option>
                            <option value="M">Maschio</option>
                            <option value="F">Femmina</option>
                            <option value="O">Altro</option>
                          </select>
                        </div>
                        
                        {/* Indirizzo */}
                        <div className="col-span-6">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Indirizzo
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="address"
                              id="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </div>
                        
                        {/* Città */}
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            Città
                          </label>
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        {/* Codice postale */}
                        <div className="col-span-6 sm:col-span-3">
                          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                            Codice postale
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <span className="mr-2">Salvataggio...</span>
                            <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Salva modifiche
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
                
                {/* Tab: Sicurezza e password */}
                {activeTab === 'security' && (
                  <form onSubmit={handlePasswordSubmit}>
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Sicurezza e password</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Aggiorna la tua password e le impostazioni di sicurezza.
                      </p>
                      
                      <div className="mt-6 space-y-6">
                        {/* Password corrente */}
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                            Password attuale
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            required
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        
                        {/* Nuova password */}
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                            Nuova password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            required
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            minLength={8}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            La password deve contenere almeno 8 caratteri.
                          </p>
                        </div>
                        
                        {/* Conferma password */}
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            Conferma nuova password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            required
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            minLength={8}
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? 'Aggiornamento...' : 'Aggiorna password'}
                      </button>
                    </div>
                  </form>
                )}
                
                {/* Tab: Privacy */}
                {activeTab === 'privacy' && (
                  <form onSubmit={handlePrivacySubmit}>
                    <div className="px-4 py-5 sm:p-6">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Impostazioni privacy</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Gestisci le tue preferenze sulla privacy e la condivisione dei dati.
                      </p>
                      
                      <div className="mt-6 space-y-6">
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="shareProfile"
                              name="shareProfile"
                              type="checkbox"
                              checked={privacySettings.shareProfile}
                              onChange={handlePrivacyChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="shareProfile" className="font-medium text-gray-700">
                              Condividi il mio profilo con i professionisti
                            </label>
                            <p className="text-gray-500">
                              Consenti ai professionisti di vedere le tue informazioni di base quando prenoti.
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="shareHealthData"
                              name="shareHealthData"
                              type="checkbox"
                              checked={privacySettings.shareHealthData}
                              onChange={handlePrivacyChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="shareHealthData" className="font-medium text-gray-700">
                              Condividi i dati sanitari tra professionisti
                            </label>
                            <p className="text-gray-500">
                              Consenti ai professionisti di accedere ai tuoi dati sanitari condivisi sulla piattaforma.
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="receiveEmails"
                              name="receiveEmails"
                              type="checkbox"
                              checked={privacySettings.receiveEmails}
                              onChange={handlePrivacyChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="receiveEmails" className="font-medium text-gray-700">
                              Ricevi notifiche via email
                            </label>
                            <p className="text-gray-500">
                              Ricevi promemoria e aggiornamenti importanti via email.
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="receiveSMS"
                              name="receiveSMS"
                              type="checkbox"
                              checked={privacySettings.receiveSMS}
                              onChange={handlePrivacyChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="receiveSMS" className="font-medium text-gray-700">
                              Ricevi notifiche via SMS
                            </label>
                            <p className="text-gray-500">
                              Ricevi promemoria per appuntamenti tramite SMS.
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="twoFactorAuth"
                              name="twoFactorAuth"
                              type="checkbox"
                              checked={privacySettings.twoFactorAuth}
                              onChange={handlePrivacyChange}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="twoFactorAuth" className="font-medium text-gray-700">
                              Autenticazione a due fattori
                            </label>
                            <p className="text-gray-500">
                              Attiva l'autenticazione a due fattori per una maggiore sicurezza del tuo account.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {loading ? 'Salvataggio...' : 'Salva impostazioni'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserProfile;