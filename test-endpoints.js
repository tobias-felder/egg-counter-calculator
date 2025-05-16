const http = require('http');

function testEndpoint(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (error) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.end();
    });
}

async function runTests() {
    try {
        console.log('Testing health endpoint...');
        const healthResult = await testEndpoint('/health');
        console.log('Health endpoint result:', healthResult);

        console.log('\nTesting subscription plans endpoint...');
        const plansResult = await testEndpoint('/api/subscriptions/plans');
        console.log('Subscription plans result:', plansResult);
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

runTests(); 