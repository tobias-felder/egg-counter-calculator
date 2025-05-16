const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3007; // Changed port again

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database('egg_counter.db', (err) => {
    if (err) {
        console.error('Database error:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
    
    // Create tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT,
        age INTEGER,
        lastPeriod TEXT
    )`);
});

// Health check endpoint
app.get('/health', (req, res) => {
    console.log('Health check requested from:', req.ip);
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        server: 'clean-server',
        port: PORT,
        ip: req.ip
    });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Clean server running on http://0.0.0.0:${PORT}`);
    console.log(`You can access it at:`);
    console.log(`- http://localhost:${PORT}/health`);
    console.log(`- http://127.0.0.1:${PORT}/health`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
    }
}); 