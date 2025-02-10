import React from 'react';

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-primary">
      <form className="bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-primary">Login</h2>
        <input type="email" placeholder="Email" className="border w-full p-2 mb-4 rounded" />
        <input type="password" placeholder="Password" className="border w-full p-2 mb-4 rounded" />
        <button className="bg-primary text-white px-4 py-2 rounded w-full">Sign In</button>
      </form>
    </div>
  );
};

export default Login;