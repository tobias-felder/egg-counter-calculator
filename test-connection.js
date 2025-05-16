const http = require('http');
const net = require('net');

// Test TCP connection
function testTcpConnection(port) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        
        socket.setTimeout(1000);  // 1 second timeout
        
        socket.on('connect', () => {
            console.log(`TCP connection successful to port ${port}`);
            socket.destroy();
            resolve(true);
        });
        
        socket.on('timeout', () => {
            console.log(`Connection timeout on port ${port}`);
            socket.destroy();
            resolve(false);
        });
        
        socket.on('error', (err) => {
            console.log(`Connection error on port ${port}:`, err.message);
            resolve(false);
        });
        
        console.log(`Attempting to connect to localhost:${port}...`);
        socket.connect(port, 'localhost');
    });
}

// Test HTTP connection
function testHttpConnection(port) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: '/',
            method: 'GET',
            timeout: 1000
        };

        console.log(`Attempting HTTP GET request to http://localhost:${port}/...`);
        
        const req = http.request(options, (res) => {
            console.log(`HTTP connection successful to port ${port}`);
            console.log('Status Code:', res.statusCode);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`HTTP request error on port ${port}:`, err.message);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`HTTP request timeout on port ${port}`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
}

// Run tests
async function runTests() {
    console.log('\nTesting server connectivity...');
    console.log('=========================');
    
    // Test multiple ports
    const ports = [3000, 3001, 3002];
    
    for (const port of ports) {
        console.log(`\nTesting port ${port}:`);
        console.log('-----------------');
        
        console.log('\nTCP Test:');
        await testTcpConnection(port);
        
        console.log('\nHTTP Test:');
        await testHttpConnection(port);
    }
}

runTests(); 