const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Simple test route
app.get('/test', (req, res) => {
    console.log('Received request at /test from:', req.ip);
    res.send('Server is working!');
});

// Start server
const PORT = 3001;
const HOST = 'localhost'; // Use localhost instead of IP

app.listen(PORT, HOST, () => {
    console.log(`Test server running on:`);
    console.log(`- http://localhost:${PORT}/test`);
    console.log(`- http://127.0.0.1:${PORT}/test`);
    console.log(`- http://[::1]:${PORT}/test`);
    console.log(`- http://${require('os').networkInterfaces()['Wi-Fi']?.[0]?.address || 'your-ip'}:${PORT}/test`);
}); 