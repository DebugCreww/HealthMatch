import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, addWeeks, isSameDay } from 'date-fns';
import { it } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookingCalendar = ({ professionalId, onDateSelected, onTimeSelected }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [weekStart, setWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  // Genera le date della settimana corrente
  const weekDates = [...Array(7)].map((_, i) => addDays(weekStart, i));
  
  // Carica gli slot temporali disponibili per la data selezionata
  useEffect(() => {
    if (!selectedDate || !professionalId) return;
    
    // Simula chiamata API per recuperare gli slot disponibili
    const fetchTimeSlots = async () => {
      // In un'applicazione reale, qui chiameresti l'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Dati simulati: gli slot disponibili tra le 9 e le 17
      const mockSlots = [];
      for (let hour = 9; hour < 17; hour++) {
        // Simula alcune fasce orarie non disponibili
        if (hour !== 13 && Math.random() > 0.3) {
          mockSlots.push(`${hour}:00`);
        }
        if (hour !== 12 && Math.random() > 0.5) {
          mockSlots.push(`${hour}:30`);
        }
      }
      
      setAvailableTimeSlots(mockSlots);
    };
    
    fetchTimeSlots();
  }, [selectedDate, professionalId]);
  
  const handlePreviousWeek = () => {
    setWeekStart(addWeeks(weekStart, -1));
  };
  
  const handleNextWeek = () => {
    setWeekStart(addWeeks(weekStart, 1));
  };
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    if (onDateSelected) {
      onDateSelected(date);
    }
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTimeSlot(time);
    if (onTimeSelected) {
      onTimeSelected(time);
    }
  };

  return (
    <div className="booking-calendar">
      {/* Navigazione settimana */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePreviousWeek} 
          className="p-1 rounded hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        
        <span className="font-medium">
          {format(weekStart, 'MMMM yyyy', { locale: it })}
        </span>
        
        <button 
          onClick={handleNextWeek} 
          className="p-1 rounded hover:bg-gray-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Giorni della settimana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {weekDates.map((date) => (
          <button
            key={date.toString()}
            onClick={() => handleDateSelect(date)}
            className={`
              p-2 rounded-md text-center
              ${isSameDay(date, selectedDate) ? 
                'bg-blue-600 text-white' : 
                'hover:bg-gray-100'
              }
              ${date < new Date() && !isSameDay(date, new Date()) ? 
                'text-gray-300 cursor-not-allowed' : 
                'cursor-pointer'
              }
            `}
            disabled={date < new Date() && !isSameDay(date, new Date())}
          >
            <div className="text-xs">{format(date, 'EEE', { locale: it })}</div>
            <div className="font-bold">{format(date, 'd')}</div>
          </button>
        ))}
      </div>

      {/* Orari disponibili */}
      {selectedDate ? (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Orari disponibili:</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableTimeSlots.length > 0 ? (
              availableTimeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`
                    py-1 px-2 text-sm border rounded-md
                    ${selectedTimeSlot === time ? 
                      'bg-blue-600 text-white border-blue-600' : 
                      'bg-white hover:bg-gray-50 border-gray-300'
                    }
                  `}
                >
                  {time}
                </button>
              ))
            ) : (
              <p className="col-span-4 text-sm text-gray-500">
                Nessun orario disponibile per questa data.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Seleziona una data per vedere gli orari disponibili.</p>
      )}
    </div>
  );
};

export default BookingCalendar;