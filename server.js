// Janaseva AI — Production & Development Node.js Web Server
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request: Invalid URL encoding');
    return;
  }

  // Health check endpoint
  if (pathname === '/api/health') {
    const healthData = JSON.stringify({
      status: 'ok',
      app: 'Janaseva AI',
      version: '2.0.0',
      timestamp: new Date().toISOString()
    });
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      res.end(healthData);
    }
    return;
  }

  // Resolve target file path securely
  const normalizedPath = path.normalize(pathname).replace(/^([a-zA-Z]:|[\\\/])+/, '');
  let filePath = path.resolve(PUBLIC_DIR, normalizedPath);

  // Security check: prevent directory traversal
  const relative = path.relative(PUBLIC_DIR, filePath);
  if (relative.startsWith('..') && !path.isAbsolute(relative)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Helper to serve a file
  function serveFile(targetFilePath) {
    fs.readFile(targetFilePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error: ' + readErr.code);
        return;
      }

      const ext = path.extname(targetFilePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      // Always disable caching so the browser immediately gets fresh files
      // exactly like opening index.html directly
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(content);
      }
    });
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(filePath);
      return;
    }

    if (!err && stats.isDirectory()) {
      const indexCandidate = path.join(filePath, 'index.html');
      fs.stat(indexCandidate, (indexErr, indexStats) => {
        if (!indexErr && indexStats.isFile()) {
          serveFile(indexCandidate);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: Directory index missing');
        }
      });
      return;
    }

    // SPA fallback handling:
    // ONLY fallback to index.html for page navigation requests (no static file extension)
    // NEVER serve index.html for missing .js, .css, .json, or image assets!
    const ext = path.extname(pathname).toLowerCase();
    const isStaticAsset = ext && ext !== '.html';

    if (!isStaticAsset) {
      const defaultIndex = path.join(PUBLIC_DIR, 'index.html');
      fs.stat(defaultIndex, (spaErr, spaStats) => {
        if (!spaErr && spaStats.isFile()) {
          serveFile(defaultIndex);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: index.html not found');
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${pathname}`);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Janaseva AI server listening on http://localhost:${PORT}`);
  console.log(`Open in browser: http://localhost:${PORT}`);
});
