import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    gender: "",
    birthDate: "",
    email: "",
    password: "",
    confirmPassword: "",
    certificate: null,
    userType: "paziente",
    specialty: "",
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Validazione del form
  useEffect(() => {
    const newErrors = {};
    
    if (touched.name && !formData.name) {
      newErrors.name = 'Il nome è obbligatorio';
    }
    
    if (touched.surname && !formData.surname) {
      newErrors.surname = 'Il cognome è obbligatorio';
    }
    
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
    
    if (touched.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non coincidono';
    }
    
    if (touched.userType && formData.userType === 'professionista') {
      if (!formData.specialty) {
        newErrors.specialty = 'Seleziona una specialità';
      }
      if (!formData.certificate) {
        newErrors.certificate = 'Carica il tuo certificato professionale';
      }
    }
    
    setErrors(newErrors);
  }, [formData, touched]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Marca tutti i campi come touched per mostrare eventuali errori
    setTouched({
      name: true,
      surname: true,
      email: true,
      password: true,
      confirmPassword: true,
      specialty: formData.userType === 'professionista',
      certificate: formData.userType === 'professionista'
    });
    
    // Verifica se ci sono errori prima di inviare
    const hasErrors = Object.keys(errors).length > 0;
    
    if (
      !formData.name || 
      !formData.surname || 
      !formData.email || 
      !formData.password ||
      formData.password !== formData.confirmPassword ||
      (formData.userType === 'professionista' && (!formData.specialty || !formData.certificate)) ||
      hasErrors
    ) {
      return;
    }
    
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'certificate' && files && files.length > 0) {
      setFormData({
        ...formData,
        certificate: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Nome"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
              Cognome
            </label>
            <input
              id="surname"
              name="surname"
              type="text"
              className={`w-full px-3 py-2 border ${errors.surname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Cognome"
              value={formData.surname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.surname && (
              <p className="mt-1 text-sm text-red-600">{errors.surname}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Genere
            </label>
            <select
              id="gender"
              name="gender"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Seleziona</option>
              <option value="m">Maschio</option>
              <option value="f">Femmina</option>
              <option value="o">Altro</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Data di nascita
            </label>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>

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

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Conferma Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="pt-4">
          <span className="text-sm font-medium text-gray-700">Tipo di account</span>
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

        {formData.userType === 'professionista' && (
          <>
            <div className="space-y-2">
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                Specialità
              </label>
              <select
                id="specialty"
                name="specialty"
                className={`w-full px-3 py-2 border ${errors.specialty ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                value={formData.specialty}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Seleziona specialità</option>
                <option value="cardiologia">Cardiologia</option>
                <option value="dermatologia">Dermatologia</option>
                <option value="ginecologia">Ginecologia</option>
                <option value="neurologia">Neurologia</option>
                <option value="oculistica">Oculistica</option>
                <option value="ortopedia">Ortopedia</option>
                <option value="pediatria">Pediatria</option>
                <option value="psicologia">Psicologia</option>
              </select>
              {errors.specialty && (
                <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="certificate" className="block text-sm font-medium text-gray-700">
                Certificato di abilitazione
              </label>
              <input
                id="certificate"
                name="certificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className={`w-full px-3 py-2 border ${errors.certificate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="text-xs text-gray-500 mt-1">Accettiamo PDF, JPG e PNG (max 5MB)</p>
              {errors.certificate && (
                <p className="mt-1 text-sm text-red-600">{errors.certificate}</p>
              )}
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            Hai già un account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Accedi!
            </Link>
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Registrazione...' : 'Registrati'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;