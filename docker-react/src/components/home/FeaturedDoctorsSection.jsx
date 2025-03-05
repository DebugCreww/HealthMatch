import React from 'react';
import { MapPin, Star, Calendar } from 'lucide-react';

const FeaturedDoctorsSection = () => {
  const doctors = [
    {name: 'Dr. Marco Rossi', specialty: 'Cardiologo', location: 'Milano', rating: 4.9, reviews: 128},
    {name: 'Dr.ssa Giulia Bianchi', specialty: 'Dermatologa', location: 'Roma', rating: 4.8, reviews: 95},
    {name: 'Dr. Alessandro Verdi', specialty: 'Ortopedico', location: 'Napoli', rating: 4.7, reviews: 73}
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Professionisti in evidenza</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <MapPin size={16} className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{doctor.location}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        <Star size={16} className="text-yellow-400" />
                        <span className="ml-1 text-sm font-medium text-gray-900">{doctor.rating}</span>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">({doctor.reviews} recensioni)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-1" />
                      <span>Prima disponibilità: Oggi</span>
                    </div>
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                      Prenota
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Mostra altri professionisti
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctorsSection;