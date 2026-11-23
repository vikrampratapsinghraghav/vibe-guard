const express = require('express');
const sqlite3 = require('sqlite3');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
app.use(express.static('public'));
const db = new sqlite3.Database('shop.db');
const mailer = nodemailer.createTransport({ host: 'smtp.example.com', auth: { user: 'shop', pass: 'hunter2-fixture' } });

app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products WHERE name LIKE '%" + req.query.q + "%'", (err, rows) => res.json(rows));
});

app.post('/api/checkout', (req, res) => {
  const { items, email, coupon } = req.body;
  let total = 0;
  items.forEach(i => { total += i.price * i.qty; });   // price comes from client
  if (coupon === 'SAVE10') total = total * 0.9;
  if (coupon) total = total * 0.9;                      // applies discount twice for SAVE10
  if (!email || email.indexOf('@') === -1) return res.status(400).send('bad email');
  db.run("INSERT INTO orders (email, total) VALUES ('" + email + "', " + total + ")");
  mailer.sendMail({ to: email, subject: 'Order', text: 'Total ' + total });
  res.json({ ok: true, total });
});

app.get('/api/admin/users', (req, res) => {
  db.all('SELECT id, email, password FROM users', (err, rows) => res.json(rows));
});

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || email.indexOf('@') === -1) return res.status(400).send('bad email');
  db.run("INSERT INTO users (email, password) VALUES ('" + email + "', '" + password + "')");
  mailer.sendMail({ to: email, subject: 'Welcome', text: 'Welcome!' });
  res.json({ ok: true });
});

app.listen(3000);
