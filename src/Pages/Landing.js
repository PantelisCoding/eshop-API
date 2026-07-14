import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => {
        const products = data.products || [];
        const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
        setFeaturedProducts(shuffled);
      })
      .catch(() => {})
      .finally(() => setLoadingFeatured(false));
  }, []);

  const scrollCarousel = (dir) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector('.feat-card');
    const cardW = card ? card.offsetWidth + 16 : 256;
    scrollRef.current.scrollBy({ left: dir * cardW, behavior: 'smooth' });
  };

  const features = [
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="#DC2626" strokeWidth="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/><path d="M12 12v4M10 14h4" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/></svg>,
      title: 'Fast Delivery',
      desc: 'Get your tech delivered within 1-3 business days, tracked every step'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: '2-Year Warranty',
      desc: 'Every product comes with full manufacturer warranty coverage'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: '24/7 Support',
      desc: 'Our tech experts are always available to help you out'
    },
    {
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 6 23 6 23 12" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
      title: 'Best Prices',
      desc: 'Competitive pricing with regular deals and flash promotions'
    }
  ];

  const categories = [
    { label: 'Laptops', icon: '💻' },
    { label: 'Smartphones', icon: '📱' },
    { label: 'Tablets', icon: '📟' },
    { label: 'Accessories', icon: '🖱️' },
    { label: 'Monitors', icon: '🖥️' },
    { label: 'Gaming', icon: '🎮' },
  ];

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 88px)' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { opacity:0.5; transform:translateX(-50%) scale(1); } 50% { opacity:0.8; transform:translateX(-50%) scale(1.08); } }
        @keyframes pulseDot { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .hero-badge { animation: fadeUp 0.4s ease 0.05s both; }
        .hero-h1 { animation: fadeUp 0.5s ease 0.1s both; font-size: 56px !important; }
        .hero-sub { animation: fadeUp 0.5s ease 0.2s both; }
        .hero-ctas { animation: fadeUp 0.5s ease 0.3s both; }
        .hero-stats { animation: fadeUp 0.5s ease 0.4s both; }
        .shop-btn:hover { background: #B91C1C !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(220,38,38,0.55) !important; }
        .browse-btn:hover { background: rgba(255,255,255,0.12) !important; }
        .hero-section::before { content:''; position:absolute; top:-10%; left:50%; transform:translateX(-50%); width:700px; height:700px; background:radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 65%); pointer-events:none; animation: glow 6s ease-in-out infinite; }
        .hero-section::after { content:''; position:absolute; bottom:-5%; right:5%; width:300px; height:300px; background:radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%); pointer-events:none; }
        .feature-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; transform: translateY(-2px); }
        .cat-chip:hover { background: #DC2626 !important; color: #FFFFFF !important; border-color: #DC2626 !important; }
        .feat-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .feat-card:hover .feat-btn { background: #B91C1C !important; }
        .scroll-arrow:hover { background: #0F172A !important; color: #FFFFFF !important; }
        .social-link:hover { background: #DC2626 !important; border-color: #DC2626 !important; color: #FFFFFF !important; }
        .footer-link:hover { color: #DC2626 !important; }
        .hero-section { padding: 88px 48px 80px; }
        .section-pad { padding-left: 48px; padding-right: 48px; }
        .hero-stat { padding: 0 28px; }
        .hero-stat-val { font-size: 30px !important; }
        @media (max-width: 768px) {
          .hero-section { padding: 48px 20px 44px !important; }
          .hero-h1 { font-size: 34px !important; letter-spacing: -0.5px !important; }
          .hero-sub { font-size: 16px !important; }
          .section-pad { padding-left: 16px !important; padding-right: 16px !important; }
          .hero-stat { padding: 0 12px !important; }
          .hero-stat-val { font-size: 22px !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
          .footer-brand { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* HERO */}
      <div className="hero-section" style={{
        position: 'relative', overflow: 'hidden',
        background: '#070B14',
        backgroundImage: 'linear-gradient(rgba(220,38,38,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.07) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        borderBottom: '1px solid rgba(220,38,38,0.15)',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>

          <div className="hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: 'rgba(220,38,38,0.15)', color: '#FCA5A5',
            border: '1px solid rgba(220,38,38,0.3)',
            fontSize: '13px', fontWeight: '600',
            padding: '5px 14px', borderRadius: '2px', marginBottom: '28px'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#DC2626', display: 'inline-block', animation: 'pulseDot 2s infinite' }} />
            New arrivals every week
          </div>

          <h1 className="hero-h1" style={{
            fontSize: '56px', fontWeight: '800',
            color: '#FFFFFF', lineHeight: '1.1',
            marginBottom: '22px', letterSpacing: '-2px'
          }}>
            Premium tech,<br />
            <span style={{ color: '#DC2626', textShadow: '0 0 40px rgba(220,38,38,0.4)' }}>delivered fast.</span>
          </h1>

          <p className="hero-sub" style={{
            fontSize: '18px', color: '#94A3B8',
            lineHeight: '1.7',
            maxWidth: '520px', margin: '0 auto 40px'
          }}>
            Discover the latest laptops, phones, tablets and accessories at competitive prices. Trusted by thousands of customers.
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="shop-btn" onClick={() => navigate('/products')} style={{
              padding: '15px 40px', border: 'none', background: '#DC2626', color: '#FFFFFF',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              transition: 'all 0.15s', boxShadow: '0 4px 20px rgba(220,38,38,0.4)'
            }}>
              Shop now
            </button>
            <button className="browse-btn" onClick={() => navigate('/products')} style={{
              padding: '15px 40px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)',
              color: '#FFFFFF', fontSize: '16px', fontWeight: '600',
              cursor: 'pointer', transition: 'background 0.15s'
            }}>
              Browse all
            </button>
          </div>

          <div className="hero-stats" style={{
            display: 'flex', justifyContent: 'center',
            marginTop: '60px', paddingTop: '40px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            {[
              { value: '500+', label: 'Products' },
              { value: '15K+', label: 'Customers' },
              { value: '99%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i, arr) => (
              <div key={stat.label} className="hero-stat" style={{
                flex: 1, textAlign: 'center',
                borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none'
              }}>
                <div className="hero-stat-val" style={{ fontSize: '30px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.5px' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', fontWeight: '500' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="section-pad" style={{ paddingTop: '48px', paddingBottom: '0', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>
          Browse by category
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat.label} className="cat-chip" onClick={() => navigate('/products')} style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', border: '1.5px solid #E2E8F0',
              background: '#FFFFFF', color: '#374151',
              fontSize: '14px', fontWeight: '500',
              cursor: 'pointer', transition: 'all 0.15s'
            }}>
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS CAROUSEL */}
      <div className="section-pad" style={{ paddingTop: '52px', paddingBottom: '0', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Featured products
            </div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
              Picked just for you
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="scroll-arrow" onClick={() => scrollCarousel(-1)} style={{
              width: '40px', height: '40px', border: '1.5px solid #E2E8F0',
              background: '#FFFFFF', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="scroll-arrow" onClick={() => scrollCarousel(1)} style={{
              width: '40px', height: '40px', border: '1.5px solid #E2E8F0',
              background: '#FFFFFF', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div ref={scrollRef} style={{
          display: 'flex', gap: '16px', overflowX: 'auto',
          scrollbarWidth: 'none', msOverflowStyle: 'none', paddingBottom: '8px'
        }}>
          {loadingFeatured
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="feat-card" style={{
                  minWidth: '220px', maxWidth: '220px', background: '#FFFFFF',
                  border: '1px solid #E2E8F0', flexShrink: 0
                }}>
                  <div style={{ height: '180px', backgroundImage: 'linear-gradient(90deg,#F1F5F9 25%,#E2E8F0 50%,#F1F5F9 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.4s infinite' }} />
                  <div style={{ padding: '14px' }}>
                    <div style={{ height: '12px', background: '#F1F5F9', marginBottom: '8px', width: '80%' }} />
                    <div style={{ height: '12px', background: '#F1F5F9', width: '50%' }} />
                  </div>
                </div>
              ))
            : featuredProducts.map(p => (
                <div key={p.id} className="feat-card" style={{
                  minWidth: '220px', maxWidth: '220px', background: '#FFFFFF',
                  border: '1px solid #E2E8F0', flexShrink: 0,
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ height: '180px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <img
                      src={p.image}
                      alt={p.title}
                      style={{ maxHeight: '148px', maxWidth: '100%', objectFit: 'contain' }}
                      onError={e => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png'; }}
                    />
                  </div>
                  <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {p.category}
                    </div>
                    <div style={{
                      fontSize: '14px', fontWeight: '600', color: '#0F172A', lineHeight: '1.4', marginBottom: '10px', flex: 1,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                    }}>
                      {p.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '17px', fontWeight: '800', color: '#0F172A' }}>€{p.price.toFixed(2)}</span>
                      <button className="feat-btn" onClick={() => navigate('/products')} style={{
                        padding: '7px 14px', border: 'none', background: '#DC2626',
                        color: '#FFFFFF', fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer', transition: 'background 0.15s'
                      }}>
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      {/* FEATURE CARDS */}
      <div className="section-pad" style={{ paddingTop: '52px', paddingBottom: '64px', margin: '0 auto' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '20px' }}>
          Why choose us
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {features.map(f => (
            <div key={f.title} className="feature-card" style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              padding: '22px 20px', transition: 'box-shadow 0.2s, transform 0.2s'
            }}>
              <div style={{ width: '44px', height: '44px', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                {f.icon}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>{f.title}</div>
              <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.55' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0F172A', color: '#CBD5E1' }}>
        <div className="section-pad" style={{ margin: '0 auto', paddingTop: '56px', paddingBottom: '40px' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px', marginBottom: '48px' }}>

            {/* Brand */}
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '36px', height: '36px', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L4.09 12.26a1 1 0 00.75 1.64l6.16.09-1 7.26 9.07-10.42a1 1 0 00-.76-1.63l-6.16-.09L13 2z" fill="#FFFFFF"/>
                  </svg>
                </div>
                <span style={{ fontSize: '17px', fontWeight: '700', color: '#FFFFFF' }}>TechStore</span>
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#94A3B8', marginBottom: '20px', maxWidth: '260px' }}>
                Your one-stop shop for premium tech. Quality products, fast delivery, and expert support — always.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { label: 'Facebook', path: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                  { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9A5.5 5.5 0 0116.5 22h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z' },
                  { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                  { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                ].map(s => (
                  <a key={s.label} href="#" className="social-link" aria-label={s.label} style={{
                    width: '36px', height: '36px', border: '1px solid #334155',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#94A3B8', textDecoration: 'none', transition: 'all 0.15s'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.path}/>
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Quick links
              </div>
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'My Orders', to: '/orders' },
                { label: 'Sign in', to: '/signin' },
                { label: 'Register', to: '/register' },
              ].map(l => (
                <div key={l.label} style={{ marginBottom: '10px' }}>
                  <span onClick={() => navigate(l.to)} className="footer-link" style={{
                    fontSize: '14px', color: '#94A3B8', cursor: 'pointer', transition: 'color 0.15s'
                  }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Categories */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Categories
              </div>
              {['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Monitors', 'Gaming'].map(cat => (
                <div key={cat} style={{ marginBottom: '10px' }}>
                  <span onClick={() => navigate('/products')} className="footer-link" style={{
                    fontSize: '14px', color: '#94A3B8', cursor: 'pointer', transition: 'color 0.15s'
                  }}>
                    {cat}
                  </span>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Contact us
              </div>
              <a href="https://www.google.com/maps/search/47+Ermou+Street,+Athens,+Greece" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '10px', marginBottom: '14px', textDecoration: 'none', color: '#94A3B8' }}>
                <span style={{ marginTop: '2px', flexShrink: 0, color: '#DC2626' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span style={{ fontSize: '14px', lineHeight: '1.5' }}>47 Ermou Street, Athens{'\n'}10563, Greece</span>
              </a>
              <a href="tel:+302105550147" style={{ display: 'flex', gap: '10px', marginBottom: '14px', textDecoration: 'none', color: '#94A3B8' }}>
                <span style={{ marginTop: '2px', flexShrink: 0, color: '#DC2626' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                </span>
                <span style={{ fontSize: '14px', lineHeight: '1.5' }}>+30 210 555 0147</span>
              </a>
              <a href="mailto:hello@techstore.gr" style={{ display: 'flex', gap: '10px', marginBottom: '14px', textDecoration: 'none', color: '#94A3B8' }}>
                <span style={{ marginTop: '2px', flexShrink: 0, color: '#DC2626' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </span>
                <span style={{ fontSize: '14px', lineHeight: '1.5' }}>hello@techstore.gr</span>
              </a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #1E293B', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              {'©'} {new Date().getFullYear()} TechStore. All rights reserved.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(t => (
                <span key={t} style={{ fontSize: '13px', color: '#475569', cursor: 'pointer' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
