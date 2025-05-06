const http = require('http');

console.log('Starting server...');

const server = http.createServer((req, res) => {
    console.log('Received request:', req.url);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
});

server.on('error', (error) => {
    console.error('Server error:', error);
});

server.listen(3000, 'localhost', () => {
    console.log('Server running at http://localhost:3000/');
    console.log('Press Ctrl+C to stop the server');
}); 