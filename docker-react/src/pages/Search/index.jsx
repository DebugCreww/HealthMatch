import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../../components/search/SearchBar';
import { searchProfessionals } from '../../services/search';
import ProfessionalCard from '../../components/search/ProfessionalCard';
import Header from '../../components/layout/Header';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const location = useLocation();

  // Parse URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialFilters = {
      specialty: params.get('specialty') || '',
      location: params.get('location') || '',
      date: params.get('date') || '',
      availability: params.get('availability') || 'any'
    };
    setFilters(initialFilters);
    handleSearch(initialFilters);
  }, [location.search]);

  const handleSearch = async (searchFilters) => {
    setLoading(true);
    try {
      const data = await searchProfessionals(searchFilters);
      setResults(data);
    } catch (err) {
      setError('Si è verificato un errore durante la ricerca');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Barra di ricerca */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} initialFilters={filters} />
          </div>
          
          {/* Risultati */}
          {loading ? (
            <div className="text-center py-10">Ricerca in corso...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : results.length === 0 ? (
            <div className="text-center py-10">Nessun risultato trovato</div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {results.map(professional => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;