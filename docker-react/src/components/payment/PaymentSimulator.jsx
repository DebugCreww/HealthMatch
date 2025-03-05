// docker-react/src/components/payment/PaymentSimulator.jsx
import React, { useState } from 'react';

const PaymentSimulator = ({ onSuccess, onError }) => {
  const [selectedCard, setSelectedCard] = useState('success');
  const [loading, setLoading] = useState(false);

  const testCards = [
    { id: 'success', number: '4242 4242 4242 4242', outcome: 'Pagamento riuscito' },
    { id: 'decline', number: '4000 0000 0000 0002', outcome: 'Carta rifiutata' },
    { id: '3ds', number: '4000 0000 0000 3220', outcome: 'Autenticazione 3D Secure' }
  ];

  const simulatePayment = async () => {
    setLoading(true);
    // Simula un ritardo di rete
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (selectedCard === 'success') {
      onSuccess({
        id: `pi_${Math.random().toString(36).substring(2, 10)}`,
        status: 'succeeded'
      });
    } else {
      onError({
        message: selectedCard === 'decline' ? 'La carta è stata rifiutata' : 'Autenticazione 3D Secure richiesta'
      });
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-medium mb-4">Simulatore di pagamento (solo per test)</h3>
      
      <div className="space-y-3 mb-4">
        {testCards.map(card => (
          <div key={card.id} className="flex items-center">
            <input
              type="radio"
              id={card.id}
              name="test-card"
              value={card.id}
              checked={selectedCard === card.id}
              onChange={() => setSelectedCard(card.id)}
              className="mr-2"
            />
            <label htmlFor={card.id}>
              <span className="font-mono text-sm">{card.number}</span>
              <span className="ml-2 text-sm text-gray-600">({card.outcome})</span>
            </label>
          </div>
        ))}
      </div>
      
      <button
        onClick={simulatePayment}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {loading ? 'Simulazione...' : 'Simula pagamento'}
      </button>
    </div>
  );
};

export default PaymentSimulator;