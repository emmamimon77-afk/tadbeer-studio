const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== CORS MIDDLEWARE ==========
// This allows your main site to fetch from this API
app.use((req, res, next) => {
    // Allow requests from your main site
    const allowedOrigins = [
        'https://tadbeer-studio.onrender.com',
        'http://localhost:3000',
        'http://localhost:5173'
    ];
    
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    // Allow credentials if needed
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    // Allow specific headers
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    
    // Allow specific methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    
    next();
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// News API proxy endpoint
app.get('/api/news', async (req, res) => {
    const query = req.query.q;
    const apiKey = '22cbe507380c980762e11568a6effa22';
    
    if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
    }
    
    try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=6&apikey=${apiKey}`;
        console.log(`Fetching news for: ${query}`);
        
        const response = await fetch(url);
        const data = await response.json();
        
        // Set cache headers to reduce API calls
        res.set('Cache-Control', 'public, max-age=300');
        res.json(data);
        
    } catch (error) {
        console.error('News API error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Serve the Global Crisis Monitor page
app.get('/global-crisis-monitor', (req, res) => {
    res.sendFile(path.join(__dirname, 'global-crisis-monitor.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Global Crisis Monitor: http://localhost:${PORT}/global-crisis-monitor`);
});
