import React from 'react';
import { Calendar, Phone, Mail } from 'lucide-react';

const PatientItem = ({ patient }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
      <div className="h-12 w-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-4">
        {patient?.name?.charAt(0) || 'P'}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{patient?.name || 'Nome Paziente'}</h3>
        <div className="flex items-center mt-1 text-gray-600">
          <Calendar size={14} className="mr-1" />
          <span className="text-xs">Ultima visita: {patient?.lastVisit || 'N/A'}</span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
          <Phone size={18} />
        </button>
        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
          <Mail size={18} />
        </button>
      </div>
    </div>
  );
};

export default PatientItem;