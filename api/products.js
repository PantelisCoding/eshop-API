export default async function handler(req, res) {
  const { query = 'electronics gadgets', category_id = 'aps', page = '1' } = req.query;

  try {
    const response = await fetch(
      `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&country=US&category_id=${category_id}`,
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
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
