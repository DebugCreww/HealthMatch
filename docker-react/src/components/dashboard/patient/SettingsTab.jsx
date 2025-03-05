import React, { useState } from 'react';

const SettingsTab = ({ user }) => {
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    notifications: {
      email: true,
      app: true,
      sms: false
    }
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        notifications: {
          ...formData.notifications,
          [name]: checked
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Impostazioni salvate con successo');
  };
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-6">Impostazioni profilo</h2>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                name="firstName"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.firstName}
                onChange={handleChange}
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Cognome</label>
             <input
               type="text"
               name="lastName"
               className="w-full px-3 py-2 border border-gray-300 rounded-md"
               value={formData.lastName}
               onChange={handleChange}
             />
           </div>
         </div>
         
         <div className="mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
           <input
             type="email"
             name="email"
             className="w-full px-3 py-2 border border-gray-300 rounded-md"
             value={formData.email}
             onChange={handleChange}
           />
         </div>
         
         <div className="mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
           <input
             type="tel"
             name="phone"
             className="w-full px-3 py-2 border border-gray-300 rounded-md"
             value={formData.phone}
             onChange={handleChange}
           />
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Indirizzo</label>
             <input
               type="text"
               name="address"
               className="w-full px-3 py-2 border border-gray-300 rounded-md"
               value={formData.address}
               onChange={handleChange}
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Città</label>
             <input
               type="text"
               name="city"
               className="w-full px-3 py-2 border border-gray-300 rounded-md"
               value={formData.city}
               onChange={handleChange}
             />
           </div>
         </div>
         
         <div className="mb-6">
           <h3 className="text-md font-medium text-gray-700 mb-2">Preferenze notifiche</h3>
           <div className="space-y-2">
             <div className="flex items-center">
               <input
                 type="checkbox"
                 id="email-notifications"
                 name="email"
                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                 checked={formData.notifications.email}
                 onChange={handleChange}
               />
               <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                 Notifiche email
               </label>
             </div>
             <div className="flex items-center">
               <input
                 type="checkbox"
                 id="app-notifications"
                 name="app"
                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                 checked={formData.notifications.app}
                 onChange={handleChange}
               />
               <label htmlFor="app-notifications" className="ml-2 block text-sm text-gray-700">
                 Notifiche app
               </label>
             </div>
             <div className="flex items-center">
               <input
                 type="checkbox"
                 id="sms-notifications"
                 name="sms"
                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                 checked={formData.notifications.sms}
                 onChange={handleChange}
               />
               <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-700">
                 Notifiche SMS
               </label>
             </div>
           </div>
         </div>
         
         <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
           Salva modifiche
         </button>
       </form>
     </div>
   </div>
 );
};

export default SettingsTab;