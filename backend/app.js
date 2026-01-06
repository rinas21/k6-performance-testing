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

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} Body:`, req.body);
  next();
});

// Health endpoint
app.get('/', (req, res) => {
  res.send('Hello World! Backend is alive.');
});

// HTML form page
app.get('/form', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>QA Form Submission</title>
      <style>
        body { font-family: Arial; max-width: 500px; margin: 50px auto; padding: 20px; }
        input, textarea { width: 100%; padding: 8px; margin: 5px 0; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <h1>QA Test Form</h1>
      <form method="POST" action="/form">
        <label>Name:</label>
        <input type="text" name="name" required>
        <label>Email:</label>
        <input type="email" name="email" required>
        <label>Message:</label>
        <textarea name="message" rows="4" required></textarea>
        <button type="submit">Submit</button>
      </form>
      <h2>Recent Submissions (${formSubmissions.length})</h2>
      <ul>
        ${formSubmissions.slice(-5).reverse().map(s => `<li>${s.name} (${s.email}): ${s.message}</li>`).join('')}
      </ul>
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
  const submission = {
    id: formSubmissions.length,
    ...req.body,
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
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
  console.log(`REST API: http://localhost:${PORT}/api/items`);
  console.log(`Form: http://localhost:${PORT}/form`);
  console.log(`SOAP: http://localhost:${PORT}/soap`);
});
