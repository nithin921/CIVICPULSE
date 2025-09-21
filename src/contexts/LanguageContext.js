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
    analytics: 'Analytics',
    languageToggle: 'తెలుగు',
    
    // Home Page
    searchPlaceholder: 'Search location...',
    searchReports: 'Search reports...',
    allReports: 'All Reports',
    nearbyReports: 'Nearby Reports',
    reports: 'Reports',
    noReports: 'No Reports Found',
    
    // Report Issue Page
    takePhoto: 'Take Photo',
    selectPhoto: 'Select Photo',
    description: 'Description',
    descriptionPlaceholder: 'Describe the issue...',
    category: 'Category',
    location: 'Location',
    address: 'Address',
    submit: 'Submit Report',
    submitting: 'Submitting...',
    
    // Citizen Information
    citizenInfo: 'Citizen Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    issueCategory: 'Issue Category',
    
    // Categories
    Roads: 'Roads',
    Water: 'Water',
    Electricity: 'Electricity',
    Waste: 'Waste Management',
    Safety: 'Safety',
    Other: 'Other',
    pothole: 'Pothole',
    garbage: 'Garbage',
    streetlight: 'Street Light',
    drain: 'Drainage',
    
    // Status
    open: 'Open',
    pending: 'Pending',
    inProgress: 'In Progress',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    
    // Login
    phoneOrEmail: 'Phone or Email',
    sendOTP: 'Send OTP',
    enterOTP: 'Enter OTP',
    login: 'Login',
    
    // Success Messages
    reportSubmitted: 'Report Submitted Successfully!',
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
    analytics: 'విశ్లేషణలు',
    languageToggle: 'English',
    
    // Home Page
    searchPlaceholder: 'స్థానం వెతకండి...',
    searchReports: 'రిపోర్ట్లను వెతకండి...',
    allReports: 'అన్ని రిపోర్ట్లు',
    nearbyReports: 'సమీప రిపోర్ట్లు',
    reports: 'రిపోర్ట్లు',
    noReports: 'రిపోర్ట్లు లేవు',
    
    // Report Issue Page
    takePhoto: 'ఫోటో తీయండి',
    selectPhoto: 'ఫోటో ఎంచుకోండి',
    description: 'వివరణ',
    descriptionPlaceholder: 'సమస్యను వివరించండి...',
    category: 'వర్గం',
    location: 'స్థానం',
    address: 'చిరునామా',
    submit: 'రిపోర్ట్ సమర్పించండి',
    submitting: 'సమర్పిస్తున్నాం...',
    
    // Citizen Information
    citizenInfo: 'పౌర సమాచారం',
    fullName: 'పూర్తి పేరు',
    phoneNumber: 'ఫోన్ నంబర్',
    issueCategory: 'సమస్య వర్గం',
    
    // Categories
    Roads: 'రోడ్లు',
    Water: 'నీరు',
    Electricity: 'విద్యుత్',
    Waste: 'వ్యర్థాల నిర్వహణ',
    Safety: 'భద్రత',
    Other: 'ఇతర',
    pothole: 'గొయ్యి',
    garbage: 'చెత్త',
    streetlight: 'వీధి దీపం',
    drain: 'కాలువ',
    
    // Status
    open: 'తెరిచిన',
    pending: 'పెండింగ్',
    inProgress: 'పురోగతిలో',
    in_progress: 'పురోగతిలో',
    resolved: 'పరిష్కరించబడింది',
    closed: 'మూసివేయబడింది',
    
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
