const express = require('express');
const app = express();

// Basic test endpoint
app.get('/', (req, res) => {
    res.send('Server is working!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start server on port 5000 (commonly available on Windows)
const server = app.listen(5000, '127.0.0.1', () => {
    console.clear(); // Clear the console
    console.log('=================================');
    console.log('Test server running!');
    console.log('Try this in your browser:');
    console.log('http://127.0.0.1:5000/health');
    console.log('=================================');
}); 