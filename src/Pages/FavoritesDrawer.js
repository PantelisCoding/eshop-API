import React from 'react';

function FavoritesDrawer({ open, onClose, favorites, setFavorites, products, selectedProducts, setSelectedProducts }) {
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const removeFavorite = (id) => setFavorites(prev => prev.filter(f => f !== id));

  const isInCart = (id) => selectedProducts.some(p => p.id === id);

  const toggleCart = (product) => {
    if (isInCart(product.id)) {
      setSelectedProducts(prev => prev.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts(prev => [...prev, { ...product, qty: 1 }]);
    }
  };

  return (
    <>
      <style>{`
        .fav-remove-btn:hover { color: #DC2626 !important; background: #FEF2F2 !important; }
        .fav-cart-btn:hover { opacity: 0.85; }
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
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.12)'
      }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #F1F5F9', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#DC2626" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span style={{ fontSize: '17px', fontWeight: '700', color: '#0F172A' }}>Wishlist</span>
            {favoriteProducts.length > 0 && (
              <span style={{ fontSize: '12px', color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '2px' }}>
                {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', border: '1px solid #94A3B8',
              background: '#FFFFFF', cursor: 'pointer', borderRadius: '0',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B'
            }}
          >✕</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {favoriteProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 0' }}>
              <div style={{
                width: '72px', height: '72px', background: '#F1F5F9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '6px' }}>Your wishlist is empty</div>
              <div style={{ fontSize: '14px', color: '#94A3B8' }}>Click the heart on any product to save it here</div>
            </div>
          ) : (
            <div>
              {favoriteProducts.map((product, index) => (
                <div key={product.id} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 0',
                  borderBottom: index < favoriteProducts.length - 1 ? '1px solid #F1F5F9' : 'none'
                }}>
                  {/* Image */}
                  <div style={{
                    width: '64px', height: '64px', background: '#F8FAFC',
                    border: '1px solid #94A3B8', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px'
                  }}>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      onError={e => e.target.src = 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png'}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600', marginBottom: '2px' }}>{product.categoryName}</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px' }}>
                      {product.title}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>€{product.price.toFixed(2)}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    <button
                      className="fav-cart-btn"
                      onClick={() => toggleCart(product)}
                      style={{
                        padding: '6px 12px', border: 'none', borderRadius: '0',
                        background: isInCart(product.id) ? '#16A34A' : '#DC2626',
                        color: '#FFFFFF', fontSize: '12px', fontWeight: '600',
                        cursor: 'pointer', transition: 'opacity 0.15s',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      {isInCart(product.id) ? (
                        <><svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Added</>
                      ) : (
                        <><svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> Add</>
                      )}
                    </button>
                    <button
                      className="fav-remove-btn"
                      onClick={() => removeFavorite(product.id)}
                      style={{
                        padding: '6px 12px', border: '1px solid #94A3B8', borderRadius: '0',
                        background: 'transparent', color: '#94A3B8',
                        fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s'
                      }}
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — add all to cart */}
        {favoriteProducts.length > 0 && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid #94A3B8', flexShrink: 0 }}>
            <button
              onClick={() => {
                favoriteProducts.forEach(p => {
                  if (!isInCart(p.id)) setSelectedProducts(prev => [...prev, { ...p, qty: 1 }]);
                });
              }}
              style={{
                width: '100%', padding: '13px', border: 'none', borderRadius: '0',
                background: '#0F172A', color: '#FFFFFF',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'opacity 0.15s'
              }}
            >
              Add all to cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default FavoritesDrawer;
