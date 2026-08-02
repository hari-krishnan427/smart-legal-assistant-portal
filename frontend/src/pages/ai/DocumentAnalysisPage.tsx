import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { aiService } from '../../services/aiService';
import type { AiAnalysisResponse } from '../../types/ai';
import { RiskScoreGauge } from '../../components/ai/RiskScoreGauge';
import { DocumentChatPanel } from '../../components/ai/DocumentChatPanel';
import { Sparkles, ArrowLeft, FileText, AlertTriangle, ShieldCheck, CheckCircle2, Clock, Users, RefreshCw } from 'lucide-react';

export const DocumentAnalysisPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState<AiAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = Number(documentId);

  const fetchAnalysis = async (forceReanalyze: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (forceReanalyze) {
        res = await aiService.analyzeDocument(id);
      } else {
        try {
          res = await aiService.getAnalysisResult(id);
        } catch {
          res = await aiService.analyzeDocument(id);
        }
      }

      if (res.success && res.data) {
        setAnalysis(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete AI Legal Analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAnalysis();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <h3>Analyzing Legal Document...</h3>
        <p style={{ color: 'var(--text-muted)' }}>Parsing clauses, evaluating risk factors, and building executive insights.</p>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
        <AlertTriangle size={48} style={{ color: 'var(--accent-red)', margin: '0 auto 1rem' }} />
        <h2>Analysis Failed</h2>
        <p style={{ color: 'var(--text-muted)', margin: '0.75rem 0 1.5rem' }}>{error || 'Unable to load analysis.'}</p>
        <button onClick={() => navigate('/documents')} className="btn-primary">
          <ArrowLeft size={16} /> Return to Documents
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Navigation & Header */}
      <div>
        <button
          onClick={() => navigate('/documents')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}
        >
          <ArrowLeft size={18} /> Back to Legal Documents
        </button>

        <div className="dashboard-hero glass-panel" style={{ padding: '2rem 2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', marginBottom: '0.5rem', fontWeight: 600 }}>
                <Sparkles size={20} />
                <span>AI Legal Intelligence Suite</span>
              </div>
              <h1 style={{ fontSize: '2rem', margin: 0 }}>{analysis.documentTitle}</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => fetchAnalysis(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} /> Re-Analyze Document
            </button>
          </div>
        </div>
      </div>

      {/* Top Grid: Executive Summary & Risk Gauge */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Executive Summary Card */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: 'var(--accent-gold)' }} /> Executive Summary
            </h3>
            <p style={{ lineHeight: '1.7', color: '#e5e7eb', fontSize: '0.95rem' }}>{analysis.summary}</p>
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--panel-border)', display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status: <strong style={{ color: 'var(--accent-green)' }}>Cached & Verified</strong></span>
          </div>
        </div>

        {/* Risk Score Gauge */}
        <div className="glass-panel" style={{ padding: '1.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Document Risk Score
          </h3>
          <RiskScoreGauge score={analysis.riskScore} level={analysis.riskLevel} />
        </div>
      </div>

      {/* Key Clauses Audit Grid */}
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={22} style={{ color: 'var(--accent-blue)' }} /> Key Legal Clauses Status
        </h3>

        <div className="dashboard-grid">
          {analysis.keyClauses && analysis.keyClauses.length > 0 ? (
            analysis.keyClauses.map((clause, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{clause.name}</strong>
                  <span className="role-tag" style={{ background: 'rgba(52, 211, 153, 0.15)', color: 'var(--accent-green)', border: '1px solid rgba(52, 211, 153, 0.3)', fontSize: '0.7rem' }}>
                    {clause.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                  "{clause.excerpt}"
                </p>
                <p style={{ fontSize: '0.85rem', color: '#d1d5db' }}>{clause.analysis}</p>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No standard key clauses identified.</p>
          )}
        </div>
      </div>

      {/* Missing Clauses & Potential Risks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Missing Clauses */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-red)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> Missing Essential Clauses ({analysis.missingClauses?.length || 0})
          </h4>
          {analysis.missingClauses && analysis.missingClauses.length > 0 ? (
            <ul className="info-list">
              {analysis.missingClauses.map((item, idx) => (
                <li key={idx} style={{ color: '#fca5a5', padding: '0.35rem 0' }}>• {item}</li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--accent-green)', fontSize: '0.9rem' }}>✓ All standard legal clauses present!</p>
          )}
        </div>

        {/* Potential Risks */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> Potential Legal & Financial Risks
          </h4>
          <ul className="info-list">
            {analysis.potentialRisks?.map((risk, idx) => (
              <li key={idx} style={{ color: '#fde68a', padding: '0.35rem 0' }}>⚠️ {risk}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations & Parties Obligations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Actionable Recommendations */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} /> Actionable Counsel Recommendations
          </h4>
          <ul className="feature-list">
            {analysis.recommendations?.map((rec, idx) => (
              <li key={idx} style={{ padding: '0.35rem 0' }}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Dates & Parties */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} style={{ color: 'var(--accent-blue)' }} /> Important Dates & Notice Periods
            </h4>
            <ul className="info-list">
              {analysis.importantDates?.map((date, idx) => (
                <li key={idx}>🗓️ {date}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={16} style={{ color: 'var(--accent-gold)' }} /> Identified Parties
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {analysis.partiesInvolved?.map((party, idx) => (
                <span key={idx} className="role-pill">{party}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive AI Chat Panel */}
      <DocumentChatPanel documentId={analysis.documentId} documentTitle={analysis.documentTitle} />
    </div>
  );
};
