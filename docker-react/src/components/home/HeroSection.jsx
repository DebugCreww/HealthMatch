import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../search/SearchBar'; // Percorso corretto

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleSearch = (searchFilters) => {
    const params = new URLSearchParams();
    
    if (searchFilters.specialty) params.append('specialty', searchFilters.specialty);
    if (searchFilters.location) params.append('location', searchFilters.location);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-500 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Trova il tuo specialista e prenota una visita
          </h1>
          <p className="text-xl text-white mb-8">
            Più di 5.000 professionisti disponibili per la tua salute
          </p>
          
          <div className="max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;