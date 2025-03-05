import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo';
import { isAuthenticated, isProfessional, getCurrentUser } from '../../services/auth';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authenticated = isAuthenticated();
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determina il link della Dashboard
  const DashboardLink = isProfessional() ? '/dashboard/professionista' : '/dashboard/paziente';

  // Gestisce la navigazione alle sezioni dell'homepage
  const navigateToSection = (sectionId) => {
    // Chiude menu mobile se aperto
    setMobileMenuOpen(false);
    
    // Se siamo già in homepage, scrolliamo alla sezione
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Altrimenti navighiamo all'homepage con il frammento
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo color="text-blue-600" size="text-xl" />
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 font-medium">
                Home
              </Link>
              {/* Link "Come funziona" per la navigazione desktop */}
              <button 
                onClick={() => navigateToSection('come-funziona')} 
                className="text-gray-500 hover:text-blue-600 px-3 py-2 font-medium bg-transparent border-none cursor-pointer"
              >
                Come funziona
              </button>
              <Link to="/search" className="text-gray-500 hover:text-blue-600 px-3 py-2 font-medium">
                Cerca professionisti
              </Link>
              <Link to="/about" className="text-gray-500 hover:text-blue-600 px-3 py-2 font-medium">
                Chi siamo
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center">
            {authenticated ? (
              <Link to={DashboardLink} className="text-blue-600 hover:text-blue-800 font-medium">
                La mia area personale
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-gray-500 hover:text-blue-600 px-4 py-2 font-medium">
                  Accedi
                </Link>
                <Link to="/register" className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Registrati
                </Link>
              </>
            )}
          </div>
          
          {/* Menu mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Apri menu principale</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile aperto */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            {/* Link "Come funziona" per la navigazione mobile */}
            <button 
              onClick={() => navigateToSection('come-funziona')} 
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50"
            >
              Come funziona
            </button>
            <Link 
              to="/search" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cerca professionisti
            </Link>
            <Link 
              to="/about" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Chi siamo
            </Link>
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-2 space-y-1">
              {authenticated ? (
                <Link
                  to={DashboardLink}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  La mia area personale
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Accedi
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrati
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;