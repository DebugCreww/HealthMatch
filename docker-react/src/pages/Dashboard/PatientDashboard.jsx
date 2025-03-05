import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/common/DashboardHeader';
import Sidebar from '../../components/dashboard/common/Sidebar';
import OverviewTab from '../../components/dashboard/patient/OverviewTab';
import AppointmentsTab from '../../components/dashboard/patient/AppointmentsTab';
import HealthRecordsTab from '../../components/dashboard/patient/HealthRecordsTab';
import ProfessionalsTab from '../../components/dashboard/patient/ProfessionalsTab';
import SettingsTab from '../../components/dashboard/patient/SettingsTab';
import { isAuthenticated, isProfessional, logout } from '../../services/auth';
import { getAppointments } from '../../services/appointments';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Definizione dei tabs per la sidebar
  const tabs = [
    { id: 'overview', name: 'Panoramica' },
    { id: 'appointments', name: 'Appuntamenti' },
    { id: 'health-records', name: 'Documenti Sanitari' },
    { id: 'professionals', name: 'Professionisti' },
    { id: 'settings', name: 'Impostazioni' },
  ];
  
  useEffect(() => {
    // Verifica se l'utente è autenticato
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Se l'utente è un professionista, reindirizza
    if (isProfessional()) {
      navigate('/dashboard/professionista');
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('authUser') || '{}');
    setUser(currentUser);
    
    // Carico i dati
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carica appuntamenti
        const appointmentsData = await getAppointments();
        setAppointments(appointmentsData);
        
        // Simula notifiche
        setNotifications([
          { id: 1, message: 'Nuovo appuntamento confermato', date: '2025-03-05' },
          { id: 2, message: 'Nuovi risultati disponibili', date: '2025-03-10' }
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleCancelAppointment = async (appointmentId) => {
    // Gestione cancellazione appuntamento
    console.log(`Cancellazione appuntamento: ${appointmentId}`);
    setAppointments(appointments.filter(app => app.id !== appointmentId));
  };
  
  // Renderer condizionale in base allo stato di caricamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Renderizza il componente corretto in base alla tab attiva
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab onCancelAppointment={handleCancelAppointment} />;
      case 'appointments':
        return <AppointmentsTab appointments={appointments} onCancelAppointment={handleCancelAppointment} />;
      case 'health-records':
        return <HealthRecordsTab />;
      case 'professionals':
        return <ProfessionalsTab />;
      case 'settings':
        return <SettingsTab user={user} />;
      default:
        return <OverviewTab onCancelAppointment={handleCancelAppointment} />;
    }
  };
 
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 overflow-y-auto">
        <Sidebar 
          tabs={tabs} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader 
          user={user} 
          notifications={notifications} 
          onLogout={handleLogout}
          title="Dashboard Paziente"
        />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;