import React, { useState, useEffect, useRef, useCallback } from 'react';

const CATEGORY_MAP = {
  'All':         null,
  'Electronics': 'electronics',
  'Accessories': 'jewelery',
  'Clothing':    "men's clothing",
  'Fashion':     "women's clothing",
};


function PriceSlider({ min, max, sliderMax, onChange }) {
  const trackRef = useRef(null);
  const draggingRef = useRef(null);
  const minRef = useRef(min);
  const maxRef = useRef(max);
  const onChangeRef = useRef(onChange);
  const [activeHandle, setActiveHandle] = useState(null);

  useEffect(() => { minRef.current = min; }, [min]);
  useEffect(() => { maxRef.current = max; }, [max]);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingRef.current || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const val = Math.round(pos * sliderMax);
      if (draggingRef.current === 'min') {
        onChangeRef.current({ min: Math.min(val, maxRef.current - 1), max: maxRef.current });
      } else {
        onChangeRef.current({ min: minRef.current, max: Math.max(val, minRef.current + 1) });
      }
    };
    const onUp = () => { draggingRef.current = null; setActiveHandle(null); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [sliderMax]);

  const pct = (val) => sliderMax > 0 ? (val / sliderMax) * 100 : 0;
  const startDrag = (handle) => (e) => { e.preventDefault(); draggingRef.current = handle; setActiveHandle(handle); };
  const handleStyle = (active) => ({
    position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)',
    width: '18px', height: '18px', borderRadius: '50%',
    background: '#0F172A', border: '2.5px solid #FFFFFF',
    boxShadow: active ? '0 0 0 3px rgba(15,23,42,0.15), 0 2px 6px rgba(0,0,0,0.3)' : '0 2px 6px rgba(0,0,0,0.3)',
    cursor: active ? 'grabbing' : 'grab', zIndex: active ? 3 : 2, userSelect: 'none'
  });

  return (
    <div ref={trackRef} style={{ position: 'relative', height: '4px', background: '#E2E8F0', borderRadius: '0' }}>
      <div style={{ position: 'absolute', top: 0, height: '100%', borderRadius: '0', background: '#DC2626', left: `${pct(min)}%`, width: `${pct(max) - pct(min)}%` }} />
      <div onMouseDown={startDrag('min')} onTouchStart={startDrag('min')} style={{ ...handleStyle(activeHandle === 'min'), left: `${pct(min)}%` }} />
      <div onMouseDown={startDrag('max')} onTouchStart={startDrag('max')} style={{ ...handleStyle(activeHandle === 'max'), left: `${pct(max)}%` }} />
    </div>
  );
}

function Products({ loggedInUser, selectedProducts, setSelectedProducts, favorites, setFavorites, searchQuery, showToast, onProductsLoaded }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [sliderMax, setSliderMax] = useState(0);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 16;
  const [columns, setColumns] = useState(4);
  const [openFilter, setOpenFilter] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const gridRef = useRef(null);
  const filterBarRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close modal on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setDetailProduct(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const isFavorite = (id) => favorites.includes(id);
  const toggleFavorite = (id) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  useEffect(() => {
    setLoading(true);
    const slug = CATEGORY_MAP[selectedCategory];
    const url = slug
      ? `https://fakestoreapi.com/products/category/${encodeURIComponent(slug)}`
      : 'https://fakestoreapi.com/products';
    fetch(url)
      .then(r => r.json())
      .then(data => {
        const items = (Array.isArray(data) ? data : []).map(p => ({
          id: p.id,
          title: p.title,
          price: p.price,
          imageUrl: p.image,
          categoryName: p.category.replace(/\b\w/g, c => c.toUpperCase()),
          description: `${p.description} | ⭐ ${p.rating?.rate || ''}`,
        }));
        setProducts(items);
        if (onProductsLoaded) onProductsLoaded(items);
        if (items.length > 0) {
          const max = Math.ceil(Math.max(...items.map(p => p.price)));
          setSliderMax(max);
          setPriceRange({ min: 0, max });
        }
        setLoading(false);
      })
      .catch(() => { setProducts([]); setLoading(false); });
  }, [selectedCategory]); // eslint-disable-line

  const updateColumns = useCallback(() => {
    if (!gridRef.current) return;
    const style = window.getComputedStyle(gridRef.current);
    const cols = style.getPropertyValue('grid-template-columns').split(' ').length;
    setColumns(cols);
  }, []);

  useEffect(() => {
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [updateColumns]);

  useEffect(() => { setPage(1); }, [searchQuery, selectedCategory, sortBy, priceRange]);

  const handleProductCheck = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
      if (showToast) showToast('Removed from cart');
    } else {
      setSelectedProducts([...selectedProducts, { ...product, qty: 1 }]);
      if (showToast) showToast('Added to cart');
    }
  };

  const isSelected = (id) => selectedProducts.some(p => p.id === id);
  const categories = Object.keys(CATEGORY_MAP);

  const filteredProducts = products
    .filter(p => {
      const matchSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMin = !sliderMax || p.price >= priceRange.min;
      const matchMax = !sliderMax || p.price <= priceRange.max;
      return matchSearch && matchMin && matchMax;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const visibleProducts = filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const hasActiveFilters = selectedCategory !== 'All' || sortBy !== 'default' ||
    priceRange.min > 0 || (sliderMax && priceRange.max < sliderMax);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSortBy('default');
    setPriceRange({ min: 0, max: sliderMax });
  };

  return (
    <div className="products-page" style={{ background: '#F8FAFC', minHeight: 'calc(100vh - 88px)' }}>

      <style>{`
        .product-card { transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s; }
        .product-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.1) !important; transform: translateY(-2px); }
        .add-btn { transition: all 0.15s ease; }
        .add-btn:hover { opacity: 0.88; }
        .show-all-btn:hover { background: #DC2626 !important; color: #FFFFFF !important; }
        .fav-btn { transition: transform 0.15s, opacity 0.15s; }
        .fav-btn:hover { transform: scale(1.15); opacity: 0.85; }
        @keyframes shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
        .skeleton { background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%); background-size: 600px 100%; animation: shimmer 1.4s infinite; }
        .products-page { padding: 40px 56px; }
        .filter-bar { overflow-x: auto; flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
        .product-modal { flex-direction: row !important; width: 90% !important; max-width: 820px !important; }
        @media (max-width: 768px) {
          .products-page { padding: 24px 16px !important; }
          .filter-bar { flex-wrap: nowrap !important; overflow-x: auto; }
          .product-modal { flex-direction: column !important; width: 100% !important; max-width: 100% !important; max-height: 95vh !important; top: auto !important; bottom: 0 !important; left: 0 !important; transform: none !important; border-radius: 0 !important; }
          .modal-image-panel { width: 100% !important; min-height: 220px !important; max-height: 240px !important; }
        }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Products
        </h1>
        <p style={{ fontSize: '15px', color: '#64748B' }}>
          {products.length > 0 ? `${filteredProducts.length} of ${products.length} products` : 'Loading...'}
        </p>
      </div>

      {/* Skeleton loader */}
      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#FFFFFF', borderRadius: '0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="skeleton" style={{ width: '100%', height: '210px' }} />
              <div style={{ padding: '18px' }}>
                <div className="skeleton" style={{ width: '60px', height: '20px', marginBottom: '10px' }} />
                <div className="skeleton" style={{ width: '100%', height: '16px', marginBottom: '6px' }} />
                <div className="skeleton" style={{ width: '75%', height: '16px', marginBottom: '14px' }} />
                <div className="skeleton" style={{ width: '80px', height: '28px', marginBottom: '14px' }} />
                <div className="skeleton" style={{ width: '100%', height: '42px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter toolbar */}
      {!loading && <div ref={filterBarRef} className="filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>

        {/* Category button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpenFilter(openFilter === 'category' ? null : 'category')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', border: selectedCategory !== 'All' ? '1.5px solid #DC2626' : '1.5px solid #CBD5E1',
              background: selectedCategory !== 'All' ? '#FEF2F2' : '#FFFFFF',
              color: selectedCategory !== 'All' ? '#DC2626' : '#374151',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer', borderRadius: '0',
              transition: 'all 0.15s'
            }}
          >
            Category
            {selectedCategory !== 'All' && <span style={{ fontWeight: '700' }}>: {selectedCategory}</span>}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '2px', transition: 'transform 0.15s', transform: openFilter === 'category' ? 'rotate(180deg)' : 'none' }}>
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {openFilter === 'category' && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
              background: '#FFFFFF', border: '1.5px solid #CBD5E1',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: '160px'
            }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setOpenFilter(null); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '9px 16px', border: 'none', borderRadius: '0',
                    background: selectedCategory === cat ? '#FEF2F2' : 'transparent',
                    color: selectedCategory === cat ? '#DC2626' : '#374151',
                    fontSize: '13px', fontWeight: selectedCategory === cat ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >{cat}</button>
              ))}
            </div>
          )}
        </div>

        {/* Price button */}
        {sliderMax > 0 && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setOpenFilter(openFilter === 'price' ? null : 'price')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', border: (priceRange.min > 0 || priceRange.max < sliderMax) ? '1.5px solid #DC2626' : '1.5px solid #CBD5E1',
                background: (priceRange.min > 0 || priceRange.max < sliderMax) ? '#FEF2F2' : '#FFFFFF',
                color: (priceRange.min > 0 || priceRange.max < sliderMax) ? '#DC2626' : '#374151',
                fontSize: '13px', fontWeight: '500', cursor: 'pointer', borderRadius: '0',
                transition: 'all 0.15s'
              }}
            >
              Price
              {(priceRange.min > 0 || priceRange.max < sliderMax) && (
                <span style={{ fontWeight: '700' }}>: €{priceRange.min} – €{priceRange.max}</span>
              )}
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '2px', transition: 'transform 0.15s', transform: openFilter === 'price' ? 'rotate(180deg)' : 'none' }}>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {openFilter === 'price' && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
                background: '#FFFFFF', border: '1.5px solid #CBD5E1',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '20px 20px 16px', width: '280px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>Price range</span>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>€{priceRange.min} – €{priceRange.max}</span>
                </div>
                <PriceSlider min={priceRange.min} max={priceRange.max} sliderMax={sliderMax} onChange={setPriceRange} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>€0</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>€{sliderMax}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sort button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setOpenFilter(openFilter === 'sort' ? null : 'sort')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', border: sortBy !== 'default' ? '1.5px solid #DC2626' : '1.5px solid #CBD5E1',
              background: sortBy !== 'default' ? '#FEF2F2' : '#FFFFFF',
              color: sortBy !== 'default' ? '#DC2626' : '#374151',
              fontSize: '13px', fontWeight: '500', cursor: 'pointer', borderRadius: '0',
              transition: 'all 0.15s'
            }}
          >
            Sort
            {sortBy !== 'default' && (
              <span style={{ fontWeight: '700' }}>: {{
                'price-asc': 'Price ↑', 'price-desc': 'Price ↓',
                'name-asc': 'A → Z', 'name-desc': 'Z → A'
              }[sortBy]}</span>
            )}
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ marginLeft: '2px', transition: 'transform 0.15s', transform: openFilter === 'sort' ? 'rotate(180deg)' : 'none' }}>
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {openFilter === 'sort' && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 200,
              background: '#FFFFFF', border: '1.5px solid #CBD5E1',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)', minWidth: '180px'
            }}>
              {[
                { value: 'default', label: 'Default' },
                { value: 'price-asc', label: 'Price: Low → High' },
                { value: 'price-desc', label: 'Price: High → Low' },
                { value: 'name-asc', label: 'Name: A → Z' },
                { value: 'name-desc', label: 'Name: Z → A' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setOpenFilter(null); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '9px 16px', border: 'none', borderRadius: '0',
                    background: sortBy === opt.value ? '#FEF2F2' : 'transparent',
                    color: sortBy === opt.value ? '#DC2626' : '#374151',
                    fontSize: '13px', fontWeight: sortBy === opt.value ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >{opt.label}</button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        {hasActiveFilters && <div style={{ width: '1px', height: '20px', background: '#CBD5E1', margin: '0 4px' }} />}

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              padding: '8px 12px', border: 'none', background: 'transparent',
              color: '#64748B', fontSize: '13px', cursor: 'pointer', borderRadius: '0'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Clear all
          </button>
        )}
      </div>}

      {/* Product grid */}
      {!loading && <>
      <div ref={gridRef} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px'
      }}>
        {visibleProducts.map(product => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setDetailProduct(product)}
            style={{
              background: '#FFFFFF',
              border: isSelected(product.id) ? '2px solid #DC2626' : '1.5px solid #FFFFFF',
              borderRadius: '0',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: isSelected(product.id)
                ? '0 0 0 4px rgba(220,38,38,0.1)'
                : '0 1px 4px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{
              width: '100%', height: '210px', background: '#F8FAFC', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', padding: '20px', borderBottom: '1px solid #F1F5F9'
            }}>
              <img
                src={product.imageUrl}
                alt={product.title}
                style={{ maxWidth: '100%', maxHeight: '170px', objectFit: 'contain', display: 'block' }}
                onError={e => e.target.src = 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png'}
              />
              {/* Heart button */}
              <button
                className="fav-btn"
                onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}

                style={{
                  position: 'absolute', top: '10px', right: '10px',
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: '#FFFFFF', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.12)'
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24"
                  fill={isFavorite(product.id) ? '#DC2626' : 'none'}
                  stroke={isFavorite(product.id) ? '#DC2626' : '#94A3B8'}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>
            <div style={{ padding: '18px' }}>
              <div style={{
                display: 'inline-block', fontSize: '12px', fontWeight: '600', color: '#DC2626',
                background: '#FEF2F2', padding: '3px 10px', borderRadius: '2px', marginBottom: '10px'
              }}>
                {product.categoryName}
              </div>
              <div style={{
                fontSize: '15px', fontWeight: '600', color: '#0F172A', marginBottom: '12px',
                lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {product.title}
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0F172A', marginBottom: '14px', letterSpacing: '-0.3px' }}>
                €{product.price.toFixed(2)}
              </div>
              <button
                className="add-btn"
                onClick={e => { e.stopPropagation(); handleProductCheck(product); }}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '0', border: 'none',
                  background: isSelected(product.id) ? '#16A34A' : '#DC2626',
                  color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}
              >
                {isSelected(product.id) ? (
                  <><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Added</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> Add to cart</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No results */}
      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 24px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%', background: '#F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#94A3B8" strokeWidth="1.5"/>
              <path d="M21 21l-4.35-4.35" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#0F172A', marginBottom: '6px' }}>No products found</div>
          <div style={{ fontSize: '14px', color: '#64748B' }}>Try a different search term</div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '36px' }}>
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0); }}
            disabled={page === 1}
            style={{ padding: '8px 14px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: page === 1 ? '#CBD5E1' : '#374151', fontSize: '13px', fontWeight: '500', cursor: page === 1 ? 'default' : 'pointer', borderRadius: '0' }}
          >‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 2)
            .reduce((acc, n, i, arr) => { if (i > 0 && n - arr[i-1] > 1) acc.push('...'); acc.push(n); return acc; }, [])
            .map((n, i) => n === '...' ? (
              <span key={`d${i}`} style={{ padding: '8px 4px', color: '#94A3B8', fontSize: '13px' }}>…</span>
            ) : (
              <button key={n} onClick={() => { setPage(n); window.scrollTo(0, 0); }} style={{ padding: '8px 13px', border: '1.5px solid', borderRadius: '0', borderColor: page === n ? '#DC2626' : '#CBD5E1', background: page === n ? '#DC2626' : '#FFFFFF', color: page === n ? '#FFFFFF' : '#374151', fontSize: '13px', fontWeight: page === n ? '700' : '400', cursor: 'pointer' }}>{n}</button>
            ))}
          <button
            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0, 0); }}
            disabled={page === totalPages}
            style={{ padding: '8px 14px', border: '1.5px solid #CBD5E1', background: '#FFFFFF', color: page === totalPages ? '#CBD5E1' : '#374151', fontSize: '13px', fontWeight: '500', cursor: page === totalPages ? 'default' : 'pointer', borderRadius: '0' }}
          >›</button>
        </div>
      )}
      {/* Product detail modal */}
      </>}

      {detailProduct && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setDetailProduct(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
              zIndex: 500, backdropFilter: 'blur(3px)',
              animation: 'fadeIn 0.18s ease'
            }}
          />
          {/* Modal */}
          <div className="product-modal" style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 501, background: '#FFFFFF',
            display: 'flex',
            boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
            animation: 'slideUp 0.2s ease',
            maxHeight: '90vh', overflow: 'hidden'
          }}>
            {/* Image panel */}
            <div className="modal-image-panel" style={{
              width: '46%', flexShrink: 0,
              background: '#F8FAFC', borderRight: '1px solid #F1F5F9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '40px', minHeight: '420px'
            }}>
              <img
                src={detailProduct.imageUrl}
                alt={detailProduct.title}
                style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain' }}
                onError={e => e.target.src = 'https://cdn-icons-png.flaticon.com/512/2529/2529396.png'}
              />
            </div>

            {/* Info panel */}
            <div style={{ flex: 1, padding: '36px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              {/* Close */}
              <button
                onClick={() => setDetailProduct(null)}
                style={{
                  position: 'absolute', top: '16px', right: '16px',
                  width: '32px', height: '32px', border: '1px solid #CBD5E1',
                  background: '#FFFFFF', cursor: 'pointer', borderRadius: '0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Category */}
              <div style={{
                display: 'inline-block', fontSize: '11px', fontWeight: '700', color: '#DC2626',
                background: '#FEF2F2', padding: '4px 10px', borderRadius: '2px',
                letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px', alignSelf: 'flex-start'
              }}>
                {detailProduct.categoryName}
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: '22px', fontWeight: '800', color: '#0F172A',
                lineHeight: '1.3', letterSpacing: '-0.3px', marginBottom: '20px'
              }}>
                {detailProduct.title}
              </h2>

              {/* Description */}
              {detailProduct.description && (
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', marginBottom: '20px' }}>
                  {detailProduct.description}
                </p>
              )}

              {/* Price */}
              <div style={{ fontSize: '34px', fontWeight: '800', color: '#0F172A', letterSpacing: '-1px', marginBottom: '32px' }}>
                €{detailProduct.price.toFixed(2)}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Add to cart */}
                <button
                  onClick={() => { handleProductCheck(detailProduct); }}
                  style={{
                    width: '100%', padding: '14px', border: 'none', borderRadius: '0',
                    background: isSelected(detailProduct.id) ? '#16A34A' : '#DC2626',
                    color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'background 0.15s'
                  }}
                >
                  {isSelected(detailProduct.id) ? (
                    <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Added to cart</>
                  ) : (
                    <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg> Add to cart</>
                  )}
                </button>

                {/* Favorite */}
                <button
                  onClick={() => toggleFavorite(detailProduct.id)}
                  style={{
                    width: '100%', padding: '13px', borderRadius: '0',
                    border: `1.5px solid ${isFavorite(detailProduct.id) ? '#DC2626' : '#CBD5E1'}`,
                    background: isFavorite(detailProduct.id) ? '#FEF2F2' : '#FFFFFF',
                    color: isFavorite(detailProduct.id) ? '#DC2626' : '#374151',
                    fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    transition: 'all 0.15s'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24"
                    fill={isFavorite(detailProduct.id) ? '#DC2626' : 'none'}
                    stroke={isFavorite(detailProduct.id) ? '#DC2626' : 'currentColor'}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {isFavorite(detailProduct.id) ? 'Saved to favorites' : 'Save to favorites'}
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideUp { from { opacity: 0; transform: translate(-50%, -46%); } to { opacity: 1; transform: translate(-50%, -50%); } }
          `}</style>
        </>
      )}
    </div>
  );
}

export default Products;
