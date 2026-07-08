const RAPIDAPI_KEY = 'b14d365b76msh9a342055053338dp11b45ajsnd0a0bcd5d43f';
const RAPIDAPI_HOST = 'real-time-amazon-data.p.rapidapi.com';

export default async function handler(req, res) {
  const { query = 'electronics', page = '1' } = req.query;

  try {
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}&page=${page}&country=US&category_id=electronics`,
      {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST,
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
