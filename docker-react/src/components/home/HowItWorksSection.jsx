import React from 'react';
import { Search, Calendar, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <section id="come-funziona" className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Come funziona</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prenotare una visita con HealthMatch è semplice e veloce.
            Ecco come funziona in tre semplici passaggi:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Cerca</h3>
            <p className="text-gray-600">
              Cerca un professionista per nome, specialità o trattamento di cui hai bisogno.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Prenota</h3>
            <p className="text-gray-600">
              Scegli data e orario disponibili che meglio si adattano alle tue esigenze.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Conferma</h3>
            <p className="text-gray-600">
              Ricevi una conferma immediata e promemoria per il tuo appuntamento.
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-medium">
            Inizia ora
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;