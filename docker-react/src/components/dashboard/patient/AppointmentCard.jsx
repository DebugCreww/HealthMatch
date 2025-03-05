import React from 'react';
import { Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';

const AppointmentCard = ({ appointment, onCancel }) => {
  const getStatusBadge = () => {
    const statusStyles = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    const statusLabels = {
      'pending': 'In attesa',
      'confirmed': 'Confermato',
      'completed': 'Completato',
      'cancelled': 'Cancellato'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[appointment.status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[appointment.status] || appointment.status}
      </span>
    );
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium">{appointment.professionalName}</h3>
          <p className="text-sm text-gray-600">{appointment.serviceName}</p>
        </div>
        <div>
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar size={16} className="mr-2" />
        <span>{appointment.date}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <Clock size={16} className="mr-2" />
        <span>{appointment.time}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin size={16} className="mr-2" />
        <span>{appointment.location}</span>
      </div>
      
      {appointment.status === 'pending' && (
        <button 
          onClick={() => onCancel && onCancel(appointment.id)}
          className="w-full px-3 py-2 mt-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 flex items-center justify-center"
        >
          <AlertCircle size={16} className="mr-2" />
          Cancella appuntamento
        </button>
      )}
    </div>
  );
};

export default AppointmentCard;