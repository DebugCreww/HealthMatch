// src/services/paymentService.js
import api from './api';
import { toast } from 'react-toastify';

/**
 * Servizio per la gestione avanzata dei pagamenti
 */

// Metodi di pagamento supportati
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  APPLE_PAY: 'apple_pay',
  GOOGLE_PAY: 'google_pay'
};

// Tipi di fatturazione
export const INVOICE_TYPES = {
  RECEIPT: 'receipt',  // Ricevuta semplice
  INVOICE: 'invoice',  // Fattura
  TAX_INVOICE: 'tax_invoice'  // Fattura fiscale
};

// Funzione per creare un intent di pagamento
export const createPaymentIntent = async (bookingData) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.post('/payments/create-intent', bookingData);
    // return response.data;
    
    // Simuliamo una risposta di successo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const response = {
      clientSecret: 'pi_mock_secret_' + Math.random().toString(36).substring(2, 10),
      id: 'pi_' + Math.random().toString(36).substring(2, 10),
      amount: bookingData.amount,
      currency: bookingData.currency || 'eur',
      status: 'requires_payment_method'
    };
    
    return response;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    toast.error('Errore durante la creazione del pagamento');
    throw error;
  }
};

// Funzione per confermare un pagamento
export const confirmPayment = async (paymentIntentId, paymentMethodId) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.post(`/payments/${paymentIntentId}/confirm`, {
    //   payment_method_id: paymentMethodId
    // });
    // return response.data;
    
    // Simuliamo una risposta di successo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = {
      id: paymentIntentId,
      status: 'succeeded',
      amount: 10000, // In centesimi
      currency: 'eur',
      created: Date.now(),
      payment_method: paymentMethodId,
      receipt_url: '#',
      invoice_id: 'inv_' + Math.random().toString(36).substring(2, 10)
    };
    
    toast.success('Pagamento completato con successo!');
    return response;
  } catch (error) {
    console.error('Error confirming payment:', error);
    toast.error('Errore durante la conferma del pagamento');
    throw error;
  }
};

// Funzione per ottenere i metodi di pagamento salvati
export const getSavedPaymentMethods = async () => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.get('/payments/methods');
    // return response.data;
    
    // Simuliamo dati di esempio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 'pm_mock_123456',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        },
        billing_details: {
          name: 'Mario Rossi',
          address: {
            city: 'Milano',
            country: 'IT',
            line1: 'Via Roma 123',
            postal_code: '20100'
          }
        },
        created: Date.now() - 86400000 * 30, // 30 giorni fa
        isDefault: true
      },
      {
        id: 'pm_mock_789012',
        type: 'card',
        card: {
          brand: 'mastercard',
          last4: '5555',
          exp_month: 10,
          exp_year: 2026
        },
        billing_details: {
          name: 'Mario Rossi',
          address: {
            city: 'Milano',
            country: 'IT',
            line1: 'Via Milano 456',
            postal_code: '20100'
          }
        },
        created: Date.now() - 86400000 * 15, // 15 giorni fa
        isDefault: false
      }
    ];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    toast.error('Errore durante il recupero dei metodi di pagamento');
    throw error;
  }
};

// Funzione per salvare un nuovo metodo di pagamento
export const savePaymentMethod = async (paymentMethodData) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.post('/payments/methods', paymentMethodData);
    // return response.data;
    
    // Simuliamo una risposta di successo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockPaymentMethod = {
      id: 'pm_mock_' + Math.random().toString(36).substring(2, 10),
      type: paymentMethodData.type,
      created: Date.now(),
      isDefault: paymentMethodData.isDefault || false
    };
    
    // Simula dati specifici in base al tipo di metodo di pagamento
    if (paymentMethodData.type === 'card') {
      mockPaymentMethod.card = {
        brand: paymentMethodData.card_brand || 'visa',
        last4: paymentMethodData.card_number.slice(-4),
        exp_month: parseInt(paymentMethodData.exp_month),
        exp_year: parseInt(paymentMethodData.exp_year)
      };
      mockPaymentMethod.billing_details = {
        name: paymentMethodData.name,
        address: {
          city: paymentMethodData.city,
          country: paymentMethodData.country || 'IT',
          line1: paymentMethodData.address,
          postal_code: paymentMethodData.postal_code
        }
      };
    }
    
    toast.success('Metodo di pagamento salvato con successo!');
    return mockPaymentMethod;
  } catch (error) {
    console.error('Error saving payment method:', error);
    toast.error('Errore durante il salvataggio del metodo di pagamento');
    throw error;
  }
};

// Funzione per eliminare un metodo di pagamento
export const deletePaymentMethod = async (paymentMethodId) => {
  try {
    // In produzione, qui chiameremmo l'API
    // await api.delete(`/payments/methods/${paymentMethodId}`);
    
    // Simuliamo un'elaborazione
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Metodo di pagamento eliminato con successo!');
    return { success: true };
  } catch (error) {
    console.error('Error deleting payment method:', error);
    toast.error('Errore durante l\'eliminazione del metodo di pagamento');
    throw error;
  }
};

// Funzione per impostare un metodo di pagamento come predefinito
export const setDefaultPaymentMethod = async (paymentMethodId) => {
  try {
    // In produzione, qui chiameremmo l'API
    // await api.post(`/payments/methods/${paymentMethodId}/set-default`);
    
    // Simuliamo un'elaborazione
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Metodo di pagamento impostato come predefinito');
    return { success: true };
  } catch (error) {
    console.error('Error setting default payment method:', error);
    toast.error('Errore durante l\'impostazione del metodo di pagamento predefinito');
    throw error;
  }
};

// Funzione per ottenere la cronologia dei pagamenti
export const getPaymentHistory = async (filters = {}) => {
  try {
    // Costruisce i parametri di query per i filtri
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    // In produzione, qui chiameremmo l'API
    // const response = await api.get(`/payments/history?${queryParams.toString()}`);
    // return response.data;
    
    // Simuliamo dati di esempio
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const mockTransactions = [
      {
        id: 'py_mock_123456',
        amount: 12000, // 120.00 EUR in centesimi
        currency: 'eur',
        status: 'succeeded',
        date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 giorni fa
        description: 'Visita cardiologica',
        payment_method: {
          type: 'card',
          details: 'Visa •••• 4242'
        },
        receipt_url: '#',
        invoice_id: 'inv_987654',
        professional: {
          id: 1,
          name: 'Dr. Marco Rossi'
        }
      },
      {
        id: 'py_mock_789012',
        amount: 8000, // 80.00 EUR in centesimi
        currency: 'eur',
        status: 'succeeded',
        date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 giorni fa
        description: 'Elettrocardiogramma',
        payment_method: {
          type: 'card',
          details: 'Mastercard •••• 5555'
        },
        receipt_url: '#',
        invoice_id: 'inv_876543',
        professional: {
          id: 1,
          name: 'Dr. Marco Rossi'
        }
      },
      {
        id: 'py_mock_345678',
        amount: 15000, // 150.00 EUR in centesimi
        currency: 'eur',
        status: 'succeeded',
        date: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 giorni fa
        description: 'Visita dermatologica',
        payment_method: {
          type: 'card',
          details: 'Visa •••• 4242'
        },
        receipt_url: '#',
        invoice_id: 'inv_765432',
        professional: {
          id: 2,
          name: 'Dr.ssa Giulia Bianchi'
        }
      }
    ];
    
    // Applica filtri lato client per il mock
    let filteredData = [...mockTransactions];
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredData = filteredData.filter(transaction => new Date(transaction.date) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredData = filteredData.filter(transaction => new Date(transaction.date) <= endDate);
    }
    
    if (filters.status) {
      filteredData = filteredData.filter(transaction => transaction.status === filters.status);
    }
    
    if (filters.limit) {
      filteredData = filteredData.slice(0, parseInt(filters.limit));
    }
    
    return filteredData;
  } catch (error) {
    console.error('Error fetching payment history:', error);
    toast.error('Errore durante il recupero della cronologia pagamenti');
    throw error;
  }
};

// Funzione per ottenere tutte le fatture
export const getInvoices = async (filters = {}) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.get('/invoices', { params: filters });
    // return response.data;
    
    // Simuliamo dati di esempio
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const mockInvoices = [
      {
        id: 'inv_987654',
        amount: 12000, // 120.00 EUR in centesimi
        currency: 'eur',
        status: 'paid',
        date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 giorni fa
        due_date: new Date(Date.now() - 86400000 * 2).toISOString(),
        payment_date: new Date(Date.now() - 86400000 * 2).toISOString(),
        description: 'Visita cardiologica',
        invoice_number: 'FT-2025-001',
        invoice_url: '#',
        invoice_type: INVOICE_TYPES.INVOICE,
        tax_rate: 22,
        payment_method: {
          type: 'card',
          details: 'Visa •••• 4242'
        },
        items: [
          {
            description: 'Visita cardiologica',
            quantity: 1,
            unit_price: 12000,
            amount: 12000
          }
        ],
        professional: {
          id: 1,
          name: 'Dr. Marco Rossi',
          vat_number: 'IT12345678901',
          address: 'Via Roma 123, Milano'
        },
        customer: {
          name: 'Mario Rossi',
          address: 'Via Milano 456, Milano',
          fiscal_code: 'RSSMRA80A01F205X'
        }
      },
      {
        id: 'inv_876543',
        amount: 8000, // 80.00 EUR in centesimi
        currency: 'eur',
        status: 'paid',
        date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 giorni fa
        due_date: new Date(Date.now() - 86400000 * 10).toISOString(),
        payment_date: new Date(Date.now() - 86400000 * 10).toISOString(),
        description: 'Elettrocardiogramma',
        invoice_number: 'FT-2025-002',
        invoice_url: '#',
        invoice_type: INVOICE_TYPES.RECEIPT,
        tax_rate: 0,
        payment_method: {
          type: 'card',
          details: 'Mastercard •••• 5555'
        },
        items: [
          {
            description: 'Elettrocardiogramma',
            quantity: 1,
            unit_price: 8000,
            amount: 8000
          }
        ],
        professional: {
          id: 1,
          name: 'Dr. Marco Rossi',
          vat_number: 'IT12345678901',
          address: 'Via Roma 123, Milano'
        },
        customer: {
          name: 'Mario Rossi',
          address: 'Via Milano 456, Milano',
          fiscal_code: 'RSSMRA80A01F205X'
        }
      },
      {
        id: 'inv_765432',
        amount: 15000, // 150.00 EUR in centesimi
        currency: 'eur',
        status: 'paid',
        date: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 giorni fa
        due_date: new Date(Date.now() - 86400000 * 20).toISOString(),
        payment_date: new Date(Date.now() - 86400000 * 20).toISOString(),
        description: 'Visita dermatologica',
        invoice_number: 'FT-2025-003',
        invoice_url: '#',
        invoice_type: INVOICE_TYPES.TAX_INVOICE,
        tax_rate: 22,
        payment_method: {
          type: 'card',
          details: 'Visa •••• 4242'
        },
        items: [
          {
            description: 'Visita dermatologica',
            quantity: 1,
            unit_price: 15000,
            amount: 15000
          }
        ],
        professional: {
          id: 2,
          name: 'Dr.ssa Giulia Bianchi',
          vat_number: 'IT98765432101',
          address: 'Via Napoli 789, Roma'
        },
        customer: {
          name: 'Mario Rossi',
          address: 'Via Milano 456, Milano',
          fiscal_code: 'RSSMRA80A01F205X'
        }
      }
    ];
    
    return mockInvoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    toast.error('Errore durante il recupero delle fatture');
    throw error;
  }
};

// Funzione per scaricare una fattura
export const downloadInvoice = async (invoiceId) => {
  try {
    // In produzione, qui chiameremmo l'API con responseType: 'blob'
    // const response = await api.get(`/invoices/${invoiceId}/download`, {
    //   responseType: 'blob'
    // });
    // 
    // // Crea un URL per il blob
    // const url = window.URL.createObjectURL(new Blob([response.data]));
    // const link = document.createElement('a');
    // link.href = url;
    // 
    // // Ottieni il nome del file dall'header Content-Disposition o usa un nome predefinito
    // const contentDisposition = response.headers['content-disposition'];
    // let fileName = 'fattura.pdf';
    // if (contentDisposition) {
    //   const match = contentDisposition.match(/filename="(.+)"/);
    //   if (match.length === 2) fileName = match[1];
    // }
    // 
    // link.setAttribute('download', fileName);
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    
    // Per ora, simuliamo il download
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Download fattura completato!');
    return { success: true };
  } catch (error) {
    console.error(`Error downloading invoice ${invoiceId}:`, error);
    toast.error('Errore durante il download della fattura');
    throw error;
  }
};

// Funzione per richiedere un rimborso
export const requestRefund = async (paymentId, reason, amount = null) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.post(`/payments/${paymentId}/refund`, {
    //   reason,
    //   amount
    // });
    // return response.data;
    
    // Simuliamo una risposta di successo
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const mockRefund = {
      id: 're_' + Math.random().toString(36).substring(2, 10),
      payment_id: paymentId,
      amount: amount || (Math.floor(Math.random() * 10000) + 5000), // Importo casuale tra 50 e 150 euro
      currency: 'eur',
      status: 'pending',
      reason: reason,
      created: Date.now()
    };
    
    toast.success('Richiesta di rimborso inviata con successo!');
    return mockRefund;
  } catch (error) {
    console.error('Error requesting refund:', error);
    toast.error('Errore durante la richiesta di rimborso');
    throw error;
  }
};

// Funzione per ottenere lo stato di un rimborso
export const getRefundStatus = async (refundId) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.get(`/refunds/${refundId}`);
    // return response.data;
    
    // Simuliamo una risposta di successo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Genera casualmente uno stato di rimborso
    const statuses = ['pending', 'processing', 'succeeded', 'failed'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: refundId,
      status: randomStatus,
      amount: Math.floor(Math.random() * 10000) + 5000,
      currency: 'eur',
      created: Date.now() - Math.floor(Math.random() * 86400000 * 10),
      estimated_arrival: Date.now() + Math.floor(Math.random() * 86400000 * 10)
    };
  } catch (error) {
    console.error(`Error fetching refund status for ${refundId}:`, error);
    toast.error('Errore durante il recupero dello stato del rimborso');
    throw error;
  }
};

// Funzione per ottenere statistiche sui pagamenti
export const getPaymentStats = async () => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.get('/payments/stats');
    // return response.data;
    
    // Simuliamo dati di esempio
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      total_spent: 35000, // 350.00 EUR in centesimi
      count: 3,
      average: 11667, // 116.67 EUR in centesimi
      breakdown: {
        'Dr. Marco Rossi': 20000, // 200.00 EUR
        'Dr.ssa Giulia Bianchi': 15000 // 150.00 EUR
      },
      by_month: {
        '2025-01': 15000,
        '2025-02': 20000
      },
      by_service: {
        'Visita cardiologica': 12000,
        'Elettrocardiogramma': 8000,
        'Visita dermatologica': 15000
      }
    };
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    return null;
  }
};

// Funzione per esportare le fatture
export const exportInvoices = async (format = 'pdf', filters = {}) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.get('/invoices/export', {
    //   params: { format, ...filters },
    //   responseType: 'blob'
    // });
    // 
    // // Crea un URL per il blob
    // const url = window.URL.createObjectURL(new Blob([response.data]));
    // const link = document.createElement('a');
    // link.href = url;
    // 
    // // Nome del file
    // let fileName = `fatture_export_${new Date().toISOString().slice(0, 10)}.${format}`;
    // 
    // link.setAttribute('download', fileName);
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    
    // Per ora, simuliamo l'esportazione
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(`Esportazione completata in formato ${format.toUpperCase()}!`);
    return { success: true };
  } catch (error) {
    console.error('Error exporting invoices:', error);
    toast.error('Errore durante l\'esportazione delle fatture');
    throw error;
  }
};

// Funzione per generare una ricevuta fiscale
export const generateInvoice = async (data) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.post('/invoices/generate', data);
    // return response.data;
    
    // Simuliamo una risposta di successo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockInvoice = {
      id: 'inv_' + Math.random().toString(36).substring(2, 10),
      amount: data.amount,
      currency: data.currency || 'eur',
      status: 'pending',
      date: new Date().toISOString(),
      due_date: new Date(Date.now() + 86400000 * 30).toISOString(), // 30 giorni da oggi
      description: data.description,
      invoice_number: `FT-2025-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      invoice_url: '#',
      invoice_type: data.invoice_type || INVOICE_TYPES.INVOICE,
      tax_rate: data.tax_rate || 22,
      items: data.items || [
        {
          description: data.description,
          quantity: 1,
          unit_price: data.amount,
          amount: data.amount
        }
      ],
      professional: data.professional,
      customer: data.customer
    };
    
    toast.success('Fattura generata con successo!');
    return mockInvoice;
  } catch (error) {
    console.error('Error generating invoice:', error);
    toast.error('Errore durante la generazione della fattura');
    throw error;
  }
};

// Esporta tutte le funzioni e costanti
export default {
  createPaymentIntent,
  confirmPayment,
  getSavedPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  getPaymentHistory,
  getInvoices,
  downloadInvoice,
  requestRefund,
  getRefundStatus,
  getPaymentStats,
  exportInvoices,
  generateInvoice,
  PAYMENT_METHODS,
  INVOICE_TYPES
};