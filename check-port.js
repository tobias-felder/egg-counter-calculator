const net = require('net');

function checkPort(port) {
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is in use`);
                resolve(false);
            } else {
                reject(err);
            }
        });

        server.once('listening', () => {
            server.close();
            console.log(`Port ${port} is available`);
            resolve(true);
        });

        server.listen(port, '0.0.0.0');
    });
}

// Check ports 3001-3005
async function checkPorts() {
    for (let port = 3001; port <= 3005; port++) {
        console.log(`Checking port ${port}...`);
        try {
            const isAvailable = await checkPort(port);
            if (isAvailable) {
                console.log(`\nRecommended port: ${port}\n`);
                break;
            }
        } catch (error) {
            console.error(`Error checking port ${port}:`, error);
        }
    }
}

checkPorts(); 