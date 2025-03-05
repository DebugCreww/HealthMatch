import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import PatientItem from './PatientItem';
import { getPatients } from '../../../services/patient';

const PatientsTab = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);
  
  const filteredPatients = patients.filter(patient => {
    if (!searchTerm) return true;
    return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <div className="text-center py-8">Caricamento pazienti...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">I miei pazienti</h2>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cerca pazienti" 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {filteredPatients.length > 0 ? (
        <div className="space-y-4">
          {filteredPatients.map(patient => (
            <PatientItem key={patient.id} patient={patient} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Nessun paziente trovato.</p>
        </div>
      )}
    </div>
  );
};

export default PatientsTab;