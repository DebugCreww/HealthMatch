import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getProfessionalById } from '../../services/professionals';
import { isAuthenticated } from '../../services/auth';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  
  // Verifica autenticazione
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { redirectTo: `/prenota/${id}` } });
    }
  }, [id, navigate]);
  
  // Carica dati professionista
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        setLoading(true);
        const data = await getProfessionalById(id);
        setProfessional(data);
        if (data.services && data.services.length > 0) {
          setSelectedService(data.services[0]);
        }
        
        // Genera date disponibili simulate per il mese corrente
        generateAvailableDates(currentMonth);
      } catch (err) {
        setError('Impossibile caricare i dettagli del professionista');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessional();
  }, [id, currentMonth]);
  
  // Simula la generazione di date disponibili
  const generateAvailableDates = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    // Genera 8-12 date casuali disponibili per questo mese
    const numDates = Math.floor(Math.random() * 5) + 8;
    const availableDays = [];
    
    for (let i = 0; i < numDates; i++) {
      // Genera un giorno casuale, esclusa la domenica (0) e date passate
      let day = Math.floor(Math.random() * daysInMonth) + 1;
      const date = new Date(year, monthIndex, day);
      
      // Esclude domeniche e date passate
      if (date.getDay() !== 0 && date >= new Date().setHours(0, 0, 0, 0)) {
        availableDays.push(day);
      }
    }
    
    setAvailableDates([...new Set(availableDays)].sort((a, b) => a - b));
  };
  
  // Simula la generazione di orari disponibili per una data
  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selectedDate);
    setSelectedTime(null);
    
    // Genera orari disponibili simulati
    const times = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Aggiungi 1-3 slot orari per ora (9:00, 9:20, 9:40, ecc.)
      const slotsPerHour = Math.floor(Math.random() * 2) + 1;
      
      for (let slot = 0; slot < slotsPerHour; slot++) {
        const minute = slot * 20;
        times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    
    setAvailableTimes(times.sort());
  };
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    // Blocca mesi passati
    const today = new Date();
    if (prevMonth.getFullYear() < today.getFullYear() ||
       (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() < today.getMonth())) {
      return;
    }
    
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Limita la prenotazione ai prossimi 3 mesi
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    if (nextMonth > threeMonthsLater) {
      return;
    }
    
    setCurrentMonth(nextMonth);
  };
  
  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Per favore seleziona servizio, data e orario');
      return;
    }
    
    // Simuliamo il salvataggio della prenotazione
    // In una app reale, qui ci sarebbe una chiamata API
    
    const booking = {
      id: Date.now(),
      professionalId: parseInt(id),
      professionalName: professional.name,
      specialty: professional.specialty,
      serviceName: selectedService,
      date: selectedDate.toLocaleDateString('it-IT'),
      time: selectedTime,
      status: 'pending',
      location: professional.location
    };
    
    // Salviamo in localStorage per simulare
    const appointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
    appointments.push(booking);
    localStorage.setItem('userAppointments', JSON.stringify(appointments));
    
    // Redirect alla Dashboard con messaggio di successo
    navigate('/Dashboard/paziente', { 
      state: { 
        notification: {
          type: 'success',
          message: 'Appuntamento prenotato con successo!'
        }
      }
    });
  };
  
  // Formatta i giorni della settimana
  const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  
  // Genera il calendario del mese
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Primo giorno del mese
    const firstDay = new Date(year, month, 1).getDay();
    
    // Numero di giorni nel mese
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    
    // Genera le celle del calendario
    const calendarCells = [];
    
    // Aggiungi celle vuote per i giorni prima dell'inizio del mese
    for (let i = 0; i < firstDay; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Aggiungi celle per ogni giorno del mese
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isAvailable = availableDates.includes(day);
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      const isSunday = date.getDay() === 0;
      
      calendarCells.push(
        <div key={day} className="relative h-10 flex items-center justify-center">
          <button
            type="button"
            onClick={() => isAvailable && !isPast && !isSunday ? handleDateSelect(day) : null}
            disabled={!isAvailable || isPast || isSunday}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isSelected
                ? 'bg-blue-600 text-white'
                : isAvailable && !isPast && !isSunday
                  ? 'hover:bg-blue-100 text-blue-800'
                  : isPast || isSunday
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700'
            } ${
              isToday ? 'ring-2 ring-blue-600 ring-offset-2' : ''
            }`}
          >
            {day}
          </button>
        </div>
      );
    }
    
    return calendarCells;
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
          <Link to={`/professionista/${id}`} className="text-blue-600 hover:underline flex items-center text-sm">
            <ArrowLeft size={16} className="mr-2" /> Torna al profilo
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Prenota un appuntamento</h1>
        
        {/* Informazioni professionista */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
              {professional.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h2 className="font-medium">{professional.name}</h2>
              <p className="text-sm text-gray-600">{professional.specialty}</p>
            </div>
          </div>
        </div>
        
        {/* Processo di prenotazione in 3 step */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Selezione servizio */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">1. Seleziona il servizio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professional.services.map((service, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className={`p-4 border rounded-md text-left ${
                    selectedService === service
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <h4 className="font-medium mb-1">{service}</h4>
                  <p className="text-sm text-gray-600">
                    €{professional.price.min === professional.price.max 
                      ? professional.price.min 
                      : `${professional.price.min}-${professional.price.max}`
                    }
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Step 2: Selezione data */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">2. Seleziona data</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 rounded-md hover:bg-gray-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <h4 className="text-lg font-medium">
                  {currentMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}
                </h4>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 rounded-md hover:bg-gray-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              {/* Giorni della settimana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekdays.map(day => (
                  <div key={day} className="text-center font-medium text-sm text-gray-700">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendario */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                  Date disponibili
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 3: Selezione orario */}
          <div className={selectedDate ? 'mb-8' : 'hidden'}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">3. Seleziona orario</h3>
            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-md text-center ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {time}import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { getProfessionalById } from '../../services/professionals';
import { isAuthenticated } from '../../services/auth';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  
  // Verifica autenticazione
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { redirectTo: `/prenota/${id}` } });
    }
  }, [id, navigate]);
  
  // Carica dati professionista
  useEffect(() => {
    const fetchProfessional = async () => {
      try {
        setLoading(true);
        const data = await getProfessionalById(id);
        setProfessional(data);
        if (data.services && data.services.length > 0) {
          setSelectedService(data.services[0]);
        }
        
        // Genera date disponibili simulate per il mese corrente
        generateAvailableDates(currentMonth);
      } catch (err) {
        setError('Impossibile caricare i dettagli del professionista');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessional();
  }, [id, currentMonth]);
  
  // Simula la generazione di date disponibili
  const generateAvailableDates = (month) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    
    // Genera 8-12 date casuali disponibili per questo mese
    const numDates = Math.floor(Math.random() * 5) + 8;
    const availableDays = [];
    
    for (let i = 0; i < numDates; i++) {
      // Genera un giorno casuale, esclusa la domenica (0) e date passate
      let day = Math.floor(Math.random() * daysInMonth) + 1;
      const date = new Date(year, monthIndex, day);
      
      // Esclude domeniche e date passate
      if (date.getDay() !== 0 && date >= new Date().setHours(0, 0, 0, 0)) {
        availableDays.push(day);
      }
    }
    
    setAvailableDates([...new Set(availableDays)].sort((a, b) => a - b));
  };
  
  // Simula la generazione di orari disponibili per una data
  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selectedDate);
    setSelectedTime(null);
    
    // Genera orari disponibili simulati
    const times = [];
    const startHour = 9;
    const endHour = 18;
    
    for (let hour = startHour; hour < endHour; hour++) {
      // Aggiungi 1-3 slot orari per ora (9:00, 9:20, 9:40, ecc.)
      const slotsPerHour = Math.floor(Math.random() * 2) + 1;
      
      for (let slot = 0; slot < slotsPerHour; slot++) {
        const minute = slot * 20;
        times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    
    setAvailableTimes(times.sort());
  };
  
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    // Blocca mesi passati
    const today = new Date();
    if (prevMonth.getFullYear() < today.getFullYear() ||
       (prevMonth.getFullYear() === today.getFullYear() && prevMonth.getMonth() < today.getMonth())) {
      return;
    }
    
    setCurrentMonth(prevMonth);
  };
  
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    // Limita la prenotazione ai prossimi 3 mesi
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
    if (nextMonth > threeMonthsLater) {
      return;
    }
    
    setCurrentMonth(nextMonth);
  };
  
  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Per favore seleziona servizio, data e orario');
      return;
    }
    
    // Simuliamo il salvataggio della prenotazione
    // In una app reale, qui ci sarebbe una chiamata API
    
    const booking = {
      id: Date.now(),
      professionalId: parseInt(id),
      professionalName: professional.name,
      specialty: professional.specialty,
      serviceName: selectedService,
      date: selectedDate.toLocaleDateString('it-IT'),
      time: selectedTime,
      status: 'pending',
      location: professional.location
    };
    
    // Salviamo in localStorage per simulare
    const appointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
    appointments.push(booking);
    localStorage.setItem('userAppointments', JSON.stringify(appointments));
    
    // Redirect alla Dashboard con messaggio di successo
    navigate('/Dashboard/paziente', { 
      state: { 
        notification: {
          type: 'success',
          message: 'Appuntamento prenotato con successo!'
        }
      }
    });
  };
  
  // Formatta i giorni della settimana
  const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
  
  // Genera il calendario del mese
  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Primo giorno del mese
    const firstDay = new Date(year, month, 1).getDay();
    
    // Numero di giorni nel mese
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const today = new Date();
    
    // Genera le celle del calendario
    const calendarCells = [];
    
    // Aggiungi celle vuote per i giorni prima dell'inizio del mese
    for (let i = 0; i < firstDay; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Aggiungi celle per ogni giorno del mese
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isAvailable = availableDates.includes(day);
      const isPast = date < new Date().setHours(0, 0, 0, 0);
      const isSunday = date.getDay() === 0;
      
      calendarCells.push(
        <div key={day} className="relative h-10 flex items-center justify-center">
          <button
            type="button"
            onClick={() => isAvailable && !isPast && !isSunday ? handleDateSelect(day) : null}
            disabled={!isAvailable || isPast || isSunday}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isSelected
                ? 'bg-blue-600 text-white'
                : isAvailable && !isPast && !isSunday
                  ? 'hover:bg-blue-100 text-blue-800'
                  : isPast || isSunday
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700'
            } ${
              isToday ? 'ring-2 ring-blue-600 ring-offset-2' : ''
            }`}
          >
            {day}
          </button>
        </div>
      );
    }
    
    return calendarCells;
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
          <Link to={`/professionista/${id}`} className="text-blue-600 hover:underline flex items-center text-sm">
            <ArrowLeft size={16} className="mr-2" /> Torna al profilo
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Prenota un appuntamento</h1>
        
        {/* Informazioni professionista */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
              {professional.name.charAt(0)}
            </div>
            <div className="ml-4">
              <h2 className="font-medium">{professional.name}</h2>
              <p className="text-sm text-gray-600">{professional.specialty}</p>
            </div>
          </div>
        </div>
        
        {/* Processo di prenotazione in 3 step */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Selezione servizio */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">1. Seleziona il servizio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professional.services.map((service, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className={`p-4 border rounded-md text-left ${
                    selectedService === service
                      ? 'border-blue-600 ring-2 ring-blue-100'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <h4 className="font-medium mb-1">{service}</h4>
                  <p className="text-sm text-gray-600">
                    €{professional.price.min === professional.price.max 
                      ? professional.price.min 
                      : `${professional.price.min}-${professional.price.max}`
                    }
                  </p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Step 2: Selezione data */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">2. Seleziona data</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={handlePrevMonth}
                  className="p-2 rounded-md hover:bg-gray-200"
                >
                  <ChevronLeft size={20} />
                </button>
                <h4 className="text-lg font-medium">
                  {currentMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })}
                </h4>
                <button 
                  onClick={handleNextMonth}
                  className="p-2 rounded-md hover:bg-gray-200"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              {/* Giorni della settimana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekdays.map(day => (
                  <div key={day} className="text-center font-medium text-sm text-gray-700">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendario */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                  Date disponibili
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 3: Selezione orario */}
          <div className={selectedDate ? 'mb-8' : 'hidden'}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">3. Seleziona orario</h3>
            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-md text-center ${
                      selectedTime === time
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {time}