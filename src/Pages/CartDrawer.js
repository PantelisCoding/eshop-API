import React, { useState, useEffect } from 'react';

function CartDrawer({ open, onClose, selectedProducts, setSelectedProducts, loggedInUser, showToast }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ orderDate: '', password: '' });
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(null); // 'success' | 'error:<msg>'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://eshop-api-production-2a1c.up.railway.app/users')
      .then(res => res.json())
      .then(data => setUsers(data.data));
  }, []);

  const showStatus = (type, msg) => {
    setStatus({ type, msg });
    setTimeout(() => setStatus(null), 3500);
  };

  const handleRemove = (product) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
  };

  const changeQty = (product, delta) => {
    setSelectedProducts(prev => prev.map(p => {
      if (p.id !== product.id) return p;
      const newQty = (p.qty || 1) + delta;
      return newQty < 1 ? null : { ...p, qty: newQty };
    }).filter(Boolean));
  };

  const total = selectedProducts.reduce((sum, p) => sum + p.price * (p.qty || 1), 0).toFixed(2);

  const handleSubmit = async () => {
    const user = loggedInUser || users.find(u => u.userName.toLowerCase() === userName.trim().toLowerCase());
    if (!user) { showStatus('error', 'User not found'); return; }
    if (!loggedInUser && user.passWord !== form.password) { showStatus('error', 'Invalid password'); return; }
    if (!form.orderDate) { showStatus('error', 'Please select an order date'); return; }
    if (selectedProducts.length === 0) { showStatus('error', 'Your cart is empty'); return; }

    setLoading(true);
    try {
      const orderRes = await fetch('https://eshop-api-production-2a1c.up.railway.app/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, orderDate: form.orderDate + ':00' })
      });
      const orderData = await orderRes.json();
      const orderId = orderData.data;

      for (const product of selectedProducts) {
        const qty = product.qty || 1;
        for (let i = 0; i < qty; i++) {
          await fetch('https://eshop-api-production-2a1c.up.railway.app/order-items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, productId: product.id })
          });
        }
      }

      setSelectedProducts([]);
      setUserName('');
      setUserId(null);
      setForm({ orderDate: '', password: '' });
      showStatus('success', 'Order placed successfully!');
      setTimeout(onClose, 2500);
    } catch {
      showStatus('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .cart-remove-btn:hover { color: #DC2626 !important; background: #FEF2F2 !important; }
        .drawer-input:focus { border-color: #DC2626 !important; outline: none; box-shadow: 0 0 0 3px rgba(220,38,38,0.1); }
        .place-order-btn:hover:not(:disabled) { background: #B91C1C !important; }
        .place-order-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,23,42,0.4)',
          zIndex: 1000,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
          backdropFilter: 'blur(2px)'
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: '420px',
        background: '#FFFFFF',
        borderLeft: '1px solid #94A3B8',
        zIndex: 1001,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #F1F5F9',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: '17px', fontWeight: '700', color: '#0F172A' }}>Your cart</span>
            {selectedProducts.length > 0 && (
              <span style={{
                fontSize: '12px', color: '#64748B',
                background: '#F1F5F9', padding: '2px 8px', borderRadius: '2px'
              }}>
                {selectedProducts.length} {selectedProducts.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '0',
              border: '1px solid #94A3B8', background: '#FFFFFF',
              color: '#64748B', cursor: 'pointer', fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* Status banner */}
          {status && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: '0', marginBottom: '16px',
              background: status.type === 'success' ? '#F0FDF4' : '#FEF2F2',
              border: `1px solid ${status.type === 'success' ? '#86EFAC' : '#FECACA'}`
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: status.type === 'success' ? '#DCFCE7' : '#FEE2E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {status.type === 'success'
                  ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/></svg>
                }
              </div>
              <span style={{ fontSize: '13px', fontWeight: '500', color: status.type === 'success' ? '#15803D' : '#B91C1C' }}>
                {status.msg}
              </span>
            </div>
          )}

          {selectedProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 0' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: '#F1F5F9', display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="6" x2="21" y2="6" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M16 10a4 4 0 01-8 0" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '6px' }}>Your cart is empty</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Add products to get started</div>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div style={{ marginBottom: '24px' }}>
                {selectedProducts.map((product, index) => (
                  <div key={product.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '14px 0',
                    borderBottom: index < selectedProducts.length - 1 ? '1px solid #F1F5F9' : 'none'
                  }}>
                    <div style={{
                      width: '60px', height: '60px', borderRadius: '0',
                      background: '#F8FAFC', border: '1px solid #94A3B8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, overflow: 'hidden', padding: '6px'
                    }}>
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        onError={e => e.target.src = 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png'}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px' }}>
                        {product.title}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{product.categoryName}</div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#DC2626', marginTop: '4px' }}>
                        €{(product.price * (product.qty || 1)).toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {/* Qty controls */}
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #E2E8F0' }}>
                        <button onClick={() => changeQty(product, -1)} style={{ width: '26px', height: '26px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A', minWidth: '20px', textAlign: 'center' }}>{product.qty || 1}</span>
                        <button onClick={() => changeQty(product, 1)} style={{ width: '26px', height: '26px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      </div>
                      <button
                        className="cart-remove-btn"
                        onClick={() => handleRemove(product)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '0',
                          border: '1px solid #94A3B8', background: 'transparent',
                          color: '#94A3B8', cursor: 'pointer', fontSize: '13px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s', flexShrink: 0
                        }}
                      >✕</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 0',
                borderTop: '2px solid #94A3B8',
                marginBottom: '28px'
              }}>
                <span style={{ fontSize: '15px', fontWeight: '500', color: '#64748B' }}>Total</span>
                <span style={{ fontSize: '22px', fontWeight: '700', color: '#0F172A' }}>€{total}</span>
              </div>

              {/* Order form */}
              <div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#0F172A', marginBottom: '16px' }}>
                  Order details
                </div>

                {loggedInUser ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px', background: '#FEF2F2', borderRadius: '0',
                    border: '1px solid #FECACA', marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#FFFFFF' }}>
                        {loggedInUser.firstName[0]}{loggedInUser.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '500' }}>Ordering as</div>
                      <div style={{ fontSize: '14px', color: '#7F1D1D', fontWeight: '600' }}>
                        {loggedInUser.firstName} {loggedInUser.lastName}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <label style={labelStyle}>Username <span style={{ color: '#DC2626' }}>*</span></label>
                    <input
                      className="drawer-input"
                      type="text"
                      placeholder="Enter your username"
                      value={userName}
                      onChange={(e) => {
                        setUserName(e.target.value);
                        const user = users.find(u => u.userName.toLowerCase() === e.target.value.trim().toLowerCase());
                        setUserId(user ? user.id : null);
                      }}
                      style={{ ...inputStyle, borderColor: userName && !userId ? '#FCA5A5' : '#94A3B8' }}
                    />
                    {userName && !userId && (
                      <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '-10px', marginBottom: '12px' }}>
                        No account found with that username
                      </div>
                    )}

                    <label style={labelStyle}>Password <span style={{ color: '#DC2626' }}>*</span></label>
                    <input
                      className="drawer-input"
                      type="password"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      style={inputStyle}
                    />
                  </>
                )}

                <label style={labelStyle}>Order date <span style={{ color: '#DC2626' }}>*</span></label>
                <input
                  className="drawer-input"
                  type="datetime-local"
                  onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
                  style={{ ...inputStyle, colorScheme: 'light' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {selectedProducts.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #94A3B8', flexShrink: 0 }}>
            <button
              className="place-order-btn"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                borderRadius: '0', border: 'none',
                background: '#DC2626', color: '#FFFFFF',
                fontSize: '15px', fontWeight: '600',
                cursor: 'pointer', transition: 'background 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}
            >
              {loading ? 'Placing order...' : `Place order · €${total}`}
            </button>
            <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', marginTop: '10px' }}>
              Secure checkout · Free returns
            </p>
          </div>
        )}
      </div>
    </>
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
  fontSize: '14px', marginBottom: '14px',
  transition: 'border-color 0.15s, box-shadow 0.15s'
};

export default CartDrawer;
