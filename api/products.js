const RAPIDAPI_KEY = 'b14d365b76msh9a342055053338dp11b45ajsnd0a0bcd5d43f';
const RAPIDAPI_HOST = 'real-time-amazon-data.p.rapidapi.com';

const ALL_QUERIES = [
  'laptop computer notebook',
  'unlocked smartphone android iphone',
  '4k computer monitor display',
  'wireless headphones bluetooth earbuds',
  'android tablet ipad',
  'gaming keyboard mouse headset',
  'computer mouse keyboard usb hub',
];

async function searchProducts(query, page = '1') {
  const response = await fetch(
    `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}&page=${page}&country=US&category_id=aps`,
    {
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      }
    }
  );
  const data = await response.json();
  return data.data?.products || [];
}

export default async function handler(req, res) {
  const { query, page = '1' } = req.query;

  try {
    let products;
    if (!query || query === 'all') {
      // Fetch all categories in parallel and combine
      const results = await Promise.all(ALL_QUERIES.map(q => searchProducts(q, '1')));
      products = results.flat();
    } else {
      products = await searchProducts(query, page);
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ data: { products } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
