import React from 'react';

const MobileAppSection = () => {
  return (
    <section className="py-12 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scarica l'app HealthMatch</h2>
            <p className="text-lg text-gray-600 mb-6">
              Prenota visite, gestisci appuntamenti e accedi a tutti i tuoi documenti medici dal tuo smartphone.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Placeholder images - replace with actual app store images */}
              <div className="h-12 w-40 bg-gray-200 rounded"></div>
              <div className="h-12 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:w-1/2 flex justify-center">
            {/* Placeholder for app image */}
            <div className="h-96 w-60 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;