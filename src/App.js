import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Landing from './Pages/Landing';
import Products from './Pages/Products';
import Register from './Pages/Register';
import SignIn from './Pages/SignIn';
import Orders from './Pages/Orders';
import CartDrawer from './Pages/CartDrawer';
import FavoritesDrawer from './Pages/FavoritesDrawer';

function Navbar({ loggedInUser, setLoggedInUser, cartCount, onCartClick, favoritesCount, onFavoritesClick, searchQuery, setSearchQuery }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSignOut, setShowSignOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/orders', label: 'Orders' },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/products') navigate('/products');
  };

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location.pathname]);

  return (
    <>
      <style>{`
        .nav-link:hover { background: #F1F5F9 !important; color: #0F172A !important; }
        .cart-btn { transition: border-color 0.15s, color 0.15s; }
        .cart-btn:hover { border-color: #DC2626 !important; color: #DC2626 !important; }
        .fav-nav-btn { transition: border-color 0.15s, color 0.15s, background 0.15s; }
        .fav-nav-btn:hover { border-color: #DC2626 !important; color: #DC2626 !important; }
        .signout-btn { transition: background 0.15s; }
        .signout-btn:hover { background: #FEF2F2 !important; }
        .nav-search:focus { border-color: #DC2626 !important; outline: none; box-shadow: 0 0 0 3px rgba(220,38,38,0.1); }
        .mobile-search:focus { border-color: #DC2626 !important; outline: none; }
        .ham-btn:hover { background: #F1F5F9 !important; }
        @media (max-width: 768px) {
          .desktop-links { display: none !important; }
          .desktop-search { display: none !important; }
          .desktop-auth { display: none !important; }
          .desktop-fav { display: none !important; }
          .mobile-icons { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-icons { display: none !important; }
          .desktop-links { display: flex !important; }
          .desktop-search { display: block !important; }
          .desktop-auth { display: flex !important; }
          .desktop-fav { display: flex !important; }
        }
      `}</style>

      {/* Sign out modal */}
      {showSignOut && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#FFFFFF', padding: '32px 36px', textAlign: 'center', maxWidth: '340px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ fontSize: '17px', fontWeight: '600', color: '#0F172A', marginBottom: '6px' }}>Sign out?</div>
            <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>You'll need to sign in again to access your account.</div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={() => setShowSignOut(false)} style={{ padding: '9px 22px', border: '1.5px solid #94A3B8', background: '#FFFFFF', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setLoggedInUser(null); setShowSignOut(false); window.location.href = '/signin'; }} style={{ padding: '9px 22px', border: 'none', background: '#DC2626', color: '#FFFFFF', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>Sign out</button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }} onClick={() => setMenuOpen(false)}>
          <div style={{
            position: 'absolute', top: '88px', left: 0, right: 0,
            background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '12px 0'
          }} onClick={e => e.stopPropagation()}>
            {/* Mobile search */}
            <div style={{ padding: '8px 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ position: 'relative' }}>
                <input
                  className="mobile-search"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  style={{
                    width: '100%', padding: '11px 40px 11px 14px',
                    border: '1.5px solid #CBD5E1', background: '#F8FAFC',
                    fontSize: '15px', color: '#0F172A', boxSizing: 'border-box'
                  }}
                />
                {searchQuery
                  ? <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                  : <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="17" height="17" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="#94A3B8" strokeWidth="1.5"/><path d="M10 10l4 4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/></svg>
                }
              </div>
            </div>
            {/* Nav links */}
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} style={{
                display: 'block', padding: '13px 20px',
                fontSize: '15px', fontWeight: location.pathname === link.path ? '600' : '400',
                color: location.pathname === link.path ? '#DC2626' : '#374151',
                textDecoration: 'none',
                background: location.pathname === link.path ? '#FEF2F2' : 'transparent'
              }}>{link.label}</Link>
            ))}
            <div style={{ borderTop: '1px solid #F1F5F9', margin: '8px 0', padding: '8px 16px 4px' }}>
              {loggedInUser ? (
                <div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '10px' }}>
                    Signed in as <strong>{loggedInUser.firstName} {loggedInUser.lastName}</strong>
                  </div>
                  <button onClick={() => { setShowSignOut(true); setMenuOpen(false); }} style={{ fontSize: '14px', color: '#DC2626', background: 'none', border: '1px solid #DC2626', padding: '8px 16px', cursor: 'pointer', fontWeight: '500' }}>Sign out</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to="/signin" style={{ padding: '9px 20px', background: '#DC2626', color: '#FFFFFF', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>Sign in</Link>
                  <Link to="/register" style={{ padding: '9px 20px', border: '1.5px solid #CBD5E1', color: '#374151', fontWeight: '500', fontSize: '14px', textDecoration: 'none' }}>Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <nav style={{
        background: '#FFFFFF', borderBottom: '1px solid #94A3B8',
        padding: '0 72px', display: 'flex', alignItems: 'center',
        height: '88px', position: 'sticky', top: 0, zIndex: 100,
        isolation: 'isolate', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}>
        <style>{`
          @media (max-width: 768px) {
            nav { padding: 0 16px !important; }
          }
        `}</style>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none', marginRight: '36px', flexShrink: 0 }}>
          <div style={{ width: '38px', height: '38px', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L4.09 12.26a1 1 0 00.75 1.64l6.16.09-1 7.26 9.07-10.42a1 1 0 00-.76-1.63l-6.16-.09L13 2z" fill="#FFFFFF"/>
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', letterSpacing: '-0.3px' }}>TechStore</span>
        </Link>

        {/* Desktop nav links */}
        <div className="desktop-links" style={{ gap: '2px', marginRight: '24px' }}>
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} className="nav-link" style={{
                fontSize: '14px', color: active ? '#DC2626' : '#64748B',
                fontWeight: active ? '600' : '400', textDecoration: 'none',
                padding: '6px 13px', background: active ? '#FEF2F2' : 'transparent', transition: 'all 0.15s ease'
              }}>{link.label}</Link>
            );
          })}
        </div>

        {/* Desktop search */}
        <div className="desktop-search" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '560px' }}>
          <input
            className="nav-search" type="text" placeholder="Search products..."
            value={searchQuery} onChange={handleSearch}
            style={{
              width: '100%', padding: '13px 46px 13px 16px',
              border: '1.5px solid #94A3B8', background: '#F8FAFC',
              color: '#0F172A', fontSize: '15px', transition: 'border-color 0.15s, box-shadow 0.15s'
            }}
          />
          {searchQuery
            ? <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '16px', padding: '4px' }}>✕</button>
            : <svg style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="#94A3B8" strokeWidth="1.5"/><path d="M10 10l4 4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/></svg>
          }
        </div>

        {/* Desktop right side */}
        <div className="desktop-auth" style={{ alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
          <button onClick={onFavoritesClick} className="fav-nav-btn" style={{
            display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px',
            border: '1.5px solid #94A3B8', background: '#FFFFFF',
            color: '#374151', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24"
              fill={favoritesCount > 0 ? '#DC2626' : 'none'}
              stroke={favoritesCount > 0 ? '#DC2626' : 'currentColor'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            Favorites
            {favoritesCount > 0 && <span style={{ background: '#DC2626', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '1px 7px', borderRadius: '2px' }}>{favoritesCount}</span>}
          </button>

          <button onClick={onCartClick} className="cart-btn" style={{
            display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px',
            border: '1.5px solid #94A3B8', background: '#FFFFFF',
            color: '#374151', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cart
            {cartCount > 0 && <span style={{ background: '#DC2626', color: '#FFFFFF', fontSize: '11px', fontWeight: '700', padding: '1px 7px', borderRadius: '2px' }}>{cartCount}</span>}
          </button>

          {loggedInUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '6px 12px', background: '#F8FAFC' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF' }}>{loggedInUser.firstName[0]}{loggedInUser.lastName[0]}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>{loggedInUser.firstName}</span>
              </div>
              <button onClick={() => setShowSignOut(true)} className="signout-btn" style={{ fontSize: '13px', padding: '7px 14px', border: '1px solid #94A3B8', background: 'transparent', color: '#DC2626', cursor: 'pointer', fontWeight: '500' }}>Sign out</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', border: '1.5px solid #94A3B8', background: '#FFFFFF' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="#64748B" strokeWidth="1.8"/>
              </svg>
              <Link to="/signin" style={{ fontSize: '14px', fontWeight: '600', color: '#DC2626', textDecoration: 'none' }}>Sign in</Link>
              <span style={{ color: '#94A3B8', fontSize: '14px' }}>/</span>
              <Link to="/register" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', textDecoration: 'none' }}>Register</Link>
            </div>
          )}
        </div>

        {/* Mobile right icons */}
        <div className="mobile-icons" style={{ alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          {/* Favorites */}
          <button onClick={onFavoritesClick} style={{
            position: 'relative', width: '42px', height: '42px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill={favoritesCount > 0 ? '#DC2626' : 'none'}
              stroke={favoritesCount > 0 ? '#DC2626' : '#374151'}
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {favoritesCount > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#DC2626', color: '#FFFFFF', fontSize: '10px', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{favoritesCount}</span>}
          </button>

          {/* Cart */}
          <button onClick={onCartClick} style={{
            position: 'relative', width: '42px', height: '42px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer'
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="#374151" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {cartCount > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#DC2626', color: '#FFFFFF', fontSize: '10px', fontWeight: '700', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
          </button>

          {/* Hamburger */}
          <button
            className="ham-btn"
            onClick={() => setMenuOpen(v => !v)}
            style={{
              width: '42px', height: '42px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '5px',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px'
            }}
          >
            <span style={{ width: '22px', height: '2px', background: '#374151', transition: 'all 0.2s', transform: menuOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
            <span style={{ width: '22px', height: '2px', background: '#374151', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ width: '22px', height: '2px', background: '#374151', transition: 'all 0.2s', transform: menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </nav>
    </>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: 'calc(100vh - 88px)', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '96px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-4px', lineHeight: 1 }}>404</div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#0F172A', marginBottom: '8px', marginTop: '8px' }}>Page not found</div>
        <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>The page you're looking for doesn't exist.</div>
        <button onClick={() => navigate('/')} style={{ padding: '11px 28px', border: 'none', background: '#DC2626', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Go home</button>
      </div>
    </div>
  );
}

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eshop_favorites') || '[]'); } catch { return []; }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('eshop_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const cartCount = selectedProducts.reduce((s, p) => s + (p.qty || 1), 0);

  return (
    <BrowserRouter>
      <div style={{ background: '#F8FAFC', minHeight: '100vh' }}>
        <Navbar
          loggedInUser={loggedInUser}
          setLoggedInUser={setLoggedInUser}
          cartCount={cartCount}
          onCartClick={() => setCartOpen(true)}
          favoritesCount={favorites.length}
          onFavoritesClick={() => setFavoritesOpen(v => !v)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          loggedInUser={loggedInUser}
          showToast={showToast}
        />

        <FavoritesDrawer
          open={favoritesOpen}
          onClose={() => setFavoritesOpen(false)}
          favorites={favorites}
          setFavorites={setFavorites}
          products={allProducts}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />

        {toast && (
          <div style={{
            position: 'fixed', bottom: '28px', right: '16px', zIndex: 9999,
            background: toast.type === 'success' ? '#0F172A' : '#DC2626',
            color: '#FFFFFF', padding: '12px 20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            fontSize: '14px', fontWeight: '500',
            display: 'flex', alignItems: 'center', gap: '10px',
            animation: 'toastIn 0.2s ease', maxWidth: 'calc(100vw - 32px)'
          }}>
            {toast.type === 'success'
              ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            }
            {toast.msg}
          </div>
        )}

        <style>{`@keyframes toastIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/products" element={
              <Products
                loggedInUser={loggedInUser}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                favorites={favorites}
                setFavorites={setFavorites}
                searchQuery={searchQuery}
                showToast={showToast}
                onProductsLoaded={setAllProducts}
              />
            } />
            <Route path="/orders" element={<Orders loggedInUser={loggedInUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signin" element={<SignIn setLoggedInUser={setLoggedInUser} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
