import React, { useState, useEffect } from 'react';

function CreateOrder() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [form, setForm] = useState({ userId: 1, orderDate: '' });

  useEffect(() => {
    fetch('https://eshop-api-production-2a1c.up.railway.app/products')
      .then(res => res.json())
      .then(data => setProducts(data.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProductCheck = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const isSelected = (id) => selectedProducts.some(p => p.id === id);
  const total = selectedProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2);

  const handleSubmit = async () => {
    const orderResponse = await fetch('https://eshop-api-production-2a1c.up.railway.app/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: parseInt(form.userId),
        orderDate: form.orderDate + ':00'
      })
    });
    const orderData = await orderResponse.json();
    const orderId = orderData.data;

    for (const product of selectedProducts) {
      await fetch('https://eshop-api-production-2a1c.up.railway.app/order-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, productId: product.id })
      });
    }

    alert('Order #' + orderId + ' placed successfully!');
    setSelectedProducts([]);
  };

  return (
    <div>
      <div style={{ fontSize: '22px', fontWeight: '500', color: '#ffffff', marginBottom: '24px' }}>Create order</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ background: '#2a2a2a', border: '1px solid #444444', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: '500', color: '#ffffff', marginBottom: '20px' }}>Order details</div>
          <label style={labelStyle}>Customer username</label>
          <input name="userName" type="text" placeholder="Enter username..." onChange={handleChange} style={inputStyle} />
          <label style={labelStyle}>Order date</label>
          <input name="orderDate" type="datetime-local" onChange={handleChange} style={inputStyle} />
          <div style={{ fontSize: '16px', fontWeight: '500', color: '#ffffff', margin: '8px 0 16px' }}>Select products</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {products.map(product => (
              <div key={product.id} onClick={() => handleProductCheck(product)} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', background: '#333333',
                border: isSelected(product.id) ? '1px solid #ffffff' : '1px solid #444444',
                borderRadius: '8px', cursor: 'pointer'
              }}>
                <input type="checkbox" checked={isSelected(product.id)} onChange={() => {}} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>{product.title}</div>
                  <div style={{ fontSize: '12px', color: '#999999' }}>{product.categoryName}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff' }}>${product.price}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: '#2a2a2a', border: '1px solid #444444', borderRadius: '12px', padding: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: '500', color: '#ffffff', marginBottom: '20px' }}>Order summary</div>
          <div style={{ background: '#333333', border: '1px solid #444444', borderRadius: '8px', padding: '16px' }}>
            {selectedProducts.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#999999' }}>No products selected</div>
            ) : (
              selectedProducts.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#999999', marginBottom: '8px' }}>
                  <span>{p.title}</span>
                  <span>${p.price}</span>
                </div>
              ))
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: '500', color: '#ffffff', paddingTop: '12px', borderTop: '1px solid #444444', marginTop: '8px' }}>
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
          <button onClick={handleSubmit} style={{
            width: '100%', padding: '12px',
            borderRadius: '8px',
            border: '1px solid #555555',
            background: 'transparent',
            color: '#ffffff',
            fontSize: '14px', fontWeight: '500',
            cursor: 'pointer', marginTop: '16px'
          }}>Place order</button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '13px', color: '#999999', display: 'block', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #444444', borderRadius: '8px', background: '#333333', color: '#ffffff', fontSize: '14px', outline: 'none', marginBottom: '16px' };

export default CreateOrder;