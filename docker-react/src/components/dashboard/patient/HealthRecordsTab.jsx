import React, { useState, useEffect } from 'react';
import { Search, Upload } from 'lucide-react';
import HealthRecordCard from './HealthRecordCard';
import UploadHealthRecordModal from './UploadHealthRecordModal';
import { getHealthRecords } from '../../../services/healthRecords';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HealthRecordsTab = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  // Stato per controllare la visibilità del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadHealthRecords = async () => {
      try {
        setLoading(true);
        const data = await getHealthRecords();
        setHealthRecords(data);
      } catch (error) {
        console.error('Error loading health records:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHealthRecords();
  }, []);
  
  const filteredRecords = healthRecords.filter(record => {
    if (filter !== 'all' && record.type !== filter) return false;
    
    if (!searchTerm) return true;
    return (
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Gestisce l'aggiunta di un nuovo record
  const handleUploadSuccess = (newRecord) => {
    setHealthRecords(prevRecords => [newRecord, ...prevRecords]);
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento documenti sanitari...</div>;
  }

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Modal di upload condizionale */}
      {isModalOpen && (
        <UploadHealthRecordModal 
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">I miei documenti sanitari</h2>
        <div className="flex items-center">
          <div className="relative mr-2">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cerca documenti" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            // Apri il modal quando il bottone viene cliccato
            onClick={() => setIsModalOpen(true)}
          >
            <Upload size={18} className="mr-1" />
            <span>Carica</span>
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
            filter === 'Laboratorio' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setFilter('Laboratorio')}
        >
          Laboratorio
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${
            filter === 'Diagnostica' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setFilter('Diagnostica')}
        >
          Diagnostica
        </button>
        <button 
          className={`mr-2 px-4 py-2 rounded-md ${
            filter === 'Visita' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'
          }`}
          onClick={() => setFilter('Visita')}
        >
          Visita
        </button>
      </div>
      
      {filteredRecords.length > 0 ? (
        filteredRecords.map(record => (
          <HealthRecordCard key={record.id} record={record} />
        ))
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Nessun documento sanitario trovato.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Carica un documento
          </button>
        </div>
      )}
    </div>
  );
};

export default HealthRecordsTab;