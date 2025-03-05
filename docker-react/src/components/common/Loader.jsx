import React from 'react';

const Loader = ({ size = 'md', color = 'blue', fullPage = false }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  const colors = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
  };
  
  const spinnerSize = sizes[size] || sizes.md;
  const spinnerColor = colors[color] || colors.blue;
  
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className={`animate-spin rounded-full ${spinnerSize} border-2 border-t-transparent ${spinnerColor}`}></div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center p-4">
      <div className={`animate-spin rounded-full ${spinnerSize} border-2 border-t-transparent ${spinnerColor}`}></div>
    </div>
  );
};

export default Loader;