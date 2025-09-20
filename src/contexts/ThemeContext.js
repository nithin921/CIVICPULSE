import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Ensure dark mode is set in localStorage
    localStorage.setItem('civic_pulse_theme', 'dark');
    // Add dark class to body for consistent theming
    document.body.classList.add('dark');
    return () => {
      document.body.classList.remove('dark');
    };
  }, []);

  const value = {
    isDark: true, // Always true for this app
    toggleTheme: () => {} // No-op function
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className="dark">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
