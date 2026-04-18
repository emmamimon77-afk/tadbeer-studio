const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Serve all other static pages - FIXED: removed the wildcard that caused the error
// Express automatically serves static files from the public directory
// No need for a catch-all route that conflicts with static serving

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Global Crisis Monitor: http://localhost:${PORT}/global-crisis-monitor`);
});
