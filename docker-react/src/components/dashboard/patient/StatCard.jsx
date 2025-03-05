import React from 'react';

const StatCard = ({ title, value, icon, color = 'bg-blue-100 text-blue-800' }) => {
  return (
    <div className={`p-6 rounded-lg shadow-sm bg-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full ${color} bg-opacity-20 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;