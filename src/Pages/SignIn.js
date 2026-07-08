import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn({ setLoggedInUser }) {
  const [form, setForm] = useState({ userName: '', passWord: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.userName || !form.passWord) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://eshop-api-production-2a1c.up.railway.app/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (response.status === 401 || !data.data) {
        setError('Invalid username or password.');
        return;
      }

      setLoggedInUser(data.data);
      navigate('/products');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 88px)',
      background: 'linear-gradient(135deg, #FEF2F2 0%, #F8FAFC 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px'
    }}>

      <style>{`
        .auth-input:focus { border-color: #DC2626 !important; outline: none; box-shadow: 0 0 0 3px rgba(220,38,38,0.12); }
        .submit-btn:hover:not(:disabled) { background: #B91C1C !important; }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <div style={{
        background: '#FFFFFF', borderRadius: '0',
        border: '1px solid #94A3B8', padding: '40px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#DC2626', borderRadius: '0',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4.09 12.26a1 1 0 00.75 1.64l6.16.09-1 7.26 9.07-10.42a1 1 0 00-.76-1.63l-6.16-.09L13 2z" fill="#FFFFFF"/>
            </svg>
          </div>
          <span style={{ fontSize: '17px', fontWeight: '700', color: '#0F172A' }}>TechStore</span>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0F172A', marginBottom: '4px', letterSpacing: '-0.3px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>Sign in to your account to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '11px 14px', borderRadius: '0',
            background: '#FEF2F2', border: '1px solid #FECACA',
            marginBottom: '18px'
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#DC2626" strokeWidth="1.5"/>
              <path d="M8 5v3M8 10v1" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: '13px', color: '#B91C1C', fontWeight: '500' }}>{error}</span>
          </div>
        )}

        <label style={labelStyle}>Username</label>
        <input
          className="auth-input"
          type="text"
          placeholder="Enter your username"
          onChange={e => setForm({ ...form, userName: e.target.value })}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />

        <label style={labelStyle}>Password</label>
        <input
          className="auth-input"
          type="password"
          placeholder="••••••••"
          onChange={e => setForm({ ...form, passWord: e.target.value })}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '12px',
            borderRadius: '0', border: 'none',
            background: '#DC2626', color: '#FFFFFF',
            fontSize: '15px', fontWeight: '600',
            cursor: 'pointer', transition: 'background 0.15s',
            marginTop: '4px'
          }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '28px', paddingTop: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#64748B' }}>Don't have an account? </span>
          <span
            onClick={() => navigate('/register')}
            style={{ fontSize: '14px', color: '#DC2626', fontWeight: '600', cursor: 'pointer' }}
          >
            Create one
          </span>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: '13px', fontWeight: '500', color: '#374151',
  display: 'block', marginBottom: '6px'
};

const inputStyle = {
  width: '100%', padding: '11px 13px',
  border: '1.5px solid #94A3B8', borderRadius: '0',
  background: '#FFFFFF', color: '#0F172A',
  fontSize: '14px', marginBottom: '16px',
  transition: 'border-color 0.15s, box-shadow 0.15s'
};

export default SignIn;
