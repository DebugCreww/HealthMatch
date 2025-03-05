import React from 'react';

const PatientListItem = ({ patient }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-3">
            {patient?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{patient?.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {patient?.lastVisit || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-blue-600 hover:text-blue-900 mr-3">
          Visualizza cartella
        </button>
        <button className="text-blue-600 hover:text-blue-900">
          Prenota visita
        </button>
      </td>
    </tr>
  );
};

export default PatientListItem;