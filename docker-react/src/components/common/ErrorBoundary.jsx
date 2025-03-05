import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // In produzione, qui potresti loggare l'errore a un servizio
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-4">Qualcosa è andato storto</h2>
          <p className="text-gray-600 mb-4">
            Si è verificato un errore nell'applicazione. Prova a ricaricare la pagina.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ricarica pagina
          </button>
          {process.env.NODE_ENV !== 'production' && (
            <pre className="mt-4 p-4 bg-gray-100 text-red-500 overflow-auto text-left text-sm rounded">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;