// src/services/healthRecordsService.js
import api from './api';
import { toast } from 'react-toastify';

/**
 * Servizio per la gestione avanzata dei documenti sanitari
 */

// Tipi di documento supportati
export const DOCUMENT_TYPES = {
  LAB_RESULT: 'Laboratorio',
  DIAGNOSTIC: 'Diagnostica',
  VISIT: 'Visita',
  PRESCRIPTION: 'Prescrizione',
  DISCHARGE: 'Dimissione',
  VACCINATION: 'Vaccinazione',
  OTHER: 'Altro'
};

// Tag comuni per documenti sanitari
export const COMMON_TAGS = [
  'Urgente', 'Controllo', 'Routine', 'Specialistica', 'Prevenzione',
  'Cardiologia', 'Ortopedia', 'Dermatologia', 'Ginecologia', 'Neurologia',
  'Psicologia', 'Oncologia', 'Pediatria', 'Oculistica', 'Allergologia'
];

// Funzione per ottenere i documenti sanitari
export const getHealthRecords = async (userId, filters = {}) => {
  try {
    // Costruisce i parametri di query per i filtri
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
    if (filters.tags && filters.tags.length > 0) {
      queryParams.append('tags', filters.tags.join(','));
    }
    
    const url = `/health-records${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // In produzione, qui chiameremmo l'API
    // const response = await api.get(url);
    // return response.data;
    
    // Per ora, generiamo dati di esempio
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockData = [
      {
        id: 1,
        title: 'Analisi del sangue',
        date: '2025-02-10',
        doctor: 'Dr. Paolo Verdi',
        facility: 'Laboratorio Centrale',
        type: DOCUMENT_TYPES.LAB_RESULT,
        status: 'Completato',
        tags: ['Routine', 'Controllo'],
        fileUrl: '#',
        fileName: 'analisi_sangue_10022025.pdf',
        fileType: 'application/pdf',
        fileSize: '1.2 MB',
        isShared: false,
        notes: 'Controllo annuale completo',
        results: {
          glucose: { value: '95', unit: 'mg/dL', isNormal: true },
          hgb: { value: '14.2', unit: 'g/dL', isNormal: true },
          cholesterol: { value: '210', unit: 'mg/dL', isNormal: false }
        }
      },
      {
        id: 2,
        title: 'Radiografia torace',
        date: '2025-01-20',
        doctor: 'Dr.ssa Sara Neri',
        facility: 'Ospedale San Raffaele',
        type: DOCUMENT_TYPES.DIAGNOSTIC,
        status: 'Completato',
        tags: ['Specialistica', 'Pneumologia'],
        fileUrl: '#',
        fileName: 'rx_torace_20012025.pdf',
        fileType: 'application/pdf',
        fileSize: '3.5 MB',
        isShared: true,
        sharedWith: [{ id: 101, name: 'Dr. Marco Rossi' }],
        notes: 'Controllo post influenza'
      },
      {
        id: 3,
        title: 'Visita cardiologica',
        date: '2024-12-05',
        doctor: 'Dr. Marco Rossi',
        facility: 'Centro Medico Europa',
        type: DOCUMENT_TYPES.VISIT,
        status: 'Completato',
        tags: ['Specialistica', 'Cardiologia', 'Controllo'],
        fileUrl: '#',
        fileName: 'referto_cardio_05122024.pdf',
        fileType: 'application/pdf',
        fileSize: '0.8 MB',
        isShared: false,
        notes: 'Controllo annuale, ECG nella norma'
      },
      {
        id: 4,
        title: 'Prescrizione farmaci',
        date: '2025-02-15',
        doctor: 'Dr. Andrea Bianchi',
        facility: 'Studio medico',
        type: DOCUMENT_TYPES.PRESCRIPTION,
        status: 'Attivo',
        tags: ['Cardiologia', 'Farmaci'],
        fileUrl: '#',
        fileName: 'ricetta_15022025.pdf',
        fileType: 'application/pdf',
        fileSize: '0.3 MB',
        isShared: false,
        notes: 'Prescrizione farmaci per ipertensione',
        medications: [
          { name: 'Norvasc', dosage: '5mg', frequency: '1 volta al giorno' },
          { name: 'Aspirina', dosage: '100mg', frequency: '1 volta al giorno' }
        ]
      },
      {
        id: 5,
        title: 'Vaccinazione antinfluenzale',
        date: '2024-11-10',
        doctor: 'Dr.ssa Maria Verdi',
        facility: 'ASL Roma 1',
        type: DOCUMENT_TYPES.VACCINATION,
        status: 'Completato',
        tags: ['Prevenzione', 'Vaccinazione'],
        fileUrl: '#',
        fileName: 'vacc_influenza_10112024.pdf',
        fileType: 'application/pdf',
        fileSize: '0.4 MB',
        isShared: false,
        notes: 'Vaccino stagionale'
      }
    ];
    
    // Applica i filtri lato client per il mock
    let filteredData = [...mockData];
    
    if (filters.type) {
      filteredData = filteredData.filter(record => record.type === filters.type);
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredData = filteredData.filter(record => new Date(record.date) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredData = filteredData.filter(record => new Date(record.date) <= endDate);
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredData = filteredData.filter(record => 
        record.title.toLowerCase().includes(term) || 
        record.doctor.toLowerCase().includes(term) ||
        record.notes?.toLowerCase().includes(term)
      );
    }
    
    if (filters.tags && filters.tags.length > 0) {
      filteredData = filteredData.filter(record => 
        filters.tags.some(tag => record.tags.includes(tag))
      );
    }
    
    return filteredData;
  } catch (error) {
    console.error('Error fetching health records:', error);
    toast.error('Errore nel recupero dei documenti sanitari');
    throw error;
  }
};

// Funzione per ottenere un documento sanitario specifico
export const getHealthRecord = async (recordId) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.get(`/health-records/${recordId}`);
    // return response.data;
    
    // Per ora, restituiamo dati di esempio
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simula il documento richiesto
    const mockData = {
      id: recordId,
      title: 'Analisi del sangue',
      date: '2025-02-10',
      doctor: 'Dr. Paolo Verdi',
      facility: 'Laboratorio Centrale',
      type: DOCUMENT_TYPES.LAB_RESULT,
      status: 'Completato',
      tags: ['Routine', 'Controllo'],
      fileUrl: '#',
      fileName: 'analisi_sangue_10022025.pdf',
      fileType: 'application/pdf',
      fileSize: '1.2 MB',
      isShared: false,
      notes: 'Controllo annuale completo',
      results: {
        glucose: { value: '95', unit: 'mg/dL', isNormal: true, range: '70-100' },
        hgb: { value: '14.2', unit: 'g/dL', isNormal: true, range: '12-16' },
        wbc: { value: '7.5', unit: 'x10^9/L', isNormal: true, range: '4-11' },
        rbc: { value: '4.8', unit: 'x10^12/L', isNormal: true, range: '4.2-5.9' },
        cholesterol: { value: '210', unit: 'mg/dL', isNormal: false, range: '<200' },
        ldl: { value: '140', unit: 'mg/dL', isNormal: false, range: '<130' },
        hdl: { value: '50', unit: 'mg/dL', isNormal: true, range: '>40' },
        triglycerides: { value: '150', unit: 'mg/dL', isNormal: true, range: '<150' }
      }
    };
    
    return mockData;
  } catch (error) {
    console.error(`Error fetching health record ${recordId}:`, error);
    toast.error('Errore nel recupero del documento sanitario');
    throw error;
  }
};

// Funzione per caricare un nuovo documento sanitario
export const uploadHealthRecord = async (recordData, file) => {
  try {
    // In produzione, qui useremmo FormData per caricare il file
    const formData = new FormData();
    formData.append('file', file);
    
    // Aggiungiamo i dati del documento
    Object.keys(recordData).forEach(key => {
      if (key === 'tags' && Array.isArray(recordData[key])) {
        formData.append(key, JSON.stringify(recordData[key]));
      } else {
        formData.append(key, recordData[key]);
      }
    });
    
    // In produzione, qui chiameremmo l'API
    // const response = await api.post('/health-records', formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // });
    // return response.data;
    
    // Per ora, simuliamo una risposta
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResponse = {
      id: Date.now(),
      ...recordData,
      fileName: file.name,
      fileType: file.type,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Completato',
      uploadDate: new Date().toISOString()
    };
    
    toast.success('Documento caricato con successo!');
    return mockResponse;
  } catch (error) {
    console.error('Error uploading health record:', error);
    toast.error('Errore durante il caricamento del documento');
    throw error;
  }
};

// Funzione per aggiornare un documento sanitario
export const updateHealthRecord = async (recordId, recordData) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.put(`/health-records/${recordId}`, recordData);
    // return response.data;
    
    // Per ora, simuliamo una risposta
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResponse = {
      id: recordId,
      ...recordData,
      updatedAt: new Date().toISOString()
    };
    
    toast.success('Documento aggiornato con successo!');
    return mockResponse;
  } catch (error) {
    console.error(`Error updating health record ${recordId}:`, error);
    toast.error('Errore durante l\'aggiornamento del documento');
    throw error;
  }
};

// Funzione per eliminare un documento sanitario
export const deleteHealthRecord = async (recordId) => {
  try {
    // In produzione, qui chiameremmo l'API
    // await api.delete(`/health-records/${recordId}`);
    
    // Per ora, simuliamo una risposta
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Documento eliminato con successo!');
    return { success: true };
  } catch (error) {
    console.error(`Error deleting health record ${recordId}:`, error);
    toast.error('Errore durante l\'eliminazione del documento');
    throw error;
  }
};

// Funzione per condividere un documento sanitario con un professionista
export const shareHealthRecord = async (recordId, professionalId, permissions = { canView: true, canEdit: false }) => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.post(`/health-records/${recordId}/share`, {
    //   professionalId,
    //   permissions
    // });
    // return response.data;
    
    // Per ora, simuliamo una risposta
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResponse = {
      recordId,
      sharedWith: {
        id: professionalId,
        name: 'Dr. Marco Rossi',
        permissions
      },
      sharedAt: new Date().toISOString()
    };
    
    toast.success('Documento condiviso con successo!');
    return mockResponse;
  } catch (error) {
    console.error(`Error sharing health record ${recordId}:`, error);
    toast.error('Errore durante la condivisione del documento');
    throw error;
  }
};

// Funzione per revocare la condivisione di un documento sanitario
export const revokeHealthRecordShare = async (recordId, professionalId) => {
  try {
    // In produzione, qui chiameremmo l'API
    // await api.delete(`/health-records/${recordId}/share/${professionalId}`);
    
    // Per ora, simuliamo una risposta
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast.success('Condivisione revocata con successo!');
    return { success: true };
  } catch (error) {
    console.error(`Error revoking health record ${recordId} share:`, error);
    toast.error('Errore durante la revoca della condivisione');
    throw error;
  }
};

// Funzione per scaricare un documento sanitario
export const downloadHealthRecord = async (recordId) => {
  try {
    // In produzione, qui chiameremmo l'API con responseType: 'blob'
    // const response = await api.get(`/health-records/${recordId}/download`, {
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
    // let fileName = 'document.pdf';
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
    
    toast.success('Download completato!');
    return { success: true };
  } catch (error) {
    console.error(`Error downloading health record ${recordId}:`, error);
    toast.error('Errore durante il download del documento');
    throw error;
  }
};

// Funzione per ottenere le statistiche sui documenti sanitari
export const getHealthRecordsStats = async () => {
  try {
    // In produzione, qui chiameremmo l'API
    // const response = await api.get('/health-records/stats');
    // return response.data;
    
    // Per ora, restituiamo dati di esempio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      totalRecords: 12,
      byType: {
        [DOCUMENT_TYPES.LAB_RESULT]: 4,
        [DOCUMENT_TYPES.DIAGNOSTIC]: 3,
        [DOCUMENT_TYPES.VISIT]: 2,
        [DOCUMENT_TYPES.PRESCRIPTION]: 2,
        [DOCUMENT_TYPES.VACCINATION]: 1
      },
      byYear: {
        '2024': 8,
        '2023': 3,
        '2022': 1
      },
      sharedRecords: 3,
      lastUpload: '2025-02-15T14:30:00.000Z'
    };
  } catch (error) {
    console.error('Error fetching health records stats:', error);
    return null;
  }
};

export default {
  getHealthRecords,
  getHealthRecord,
  uploadHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
  shareHealthRecord,
  revokeHealthRecordShare,
  downloadHealthRecord,
  getHealthRecordsStats,
  DOCUMENT_TYPES,
  COMMON_TAGS
};