import api from './api';

/**
 * Servizio per la gestione dei documenti sanitari
 */

// Funzione per ottenere i documenti sanitari di un paziente
export const getHealthRecords = async (userId) => {
  // In produzione, qui chiameresti l'API
  // Dati di esempio
  const mockHealthRecords = [
    {
      id: 1,
      title: 'Analisi del sangue',
      date: '10/02/2025',
      doctor: 'Dr. Paolo Verdi',
      type: 'Laboratorio',
      status: 'Completato'
    },
    {
      id: 2,
      title: 'Radiografia torace',
      date: '20/01/2025',
      doctor: 'Dr.ssa Sara Neri',
      type: 'Diagnostica',
      status: 'Completato'
    },
    {
      id: 3,
      title: 'Visita cardiologica',
      date: '05/12/2024',
      doctor: 'Dr. Marco Rossi',
      type: 'Visita',
      status: 'Completato'
    }
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockHealthRecords);
    }, 500);
  });
};

// Funzione per caricare un nuovo documento sanitario
export const uploadHealthRecord = async (recordData) => {
  // In produzione, qui chiameresti l'API
  console.log('Uploading health record:', recordData);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        ...recordData,
        status: 'Completato',
        date: new Date().toLocaleDateString('it-IT')
      });
    }, 500);
  });
};

// Funzione per scaricare un documento sanitario
export const downloadHealthRecord = async (recordId) => {
  console.log('Downloading health record:', recordId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Documento pronto per il download'
      });
    }, 500);
  });
};

// Funzione per ottenere i professionisti preferiti del paziente
export const getFavoriteProfessionals = async (userId) => {
  // In produzione, qui chiameresti l'API
  // Dati di esempio
  const mockFavoriteProviders = [
    {
      id: 1,
      name: 'Dr. Marco Rossi',
      specialty: 'Cardiologo',
      rating: 4.9,
      lastVisit: '05/12/2024'
    },
    {
      id: 2,
      name: 'Dr.ssa Giulia Bianchi',
      specialty: 'Psicologa',
      rating: 4.8,
      lastVisit: '15/11/2024'
    }
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFavoriteProviders);
    }, 500);
  });
};

// Funzione per cercare professionisti
export const searchProfessionals = async (searchParams) => {
  // Dati di esempio
  const mockProfessionals = [
    {
      id: 1,
      name: 'Dr. Marco Rossi',
      specialty: 'Cardiologo',
      location: 'Milano',
      rating: 4.9,
      reviews: 42
    },
    // Altri professionisti...
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProfessionals);
    }, 500);
  });
};

// Funzione per ottenere un professionista per ID
export const getProfessionalById = async (id) => {
  // Simulazione richiesta API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: parseInt(id),
        name: 'Dr. Marco Rossi',
        specialty: 'Cardiologo',
        location: 'Via Roma 123, Milano',
        rating: 4.9,
        nextAvailability: 'Domani, 15:00',
        services: [
          { id: 1, name: 'Visita cardiologica', price: '120€', duration: '45 min' },
          { id: 2, name: 'Elettrocardiogramma', price: '80€', duration: '30 min' }
        ]
      });
    }, 500);
  });
};

export default { 
  getFavoriteProfessionals, 
  searchProfessionals,
  getProfessionalById
};