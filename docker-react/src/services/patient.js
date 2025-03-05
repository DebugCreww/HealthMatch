import api from './api';

/**
 * Servizio per la gestione dei pazienti
 */

// Funzione per ottenere i pazienti (mock per test)
export const getPatients = async () => {
  // Dati di esempio
  const mockPatients = [
    {
      id: 1,
      name: 'Mario Rossi',
      birthDate: '15/06/1975',
      gender: 'M',
      phone: '345123456',
      email: 'mario.rossi@example.com',
      lastVisit: '20/02/2024'
    },
    {
      id: 2,
      name: 'Laura Bianchi',
      birthDate: '22/09/1985',
      gender: 'F',
      phone: '345678901',
      email: 'laura.bianchi@example.com',
      lastVisit: '14/02/2024'
    },
    {
      id: 3,
      name: 'Giulio Verdi',
      birthDate: '10/03/1990',
      gender: 'M',
      phone: '333987654',
      email: 'giulio.verdi@example.com',
      lastVisit: '05/01/2024'
    }
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPatients);
    }, 500);
  });
};

// Funzione per ottenere le cartelle cliniche di un paziente
export const getPatientMedicalRecords = async (patientId) => {
  const mockMedicalRecords = [
    {
      id: 1,
      patientId: patientId,
      date: '10/02/2024',
      type: 'Visita',
      doctor: 'Dr. Marco Bianchi',
      notes: 'Paziente in buone condizioni generali. Pressione arteriosa nella norma.',
      attachments: ['referto.pdf']
    },
    {
      id: 2,
      patientId: patientId,
      date: '20/12/2023',
      type: 'Laboratorio',
      doctor: 'Dr.ssa Sara Neri',
      notes: 'Esami del sangue di routine. Valori nella norma.',
      attachments: ['analisi_sangue.pdf']
    }
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMedicalRecords);
    }, 500);
  });
};

export default {
  getPatients,
  getPatientMedicalRecords
};