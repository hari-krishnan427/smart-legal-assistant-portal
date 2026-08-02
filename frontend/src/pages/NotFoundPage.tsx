import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page glass-panel">
      <AlertCircle size={64} className="not-found-icon" />
      <h1>404 - Page Not Found</h1>
      <p>The legal document or route you requested does not exist.</p>
      <Link to="/" className="btn-primary">
        <ArrowLeft size={18} />
        <span>Return to Safety</span>
      </Link>
    </div>
  );
};
