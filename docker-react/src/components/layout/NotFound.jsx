import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <AlertCircle size={40} className="text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Pagina non trovata</p>
          <p className="text-gray-500 mb-8">
            La pagina che stai cercando potrebbe essere stata rimossa, rinominata o potrebbe essere temporaneamente non disponibile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <Home className="mr-2" size={18} />
              Torna alla home
            </Link>
            <button onClick={() => window.history.back()} className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <ArrowLeft className="mr-2" size={18} />
              Torna indietro
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;