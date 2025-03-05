import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {text: "Ho trovato subito uno specialista disponibile per un'urgenza. Servizio eccellente!", name: "Maria G."},
    {text: "La prenotazione è stata semplice e veloce. Grazie a HealthMatch ho risolto il mio problema in pochi giorni.", name: "Luca B."},
    {text: "Un modo davvero comodo per gestire la salute della mia famiglia. Consigliatissimo!", name: "Francesca M."}
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Cosa dicono i nostri utenti</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start">
                <div className="text-blue-600">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 italic mb-4">{testimonial.text}</p>
                  <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;