import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { formatStatusText, formatCategoryText } from '../utils/textUtils';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // Load reports from localStorage and filter by current user
    const savedReports = JSON.parse(localStorage.getItem('civic_pulse_reports') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('civic_pulse_user') || '{}');
    
    // Filter reports by current user
    const userReports = savedReports.filter(report => 
      report.userId === currentUser.id || 
      report.userPhone === currentUser.phoneOrEmail
    );
    
    setReports(userReports);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
      case 'pending': return 'bg-red-100 text-red-800';
      case 'inProgress':
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    // Use the formatStatusText utility for consistent formatting
    return formatStatusText(status);
  };

  const getCategoryText = (category) => {
    // Try translation first, fallback to formatted text
    const translated = t(category);
    return translated !== category ? translated : formatCategoryText(category);
  };

  const getSLADays = (timestamp) => {
    const reportDate = new Date(timestamp);
    const now = new Date();
    const diffTime = now - reportDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 7 - diffDays); // 7 days SLA
  };

  if (selectedReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        {/* Header */}
        <div className="glass-morphism backdrop-blur-xl border-b border-white/20 p-4 shadow-glass">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedReport(null)}
              className="mr-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Report Details</h1>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Report Image */}
          <div className="glass-morphism backdrop-blur-xl p-6 rounded-2xl shadow-glass border border-white/20">
            <h3 className="font-medium text-white mb-3">Before Photo</h3>
            <img
              src={selectedReport.photo}
              alt="Issue"
              className="w-full h-64 object-cover rounded-lg border border-white/20"
            />
          </div>

          {/* Report Details */}
          <div className="glass-morphism backdrop-blur-xl p-6 rounded-2xl shadow-glass border border-white/20">
            <div className="space-y-4">
              <div>
                <div>
                  <label className="text-sm font-medium text-blue-200">Category</label>
                  <p className="text-lg font-medium text-white">{getCategoryText(selectedReport.category)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-200">Description</label>
                  <p className="text-white">{selectedReport.description}</p>
                </div>

                {selectedReport.address && (
                  <div>
                    <label className="text-sm font-medium text-blue-200">Address</label>
                    <p className="text-white">{selectedReport.address}</p>
                  </div>
                )}

                {selectedReport.landmark && (
                  <div>
                    <label className="text-sm font-medium text-blue-200">Nearby Landmark</label>
                    <p className="text-white">{selectedReport.landmark}</p>
                  </div>
                )}

                {selectedReport.citizenName && (
                  <div>
                    <label className="text-sm font-medium text-blue-200">Reported By</label>
                    <p className="text-white">{selectedReport.citizenName}</p>
                    {selectedReport.citizenPhone && (
                      <p className="text-sm text-gray-300">{selectedReport.citizenPhone}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-blue-200">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedReport.status)}`}>
                    {getStatusText(selectedReport.status)}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-200">Reported On</label>
                  <p className="text-white">{new Date(selectedReport.timestamp).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-200">GPS Coordinates</label>
                  <p className="text-white font-mono text-sm">
                    {selectedReport.latitude?.toFixed(6)}, {selectedReport.longitude?.toFixed(6)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-blue-200">SLA Remaining</label>
                  <p className="text-white">{getSLADays(selectedReport.timestamp)} days</p>
                </div>

                {selectedReport.estimatedResolutionDays && (
                  <div>
                    <label className="text-sm font-medium text-blue-200">Expected Resolution</label>
                    <p className="text-white">{selectedReport.estimatedResolutionDays} days from report date</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="glass-morphism backdrop-blur-xl p-6 rounded-2xl shadow-glass border border-white/20">
            <h3 className="font-medium text-white mb-4">Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 mr-3"></div>
                <div>
                  <p className="font-medium text-white">Report Submitted</p>
                  <p className="text-sm text-blue-200">{new Date(selectedReport.timestamp).toLocaleString()}</p>
                </div>
              </div>

              {selectedReport.status !== 'open' && (
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-white">Under Review</p>
                    <p className="text-sm text-blue-200">Status updated to In Progress</p>
                  </div>
                </div>
              )}

              {selectedReport.status === 'resolved' && (
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-green-400 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="font-medium text-white">Issue Resolved</p>
                    <p className="text-sm text-blue-200">Issue has been fixed</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* After Photo (if resolved) */}
          {selectedReport.status === 'resolved' && (
            <div className="glass-morphism backdrop-blur-xl p-6 rounded-2xl shadow-glass border border-white/20">
              <h3 className="font-medium text-white mb-3">After Photo</h3>
              <div className="bg-white/10 rounded-lg h-64 flex items-center justify-center border border-white/20">
                <p className="text-blue-200">After photo will be uploaded by authorities</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="glass-morphism backdrop-blur-xl border-b border-white/20 p-4 shadow-glass">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-white/10 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">{t('myReports')}</h1>
        </div>
      </div>

      {/* Reports List */}
      <div className="p-4">
        {reports.length === 0 ? (
          <div className="glass-morphism backdrop-blur-xl p-8 text-center rounded-2xl shadow-glass border border-white/20">
            <svg className="w-16 h-16 text-blue-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-white mb-2">No Reports Yet</h3>
            <p className="text-blue-200 mb-4">You haven't submitted any reports yet.</p>
            <button
              onClick={() => navigate('/report')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all shadow-neon"
            >
              Report an Issue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="glass-morphism backdrop-blur-xl p-4 rounded-2xl shadow-glass border border-white/20 cursor-pointer hover:border-white/30 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={report.photo}
                    alt="Issue"
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-white/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-white truncate">
                          {getCategoryText(report.category)}
                        </h3>
                        <p className="text-sm text-blue-200 mt-1 line-clamp-2">
                          {report.description}
                        </p>
                      </div>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-blue-200">
                      <span>{new Date(report.timestamp).toLocaleDateString()}</span>
                      <span>SLA: {getSLADays(report.timestamp)} days left</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReportsPage;