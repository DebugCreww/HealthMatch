import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, Award, Languages, Heart, ArrowLeft } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getProfessionalById } from '../../services/professionals';

const ProfessionalDetail = () => {
  const { id } = useParams();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        setLoading(true);
        const data = await getProfessionalById(id);
        setProfessional(data);
        
        // Controlla se è tra i preferiti
        const favorites = JSON.parse(localStorage.getItem('favoriteProfessionals') || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));
      } catch (err) {
        setError('Impossibile caricare i dettagli del professionista');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessional();
  }, [id]);
  
  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteProfessionals') || '[]');
    const professionalId = parseInt(id);
    
    let newFavorites;
    if (favorites.includes(professionalId)) {
      newFavorites = favorites.filter(id => id !== professionalId);
      setIsFavorite(false);
    } else {
      newFavorites = [...favorites, professionalId];
      setIsFavorite(true);
    }
    
    localStorage.setItem('favoriteProfessionals', JSON.stringify(newFavorites));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !professional) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Errore</h2>
            <p className="text-gray-600 mb-4">{error || 'Professionista non trovato'}</p>
            <Link to="/search" className="text-blue-600 hover:underline flex items-center justify-center">
              <ArrowLeft size={16} className="mr-2" /> Torna alla ricerca
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/search" className="text-blue-600 hover:underline flex items-center text-sm">
            <ArrowLeft size={16} className="mr-2" /> Torna ai risultati
          </Link>
        </div>
        
        {/* Header profilo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Avatar o iniziale */}
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl">
              {professional.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{professional.name}</h1>
                  <p className="text-lg text-blue-600">{professional.specialty}</p>
                  
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">{professional.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({professional.reviewCount} recensioni)</span>
                    </div>
                    
                    <div className="mx-2 text-gray-300">•</div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {professional.location}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={handleToggleFavorite}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50"
                >
                  <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"} />
                  <span>{isFavorite ? "Salvato" : "Salva"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenuto principale */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Colonna sinistra - Info dettagliate */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Chi sono</h2>
              <p className="text-gray-700">{professional.bio}</p>
              
              <hr className="my-6" />
              
              <h2 className="text-lg font-medium text-gray-900 mb-4">Servizi offerti</h2>
              <div className="flex flex-wrap gap-2">
                {professional.services.map((service, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {service}
                  </span>
                ))}
              </div>
              
              <hr className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Formazione</h2>
                  <ul className="space-y-2">
                    {professional.education.map((edu, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-1.5 mr-2 flex-shrink-0"></div>
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Informazioni aggiuntive</h2>
                  
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-600">Esperienza professionale</h3>
                    <p className="text-sm">{professional.experience} anni</p>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-sm font-medium text-gray-600">Lingue parlate</h3>
                    <p className="text-sm">{professional.languages.join(', ')}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Convenzioni</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {professional.insurances.map((insurance, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {insurance}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Colonna destra - Prenotazione */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Prenotazione</h2>
              
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Tariffa</h3>
                <p className="text-2xl font-bold text-gray-900">
                  €{professional.price.min === professional.price.max 
                    ? professional.price.min 
                    : `${professional.price.min} - ${professional.price.max}`}
                </p>
                <p className="text-sm text-gray-500">a visita</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Prossima disponibilità</h3>
                <div className="flex items-center text-green-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{professional.nextAvailability}</span>
                </div>
              </div>
              
              <Link 
                to={`/prenota/${professional.id}`}
                className="w-full block text-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm"
              >
                Prenota appuntamento
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfessionalDetail;