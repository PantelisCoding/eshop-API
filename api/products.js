export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { category } = req.query;

  try {
    const url = category && category !== 'all'
      ? `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`
      : 'https://fakestoreapi.com/products';

    const r = await fetch(url);
    const data = await r.json();

    const products = (Array.isArray(data) ? data : []).map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      imageUrl: p.image,
      categoryName: p.category.replace(/\b\w/g, c => c.toUpperCase()),
      description: `${p.description} | ⭐ ${p.rating?.rate || ''}`,
    }));

    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message, products: [] });
  }
}
