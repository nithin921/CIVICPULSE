import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatStatusText } from '../utils/textUtils';

const AnalyticsDashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('civic_pulse_reports') || '[]');
    setReports(savedReports);
    
    // Calculate statistics
    const totalReports = savedReports.length;
    const openReports = savedReports.filter(r => r.status === 'open').length;
    const inProgressReports = savedReports.filter(r => r.status === 'inProgress' || r.status === 'in_progress').length;
    const resolvedReports = savedReports.filter(r => r.status === 'resolved').length;
    
    const categoryStats = savedReports.reduce((acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    }, {});
    
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const thisMonthReports = savedReports.filter(report => {
      const reportDate = new Date(report.timestamp);
      return reportDate.getMonth() === thisMonth && reportDate.getFullYear() === thisYear;
    }).length;
    
    setStats({
      total: totalReports,
      open: openReports,
      inProgress: inProgressReports,
      resolved: resolvedReports,
      categoryStats,
      thisMonth: thisMonthReports,
      resolutionRate: totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0
    });
  }, []);

  const StatCard = ({ title, value, color, icon }) => (
    <div className="glass-morphism backdrop-blur-xl p-6 rounded-3xl shadow-glass border border-white/20 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white opacity-80">{title}</p>
          <p className={`text-3xl font-bold text-white`}>{value}</p>
        </div>
        <div className="w-14 h-14 bg-gradient-to-br from-accent-blue to-light-blue rounded-2xl flex items-center justify-center shadow-neon animate-glow">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-midnight-blue via-navy-blue to-rich-blue text-white p-4 sm:p-6 shadow-glass relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-glass-white to-transparent opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue rounded-full opacity-10 -translate-y-16 translate-x-16"></div>
        
        <div className="flex items-center relative z-10">
          <button
            onClick={() => navigate('/')}
            className="mr-4 p-3 glass-morphism rounded-xl hover:bg-glass-white transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-light-blue bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-xs text-blue-200 opacity-80">Civic reports insights & statistics</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Reports"
            value={stats.total || 0}
            color="text-blue-600"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>}
          />
          
          <StatCard
            title="Open Issues"
            value={stats.open || 0}
            color="text-red-600"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>}
          />
          
          <StatCard
            title="In Progress"
            value={stats.inProgress || 0}
            color="text-yellow-600"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
          />
          
          <StatCard
            title="Resolved"
            value={stats.resolved || 0}
            color="text-green-600"
            icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-morphism backdrop-blur-xl p-6 rounded-3xl shadow-glass border border-white/20 animate-slide-up">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📅</span>
              <h3 className="text-xl font-bold text-white">This Month</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.thisMonth || 0}</div>
            <p className="text-sm text-blue-200 opacity-80">New reports submitted</p>
          </div>
          
          <div className="glass-morphism backdrop-blur-xl p-6 rounded-3xl shadow-glass border border-white/20 animate-slide-up">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🎯</span>
              <h3 className="text-xl font-bold text-white">Resolution Rate</h3>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{stats.resolutionRate || 0}%</div>
            <p className="text-sm text-blue-200 opacity-80">Issues resolved successfully</p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="glass-morphism backdrop-blur-xl p-6 rounded-3xl shadow-glass border border-white/20 animate-slide-up">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">📊</span>
            <h3 className="text-xl font-bold text-white">Issues by Category</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.categoryStats || {}).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between p-3 glass-morphism rounded-2xl">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-civic-orange to-red-500 rounded-full mr-4 animate-pulse"></div>
                  <span className="text-white font-semibold capitalize">{category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-200 font-bold">{count}</span>
                  <div className="w-24 bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-civic-orange to-red-500 h-3 rounded-full shadow-neon" 
                      style={{ width: `${(count / (stats.total || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-morphism backdrop-blur-xl p-6 rounded-3xl shadow-glass border border-white/20 animate-slide-up">
          <div className="flex items-center mb-6">
            <span className="text-2xl mr-3">🕰️</span>
            <h3 className="text-xl font-bold text-white">Recent Reports</h3>
          </div>
          <div className="space-y-4">
            {reports.slice(0, 5).map((report, index) => (
              <div key={report.id} className="flex items-center justify-between p-4 glass-morphism rounded-2xl border border-white/10 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center">
                  <img src={report.photo} alt="Issue" className="w-12 h-12 object-cover rounded-xl mr-4 shadow-soft" />
                  <div>
                    <p className="text-sm font-bold text-white">{report.category}</p>
                    <p className="text-xs text-blue-200 opacity-80">{new Date(report.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-soft ${
                  report.status === 'open' || report.status === 'pending' ? 'bg-gradient-to-r from-red-400 to-red-500 text-white' :
                  report.status === 'inProgress' || report.status === 'in_progress' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                  'bg-gradient-to-r from-green-400 to-emerald-400 text-white'
                }`}>
                  {formatStatusText(report.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
