import React from 'react';

const RecentPatientCard = ({ patient }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 flex items-center">
      <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-4">
        {patient?.name?.charAt(0) || 'P'}
      </div>
      <div>
        <h3 className="font-medium">{patient?.name || 'Paziente'}</h3>
        <p className="text-sm text-gray-600">Ultima visita: {patient?.lastVisit || 'N/A'}</p>
      </div>
    </div>
  );
};

export default RecentPatientCard;