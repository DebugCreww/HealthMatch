import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'paziente',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validazione del form
  useEffect(() => {
    const newErrors = {};
    
    if (touched.email && !formData.email) {
      newErrors.email = 'L\'email è obbligatoria';
    } else if (touched.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
    }
    
    if (touched.password && !formData.password) {
      newErrors.password = 'La password è obbligatoria';
    } else if (touched.password && formData.password.length < 6) {
      newErrors.password = 'La password deve contenere almeno 6 caratteri';
    }
    
    setErrors(newErrors);
  }, [formData, touched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marca tutti i campi come touched per mostrare eventuali errori
    setTouched({
      email: true,
      password: true
    });
    
    // Verifica se ci sono errori prima di inviare
    const hasErrors = Object.keys(errors).length > 0;
    if (!formData.email || !formData.password || hasErrors) {
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="nome@esempio.it"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="pt-4">
          <span className="text-sm font-medium text-gray-700">Tipo di utente</span>
          <div className="mt-2 flex space-x-6">
            <div className="flex items-center">
              <input
                id="paziente"
                name="userType"
                type="radio"
                value="paziente"
                checked={formData.userType === 'paziente'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="paziente" className="ml-2 block text-sm text-gray-700">
                Paziente
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="professionista"
                name="userType"
                type="radio"
                value="professionista"
                checked={formData.userType === 'professionista'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor="professionista" className="ml-2 block text-sm text-gray-700">
                Professionista
              </label>
            </div>
          </div>
        </div>

        <div className="text-sm mt-2">
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 font-medium">
            Password dimenticata?
          </Link>
        </div>

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            Non hai un account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-medium">
              Registrati!
            </Link>
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Accesso...' : 'Accedi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;