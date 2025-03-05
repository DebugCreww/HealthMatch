import React, { useState } from 'react';
import { Star, MapPin, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfessionalCard = ({ professional }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Estrazione sicura dei dati con valori di default
  const {
    id,
    name,
    specialty,
    location,
    rating = 0,
    reviews = 0,
    price = { min: 0, max: 0 }, // Valore di default per price
    nextAvailability,
    services = [],
    imageUrl
  } = professional || {};

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{name}</h3>
            <p className="text-gray-600">{specialty}</p>
          </div>
          <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
            <Star size={16} className="text-yellow-500 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-xs text-gray-500 ml-1">({reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center mt-3 text-gray-600">
          <MapPin size={16} className="mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        
        {nextAvailability && (
          <div className="flex items-center mt-1 text-gray-600">
            <Clock size={16} className="mr-1" />
            <span className="text-sm">Prima disponibilità: {nextAvailability}</span>
          </div>
        )}

        {price && (
          <div className="mt-3 text-gray-700">
            <span className="font-medium">Prezzo: </span>
            <span>€{price.min} - €{price.max}</span>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/professional/${id}`}
            className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Vedi profilo
          </Link>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-500 hover:text-gray-700 flex items-center"
          >
            {showDetails ? (
              <>
                <span className="mr-1 text-sm">Meno dettagli</span>
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                <span className="mr-1 text-sm">Più dettagli</span>
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>

        {showDetails && services && services.length > 0 && (
          <div className="mt-2 border-t pt-2">
            <h4 className="text-sm font-medium mb-1">Servizi offerti</h4>
            <ul className="text-sm text-gray-600">
              {services.slice(0, 3).map((service, index) => (
                <li key={index} className="flex items-center mt-1">
                  <Clock size={14} className="mr-2 text-gray-400" />
                  {typeof service === 'string' ? service : service.name}
                </li>
              ))}
              {services.length > 3 && (
                <li className="mt-1 text-blue-600">+ altri {services.length - 3}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalCard;