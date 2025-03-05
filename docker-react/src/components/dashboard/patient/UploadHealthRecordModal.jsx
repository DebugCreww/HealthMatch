import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const UploadHealthRecordModal = ({ onClose, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    doctor: '',
    type: 'Laboratorio',
    file: null
  });
  
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setFileName(file.name);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.doctor || !formData.type) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }
    
    setLoading(true);
    
    try {
      // Mock upload - in un'implementazione reale, qui chiameresti l'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuliamo una risposta positiva
      const mockResponse = {
        id: Date.now(),
        ...formData,
        date: new Date().toLocaleDateString('it-IT'),
        status: 'Completato',
        fileName: fileName
      };
      
      toast.success('Documento caricato con successo');
      
      if (onUploadSuccess) {
        onUploadSuccess(mockResponse);
      }
      
      onClose();
    } catch (error) {
      toast.error('Errore durante il caricamento del documento');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Carica nuovo documento</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titolo*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medico/Struttura*
              </label>
              <input
                type="text"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo documento*
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="Laboratorio">Analisi di laboratorio</option>
                <option value="Diagnostica">Esame diagnostico</option>
                <option value="Visita">Referto visita</option>
                <option value="Prescrizione">Prescrizione medica</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documento
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
                <div className="space-y-1 text-center">
                  <Upload
                    className="mx-auto h-12 w-12 text-gray-400"
                    strokeWidth={1}
                  />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Carica un file</span>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">o trascina qui</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG fino a 10MB</p>
                </div>
              </div>
              {fileName && (
                <p className="mt-2 text-sm text-gray-600">{fileName}</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Caricamento...' : 'Carica documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadHealthRecordModal;