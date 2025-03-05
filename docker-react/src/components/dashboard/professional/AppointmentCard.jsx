import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';

const AppointmentCard = ({ appointment, onUpdateStatus }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (!appointment) return null;

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${statusColors[appointment.status] || 'bg-gray-100'}`}>
            {appointment.status}
          </span>
          <h3 className="text-lg font-medium">{appointment.serviceName}</h3>
        </div>
        <div className="flex space-x-2">
          {appointment.status === 'pending' && (
            <>
              <button 
                onClick={() => onUpdateStatus(appointment.id, 'confirmed')} 
                className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
              >
                Conferma
              </button>
              <button 
                onClick={() => onUpdateStatus(appointment.id, 'cancelled')} 
                className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
              >
                Annulla
              </button>
            </>
          )}
          {appointment.status === 'confirmed' && (
            <button 
              onClick={() => onUpdateStatus(appointment.id, 'completed')} 
              className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
            >
              Completa
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <User size={16} className="mr-2" />
        <span>{appointment.patientName}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar size={16} className="mr-2" />
        <span>{appointment.date}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-4">
        <Clock size={16} className="mr-2" />
        <span>{appointment.time}</span>
      </div>
      {appointment.notes && (
        <div className="text-sm bg-gray-50 p-2 rounded mb-4">
          <p className="font-medium">Note:</p>
          <p>{appointment.notes}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;