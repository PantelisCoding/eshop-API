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
      products = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value);
    }

    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message, products: [] });
  }
}
