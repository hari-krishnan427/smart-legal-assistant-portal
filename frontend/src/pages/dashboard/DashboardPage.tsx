import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { aiService } from '../../services/aiService';
import type { AiDashboardStats } from '../../types/ai';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Database, Lock, CheckCircle, AlertTriangle, Sparkles, FileText, ArrowRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [healthInfo, setHealthInfo] = useState<Record<string, string> | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [aiStats, setAiStats] = useState<AiDashboardStats | null>(null);

  // Role Authorization Testing States
  const [testResult, setTestResult] = useState<{
    endpoint: string;
    status: 'idle' | 'loading' | 'success' | 'forbidden' | 'error';
    message: string;
    data?: any;
  }>({ endpoint: '', status: 'idle', message: '' });

  useEffect(() => {
    const fetchBackendHealthAndStats = async () => {
      try {
        const response = await authService.checkHealth();
        if (response.success && response.data) {
          setHealthInfo(response.data);
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }

        const statsRes = await aiService.getDashboardStats();
        if (statsRes.success && statsRes.data) {
          setAiStats(statsRes.data);
        }
      } catch {
        setBackendStatus('offline');
      }
    };

    fetchBackendHealthAndStats();
  }, []);

  const handleTestEndpoint = async (type: 'user' | 'lawyer' | 'admin') => {
    let endpointName = '';
    setTestResult({ endpoint: '', status: 'loading', message: 'Executing JWT authorized request...' });

    try {
      let res;
      if (type === 'user') {
        endpointName = '/api/v1/users/me';
        res = await authService.testUserProfile();
      } else if (type === 'lawyer') {
        endpointName = '/api/v1/users/lawyer-desk';
        res = await authService.testLawyerDesk();
      } else {
        endpointName = '/api/v1/users/admin/all';
        res = await authService.testAdminConsole();
      }

      setTestResult({
        endpoint: endpointName,
        status: 'success',
        message: res.message || 'Access Granted',
        data: res.data,
      });
    } catch (err: any) {
      if (err.response?.status === 403) {
        setTestResult({
          endpoint: endpointName,
          status: 'forbidden',
          message: '403 Forbidden: Your current role does not have permission for this endpoint.',
        });
      } else {
        setTestResult({
          endpoint: endpointName,
          status: 'error',
          message: err.response?.data?.message || 'Failed to complete API test call.',
        });
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* Hero */}
      <div className="dashboard-hero glass-panel">
        <div className="hero-content">
          <h1>Welcome, {user?.fullName || 'Legal Practitioner'}</h1>
          <p>Smart Legal Assistant Portal — Intelligent Analytics & Control Center</p>
          <div className="hero-tags">
            <span className="role-pill">{user?.role}</span>
            <span className={`status-pill ${backendStatus}`}>
              Backend Status: {backendStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* AI Legal Metrics Cards */}
      {aiStats && (
        <div className="dashboard-grid">
          <div className="card glass-panel">
            <div className="card-header">
              <FileText className="card-icon blue" size={24} />
              <h3>Total Documents</h3>
            </div>
            <div className="card-body">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>{aiStats.totalDocuments}</span>
              <p style={{ marginTop: '0.25rem' }}>Uploaded to Repository</p>
            </div>
          </div>

          <div className="card glass-panel">
            <div className="card-header">
              <Sparkles className="card-icon amber" size={24} />
              <h3>Documents Analyzed</h3>
            </div>
            <div className="card-body">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{aiStats.documentsAnalyzed}</span>
              <p style={{ marginTop: '0.25rem' }}>Parsed by AI Engine</p>
            </div>
          </div>

          <div className="card glass-panel">
            <div className="card-header">
              <Activity className="card-icon green" size={24} />
              <h3>Average Risk Score</h3>
            </div>
            <div className="card-body">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-green)' }}>{aiStats.averageRiskScore} <span style={{ fontSize: '1rem' }}>/ 100</span></span>
              <p style={{ marginTop: '0.25rem' }}>Average Safety Rating</p>
            </div>
          </div>

          <div className="card glass-panel">
            <div className="card-header">
              <AlertTriangle className="card-icon purple" size={24} />
              <h3>Risk Breakdown</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="status-pill offline" style={{ fontSize: '0.75rem' }}>High: {aiStats.highRiskCount}</span>
              <span className="status-pill checking" style={{ background: 'rgba(229,185,100,0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(229,185,100,0.3)', fontSize: '0.75rem' }}>Med: {aiStats.mediumRiskCount}</span>
              <span className="status-pill online" style={{ fontSize: '0.75rem' }}>Low: {aiStats.lowRiskCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent AI Analyses Section */}
      {aiStats && aiStats.recentAnalyses && aiStats.recentAnalyses.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--accent-gold)' }} /> Recent AI Legal Analyses
            </h3>
            <button onClick={() => navigate('/documents')} className="nav-link">
              View All Documents <ArrowRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {aiStats.recentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                onClick={() => navigate(`/documents/${analysis.documentId}/analysis`)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <FileText size={22} style={{ color: 'var(--accent-blue)' }} />
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{analysis.documentTitle}</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.15rem' }}>
                      {analysis.summary.length > 100 ? analysis.summary.substring(0, 100) + '...' : analysis.summary}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    className="role-pill"
                    style={{
                      background: analysis.riskLevel === 'LOW' ? 'rgba(52, 211, 153, 0.15)' : analysis.riskLevel === 'MEDIUM' ? 'rgba(229, 185, 100, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                      color: analysis.riskLevel === 'LOW' ? 'var(--accent-green)' : analysis.riskLevel === 'MEDIUM' ? 'var(--accent-gold)' : 'var(--accent-red)',
                      border: `1px solid ${analysis.riskLevel === 'LOW' ? 'rgba(52, 211, 153, 0.3)' : analysis.riskLevel === 'MEDIUM' ? 'rgba(229, 185, 100, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
                    }}
                  >
                    {analysis.riskLevel} ({analysis.riskScore})
                  </span>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Role Authorization Tester */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <Lock size={22} style={{ color: 'var(--accent-gold)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Role-Based Authorization Tester</h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Test Spring Security JWT role-based access control live against protected backend endpoints:
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button
            onClick={() => handleTestEndpoint('user')}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#fff' }}
          >
            Test User Profile API (All Auth Users)
          </button>
          <button
            onClick={() => handleTestEndpoint('lawyer')}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #e5b964 0%, #b48528 100%)' }}
          >
            Test Lawyer Desk API (Lawyer & Admin Only)
          </button>
          <button
            onClick={() => handleTestEndpoint('admin')}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)', color: '#fff' }}
          >
            Test Admin Console API (Admin Only)
          </button>
        </div>

        {testResult.status !== 'idle' && (
          <div
            className={`result-box ${testResult.status}`}
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-sm)',
              background: testResult.status === 'success' ? 'rgba(52, 211, 153, 0.12)' : testResult.status === 'forbidden' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${testResult.status === 'success' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>
              {testResult.status === 'success' && <CheckCircle size={18} style={{ color: 'var(--accent-green)' }} />}
              {testResult.status === 'forbidden' && <AlertTriangle size={18} style={{ color: 'var(--accent-red)' }} />}
              <span>Endpoint Tested: <code>{testResult.endpoint}</code></span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: testResult.data ? '0.5rem' : 0 }}>{testResult.message}</p>
            {testResult.data && (
              <pre style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', overflowX: 'auto' }}>
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      <div className="dashboard-grid">
        <div className="card glass-panel">
          <div className="card-header">
            <Activity className="card-icon blue" size={24} />
            <h3>Backend REST API Health</h3>
          </div>
          <div className="card-body">
            {backendStatus === 'online' && healthInfo ? (
              <ul className="info-list">
                <li><strong>Status:</strong> <span className="text-success">{healthInfo.status}</span></li>
                <li><strong>Service:</strong> {healthInfo.service}</li>
                <li><strong>Version:</strong> {healthInfo.version}</li>
              </ul>
            ) : (
              <p className="text-muted">Connecting to Spring Boot backend...</p>
            )}
          </div>
        </div>

        <div className="card glass-panel">
          <div className="card-header">
            <ShieldCheck className="card-icon green" size={24} />
            <h3>Active Security Features</h3>
          </div>
          <div className="card-body">
            <ul className="feature-list">
              <li>BCrypt Hashed Passwords</li>
              <li>JWT Access & Refresh Token Flow</li>
              <li>Database Token Revocation</li>
              <li>Email Uniqueness Check</li>
            </ul>
          </div>
        </div>

        <div className="card glass-panel">
          <div className="card-header">
            <Database className="card-icon purple" size={24} />
            <h3>Database Entities</h3>
          </div>
          <div className="card-body">
            <ul className="feature-list">
              <li><code>User</code> Table</li>
              <li><code>RefreshToken</code> Table</li>
              <li><code>LegalDocument</code> Table</li>
              <li><code>AiAnalysis</code> Table</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
