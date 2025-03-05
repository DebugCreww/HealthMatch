import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ color = "text-blue-600", size = "text-2xl" }) => {
  return (
    <Link to="/" className={`font-bold ${color} ${size}`}>
      HealthMatch
    </Link>
  );
};

export default Logo;