// Vercel serverless function
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple health check
  if (req.url === '/health' || req.url === '/api/health') {
    res.status(200).json({ status: "ok", message: "API is working" });
    return;
  }

  // Default response
  res.status(404).json({ error: "API endpoint not found" });
}
