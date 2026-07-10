const TECH_SLUGS = ['laptops', 'smartphones', 'tablets', 'mobile-accessories'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { category } = req.query;

  try {
    let products = [];

    if (category && category !== 'all') {
      const r = await fetch(`https://dummyjson.com/products/category/${category}?limit=100`);
      const data = await r.json();
      products = data.products || [];
    } else {
      const results = await Promise.allSettled(
        TECH_SLUGS.map(s =>
          fetch(`https://dummyjson.com/products/category/${s}?limit=100`)
            .then(r => r.json())
            .then(d => d.products || [])
        )
      );
      products = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    }

    const mapped = products.map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      image: p.thumbnail,
      category: p.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      description: `${p.description}${p.brand ? ' | ' + p.brand : ''} | ⭐ ${p.rating}`,
    }));

    res.status(200).json({ products: mapped });
  } catch (err) {
    res.status(500).json({ error: String(err), products: [] });
  }
}
