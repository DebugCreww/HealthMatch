import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ProfessionalItem from './ProfessionalItem';
import { getFavoriteProfessionals } from '../../../services/professionals';

const ProfessionalsTab = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProfessionals = async () => {
      try {
        setLoading(true);
        const data = await getFavoriteProfessionals();
        setProfessionals(data);
      } catch (error) {
        console.error('Error loading professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionals();
  }, []);
  
  const filteredProfessionals = professionals.filter(professional => {
    if (!searchTerm) return true;
    
    return (
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="text-center py-8">Caricamento professionisti...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">I miei professionisti</h2>
        <div className="flex items-center">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cerca professionisti" 
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {filteredProfessionals.length > 0 ? (
        <div className="space-y-4">
          {filteredProfessionals.map(professional => (
            <ProfessionalItem key={professional.id} professional={professional} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Nessun professionista preferito trovato.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Cerca nuovi professionisti
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfessionalsTab;