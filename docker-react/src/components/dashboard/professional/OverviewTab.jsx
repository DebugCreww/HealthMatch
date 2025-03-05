import React from 'react';
import { Calendar, Users, Clock } from 'lucide-react';
import StatCard from '../common/StatCard';
import AppointmentCard from './AppointmentCard';
import RecentPatientCard from './RecentPatientCard';

const OverviewTab = ({ appointments, patients, onUpdateAppointmentStatus }) => {
  // Filtra gli appuntamenti di oggi e questa settimana
  const todayAppointments = appointments?.filter(app => 
    app.status !== 'cancelled' && 
    app.status !== 'completed' &&
    new Date(app.date).toDateString() === new Date().toDateString()
  ) || [];
  
  const weekAppointments = appointments?.filter(app => 
    app.status !== 'cancelled' && 
    app.status !== 'completed'
  ) || [];
  
  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">Dashboard Professionale</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Appuntamenti oggi" 
          value={todayAppointments.length} 
          icon={<Calendar size={20} />}
          color="bg-blue-100 text-blue-800"
        />
        <StatCard 
          title="Pazienti totali" 
          value={patients?.length || 0}
          icon={<Users size={20} />}
          color="bg-purple-100 text-purple-800" 
        />
        <StatCard 
          title="Appuntamenti settimana" 
          value={weekAppointments.length} 
          icon={<Clock size={20} />}
          color="bg-green-100 text-green-800" 
        />
      </div>
      
      <h3 className="text-lg font-medium mb-4">Prossimi appuntamenti</h3>
      <div className="mb-8">
        {todayAppointments.length > 0 ? (
          todayAppointments.slice(0, 3).map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onUpdateStatus={onUpdateAppointmentStatus}
            />
          ))
        ) : (
          <p className="text-gray-500">Nessun appuntamento per oggi.</p>
        )}
      </div>
      
      <h3 className="text-lg font-medium mb-4">Pazienti recenti</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patients && patients.length > 0 ? (
          patients.slice(0, 4).map(patient => (
            <RecentPatientCard key={patient.id} patient={patient} />
          ))
        ) : (
          <p className="text-gray-500">Nessun paziente trovato.</p>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;