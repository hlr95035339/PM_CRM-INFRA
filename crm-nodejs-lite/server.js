const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

function sendJSON(res, obj, code = 200) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function serveStatic(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const usersPath = path.join(__dirname, 'data', 'users.json');
const customersPath = path.join(__dirname, 'data', 'customers.json');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    return serveStatic(res, path.join(__dirname, 'frontend', 'index.html'), 'text/html; charset=utf-8');
  }

  if (req.method === 'GET' && url.pathname === '/app.js') {
    return serveStatic(res, path.join(__dirname, 'frontend', 'app.js'), 'application/javascript');
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return sendJSON(res, { status: 'ok', message: 'CRM lite healthy' });
  }

  if (req.method === 'GET' && url.pathname === '/api/customers') {
    fs.readFile(customersPath, 'utf8', (err, data) => {
      if (err) return sendJSON(res, { message: 'No customers' }, 404);
      sendJSON(res, JSON.parse(data));
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const { username, password } = JSON.parse(body || '{}');
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) return sendJSON(res, { message: 'Invalid username or password' }, 401);
        // return a fake token for demo
        return sendJSON(res, { token: 'demo-token', user: { id: user.id, username: user.username, role: user.role } });
      } catch (e) {
        return sendJSON(res, { message: 'Invalid request' }, 400);
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

server.listen(PORT, () => console.log(`CRM-lite running on port ${PORT}`));
