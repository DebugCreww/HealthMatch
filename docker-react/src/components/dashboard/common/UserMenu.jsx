import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserMenu = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Chiudi il dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {user.name?.charAt(0) || 'U'}
      </div>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Il mio profilo
            </Link>
            <Link to="/profile/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Impostazioni
            </Link>
            <button
              onClick={onLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;