import React from 'react';
import { useParams } from 'react-router-dom';

const ProfessionalProfile = () => {
  const { id } = useParams();
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Professional Profile</h1>
      <p>Details and expertise of the selected professional.</p>
    </div>
  );
};

export default ProfessionalProfile;