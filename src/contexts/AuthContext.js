import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('civic_pulse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phoneOrEmail, otp) => {
    // Simulate OTP verification
    if (otp === '123456') {
      const userData = {
        id: Date.now().toString(),
        phoneOrEmail,
        loginTime: new Date().toISOString()
      };
      setUser(userData);
      localStorage.setItem('civic_pulse_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: 'Invalid OTP' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('civic_pulse_user');
  };

  const sendOTP = async (phoneOrEmail) => {
    // Simulate sending OTP
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'OTP sent successfully' });
      }, 1000);
    });
  };

  const value = {
    user,
    login,
    logout,
    sendOTP,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
