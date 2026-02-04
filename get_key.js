const http = require('http');

(async () => {
    try {
        console.log('Checking Health...');

        // 1. Auto-Login (Assuming seed creds)
        const loginPayload = JSON.stringify({ email: 'admin@medusa-test.com', password: 'supersecret' });

        const loginReq = http.request({
            hostname: 'localhost',
            port: 9000,
            path: '/auth/user/emailpass',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginPayload.length
            }
        }, (res) => {
            if (res.statusCode !== 200) {
                console.log(`Login Failed: ${res.statusCode}`);
                // Parse body to see error
                res.setEncoding('utf8');
                res.on('data', chunk => console.log('Login Error Body:', chunk));
                return;
            }

            const cookies = res.headers['set-cookie'];
            console.log('Logged in. Cookies:', cookies);
            const cookieHeader = cookies ? cookies.map(c => c.split(';')[0]).join('; ') : '';

            // 2. List Keys to see if one exists
            http.get({
                hostname: 'localhost',
                port: 9000,
                path: '/admin/publishable-api-keys',
                headers: { 'Cookie': cookieHeader }
            }, (listRes) => {
                let listData = '';
                listRes.on('data', c => listData += c);
                listRes.on('end', () => {
                    const listJson = JSON.parse(listData);
                    if (listJson.publishable_api_keys && listJson.publishable_api_keys.length > 0) {
                        console.log('KEY_FOUND:', listJson.publishable_api_keys[0].id);
                    } else {
                        // 3. Create Key
                        console.log('Creating new key...');
                        const createPayload = JSON.stringify({ title: "Web Client" });
                        const createReq = http.request({
                            hostname: 'localhost',
                            port: 9000,
                            path: '/admin/publishable-api-keys',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Content-Length': createPayload.length,
                                'Cookie': cookieHeader
                            }
                        }, (createRes) => {
                            let createData = '';
                            createRes.on('data', c => createData += c);
                            createRes.on('end', () => {
                                const createJson = JSON.parse(createData);
                                if (createJson.publishable_api_key) {
                                    console.log('KEY_CREATED:', createJson.publishable_api_key.id);
                                } else {
                                    console.log('Create Failed:', createData);
                                }
                            });
                        });
                        createReq.write(createPayload);
                        createReq.end();
                    }
                });
            });
        });

        loginReq.write(loginPayload);
        loginReq.end();

    } catch (e) {
        console.error('Script Error:', e);
    }
})();
