const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text({ type: 'text/xml' }));

// In-memory DB for demo
let items = [];
let formSubmissions = [];

// Valid users for login (simple demo)
const validUsers = [
  { username: 'admin', password: 'admin123' },
  { username: 'testuser', password: 'test123' },
  { username: 'qa', password: 'qa123' }
];
let loginAttempts = [];

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Body:`, req.body);
  next();
});

// Health endpoint
app.get('/', (req, res) => {
  res.send('Hello World! Backend is alive.');
});

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login - QA Testing</title>
      <style>
        body { font-family: Arial; max-width: 400px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 20px; }
        input { width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; background: #007bff; color: white; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px; }
        button:hover { background: #0056b3; }
        .error { color: red; margin-top: 10px; }
        .success { color: green; margin-top: 10px; }
        .info { font-size: 12px; color: #666; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Login</h1>
        <form method="POST" action="/login" id="loginForm">
          <label>Username:</label>
          <input type="text" name="username" required minlength="3">
          <label>Password:</label>
          <input type="password" name="password" required minlength="3">
          <button type="submit">Login</button>
        </form>
        <div class="info">
          <p><strong>Test Credentials:</strong></p>
          <p>admin / admin123</p>
          <p>testuser / test123</p>
          <p>qa / qa123</p>
        </div>
        <h2>Recent Login Attempts (${loginAttempts.length})</h2>
        <ul style="font-size: 12px;">
          ${loginAttempts.slice(-5).reverse().map(a => `<li>${a.username} - ${a.success ? '✓ Success' : '✗ Failed'} (${a.timestamp})</li>`).join('')}
        </ul>
      </div>
    </body>
    </html>
  `);
});

// Login validation endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validation
  if (!username || username.length < 3) {
    loginAttempts.push({ username: username || '', success: false, timestamp: new Date().toISOString() });
    console.log(`POST /login - Validation failed: username too short`);
    return res.status(400).send(`
      <h1>Login Failed</h1>
      <p class="error">Username must be at least 3 characters</p>
      <p><a href="/login">Try Again</a></p>
    `);
  }
  
  if (!password || password.length < 3) {
    loginAttempts.push({ username, success: false, timestamp: new Date().toISOString() });
    console.log(`POST /login - Validation failed: password too short`);
    return res.status(400).send(`
      <h1>Login Failed</h1>
      <p class="error">Password must be at least 3 characters</p>
      <p><a href="/login">Try Again</a></p>
    `);
  }
  
  // Check credentials
  const user = validUsers.find(u => u.username === username && u.password === password);
  const success = !!user;
  
  loginAttempts.push({ username, success, timestamp: new Date().toISOString() });
  
  if (success) {
    console.log(`POST /login - Success: ${username}`);
    res.send(`
      <h1>Login Successful!</h1>
      <p class="success">Welcome, ${username}!</p>
      <p>Login time: ${new Date().toISOString()}</p>
      <p><a href="/login">Login Again</a></p>
    `);
  } else {
    console.log(`POST /login - Failed: ${username} (invalid credentials)`);
    res.status(401).send(`
      <h1>Login Failed</h1>
      <p class="error">Invalid username or password</p>
      <p><a href="/login">Try Again</a></p>
    `);
  }
});

// HTML form page
app.get('/form', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>QA Form Submission</title>
      <style>
        body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        input, textarea { width: 100%; padding: 10px; margin: 8px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { background: #007bff; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
        button:hover { background: #0056b3; }
        label { font-weight: bold; display: block; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>QA Test Form</h1>
        <form method="POST" action="/form">
          <label>Name:</label>
          <input type="text" name="name" required minlength="2" placeholder="Enter your name">
          <label>Email:</label>
          <input type="email" name="email" required placeholder="your@email.com">
          <label>Message:</label>
          <textarea name="message" rows="4" required minlength="5" placeholder="Enter your message"></textarea>
          <button type="submit">Submit</button>
        </form>
        <h2>Recent Submissions (${formSubmissions.length})</h2>
        <ul style="font-size: 12px;">
          ${formSubmissions.slice(-5).reverse().map(s => `<li>${s.name} (${s.email}): ${s.message.substring(0, 50)}...</li>`).join('')}
        </ul>
      </div>
    </body>
    </html>
  `);
});

// REST API CRUD
app.get('/api/items', (req, res) => {
  console.log(`GET /api/items - Returning ${items.length} items`);
  res.json(items);
});

app.post('/api/items', (req, res) => {
  const item = { id: items.length, ...req.body, createdAt: new Date().toISOString() };
  items.push(item);
  console.log(`POST /api/items - Created item:`, item);
  res.json(item);
});

app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (items[id]) {
    items[id] = { ...items[id], ...req.body, updatedAt: new Date().toISOString() };
    console.log(`PUT /api/items/${id} - Updated item:`, items[id]);
    return res.json(items[id]);
  }
  console.log(`PUT /api/items/${id} - Not found`);
  res.status(404).json({ error: 'Not found' });
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (items[id]) {
    const deleted = items.splice(id, 1)[0];
    console.log(`DELETE /api/items/${id} - Deleted item:`, deleted);
    return res.json({ deleted: id, item: deleted });
  }
  console.log(`DELETE /api/items/${id} - Not found`);
  res.status(404).json({ error: 'Not found' });
});

// HTML form submission
app.post('/form', (req, res) => {
  const { name, email, message } = req.body;
  
  // Validation
  if (!name || name.length < 2) {
    console.log(`POST /form - Validation failed: name too short`);
    return res.status(400).send(`<h1>Validation Error</h1><p>Name must be at least 2 characters</p><p><a href="/form">Try Again</a></p>`);
  }
  
  if (!email || !email.includes('@')) {
    console.log(`POST /form - Validation failed: invalid email`);
    return res.status(400).send(`<h1>Validation Error</h1><p>Invalid email address</p><p><a href="/form">Try Again</a></p>`);
  }
  
  if (!message || message.length < 5) {
    console.log(`POST /form - Validation failed: message too short`);
    return res.status(400).send(`<h1>Validation Error</h1><p>Message must be at least 5 characters</p><p><a href="/form">Try Again</a></p>`);
  }
  
  const submission = {
    id: formSubmissions.length,
    name,
    email,
    message,
    submittedAt: new Date().toISOString()
  };
  formSubmissions.push(submission);
  console.log(`POST /form - Form submitted:`, submission);
  res.send(`
    <h1>Form Submitted Successfully!</h1>
    <p>Name: ${submission.name}</p>
    <p>Email: ${submission.email}</p>
    <p>Message: ${submission.message}</p>
    <p>Submission ID: ${submission.id}</p>
    <p><a href="/form">Submit Another</a></p>
  `);
});

// SOAP endpoint
app.post('/soap', (req, res) => {
  console.log('POST /soap - SOAP request received:', req.body);
  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Response>
      <Status>Success</Status>
      <Message>SOAP request processed successfully</Message>
      <Timestamp>${new Date().toISOString()}</Timestamp>
    </soap:Response>
  </soap:Body>
</soap:Envelope>`;
  res.set('Content-Type', 'text/xml');
  res.send(xmlResponse);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`REST API: http://localhost:${PORT}/api/items`);
  console.log(`Form: http://localhost:${PORT}/form`);
  console.log(`Login: http://localhost:${PORT}/login`);
  console.log(`SOAP: http://localhost:${PORT}/soap`);
});
