import React from 'react';
import logo from '../assets/Logo_Web.png'; // Importa il logo

const Header = () => {
  return (
    <header className="bg-primary text-white p-4">
      <nav className="flex justify-between items-center">
        <div className="flex items-center mx-auto">
          <img src={logo} alt="HealthMatch Logo" className="h-8 w-8 mr-2" /> {/* Aggiungi il logo */}
          <div className="text-xl font-bold">HealthMatch</div>
        </div>
        <ul className="flex space-x-4">
          <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
          <li><a href="/services" className="hover:underline">Services</a></li>
          <li><a href="/profile" className="hover:underline">Profile</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;