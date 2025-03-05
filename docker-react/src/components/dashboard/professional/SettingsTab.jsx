import React, { useState } from 'react';

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    weekdayStart: '09:00',
    weekdayEnd: '18:00',
    saturdayStart: '09:00',
    saturdayEnd: '13:00',
    appointmentDuration: 30
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Impostazioni salvate con successo!');
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Impostazioni Profilo</h2>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orari di disponibilità
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Lunedì-Venerdì</p>
                <div className="flex space-x-2">
                  <input 
                    type="time" 
                    name="weekdayStart"
                    className="px-3 py-2 border border-gray-300 rounded-md" 
                    value={settings.weekdayStart}
                    onChange={handleChange}
                  />
                  <span className="self-center">-</span>
                  <input 
                    type="time" 
                    name="weekdayEnd"
                    className="px-3 py-2 border border-gray-300 rounded-md" 
                    value={settings.weekdayEnd}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Sabato</p>
                <div className="flex space-x-2">
                  <input 
                    type="time" 
                    name="saturdayStart"
                    className="px-3 py-2 border border-gray-300 rounded-md" 
                    value={settings.saturdayStart}
                    onChange={handleChange}
                  />
                  <span className="self-center">-</span>
                  <input 
                    type="time" 
                    name="saturdayEnd"
                    className="px-3 py-2 border border-gray-300 rounded-md" 
                    value={settings.saturdayEnd}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durata visita predefinita (minuti)
            </label>
            <input 
              type="number" 
              name="appointmentDuration"
              className="px-3 py-2 border border-gray-300 rounded-md w-full" 
              value={settings.appointmentDuration}
              onChange={handleChange}
              min="10"
              step="5"
            />
          </div>
          
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Salva impostazioni
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;