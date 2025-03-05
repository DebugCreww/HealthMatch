import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import BookingCalendar from './BookingCalendar';

const BookingForm = ({ professional, onBookingComplete }) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Seleziona il primo servizio come default
  useEffect(() => {
    if (professional?.services && professional.services.length > 0) {
      setSelectedService(professional.services[0]);
    }
  }, [professional]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Per favore completa tutti i campi richiesti');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simula chiamata API per ora
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simula risposta positiva
      toast.success('Prenotazione completata con successo!');
      
      // Notifica il componente parent
      if (onBookingComplete) {
        onBookingComplete({
          professionalId: professional.id,
          professionalName: professional.name,
          service: selectedService,
          date: selectedDate,
          time: selectedTime,
          notes
        });
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Si è verificato un errore durante la prenotazione.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-medium mb-4">Prenota appuntamento</h3>
      
      <form onSubmit={handleSubmit}>
        {/* Selezione servizio */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleziona servizio
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedService?.id || ''}
            onChange={(e) => {
              const serviceId = parseInt(e.target.value);
              const service = professional.services.find(s => s.id === serviceId);
              setSelectedService(service);
            }}
            required
          >
            {professional?.services?.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price} ({service.duration})
              </option>
            ))}
          </select>
        </div>
        
        {/* Calendario e orari */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleziona data e orario
          </label>
          <BookingCalendar
            professionalId={professional?.id}
            onDateSelected={setSelectedDate}
            onTimeSelected={setTimeSlot => {
              setSelectedTime(timeSlot);
            }}
          />
        </div>
        
        {/* Note aggiuntive */}
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Note aggiuntive (opzionale)
          </label>
          <textarea
            id="notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Aggiungi eventuali dettagli o richieste..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        {/* Pulsante di invio */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium"
          disabled={isSubmitting || !selectedService || !selectedDate || !selectedTime}
        >
          {isSubmitting ? 'Prenotazione in corso...' : 'Conferma prenotazione'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;