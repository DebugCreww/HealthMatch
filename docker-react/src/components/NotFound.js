import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-lg">Page not found. Please check the URL or go back to the homepage.</p>
    </div>
  );
};

export default NotFound;