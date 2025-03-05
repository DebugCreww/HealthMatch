import { useState } from 'react';
import { toast } from 'react-toastify';

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBooking = async (bookingData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In produzione, questa sarebbe una chiamata API reale
      // const response = await api.post('/bookings', bookingData);
      
      // Simuliamo una chiamata API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockResponse = {
        id: Math.floor(Math.random() * 1000),
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Salva l'appuntamento localmente (per demo)
      const userAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
      userAppointments.push(mockResponse);
      localStorage.setItem('userAppointments', JSON.stringify(userAppointments));
      
      toast.success('Appuntamento prenotato con successo!');
      return mockResponse;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Errore durante la prenotazione';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const getAvailableSlots = async (professionalId, date) => {
    setLoading(true);
    setError(null);
    
    try {
      // In produzione, questa sarebbe una chiamata API reale
      // const response = await api.get(`/professionals/${professionalId}/availability`, {
      //   params: { date }
      // });
      
      // Simuliamo una chiamata API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock di slot disponibili
      const hours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      const availableSlots = hours.filter(() => Math.random() > 0.3);
      
      return availableSlots;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Errore nel recupero degli slot disponibili';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    createBooking,
    getAvailableSlots
  };
};

export default useBooking;