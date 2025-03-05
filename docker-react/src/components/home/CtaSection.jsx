import React from 'react';

const CtaSection = () => {
  return (
    <section className="py-12 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Pronto a prenderti cura della tua salute?</h2>
        <p className="text-lg text-blue-100 mb-8">
          Più di 1 milione di italiani hanno già scelto HealthMatch per le loro esigenze di salute.
        </p>
        <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 shadow-sm">
          Cerca uno specialista
        </button>
      </div>
    </section>
  );
};

export default CtaSection;