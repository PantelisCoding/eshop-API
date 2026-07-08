import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState({
    firstName: '', lastName: '', userName: '',
    passWord: '', address: '', phoneNo: '', cityId: 1
  });
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://eshop-api-production-2a1c.up.railway.app/cities')
      .then(res => res.json())
      .then(data => setCities(data.data));
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
    if (!/[0-9]/.test(password)) errors.push('One number');
    return errors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'passWord') {
      setPasswordErrors(validatePassword(e.target.value));
    }
  };

  const handleSubmit = async () => {
    const errors = validatePassword(form.passWord);
    if (errors.length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('https://eshop-api-production-2a1c.up.railway.app/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setSuccess(`Account created! Your ID is #${data.data}`);
      setTimeout(() => navigate('/signin'), 2500);
    } catch {
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrong = form.passWord && passwordErrors.length === 0;
  const passwordWeak = form.passWord && passwordErrors.length > 0;

  return (
    <div style={{
      minHeight: 'calc(100vh - 88px)',
      background: 'linear-gradient(135deg, #FEF2F2 0%, #F8FAFC 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px'
    }}>

      <style>{`
        .auth-input:focus { border-color: #DC2626 !important; outline: none; box-shadow: 0 0 0 3px rgba(220,38,38,0.12); }
        .register-btn:hover:not(:disabled) { background: #B91C1C !important; }
        .register-btn:disabled { opacity: 0.65; cursor: not-allowed; }
      `}</style>

      <div style={{
        background: '#FFFFFF', borderRadius: '0',
        border: '1px solid #94A3B8', padding: '40px',
        width: '100%', maxWidth: '500px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        {/* Logo */}
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
            Create an account
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>Fill in your details to get started</p>
        </div>

        {/* Success banner */}
        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '11px 14px', borderRadius: '0',
            background: '#F0FDF4', border: '1px solid #86EFAC',
            marginBottom: '18px'
          }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3.5 3.5L13 5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '13px', color: '#15803D', fontWeight: '500' }}>{success}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div>
            <label style={labelStyle}>First name</label>
            <input className="auth-input" name="firstName" placeholder="John" onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Last name</label>
            <input className="auth-input" name="lastName" placeholder="Doe" onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Username</label>
            <input className="auth-input" name="userName" placeholder="johndoe" onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              className="auth-input"
              name="passWord"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: passwordWeak ? '#FCA5A5' : passwordStrong ? '#86EFAC' : '#94A3B8'
              }}
            />
            {form.passWord && (
              <div style={{ marginTop: '-6px', marginBottom: '4px' }}>
                {passwordErrors.map((err, i) => (
                  <div key={i} style={{ fontSize: '11px', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>✕</span> {err}
                  </div>
                ))}
                {passwordStrong && (
                  <div style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>✓</span> Password is strong
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Address</label>
            <input className="auth-input" name="address" placeholder="123 Main Street" onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone</label>
            <input className="auth-input" name="phoneNo" placeholder="+30 697 000 0000" onChange={handleChange} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>City</label>
            <select className="auth-input" name="cityId" onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer', colorScheme: 'light' }}>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="register-btn"
          onClick={handleSubmit}
          disabled={loading || passwordErrors.length > 0}
          style={{
            width: '100%', padding: '12px', marginTop: '20px',
            borderRadius: '0', border: 'none',
            background: '#DC2626', color: '#FFFFFF',
            fontSize: '15px', fontWeight: '600',
            cursor: 'pointer', transition: 'background 0.15s'
          }}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '24px', paddingTop: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '14px', color: '#64748B' }}>Already have an account? </span>
          <span
            onClick={() => navigate('/signin')}
            style={{ fontSize: '14px', color: '#DC2626', fontWeight: '600', cursor: 'pointer' }}
          >
            Sign in
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
  width: '100%', padding: '10px 13px',
  border: '1.5px solid #94A3B8', borderRadius: '0',
  background: '#FFFFFF', color: '#0F172A',
  fontSize: '14px', marginBottom: '0',
  transition: 'border-color 0.15s, box-shadow 0.15s'
};

export default Register;
