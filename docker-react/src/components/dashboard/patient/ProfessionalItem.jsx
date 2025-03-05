import React from 'react';
import { Star, Calendar } from 'lucide-react';

const ProfessionalItem = ({ professional }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
      <div className="h-12 w-12 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-4">
        {professional?.name?.charAt(0) || 'D'}
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{professional?.name || 'Nome Professionista'}</h3>
        <p className="text-sm text-gray-600">{professional?.specialty || 'Specialità'}</p>
        <div className="flex items-center mt-1">
          <div className="flex items-center text-yellow-400">
            <Star size={16} />
            <span className="ml-1 text-sm text-gray-700">{professional?.rating || '0.0'}</span>
          </div>
          <div className="mx-2 text-gray-300">•</div>
          <div className="flex items-center text-gray-600">
            <Calendar size={14} className="mr-1" />
            <span className="text-xs">Ultima visita: {professional?.lastVisit || 'N/A'}</span>
          </div>
        </div>
      </div>
      <button className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
        Prenota
      </button>
    </div>
  );
};

export default ProfessionalItem;