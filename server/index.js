const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
require('dotenv').config();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Repo Scout API is running' });
});

// GitHub proxy endpoint (to avoid CORS issues)
app.use('/api/github/*', async (req, res) => {
  try {
    const githubPath = req.params[0];
    const token = process.env.GITHUB_TOKEN;
    
    console.log(`Proxying request to: https://api.github.com/${githubPath}`);
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'Repo-Scout-App'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Using GitHub token for authentication');
    } else {
      console.log('No GitHub token found, using unauthenticated requests');
    }
    
    const fetchOptions = {
      method: req.method,
      headers: headers
    };
    
    if (req.method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(`https://api.github.com/${githubPath}`, fetchOptions);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`GitHub API error: ${response.status} - ${errorData}`);
      return res.status(response.status).json({ 
        error: `GitHub API error: ${response.status} ${response.statusText}`,
        details: errorData 
      });
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ error: 'Failed to fetch from GitHub', details: error.message });
  }
});

// Catch all handler: send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 http://localhost:${PORT}`);
});
