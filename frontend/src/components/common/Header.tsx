import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Scale, LogOut, User as UserIcon, LayoutDashboard, FileText, Briefcase, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="brand-logo">
          <Scale className="brand-icon" size={28} />
          <span className="brand-title">SmartLegal</span>
        </Link>

        <nav className="header-nav">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link to="/cases" className="nav-link">
                <Briefcase size={18} />
                <span>Cases</span>
              </Link>
              <Link to="/contracts" className="nav-link">
                <Sparkles size={18} />
                <span>Contract Builder</span>
              </Link>
              <Link to="/documents" className="nav-link">
                <FileText size={18} />
                <span>Documents</span>
              </Link>
              <div className="user-badge">
                <UserIcon size={16} />
                <span>{user?.fullName}</span>
                <span className="role-tag">{user?.role?.replace('ROLE_', '')}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
