// Nutrition Tracker API Proxy Server
// Usage: node server.js
// Then open http://localhost:3456

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const API_KEY = 'sk-a8e9984b0ecd4995922cf3bb616d43b5';

function send(res, code, data, contentType) {
  res.writeHead(code, {
    'Content-Type': contentType || 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  res.end(data);
}

const server = http.createServer((req, res) => {
  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return send(res, 204, '');
  }

  // Proxy /api to DeepSeek
  if (req.url === '/api/analyze' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { model, messages, max_tokens, temperature } = JSON.parse(body);
        const payload = JSON.stringify({ model, messages, max_tokens, temperature });

        const options = {
          hostname: 'api.deepseek.com',
          path: '/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Length': Buffer.byteLength(payload)
          }
        };

        const proxyReq = https.request(options, proxyRes => {
          let data = '';
          proxyRes.on('data', chunk => data += chunk);
          proxyRes.on('end', () => {
            send(res, proxyRes.statusCode, data, 'application/json');
          });
        });
        proxyReq.on('error', err => send(res, 502, JSON.stringify({ error: err.message }), 'application/json'));
        proxyReq.write(payload);
        proxyReq.end();
      } catch (e) {
        send(res, 400, JSON.stringify({ error: e.message }), 'application/json');
      }
    });
    return;
  }

  // Serve static files
  let filePath = req.url === '/' ? '/nutrition-tracker.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const extMap = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not Found');
    send(res, 200, data, extMap[ext] || 'application/octet-stream');
  });
});

server.listen(PORT, () => {
  console.log(`\n  🍎 营养拍服务器已启动`);
  console.log(`  📱 手机访问: http://${getLocalIP()}:${PORT}`);
  console.log(`  💻 电脑访问: http://localhost:${PORT}\n`);
});

function getLocalIP() {
  const { networkInterfaces } = require('os');
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return 'localhost';
}
