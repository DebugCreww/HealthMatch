import React from 'react';
import { User } from 'lucide-react';

const SpecialtiesSection = () => {
  const specialties = [
    'Cardiologo', 'Dermatologo', 'Ginecologo', 'Ortopedico', 'Oculista', 'Dentista',
    'Psicologo', 'Nutrizionista', 'Fisioterapista', 'Otorinolaringoiatra', 'Pediatra', 'Radiologo'
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Specialità più popolari</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {specialties.map((specialty, index) => (
            <a 
              key={index} 
              href="#" 
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 mb-3">
                <User size={24} />
              </div>
              <span className="text-sm font-medium text-gray-900 text-center">{specialty}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;