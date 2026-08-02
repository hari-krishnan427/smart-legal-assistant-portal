import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskScoreGaugeProps {
  score: number; // 0 to 100
  level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({ score, level }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (level === 'LOW' || score >= 75) return '#34d399'; // Green
    if (level === 'MEDIUM' || score >= 45) return '#e5b964'; // Gold/Amber
    return '#f87171'; // Red
  };

  const color = getColor();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'relative', width: '140px', height: '140px' }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background Circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={color}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>

        {/* Center Score Display */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '2rem', fontWeight: 800, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>
            {score}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Risk Score
          </span>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div
        style={{
          marginTop: '0.85rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          fontWeight: 700,
          fontSize: '0.85rem',
          background: level === 'LOW' ? 'rgba(52, 211, 153, 0.15)' : level === 'MEDIUM' ? 'rgba(229, 185, 100, 0.15)' : 'rgba(248, 113, 113, 0.15)',
          color,
          border: `1px solid ${color}40`,
        }}
      >
        {level === 'LOW' && <ShieldCheck size={16} />}
        {level === 'MEDIUM' && <AlertTriangle size={16} />}
        {level === 'HIGH' && <ShieldAlert size={16} />}
        <span>{level} RISK</span>
      </div>
    </div>
  );
};
