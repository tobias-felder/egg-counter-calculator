const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3007;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('test.db', (err) => {
    if (err) {
        console.error('Database error:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
});

// Health check endpoint
app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Test server is running' });
});

// Simple route
app.get('/', (req, res) => {
    res.send('Test server is working!');
});

// Start server
console.log('Starting test server...');
app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
    console.log('Try accessing this in your browser');
}); 