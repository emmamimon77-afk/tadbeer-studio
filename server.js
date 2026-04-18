const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for your frontend
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// News proxy endpoint
app.get('/api/news', async (req, res) => {
    const { q } = req.query;
    const apiKey = '22cbe507380c980762e11568a6effa22';
    
    if (!q) {
        return res.status(400).json({ error: 'Missing search query' });
    }
    
    try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=8&apikey=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Add cache headers to reduce API calls
        res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
        res.json(data);
    } catch (error) {
        console.error('News API error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Serve the main page
app.get('/global-crisis-monitor', (req, res) => {
    res.sendFile(path.join(__dirname, 'global-crisis-monitor.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
