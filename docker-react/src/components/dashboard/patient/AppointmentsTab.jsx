import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import AppointmentCard from './AppointmentCard';

const AppointmentsTab = ({ appointments, onCancelAppointment }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAppointments = appointments
    ?.filter(app => {
      if (filter === 'all') return true;
      if (filter === 'pending') return app.status === 'pending';
      if (filter === 'confirmed') return app.status === 'confirmed';
      if (filter === 'completed') return app.status === 'completed';
      return true;
    })
    .filter(app => {
      if (!searchTerm) return true;
      return (
        app.professionalName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        app.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">I miei appuntamenti</h2>
        <div className="flex items-center">
          <div className="relative mr-2">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cerca appuntamenti" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus size={18} className="mr-1" />
            <span>Nuovo</span>
          </button>
        </div>
      </div>
      
      <div className="flex mb-6 overflow-x-auto whitespace-nowrap">
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setFilter('all')}
        >
          Tutti
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${
            filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setFilter('pending')}
        >
          In attesa
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${
            filter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setFilter('confirmed')}
        >
          Confermati
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${
            filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setFilter('completed')}
        >
          Completati
        </button>
      </div>
      
      {filteredAppointments.map(appointment => (
        <AppointmentCard 
          key={appointment.id} 
          appointment={appointment} 
          onCancel={onCancelAppointment}
        />
      ))}
      
      {filteredAppointments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Nessun appuntamento trovato.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Prenota un appuntamento
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;