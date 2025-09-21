import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatStatusText } from '../utils/textUtils';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HomePage = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState([17.3850, 78.4867]); // Default to Hyderabad
  const [reports, setReports] = useState([]);
  const [, setSelectedReport] = useState(null);
  
  const navigate = useNavigate();
  const { t, toggleLanguage } = useLanguage();
  const { showInfo } = useNotification();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // Load reports from localStorage (simulating API call)
    const savedReports = localStorage.getItem('civic_pulse_reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  // Helper function to calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    try {
      const R = 6371; // Radius of Earth in kilometers
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const d = R * c;
      return d;
    } catch (error) {
      console.error('Error calculating distance:', error);
      return 999; // Return large distance on error
    }
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const filteredReports = reports.filter(report => {
    try {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        (report.description && report.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.category && report.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.address && report.address.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;
      
      if (filter === 'my') {
        // Filter by current user's reports
        const currentUser = JSON.parse(localStorage.getItem('civic_pulse_user') || '{}');
        return report.userId === currentUser.id || report.userPhone === currentUser.phoneOrEmail;
      }
      
      if (filter === 'nearby') {
        // Calculate distance from user location
        if (!userLocation || userLocation.length !== 2) {
          showInfo('Location not available. Please enable GPS.');
          return false;
        }
        
        if (!report.latitude || !report.longitude || 
            typeof report.latitude !== 'number' || typeof report.longitude !== 'number') {
          return false;
        }
        
        const distance = calculateDistance(
          userLocation[0], userLocation[1],
          report.latitude, report.longitude
        );
        
        return distance <= 5; // 5km radius
      }
      
      return true;
    } catch (error) {
      console.error('Error filtering reports:', error);
      return false;
    }
  });

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-midnight-blue via-navy-blue to-rich-blue text-white p-4 sm:p-6 shadow-glass relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-glass-white to-transparent opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue rounded-full opacity-10 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-light-blue rounded-full opacity-10 translate-y-12 -translate-x-12"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent-blue to-light-blue rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-neon animate-glow">
                <span className="text-lg sm:text-2xl">🏛️</span>
              </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-light-blue bg-clip-text text-transparent">
                Civic Pulse
              </h1>
              <p className="text-xs text-blue-200 opacity-80 hidden sm:block">Smart City Solutions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={toggleTheme}
              className="px-2 py-1 sm:px-4 sm:py-2 glass-morphism rounded-xl text-xs sm:text-sm hover:bg-glass-white transition-all duration-300 transform hover:scale-105 shadow-soft"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? '🌙 Dark' : '☀️ Light'}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 sm:px-4 sm:py-2 glass-morphism rounded-xl text-xs sm:text-sm hover:bg-glass-white transition-all duration-300 transform hover:scale-105 shadow-soft"
            >
              {t('languageToggle')}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4 sm:mb-6 z-10 px-2 sm:px-0">
          <div className="glass-morphism backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-glass border border-white/20">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchReports')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-10 sm:px-12 py-3 sm:py-4 glass-morphism backdrop-blur-xl text-white placeholder-blue-200 border border-white/20 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all text-sm sm:text-base"
              />
              <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 z-10 relative px-2 sm:px-0">
          {[
            { key: 'all', label: t('allReports'), icon: '📋', count: filteredReports.length },
            { key: 'my', label: t('myReports'), icon: '👤', count: filteredReports.filter(r => r.userId === JSON.parse(localStorage.getItem('civic_pulse_user') || '{}').id).length },
            { key: 'nearby', label: t('nearbyReports'), icon: '📍', count: filteredReports.filter(r => r.latitude && r.longitude && calculateDistance(userLocation[0], userLocation[1], r.latitude, r.longitude) <= 5).length }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-soft text-xs sm:text-sm ${
                filter === filterOption.key
                  ? 'bg-gradient-to-r from-accent-blue to-light-blue text-white shadow-neon'
                  : 'glass-morphism backdrop-blur-xl text-blue-200 border border-white/20 hover:bg-glass-white'
              }`}
            >
              <span className="text-sm sm:text-lg">{filterOption.icon}</span>
              <span className="hidden sm:inline">{filterOption.label || filterOption.key}</span>
              <span className="bg-white/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">{filterOption.count}</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-sm text-blue-200 opacity-80">
          {filteredReports.length} {filteredReports.length === 1 ? 'report' : 'reports'} found
          {searchQuery && ` for "${searchQuery}"`}
        </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        {/* Map Container */}
        <div className="flex-1 lg:flex-none lg:w-2/3 p-4 lg:p-6">
          <div className="glass-morphism backdrop-blur-xl p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-glass border border-white/20 h-96 lg:h-full">
            <div className="h-full rounded-xl lg:rounded-2xl overflow-hidden border border-white/20 shadow-glass">
              <MapContainer center={userLocation} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredReports.map((report) => (
                  <Marker key={report.id} position={[report.latitude, report.longitude]}>
                    <Popup className="custom-popup">
                      <div className="glass-morphism backdrop-blur-xl p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-glass border border-white/20 min-w-[200px] sm:min-w-[250px]">
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          {report.photo && (
                            <img src={report.photo} alt="Issue" className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl shadow-soft" />
                          )}
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-1 sm:mb-2">{report.category}</h3>
                            <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{report.description}</p>
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold ${
                                report.status === 'open' ? 'bg-red-100 text-red-800' :
                                report.status === 'inProgress' || report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {formatStatusText(report.status)}
                              </span>
                              <button 
                                onClick={() => navigator.share && navigator.share({
                                  title: `Civic Issue: ${report.category}`,
                                  text: report.description,
                                  url: window.location.href
                                })}
                                className="bg-gradient-to-r from-accent-blue to-light-blue text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-bold hover:shadow-neon transition-all"
                              >
                                📤 Share
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => navigate('/report')}
          className="fixed bottom-20 sm:bottom-8 right-4 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-civic-orange to-red-500 text-white rounded-2xl shadow-glass hover:shadow-neon transition-all duration-300 flex items-center justify-center z-50 transform hover:scale-110 animate-bounce-subtle group floating-action-btn"
        >
          <div className="relative">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-ping"></div>
          </div>
        </button>

          {/* Sidebar */}
          <div className="w-full lg:w-1/3 lg:flex-none p-4 lg:p-6">
            <div className="glass-morphism backdrop-blur-xl p-4 lg:p-6 rounded-2xl lg:rounded-3xl shadow-glass border border-white/20 h-96 lg:h-full flex flex-col">
              {/* Reports List Header */}
              <div className="p-4 border-b border-white/10 bg-gradient-to-r from-glass-white to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white bg-gradient-to-r from-navy-blue to-accent-blue bg-clip-text text-transparent">
                      {t('reports')}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-accent-blue rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{filteredReports.length} found</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-light-blue rounded-xl flex items-center justify-center shadow-neon">
                  <span className="text-white font-bold">{filteredReports.length}</span>
                </div>
              </div>
            </div>

            {/* Reports List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-accent-blue scrollbar-track-transparent">
              {filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
                    <span className="text-2xl">📋</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">{t('noReports')}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                filteredReports.map((report, index) => (
                  <div
                    key={report.id}
                    className="glass-morphism backdrop-blur-xl p-5 rounded-2xl shadow-soft border border-white/20 hover:shadow-glass transition-all duration-300 cursor-pointer transform hover:scale-[1.02] animate-slide-up group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start space-x-4">
                      {report.photo && (
                        <div className="relative">
                          <img
                            src={report.photo}
                            alt="Report"
                            className="w-18 h-18 object-cover rounded-xl shadow-soft group-hover:shadow-neon transition-shadow"
                          />
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-blue rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">📸</span>
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight flex-1 pr-2">
                            {report.category}
                          </h3>
                          <div className={`w-3 h-3 rounded-full animate-pulse flex-shrink-0 ${
                            report.status === 'open' || report.status === 'pending' ? 'bg-red-400' :
                            report.status === 'inProgress' || report.status === 'in_progress' ? 'bg-yellow-400' :
                            'bg-green-400'
                          }`}></div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                        {report.address && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start">
                            <span className="mr-1 flex-shrink-0">📍</span>
                            <span className="truncate">{report.address}</span>
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-1">
                          <span className={`px-2 py-1 text-xs rounded-full font-medium shadow-soft flex-shrink-0 ${
                            report.status === 'open' || report.status === 'pending' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' :
                            report.status === 'inProgress' || report.status === 'in_progress' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                            'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                          }`}>
                            {formatStatusText(report.status)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-2">
                            {new Date(report.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="glass-morphism backdrop-blur-xl border-t border-white/20 p-4 shadow-glass">
        <div className="flex justify-around">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center text-accent-blue group transition-all duration-300"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-light-blue rounded-2xl flex items-center justify-center mb-1 shadow-neon group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-xs font-semibold">{t('home')}</span>
          </button>
          
          <button
            onClick={() => {
              showInfo('Navigating to My Reports...');
              navigate('/my-reports');
            }}
            className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-accent-blue group transition-all duration-300"
          >
            <div className="w-12 h-12 glass-morphism rounded-2xl flex items-center justify-center mb-1 group-hover:bg-accent-blue group-hover:scale-110 transition-all">
              <svg className="w-6 h-6 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </div>
            <span className="text-xs font-medium group-hover:font-semibold transition-all">{t('myReports')}</span>
          </button>

          <button
            onClick={() => navigate('/analytics')}
            className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-accent-blue group transition-all duration-300"
          >
            <div className="w-12 h-12 glass-morphism rounded-2xl flex items-center justify-center mb-1 group-hover:bg-accent-blue group-hover:scale-110 transition-all">
              <svg className="w-6 h-6 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22,21H2V3H4V19H6V17H10V19H12V16H16V19H18V17H22V21Z"/>
              </svg>
            </div>
            <span className="text-xs font-medium group-hover:font-semibold transition-all">{t('analytics')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
