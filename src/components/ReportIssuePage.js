import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import { useNotification } from '../contexts/NotificationContext';
import { formatStatusText } from '../utils/textUtils';

const LocationMarker = ({ position, setPosition, onPositionChange }) => {
  useMapEvents({
    click(e) {
      const newPosition = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      if (onPositionChange) {
        onPositionChange(newPosition);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position}>
    </Marker>
  );
};

const ReportIssuePage = () => {
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [landmark, setLandmark] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { t } = useLanguage();
  const { isOnline, addPendingReport } = useOffline();
  const { showSuccess: notifySuccess, showError, showInfo } = useNotification();

  const categories = [
    { id: 1, name: 'Roads', icon: '🛣️' },
    { id: 2, name: 'Water', icon: '💧' },
    { id: 3, name: 'Electricity', icon: '⚡' },
    { id: 4, name: 'Waste', icon: '🗑️' },
    { id: 5, name: 'Safety', icon: '🚨' },
    { id: 6, name: 'Other', icon: '📋' }
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const coords = [location.coords.latitude, location.coords.longitude];
          setPosition(coords);
          // Get address from coordinates
          getAddressFromCoordinates(coords[0], coords[1]);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Hyderabad
          setPosition([17.3850, 78.4867]);
          setAddress('Hyderabad, Telangana, India');
        }
      );
    } else {
      setPosition([17.3850, 78.4867]);
      setAddress('Hyderabad, Telangana, India');
    }

    // Load user info
    const currentUser = JSON.parse(localStorage.getItem('civic_pulse_user') || '{}');
    if (currentUser.phoneOrEmail) {
      setPhone(currentUser.phoneOrEmail);
    }
  }, []);

  // Reverse geocoding function
  // Enhanced geocoding with multiple fallbacks
  const getAddressFromCoordinates = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      // Try Nominatim first
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (nominatimResponse.ok) {
        const data = await nominatimResponse.json();
        if (data.display_name) {
          setAddress(data.display_name);
          setLoadingAddress(false);
          return;
        }
      }
      
      // Fallback to coordinates
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Enhanced address search function
  const handleAddressSearch = async () => {
    if (!address.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const newPosition = [parseFloat(result.lat), parseFloat(result.lon)];
          setPosition(newPosition);
          setAddress(result.display_name);
        }
      }
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  // Image compression function
  const compressImage = (dataUrl, quality = 0.7, maxWidth = 800) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      
      img.src = dataUrl;
    });
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!photo || !description.trim() || !category || !position || !name.trim() || !phone.trim()) {
      alert('Please fill all required fields including citizen information');
      return;
    }

    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('civic_pulse_user') || '{}');
      // Compress image to reduce size
      const compressedPhoto = await compressImage(photoPreview, 0.7, 800);
      
      const reportData = {
        id: uuidv4(),
        photo: compressedPhoto,
        description: description.trim(),
        category,
        latitude: position[0],
        longitude: position[1],
        address: address || `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`,
        landmark: landmark.trim(),
        citizenName: name.trim(),
        citizenPhone: phone.trim(),
        userId: currentUser.id || 'anonymous',
        userPhone: currentUser.phoneOrEmail || phone.trim(),
        status: 'open',
        timestamp: new Date().toISOString(),
        priority: 'medium',
        estimatedResolutionDays: getCategoryResolutionTime(category)
      };

      if (isOnline) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Save to localStorage (simulating database)
        const existingReports = JSON.parse(localStorage.getItem('civic_pulse_reports') || '[]');
        existingReports.push(reportData);
        localStorage.setItem('civic_pulse_reports', JSON.stringify(existingReports));
      } else {
        // Save for offline sync
        addPendingReport(reportData);
      }

      const generatedTicketId = `CP${Date.now().toString().slice(-6)}`;
      setTicketId(generatedTicketId);
      setShowSuccess(true);
      
      if (isOnline) {
        notifySuccess(`Report submitted successfully! Ticket ID: ${generatedTicketId}`);
      } else {
        showInfo('Report saved offline. Will sync when connection is restored.');
      }

      // Reset form
      setPhoto(null);
      setPhotoPreview(null);
      setDescription('');
      setCategory('');
      setLandmark('');
      // Keep citizen info for next report
      // setName('');
      // setPhone('');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      showError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get estimated resolution time based on category
  const getCategoryResolutionTime = (category) => {
    const resolutionTimes = {
      'Roads': 7,
      'Water': 10,
      'Electricity': 5,
      'Waste': 3,
      'Safety': 1,
      'Other': 7
    };
    return resolutionTimes[category] || 7;
  };

  // Handle position change and update address
  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    getAddressFromCoordinates(newPosition[0], newPosition[1]);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('reportSubmitted')}</h2>
          <p className="text-gray-600 mb-4">{t('ticketId')}: <span className="font-mono font-bold">{ticketId}</span></p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-civic-orange text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            {t('home')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 p-3 sm:p-6 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-midnight-blue via-navy-blue to-rich-blue text-white p-4 sm:p-6 shadow-glass relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-glass-white to-transparent opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue rounded-full opacity-10 -translate-y-16 translate-x-16"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-3 sm:mr-4 p-2 glass-morphism rounded-xl hover:bg-glass-white transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-blue to-light-blue rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-neon animate-glow">
                <span className="text-lg sm:text-2xl">📝</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-light-blue bg-clip-text text-transparent">
                  {t('reportIssue')}
                </h1>
                <p className="text-xs text-blue-200 opacity-80 hidden sm:block">Help improve your community</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {/* Form Section */}
            <div className="glass-morphism backdrop-blur-xl p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-glass border border-white/20">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Citizen Information */}
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-navy-blue to-accent-blue bg-clip-text text-transparent">
                    {t('citizenInfo')}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-gray-800 dark:text-white text-sm font-medium mb-2">
                        {t('fullName')} *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="report-form-input w-full px-4 py-3 glass-morphism backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-800 dark:text-white text-sm font-medium mb-2">
                        {t('phoneNumber')} *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="report-form-input w-full px-4 py-3 glass-morphism backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Issue Category */}
                <div>
                  <label className="block text-gray-800 dark:text-white text-sm font-medium mb-3">
                    {t('issueCategory')} *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.name)}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                          category === cat.name
                            ? 'border-accent-blue bg-accent-blue/20 shadow-neon'
                            : 'border-white/20 glass-morphism hover:border-accent-blue/50'
                        }`}
                      >
                        <div className="text-2xl sm:text-3xl mb-2">{cat.icon}</div>
                        <div className="text-white text-xs sm:text-sm font-medium">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-800 dark:text-white text-sm font-medium mb-2">
                    {t('description')} *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="report-form-input w-full px-4 py-3 glass-morphism backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all resize-none"
                    placeholder="Describe the issue in detail..."
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-800 dark:text-white text-sm font-medium mb-2">
                    {t('address')}
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onBlur={handleAddressSearch}
                    rows={2}
                    className="report-form-input w-full px-4 py-3 glass-morphism backdrop-blur-xl border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all resize-none"
                    placeholder={loadingAddress ? "Getting address..." : "Enter address or landmark"}
                    disabled={loadingAddress}
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-gray-800 dark:text-white text-sm font-medium mb-4 flex items-center">
                    <span className="mr-2">📸</span>
                    {t('takePhoto')} * (Required)
                  </label>
                  
                  {!photoPreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/30 rounded-2xl p-6 sm:p-8 text-center cursor-pointer hover:border-accent-blue transition-all duration-300 transform hover:scale-105 glass-morphism"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent-blue to-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon animate-glow">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <p className="text-white font-semibold text-base sm:text-lg">{t('takePhoto')}</p>
                      <p className="text-blue-200 text-xs sm:text-sm mt-2">Tap to capture or select photo</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img src={photoPreview} alt="Preview" className="w-full h-32 sm:h-48 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => {
                          setPhoto(null);
                          setPhotoPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-base"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-civic-orange to-red-500 text-white py-4 sm:py-6 px-4 sm:px-6 rounded-2xl sm:rounded-3xl font-bold text-lg sm:text-xl shadow-neon hover:shadow-glass transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-glow"
                  >
                    <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{t('submitting')}</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>{t('submit')}</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>
            </div>

            {/* Map Section */}
            <div className="glass-morphism backdrop-blur-xl p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-glass border border-white/20">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Location
              </h3>
              <div className="h-48 sm:h-64 rounded-xl overflow-hidden border border-white/20 shadow-glass">
                {position && (
                  <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} onPositionChange={handlePositionChange} />
                  </MapContainer>
                )}
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs sm:text-sm text-blue-200 opacity-80">Tap on map to adjust location</p>
                <p className="text-xs text-blue-300 font-mono">
                  {position && `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssuePage;
