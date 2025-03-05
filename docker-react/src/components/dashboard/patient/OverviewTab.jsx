import React, { useState, useEffect } from 'react';
import { Calendar, FileText, User, Clock } from 'lucide-react';
import StatCard from '../common/StatCard';
import { getAppointments } from '../../../services/appointments';
import { getHealthRecords } from '../../../services/healthRecords';
import { getFavoriteProfessionals } from '../../../services/professionals';
import AppointmentCard from './AppointmentCard';
import HealthRecordCard from './HealthRecordCard';
import ProfessionalItem from './ProfessionalItem';

const OverviewTab = ({ onCancelAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Carica i dati per la panoramica paziente
        const appointmentsData = await getAppointments();
        const healthRecordsData = await getHealthRecords();
        const professionalsData = await getFavoriteProfessionals();
        
        setAppointments(appointmentsData);
        setHealthRecords(healthRecordsData);
        setProfessionals(professionalsData);
      } catch (error) {
        console.error('Error loading overview data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Caricamento panoramica...</div>;
  }

  // Calcoli per le statistiche (specifici per paziente)
  const upcomingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div>
      <h2 className="text-lg font-semibold mb-6">La mia salute</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard 
          title="Visite prenotate" 
          value={upcomingAppointments.length} 
          icon={<Calendar size={20} />}
          color="bg-blue-100 text-blue-800" 
        />
        <StatCard 
          title="Documenti sanitari" 
          value={healthRecords.length} 
          icon={<FileText size={20} />}
          color="bg-purple-100 text-purple-800" 
        />
        <StatCard 
          title="Visite completate" 
          value={completedAppointments.length} 
          icon={<Clock size={20} />}
          color="bg-green-100 text-green-800" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Prossimi appuntamenti</h3>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 2).map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment}
                  onCancel={onCancelAppointment}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nessun appuntamento programmato.</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Documenti recenti</h3>
          {healthRecords.length > 0 ? (
            <div>
              {healthRecords.slice(0, 2).map(record => (
                <HealthRecordCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Nessun documento sanitario trovato.</p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">I miei professionisti</h3>
        {professionals.length > 0 ? (
          <div className="space-y-4">
            {professionals.map(professional => (
              <ProfessionalItem key={professional.id} professional={professional} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Nessun professionista preferito.</p>
        )}
      </div>
    </div>
  );
};

export default OverviewTab;