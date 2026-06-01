// Nutrition Tracker API Proxy Server
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const PORT = 3456;
const API_KEY = 'sk-a8e9984b0ecd4995922cf3bb616d43b5';

function send(res, code, data, ct) {
  res.writeHead(code, {
    'Content-Type': ct || 'text/html; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Cache-Control': 'no-store'
  });
  res.end(data);
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, '');

  if (req.url === '/api/analyze' && req.method === 'POST') {
    console.log(`[${new Date().toLocaleTimeString()}] POST /api/analyze`);
    let chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString();
      console.log(`[API] body: ${(body.length/1024).toFixed(0)}KB`);

      // Validate JSON first
      try { JSON.parse(body); }
      catch(e) { console.error('[API] JSON parse error:', e.message); return send(res, 400, JSON.stringify({error:'Invalid client JSON'})); }

      // Forward raw body directly — don't re-serialize (avoids type mismatches)
      console.log(`[API] forwarding to DeepSeek (${(body.length/1024).toFixed(0)}KB)...`);
      const t0 = Date.now();

      // DeepSeek OpenAI endpoint doesn't support vision. Use Anthropic-compatible endpoint.
      const opts = {
        hostname: 'api.deepseek.com',
        path: '/anthropic/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Length': Buffer.byteLength(body)
        },
        timeout: 120000
      };

      const preq = https.request(opts, pres => {
        let data = '';
        pres.on('data', c => data += c);
        pres.on('end', () => {
          console.log(`[API] DeepSeek ${pres.statusCode} in ${((Date.now()-t0)/1000).toFixed(1)}s body:${data.substring(0,200)}`);
          send(res, pres.statusCode, data, 'application/json');
        });
      });

      preq.on('error', err => {
        console.error('[API] request error:', err.message);
        send(res, 502, JSON.stringify({error: 'Upstream error: '+err.message}), 'application/json');
      });

      preq.on('timeout', () => {
        console.error('[API] request timeout');
        preq.destroy();
        send(res, 504, JSON.stringify({error: 'Upstream timeout'}), 'application/json');
      });

      preq.write(body);
      preq.end();
    });
    return;
  }

  // Serve static files
  let fp = req.url === '/' ? '/nutrition-tracker.html' : req.url;
  fp = path.join(__dirname, fp);
  const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.jpg':'image/jpeg'};
  const ext = path.extname(fp);
  fs.readFile(fp, (err, data) => {
    if (err) return send(res, 404, 'Not Found');
    send(res, 200, data, mime[ext] || 'application/octet-stream');
  });
});

server.listen(PORT, () => {
  const { networkInterfaces } = require('os');
  let ip = 'localhost';
  for (const [name, nets] of Object.entries(networkInterfaces())) {
    for (const n of nets) { if (n.family === 'IPv4' && !n.internal) ip = n.address; }
  }
  console.log(`\n  🍎 营养拍 http://localhost:${PORT}`);
  console.log(`  📱 手机 http://${ip}:${PORT}\n`);
});
