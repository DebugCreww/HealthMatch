import React from 'react';
import { Calendar, Download, FileText, User } from 'lucide-react';
import { downloadHealthRecord } from '../../../services/healthRecords';

const HealthRecordCard = ({ record }) => {
  const typeColors = {
    'Laboratorio': 'bg-purple-100 text-purple-800',
    'Diagnostica': 'bg-green-100 text-green-800',
    'Visita': 'bg-blue-100 text-blue-800',
    'Prescrizione': 'bg-yellow-100 text-yellow-800',
    'Altro': 'bg-gray-100 text-gray-800',
  };

  const handleDownload = async () => {
    try {
      await downloadHealthRecord(record.id);
      // In un'applicazione reale, qui gestiresti il download effettivo
      alert('Download simulato completato');
    } catch (error) {
      console.error('Error downloading record:', error);
      alert('Errore durante il download');
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${typeColors[record.type] || 'bg-gray-100'}`}>
            {record.type}
          </span>
          <h3 className="text-lg font-medium">{record.title}</h3>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleDownload}
            className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
          >
            <Download size={14} className="mr-1" />
            <span>Scarica</span>
          </button>
        </div>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <User size={16} className="mr-2" />
        <span>{record.doctor}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar size={16} className="mr-2" />
        <span>{record.date}</span>
      </div>
      <div className="flex items-center text-gray-600 mb-2">
        <FileText size={16} className="mr-2" />
        <span>{record.status}</span>
      </div>
    </div>
  );
};

export default HealthRecordCard;