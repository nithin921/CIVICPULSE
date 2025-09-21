import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, sendOTP } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setError('Please enter phone number or email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await sendOTP(phoneOrEmail);
    if (result.success) {
      setOtpSent(true);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('Please enter OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const result = await login(phoneOrEmail, otp);
    if (!result.success) {
      setError(result.error || 'Invalid OTP. Use 123456');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-blue via-navy-blue to-rich-blue flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue rounded-full opacity-10 -translate-y-48 translate-x-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-light-blue rounded-full opacity-10 translate-y-40 -translate-x-40 animate-bounce-subtle"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-blue to-light-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon animate-glow">
            <span className="text-3xl">🏛️</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Civic Pulse</h1>
          <p className="text-blue-200">Smart City Solutions</p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 glass-morphism rounded-xl text-white text-sm hover:bg-glass-white transition-all duration-300 transform hover:scale-105"
          >
            {language === 'en' ? '🌐 తెలుగు' : '🌐 English'}
          </button>
        </div>

        {/* Login Form */}
        <div className="glass-morphism backdrop-blur-xl p-8 rounded-3xl shadow-glass border border-white/20">
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t('phoneOrEmail')}
                </label>
                <input
                  type="text"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  placeholder="Enter phone or email"
                  className="w-full p-4 rounded-2xl glass-morphism backdrop-blur-xl text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                  disabled={loading}
                />
              </div>
              
              {error && (
                <div className="text-red-300 text-sm bg-red-500/20 p-3 rounded-xl">{error}</div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-accent-blue to-light-blue text-white rounded-2xl font-semibold shadow-neon hover:shadow-glass transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : t('sendOTP')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {t('enterOTP')}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 123456"
                  className="w-full p-4 rounded-2xl glass-morphism backdrop-blur-xl text-white placeholder-blue-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all text-center text-2xl tracking-widest"
                  disabled={loading}
                  maxLength={6}
                />
              </div>
              <div className="text-center">
                <p className="text-blue-200 text-sm mb-4">OTP sent to {phoneOrEmail}</p>
                <p className="text-yellow-300 text-xs">💡 Use OTP: <strong>123456</strong></p>
              </div>
              
              {error && (
                <div className="text-red-300 text-sm bg-red-500/20 p-3 rounded-xl">{error}</div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-accent-blue to-light-blue text-white rounded-2xl font-semibold shadow-neon hover:shadow-glass transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : t('login')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                  setError('');
                }}
                className="w-full py-2 text-blue-200 text-sm hover:text-white transition-colors"
              >
                ← Back to phone/email
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            Report civic issues in your city
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
