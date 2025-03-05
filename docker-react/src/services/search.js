import api from './api';

export const searchProfessionals = async (filters) => {
  try {
    // Dati di esempio con il formato corretto
    const mockProfessionals = [
      {
        id: 1,
        name: 'Dr. Marco Rossi',
        specialty: 'Cardiologo',
        location: 'Milano',
        rating: 4.9,
        reviews: 42,
        price: { min: 80, max: 120 },
        nextAvailability: 'Domani, 15:00',
        services: ['Visita cardiologica', 'ECG', 'Holter pressorio'],
        imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
      },
      {
        id: 2,
        name: 'Dr.ssa Giulia Bianchi',
        specialty: 'Psicologa',
        location: 'Roma',
        rating: 4.8,
        reviews: 36,
        price: { min: 70, max: 100 },
        nextAvailability: 'Oggi, 18:30',
        services: ['Psicoterapia', 'Consulenza psicologica', 'Terapia cognitivo-comportamentale'],
        imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      {
        id: 3,
        name: 'Dr. Antonio Verdi',
        specialty: 'Ortopedico',
        location: 'Milano',
        rating: 4.7,
        reviews: 28,
        price: { min: 90, max: 130 },
        nextAvailability: 'Martedì, 10:00',
        services: ['Visita ortopedica', 'Infiltrazioni', 'Valutazione posturale'],
        imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
      }
    ];
    
    // Filtra i risultati in base ai criteri di ricerca
    return mockProfessionals.filter(prof => {
      if (filters.specialty && !prof.specialty.toLowerCase().includes(filters.specialty.toLowerCase())) {
        return false;
      }
      if (filters.location && !prof.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      return true;
    });
  } catch (error) {
    console.error('Error searching professionals:', error);
    throw error;
  }
};

export const getProfessionalById = async (id) => {
  // Implementazione per dettagli professionista...
};