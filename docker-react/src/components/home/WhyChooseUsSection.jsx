import React from 'react';
import { Calendar, Star, Clock } from 'lucide-react';

const WhyChooseUsSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Perché scegliere HealthMatch</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6">
            <Calendar size={48} className="text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Prenotazione facile</h3>
            <p className="text-gray-600">Prenota con pochi click una visita con lo specialista che preferisci, quando è più comodo per te.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <Clock size={48} className="text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Zero attese</h3>
            <p className="text-gray-600">Vedi in tempo reale la disponibilità dei medici e scegli l'orario che ti è più comodo.</p>
          </div>
          <div className="flex flex-col items-center text-center p-6">
            <Star size={48} className="text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Specialisti verificati</h3>
            <p className="text-gray-600">Leggi i feedback di altri pazienti e scegli lo specialista più adatto alle tue esigenze.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;