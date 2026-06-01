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

      let parsed;
      try { parsed = JSON.parse(body); }
      catch(e) { console.error('[API] JSON parse error:', e.message); return send(res, 400, JSON.stringify({error:'Invalid JSON'})); }

      const payload = JSON.stringify({
        model: parsed.model || 'deepseek-chat',
        messages: parsed.messages,
        max_tokens: parsed.max_tokens || 1200,
        temperature: parsed.temperature || 0.1
      });

      console.log(`[API] forwarding to DeepSeek (${(payload.length/1024).toFixed(0)}KB)...`);
      const t0 = Date.now();

      const opts = {
        hostname: 'api.deepseek.com',
        path: '/chat/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 120000
      };

      const preq = https.request(opts, pres => {
        let data = '';
        pres.on('data', c => data += c);
        pres.on('end', () => {
          console.log(`[API] DeepSeek responded: ${pres.statusCode} in ${((Date.now()-t0)/1000).toFixed(1)}s`);
          // Always return JSON
          try {
            const parsed = JSON.parse(data);
            send(res, pres.statusCode, JSON.stringify(parsed), 'application/json');
          } catch(e) {
            send(res, 500, JSON.stringify({error:'DeepSeek returned non-JSON', raw:data.substring(0,200)}), 'application/json');
          }
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

      try {
        preq.write(payload);
        preq.end();
      } catch(e) {
        console.error('[API] write error:', e.message);
        send(res, 500, JSON.stringify({error: 'Write error: '+e.message}), 'application/json');
      }
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
