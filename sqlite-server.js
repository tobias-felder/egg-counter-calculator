const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3004;

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
    
    db.run(`CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        data TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Health check endpoint
app.get('/health', (req, res) => {
    console.log('Health check requested');
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        server: 'sqlite-server',
        port: PORT
    });
});

// Notification endpoint
app.post('/api/notifications', (req, res) => {
    const { email, age, lastPeriod } = req.body;
    console.log('Received notification request:', { email, age, lastPeriod });
    
    db.run('INSERT INTO users (email, age, lastPeriod) VALUES (?, ?, ?)',
        [email, age, lastPeriod],
        function(err) {
            if (err) {
                console.error('Error saving user:', err);
                return res.status(500).json({ error: err.message });
            }
            
            db.run('INSERT INTO analytics (type, data) VALUES (?, ?)',
                ['user_registration', JSON.stringify({ email, age })],
                function(err) {
                    if (err) {
                        console.error('Error saving analytics:', err);
                        return res.status(500).json({ error: err.message });
                    }
                    
                    res.json({ success: true, message: 'Notification sent' });
                }
            );
        }
    );
});

// Start server
app.listen(PORT, () => {
    console.log(`SQLite server running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
}); 