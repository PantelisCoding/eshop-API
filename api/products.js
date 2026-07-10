const TECH_SLUGS = ['laptops', 'smartphones', 'tablets', 'mobile-accessories'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const { category } = req.query;

  try {
    let rawProducts = [];

    if (category && category !== 'all') {
      const r = await fetch(`https://dummyjson.com/products/category/${category}?limit=100`, { signal: AbortSignal.timeout(8000) });
      const data = await r.json();
      rawProducts = data.products || [];
    } else {
      const results = await Promise.allSettled(
        TECH_SLUGS.map(s =>
          fetch(`https://dummyjson.com/products/category/${s}?limit=100`, { signal: AbortSignal.timeout(8000) })
            .then(r => r.json())
            .then(d => d.products || [])
        )
      );
      rawProducts = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    }

    const products = rawProducts.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.thumbnail,
      category: p.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: `${p.description}${p.brand ? ' | ' + p.brand : ''} | ⭐ ${p.rating}`,
      rating: p.rating,
    }));

    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ error: String(err), products: [] });
  }
}
