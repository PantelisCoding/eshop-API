export default async function handler(req, res) {
  const { asin } = req.query;
  if (!asin) return res.status(400).json({ error: 'asin required' });

  try {
    const response = await fetch(
      `https://real-time-amazon-data.p.rapidapi.com/product-details?asin=${asin}&country=US`,
      {
        headers: {
          'x-rapidapi-key': 'b14d365b76msh9a342055053338dp11b45ajsnd0a0bcd5d43f',
          'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
        }
      }
    );
    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
}
