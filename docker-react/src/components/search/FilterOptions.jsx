import React from 'react';
import { Check, X } from 'lucide-react';

/**
 * Componente per filtrare i risultati di ricerca dei professionisti
 * Supporta filtri per valutazione, prezzo, genere, lingue parlate e anni di esperienza
 */
const FilterOptions = ({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  activeFiltersCount 
}) => {
  // Gestisce il cambio di filtro per valutazione
  const handleRatingChange = (rating) => {
    onFilterChange('minRating', rating);
  };

  // Gestisce il cambio di filtro per genere
  const handleGenderChange = (gender) => {
    onFilterChange('gender', gender);
  };

  // Gestisce il cambio di filtro per lingua
  const handleLanguageChange = (e) => {
    const language = e.target.value;
    const isChecked = e.target.checked;
    
    let updatedLanguages = [...filters.languages];
    if (isChecked && !updatedLanguages.includes(language)) {
      updatedLanguages.push(language);
    } else if (!isChecked && updatedLanguages.includes(language)) {
      updatedLanguages = updatedLanguages.filter(lang => lang !== language);
    }
    
    onFilterChange('languages', updatedLanguages);
  };

  // Gestisce il cambio di filtro per prezzo
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value === '' ? null : parseInt(value, 10));
  };

  // Gestisce il cambio di filtro per anni di esperienza
  const handleExperienceChange = (e) => {
    const value = parseInt(e.target.value, 10);
    onFilterChange('minExperience', value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h3 className="font-medium">Filtri</h3>
        <div className="flex items-center">
          {activeFiltersCount > 0 && (
            <span className="text-sm text-gray-600 mr-2">
              {activeFiltersCount} filtri attivi
            </span>
          )}
          <button
            onClick={onResetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X size={16} className="mr-1" />
            Azzera filtri
          </button>
        </div>
      </div>

      {/* Filtro per valutazione */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Valutazione minima</h4>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 3.5, 4, 4.5].map(rating => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.minRating === rating
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {rating === 0 ? (
                'Qualsiasi'
              ) : (
                <div className="flex items-center">
                  {rating}+ <span className="text-yellow-500 ml-1">★</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro per prezzo */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Prezzo (€)</h4>
        <div className="flex gap-3">
          <div className="w-1/2">
            <label htmlFor="minPrice" className="block text-xs text-gray-600 mb-1">
              Min
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              min="0"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={handlePriceChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="w-1/2">
            <label htmlFor="maxPrice" className="block text-xs text-gray-600 mb-1">
              Max
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              min="0"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={handlePriceChange}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Filtro per genere */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Genere del professionista</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGenderChange(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              filters.gender === null
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            Qualsiasi
          </button>
          <button
            onClick={() => handleGenderChange('M')}
            className={`px-3 py-1 rounded-full text-sm ${
              filters.gender === 'M'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            Uomo
          </button>
          <button
            onClick={() => handleGenderChange('F')}
            className={`px-3 py-1 rounded-full text-sm ${
              filters.gender === 'F'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            Donna
          </button>
        </div>
      </div>

      {/* Filtro per lingue parlate */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Lingue parlate</h4>
        <div className="grid grid-cols-2 gap-2">
          {['Italiano', 'Inglese', 'Francese', 'Tedesco', 'Spagnolo', 'Arabo'].map(language => (
            <label key={language} className="flex items-center">
              <input
                type="checkbox"
                value={language}
                checked={filters.languages.includes(language)}
                onChange={handleLanguageChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Filtro per anni di esperienza */}
      <div>
        <h4 className="text-sm font-medium mb-2">Anni di esperienza (minimo)</h4>
        <input
          type="range"
          min="0"
          max="30"
          value={filters.minExperience}
          onChange={handleExperienceChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>0+</span>
          <span>{filters.minExperience}+ anni</span>
          <span>30+</span>
        </div>
      </div>
    </div>
  );
};

export default FilterOptions;