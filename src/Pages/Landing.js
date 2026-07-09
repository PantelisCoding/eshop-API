import React from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Fast Delivery',
      desc: 'Get your tech delivered to your door within 1–3 business days'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: '2-Year Warranty',
      desc: 'Every product comes with a full manufacturer warranty'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 10h2l1.5 4.5L8 7l3 9 2.5-6.5L15 14h2" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 5h3M18 12h3M18 19h3" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: '24/7 Support',
      desc: 'Our tech experts are always available to help you out'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17 6 23 6 23 12" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Best Prices',
      desc: 'Competitive pricing with regular deals and promotions'
    }
  ];

  const categories = [
    { label: 'Laptops', icon: '💻' },
    { label: 'Phones', icon: '📱' },
    { label: 'Accessories', icon: '🖱️' },
    { label: 'Monitors', icon: '🖥️' },
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 88px)' }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-content { animation: fadeUp 0.5s ease forwards; }
        .hero-badge { animation: fadeUp 0.4s ease 0.05s both; }
        .hero-h1 { animation: fadeUp 0.5s ease 0.1s both; }
        .hero-sub { animation: fadeUp 0.5s ease 0.2s both; }
        .hero-ctas { animation: fadeUp 0.5s ease 0.3s both; }
        .hero-stats { animation: fadeUp 0.5s ease 0.4s both; }
        .shop-btn:hover { background: #B91C1C !important; }
        .orders-btn:hover { background: #F1F5F9 !important; }
        .feature-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
        .cat-chip:hover { background: #DC2626 !important; color: #FFFFFF !important; }
        .hero-section { padding: 80px 48px 72px; }
        .hero-h1 { font-size: 52px !important; }
        .section-pad { padding-left: 48px; padding-right: 48px; }
        @media (max-width: 768px) {
          .hero-section { padding: 48px 20px 40px !important; }
          .hero-h1 { font-size: 34px !important; letter-spacing: -0.5px !important; }
          .hero-sub { font-size: 16px !important; }
          .section-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .hero-stat { padding: 0 12px !important; }
          .hero-stat-val { font-size: 22px !important; }
        }
      `}</style>

      {/* Hero */}
      <div className="hero-section" style={{
        background: 'linear-gradient(135deg, #FEF2F2 0%, #F8FAFC 60%, #F0F9FF 100%)',
        borderBottom: 'none',
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>

          <div className="hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#FEE2E2', color: '#B91C1C',
            fontSize: '13px', fontWeight: '600',
            padding: '5px 14px', borderRadius: '2px',
            marginBottom: '24px', border: 'none'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />
            New arrivals every week
          </div>

          <h1 className="hero-h1" style={{
            fontSize: '52px', fontWeight: '800',
            color: '#0F172A', lineHeight: '1.15',
            marginBottom: '20px', letterSpacing: '-1.5px'
          }}>
            Premium tech,<br />
            <span style={{ color: '#DC2626' }}>delivered fast.</span>
          </h1>

          <p className="hero-sub" style={{
            fontSize: '18px', color: '#64748B',
            lineHeight: '1.7', marginBottom: '36px', maxWidth: '520px', margin: '0 auto 36px'
          }}>
            Discover the latest laptops, phones, and accessories at competitive prices. Trusted by thousands of customers.
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="shop-btn"
              onClick={() => navigate('/products')}
              style={{
                padding: '14px 36px', borderRadius: '0', border: 'none',
                background: '#DC2626', color: '#FFFFFF',
                fontSize: '16px', fontWeight: '600',
                cursor: 'pointer', transition: 'background 0.15s',
                boxShadow: '0 4px 14px rgba(220,38,38,0.35)'
              }}
            >
              Shop now
            </button>
            <button
              className="orders-btn"
              onClick={() => navigate('/orders')}

              style={{
                padding: '14px 36px', borderRadius: '0',
                border: 'none', background: '#FFFFFF',
                color: '#374151', fontSize: '16px', fontWeight: '600',
                cursor: 'pointer', transition: 'background 0.15s'
              }}
            >
              View orders
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats" style={{
            display: 'flex', gap: '0', justifyContent: 'center',
            marginTop: '56px', borderTop: 'none', paddingTop: '40px'
          }}>
            {[
              { value: '500+', label: 'Products' },
              { value: '15K+', label: 'Customers' },
              { value: '99%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label} className="hero-stat" style={{ flex: 1, textAlign: 'center', padding: '0 24px' }}>
                <div className="hero-stat-val" style={{ fontSize: '28px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="section-pad" style={{ paddingTop: '40px', paddingBottom: '0', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Browse by category
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.label}
              className="cat-chip"
              onClick={() => navigate('/products')}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '0',
                border: 'none', background: '#FFFFFF',
                color: '#374151', fontSize: '14px', fontWeight: '500',
                cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature cards */}
      <div className="section-pad" style={{ paddingTop: '40px', paddingBottom: '64px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
          {features.map(f => (
            <div
              key={f.title}
              className="feature-card"
              style={{
                background: '#FFFFFF', borderRadius: '0',
                border: 'none', padding: '22px 20px',
                transition: 'box-shadow 0.2s, transform 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <div style={{
                width: '42px', height: '42px', borderRadius: '0',
                background: '#FEF2F2', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '14px'
              }}>
                {f.icon}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
