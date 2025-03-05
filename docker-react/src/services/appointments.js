// Funzione per ottenere gli appuntamenti (mock per test)
export const getAppointments = async () => {
  // Dati di esempio
  const mockAppointments = [
    { 
      id: 1, 
      patientId: 1,
      patientName: 'Luca Bianchi', 
      serviceName: 'Visita cardiologica', 
      date: '03/03/2025', 
      time: '10:00', 
      status: 'confirmed', 
      notes: 'Paziente con ipertensione' 
    },
    { 
      id: 2,
      patientId: 2,
      patientName: 'Mario Mastrulli', 
      serviceName: 'Psiconalisi', 
      date: '03/03/2025', 
      time: '11:30', 
      status: 'pending' 
    },
    { 
      id: 3,
      patientId: 3,
      patientName: 'Marco Neri', 
      serviceName: 'Visita cardiologica', 
      date: '04/03/2025', 
      time: '09:15', 
      status: 'pending' 
    },
    { 
      id: 4,
      patientId: 4,
      patientName: 'Sofia Russo', 
      serviceName: 'Controllo pressione', 
      date: '05/03/2025', 
      time: '14:30', 
      status: 'confirmed' 
    }
  ];
  
  // Restituiamo i dati come una Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAppointments);
    }, 500);
  });
};

// Funzione per aggiornare lo stato di un appuntamento
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  // In un'app reale, questa sarebbe una chiamata API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: appointmentId, status: newStatus });
    }, 500);
  });
};