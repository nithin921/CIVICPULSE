import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OfflineContext = createContext();

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingReports, setPendingReports] = useState([]);

  const syncPendingReports = useCallback(async () => {
    if (pendingReports.length === 0) return;

    try {
      // Simulate syncing reports to server
      for (const report of pendingReports) {
        // In a real app, you would send these to your backend
        console.log('Syncing report:', report);
      }
      
      // Clear pending reports after successful sync
      setPendingReports([]);
      localStorage.removeItem('civic_pulse_pending_reports');
    } catch (error) {
      console.error('Failed to sync reports:', error);
    }
  }, [pendingReports]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingReports();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending reports from localStorage
    const saved = localStorage.getItem('civic_pulse_pending_reports');
    if (saved) {
      setPendingReports(JSON.parse(saved));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingReports]);

  const addPendingReport = (report) => {
    const newPendingReports = [...pendingReports, report];
    setPendingReports(newPendingReports);
    localStorage.setItem('civic_pulse_pending_reports', JSON.stringify(newPendingReports));
  };


  const value = {
    isOnline,
    pendingReports,
    addPendingReport,
    syncPendingReports
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
