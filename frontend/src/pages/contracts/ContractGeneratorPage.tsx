import React, { useEffect, useState } from 'react';
import { contractService } from '../../services/contractService';
import type { ContractResponse, GenerateContractRequest } from '../../types/contract';
import { FileText, Sparkles, Download, Copy, Check, Trash2, Scale } from 'lucide-react';

export const ContractGeneratorPage: React.FC = () => {
  const [contracts, setContracts] = useState<ContractResponse[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedContract, setSelectedContract] = useState<ContractResponse | null>(null);

  const [formData, setFormData] = useState<GenerateContractRequest>({
    title: 'Mutual Non-Disclosure Agreement',
    contractType: 'NDA',
    partyOne: 'Acme Corporation Inc.',
    partyTwo: 'Nexus Innovations Ltd.',
    jurisdiction: 'Courts of New York, USA',
    effectiveDate: new Date().toISOString().split('T')[0],
    additionalTerms: 'Includes 2-year non-solicitation of employees and mutual IP protection.',
  });

  const templatePresets = [
    { type: 'NDA', title: 'Mutual Non-Disclosure Agreement', partyOne: 'Disclosing Party Corp', partyTwo: 'Receiving Party Ltd', terms: 'Strict 3-year confidentiality and trade secret protection.' },
    { type: 'MSA', title: 'Master Service Agreement', partyOne: 'Client Enterprise', partyTwo: 'Service Provider LLC', terms: 'Monthly retainer billing, 30-day notice, IP assignment upon payment.' },
    { type: 'EMPLOYMENT', title: 'Employment & Non-Compete Agreement', partyOne: 'Apex Global Inc.', partyTwo: 'Jane Smith', terms: 'Standard full-time employment with 1-year non-compete clause.' },
    { type: 'CONSULTING', title: 'Independent Contractor Agreement', partyOne: 'TechVentures Corp', partyTwo: 'John Doe Consulting', terms: 'Milestone deliverables, independent tax status, work-for-hire IP.' },
    { type: 'LEASE', title: 'Commercial Lease Agreement', partyOne: 'Skyline Property Management', partyTwo: 'Vanguard Retail LLC', terms: '36-month lease duration, security deposit, maintenance covenants.' },
  ];

  const fetchHistory = async () => {
    try {
      const res = await contractService.getUserContracts();
      if (res.success && res.data) {
        setContracts(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSelectPreset = (preset: typeof templatePresets[0]) => {
    setFormData({
      title: preset.title,
      contractType: preset.type,
      partyOne: preset.partyOne,
      partyTwo: preset.partyTwo,
      jurisdiction: 'Courts of Competent Jurisdiction',
      effectiveDate: new Date().toISOString().split('T')[0],
      additionalTerms: preset.terms,
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.partyOne.trim() || !formData.partyTwo.trim()) return;

    setGenerating(true);
    try {
      const res = await contractService.generateContract(formData);
      if (res.success && res.data) {
        setSelectedContract(res.data);
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (selectedContract) {
      navigator.clipboard.writeText(selectedContract.contractText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await contractService.deleteContract(id);
      if (selectedContract?.id === id) setSelectedContract(null);
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Hero Bar */}
      <div className="dashboard-hero glass-panel" style={{ padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Sparkles size={28} style={{ color: 'var(--accent-gold)' }} /> AI Legal Contract & Template Builder
            </h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem' }}>
              Draft customized, legally binding contracts, NDAs, and agreements in seconds powered by AI.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Templates Slider */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Select Template Preset
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
          {templatePresets.map((preset) => (
            <div
              key={preset.type}
              onClick={() => handleSelectPreset(preset)}
              style={{
                padding: '1rem',
                background: formData.contractType === preset.type ? 'rgba(229,185,100,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${formData.contractType === preset.type ? 'rgba(229,185,100,0.4)' : 'var(--panel-border)'}`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <FileText size={18} style={{ color: 'var(--accent-gold)' }} />
                <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{preset.type}</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>{preset.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Form & Viewer */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem', alignItems: 'flex-start' }}>
        {/* Form Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale size={20} style={{ color: 'var(--accent-blue)' }} /> Contract Terms & Parameters
          </h3>

          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Contract Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Party A (First Party) *</label>
                <input
                  type="text"
                  required
                  placeholder="Company / Disclosing Party"
                  value={formData.partyOne}
                  onChange={(e) => setFormData({ ...formData, partyOne: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Party B (Second Party) *</label>
                <input
                  type="text"
                  required
                  placeholder="Contractor / Client"
                  value={formData.partyTwo}
                  onChange={(e) => setFormData({ ...formData, partyTwo: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Jurisdiction / Venue</label>
                <input
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Effective Date</label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-muted)' }}>Special Covenants & Terms</label>
              <textarea
                rows={4}
                placeholder="Enter specific payment milestones, non-solicitation, or custom covenants..."
                value={formData.additionalTerms}
                onChange={(e) => setFormData({ ...formData, additionalTerms: e.target.value })}
                style={{ width: '100%', padding: '0.65rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff' }}
              />
            </div>

            <button type="submit" disabled={generating} className="btn-primary" style={{ padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              {generating ? 'Drafting Legal Covenants with AI...' : '✨ Generate Legal Contract'}
            </button>
          </form>
        </div>

        {/* Viewer / Editor Panel */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} style={{ color: 'var(--accent-gold)' }} /> Live Formatted Contract Preview
            </h3>

            {selectedContract && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handleCopy}
                  style={{ padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--panel-border)', borderRadius: 'var(--radius-sm)', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {copied ? <Check size={14} style={{ color: 'var(--accent-green)' }} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>

                <button
                  onClick={() => contractService.downloadContract(selectedContract.id, selectedContract.title)}
                  className="btn-primary"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <Download size={14} /> Download File
                </button>
              </div>
            )}
          </div>

          {generating ? (
            <div className="spinner-container" style={{ flex: 1 }}>
              <div className="spinner"></div>
              <h4>AI Legal Counsel is Drafting Contract...</h4>
              <p style={{ color: 'var(--text-muted)' }}>Structuring recitals, confidentiality provisions, and execution signatures.</p>
            </div>
          ) : selectedContract ? (
            <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--panel-border)', overflowY: 'auto', maxHeight: '420px', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#e5e7eb' }}>
              {selectedContract.contractText}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              <Sparkles size={40} style={{ color: 'var(--accent-gold)', marginBottom: '1rem', opacity: 0.6 }} />
              <h4>No Contract Generated Yet</h4>
              <p style={{ fontSize: '0.875rem' }}>Select a preset template on the left and click "Generate Legal Contract" to view live formatted covenants.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contract Generation History Stream */}
      {contracts.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Generated Contracts Library ({contracts.length})</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {contracts.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1.15rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <FileText size={20} style={{ color: 'var(--accent-blue)' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#fff' }}>{c.title}</strong>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                      {c.partyOne} & {c.partyTwo} • Drafted on {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => setSelectedContract(c)} className="btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    View Preview
                  </button>
                  <button onClick={() => contractService.downloadContract(c.id, c.title)} style={{ background: 'none', border: 'none', color: 'var(--accent-gold)', cursor: 'pointer', padding: '0.35rem' }}>
                    <Download size={16} />
                  </button>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', padding: '0.35rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
