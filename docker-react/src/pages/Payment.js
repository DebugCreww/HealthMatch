import React from 'react';

const Payment = () => {
  return (
    <div className="p-8 bg-primary min-h-screen">
      <h1 className="text-3xl font-bold">Payment</h1>
      <p>Complete your transactions securely.</p>
      <form>
        <input type="text" placeholder="Card Number" className="border w-full p-2 mb-4 rounded" />
        <input type="text" placeholder="Expiration Date" className="border w-full p-2 mb-4 rounded" />
        <input type="text" placeholder="CVV" className="border w-full p-2 mb-4 rounded" />
        <button className="bg-primary text-white px-4 py-2 rounded w-full">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;