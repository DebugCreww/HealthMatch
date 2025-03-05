// docker-react/src/components/payment/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../../services/api';

const PaymentForm = ({ bookingData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Crea l'intent di pagamento sul backend
      const response = await api.post('/payments/stripe/create-payment-intent', {
        amount: bookingData.amount,
        booking_id: bookingData.id,
        client_id: bookingData.client_id,
        professional_id: bookingData.professional_id
      });

      // Conferma il pagamento con Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        response.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: bookingData.clientName,
            },
          },
        }
      );

      if (error) {
        setError(`Errore nel pagamento: ${error.message}`);
        onError && onError(error);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess && onSuccess(paymentIntent);
      }
    } catch (err) {
      setError(`Errore nella richiesta: ${err.message}`);
      onError && onError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dettagli carta
        </label>
        <div className="p-4 border border-gray-300 rounded-md">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md ${
          (!stripe || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
        }`}
      >
        {loading ? 'Elaborazione...' : `Paga €${bookingData.amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;