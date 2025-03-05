import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  // Configurazione stili in base al tipo
  const config = {
    success: {
      icon: <CheckCircle className="h-5 w-5" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-400',
      borderColor: 'border-green-400'
    },
    error: {
      icon: <AlertCircle className="h-5 w-5" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-800',
      iconColor: 'text-red-400',
      borderColor: 'border-red-400'
    },
    info: {
      icon: <Info className="h-5 w-5" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-400',
      borderColor: 'border-blue-400'
    }
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  // Auto-chiusura dopo duration ms
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const { icon, bgColor, textColor, iconColor, borderColor } = config[type] || config.info;

  return (
    <div className={`p-4 ${bgColor} border-l-4 ${borderColor} rounded-lg mb-4`}>
      <div className="flex">
        <div className={`flex-shrink-0 ${iconColor}`}>
          {icon}
        </div>
        <div className={`ml-3 ${textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={handleClose}
                className={`inline-flex rounded-md p-1.5 ${textColor} focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <span className="sr-only">Chiudi</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;