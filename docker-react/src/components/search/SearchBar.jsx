import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch, initialFilters = {} }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    specialty: initialFilters.specialty || '',
    location: initialFilters.location || '',
    date: initialFilters.date || '',
    availability: initialFilters.availability || 'any'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filtra i parametri vuoti
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'any') {
        queryParams.append(key, value);
      }
    });
    
    // Naviga alla pagina di ricerca con i parametri
    navigate(`/search?${queryParams.toString()}`);
    
    // Se è stata fornita una funzione onSearch, chiamala
    if (onSearch) {
      onSearch(filters);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
              Specialità
            </label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={filters.specialty}
              onChange={handleChange}
              placeholder="Es. Cardiologo, Psicologo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Località
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Es. Milano, Roma..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
              Disponibilità
            </label>
            <select
              id="availability"
              name="availability"
              value={filters.availability}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="any">Qualsiasi</option>
              <option value="today">Oggi</option>
              <option value="tomorrow">Domani</option>
              <option value="week">Questa settimana</option>
              <option value="weekend">Weekend</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium flex items-center justify-center"
          >
            <Search className="mr-2" size={20} />
            Cerca professionisti
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;