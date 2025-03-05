import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import UserMenu from './UserMenu';
import Logo from '../../common/Logo';

const DashboardHeader = ({ user, notifications, onLogout, title, subtitle }) => {
  if (!user) return null;
  
  // Determina l'URL della Dashboard in base al tipo di utente
  const DashboardUrl = user.userType === 'professionista' 
    ? '/Dashboard/professionista' 
    : '/Dashboard/paziente';
  
  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-6">
              {/* Il Logo ora reindirizza alla Dashboard corretta invece che alla homepage */}
              <Link to={DashboardUrl}>
                <Logo color="text-blue-600" size="text-xl" />
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title || "Dashboard"}</h1>
              <p className="text-gray-600">{subtitle || `Benvenuto, ${user?.name}`}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell size={20} className="text-gray-600 cursor-pointer" />
              {notifications && notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
            <Link to="/profile/settings">
              <Settings size={20} className="text-gray-600" />
            </Link>
            <UserMenu user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;