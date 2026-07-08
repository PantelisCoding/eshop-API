import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Orders({ loggedInUser }) {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) return;
    setLoading(true);
    Promise.all([
      fetch('https://eshop-api-production-2a1c.up.railway.app/orders').then(r => r.json()),
      fetch('https://eshop-api-production-2a1c.up.railway.app/order-items').then(r => r.json()),
      fetch('https://eshop-api-production-2a1c.up.railway.app/products').then(r => r.json()),
    ]).then(([ordersData, itemsData, productsData]) => {
      const userOrders = (ordersData.data || [])
        .filter(o => o.userId === loggedInUser.id)
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      setOrders(userOrders);
      setOrderItems(itemsData.data || []);
      setProducts(productsData.data || []);
    }).finally(() => setLoading(false));
  }, [loggedInUser]);

  const getOrderItems = (orderId) => {
    const ids = orderItems.filter(i => i.orderId === orderId).map(i => i.productId);
    return ids.map(pid => products.find(p => p.id === pid)).filter(Boolean);
  };

  const getOrderTotal = (orderId) =>
    getOrderItems(orderId).reduce((sum, p) => sum + p.price, 0).toFixed(2);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (!loggedInUser) {
    return (
      <div style={{
        minHeight: 'calc(100vh - 88px)', background: '#F8FAFC',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '64px', height: '64px', background: '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="#94A3B8" strokeWidth="1.5"/>
            </svg>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#0F172A', marginBottom: '8px' }}>Sign in to view your orders</div>
          <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>You need to be signed in to see your order history.</div>
          <button onClick={() => navigate('/signin')} style={{
            padding: '12px 28px', border: 'none', background: '#DC2626',
            color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderRadius: '0'
          }}>Sign in</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 88px)', padding: '40px 56px' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .order-row:hover { background: #FAFAFA !important; }
      `}</style>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '6px' }}>My Orders</h1>
        <p style={{ fontSize: '15px', color: '#64748B' }}>
          {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
        </p>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '20px 24px', display: 'flex', gap: '32px' }}>
              {[80,120,60,60].map((w, j) => (
                <div key={j} style={{ width: w, height: 14, background: '#F1F5F9', animation: 'pulse 1.5s ease infinite' }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{ width: '64px', height: '64px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="3" y1="6" x2="21" y2="6" stroke="#94A3B8" strokeWidth="1.5"/>
              <path d="M16 10a4 4 0 01-8 0" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '6px' }}>No orders yet</div>
          <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>When you place an order it will appear here.</div>
          <button onClick={() => navigate('/products')} style={{
            padding: '11px 24px', border: 'none', background: '#DC2626',
            color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderRadius: '0'
          }}>Browse products</button>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {orders.map(order => {
            const items = getOrderItems(order.id);
            const isOpen = expandedOrder === order.id;
            return (
              <div key={order.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div
                  className="order-row"
                  onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '32px', padding: '18px 24px',
                    cursor: 'pointer', background: '#FFFFFF',
                    borderBottom: isOpen ? '1px solid #F1F5F9' : 'none'
                  }}
                >
                  {[
                    { label: 'ORDER', value: `#${order.id}`, bold: true },
                    { label: 'DATE', value: formatDate(order.orderDate) },
                    { label: 'ITEMS', value: items.length },
                    { label: 'TOTAL', value: `€${getOrderTotal(order.id)}`, red: true },
                  ].map(col => (
                    <div key={col.label}>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', marginBottom: '3px', letterSpacing: '0.05em' }}>{col.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: col.bold || col.red ? '700' : '400', color: col.red ? '#DC2626' : '#0F172A' }}>{col.value}</div>
                    </div>
                  ))}
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', background: '#F0FDF4', color: '#16A34A', borderRadius: '2px' }}>Completed</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                      <path d="M4 6l4 4 4-4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: '8px 24px 16px' }}>
                    {items.length === 0 ? (
                      <div style={{ fontSize: '13px', color: '#94A3B8', padding: '12px 0' }}>No item details available.</div>
                    ) : items.map((product, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0',
                        borderBottom: i < items.length - 1 ? '1px solid #F8FAFC' : 'none'
                      }}>
                        <div style={{ width: '52px', height: '52px', background: '#F8FAFC', border: '1px solid #F1F5F9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                          <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => e.target.src = 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png'} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#0F172A' }}>{product.title}</div>
                          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{product.categoryName}</div>
                        </div>
                        <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>€{product.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Orders;
