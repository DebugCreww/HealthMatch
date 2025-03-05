import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">HealthMatch</h3>
            <p className="text-gray-400 mb-4">
              La piattaforma leader in Italia per la prenotazione di visite mediche online.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Altri social icon qui */}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Per i pazienti</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Come funziona</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Specialità mediche</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Assicurazioni</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">App mobile</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Per i professionisti</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Unisciti a noi</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Vantaggi</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Tariffe</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Software per cliniche</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Centro risorse</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Informazioni</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Chi siamo</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Lavora con noi</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contatti</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Termini e condizioni</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-center">
            &copy; 2025 HealthMatch. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;