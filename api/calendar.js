export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const icsUrl = 'https://backend.stadtreinigung.hamburg/kalender/abholtermine.ics?hnIds=372521';

  try {
    const response = await fetch(icsUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/calendar, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (compatible; FAQ-Eidelstedter-Hoefe/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const icsData = await response.text();

    // Set appropriate headers
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

    return res.status(200).send(icsData);
  } catch (error) {
    console.error('Error fetching calendar:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch calendar data',
      message: error.message 
    });
  }
}
