import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    myReports: 'My Reports',
    reportIssue: 'Report Issue',
    
    // Home Page
    searchPlaceholder: 'Search location...',
    allReports: 'All',
    nearbyReports: 'Nearby',
    
    // Report Issue Page
    takePhoto: 'Take Photo',
    selectPhoto: 'Select Photo',
    description: 'Description',
    descriptionPlaceholder: 'Describe the issue...',
    category: 'Category',
    location: 'Location',
    submit: 'Submit Report',
    submitting: 'Submitting...',
    
    // Categories
    pothole: 'Pothole',
    garbage: 'Garbage',
    streetlight: 'Streetlight',
    drain: 'Drain',
    other: 'Other',
    
    // Status
    open: 'Open',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    
    // Login
    phoneOrEmail: 'Phone or Email',
    sendOTP: 'Send OTP',
    enterOTP: 'Enter OTP',
    login: 'Login',
    
    // Success Messages
    reportSubmitted: 'Report submitted successfully!',
    ticketId: 'Ticket ID',
    
    // Offline
    offline: 'You are offline',
    offlineMessage: 'Reports will be synced when connection is restored',
  },
  te: {
    // Navigation
    home: 'హోమ్',
    myReports: 'నా రిపోర్ట్లు',
    reportIssue: 'సమస్య నివేదించండి',
    
    // Home Page
    searchPlaceholder: 'స్థానం వెతకండి...',
    allReports: 'అన్ని',
    nearbyReports: 'సమీపంలో',
    
    // Report Issue Page
    takePhoto: 'ఫోటో తీయండి',
    selectPhoto: 'ఫోటో ఎంచుకోండి',
    description: 'వివరణ',
    descriptionPlaceholder: 'సమస్యను వివరించండి...',
    category: 'వర్గం',
    location: 'స్థానం',
    submit: 'రిపోర్ట్ సమర్పించండి',
    submitting: 'సమర్పిస్తున్నాం...',
    
    // Categories
    pothole: 'గొయ్యి',
    garbage: 'చెత్త',
    streetlight: 'వీధి దీపం',
    drain: 'కాలువ',
    other: 'ఇతర',
    
    // Status
    open: 'తెరిచిన',
    inProgress: 'పురోగతిలో',
    resolved: 'పరిష్కరించబడింది',
    
    // Login
    phoneOrEmail: 'ఫోన్ లేదా ఇమెయిల్',
    sendOTP: 'OTP పంపండి',
    enterOTP: 'OTP నమోదు చేయండి',
    login: 'లాగిన్',
    
    // Success Messages
    reportSubmitted: 'రిపోర్ట్ విజయవంతంగా సమర్పించబడింది!',
    ticketId: 'టికెట్ ID',
    
    // Offline
    offline: 'మీరు ఆఫ్‌లైన్‌లో ఉన్నారు',
    offlineMessage: 'కనెక్షన్ పునరుద్ధరించబడినప్పుడు రిపోర్ట్లు సింక్ చేయబడతాయి',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'te' : 'en');
  };

  const value = {
    language,
    setLanguage,
    t,
    toggleLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
