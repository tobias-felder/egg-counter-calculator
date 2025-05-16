const http = require('http');
const app = require('./server.js');  // Import your Express app

const server = http.createServer(app);

server.listen(3000, '0.0.0.0', () => {
    console.log('=================================');
    console.log('Server is running on port 3000');
    console.log('Try these URLs in your browser:');
    console.log('  http://localhost:3000/health');
    console.log('  http://localhost:3000/test');
    console.log('=================================');
}); 