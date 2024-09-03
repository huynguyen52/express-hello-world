const express = require('express');
const app = express();

const TEN_MINUTES = 1000 * 60 * 10; // 10 minutes in milliseconds

app.get('/', (req, res) => {
  res.cookie('name', 'express', {
    expires: new Date(Date.now() + TEN_MINUTES),
    secure: true,
    httpOnly: true,
  }); // or res.setHeader('Set-Cookie', 'name=express');
  res.send('Hello World!');
});

app.get('/home', (req, res) => {
  const cookie = req.headers.cookie;
  console.log(cookie); // output: 'name=express'
  res.send('Home Page');
});

app.get('/clear-cookie', (req, res) => {
  res.clearCookie('name'); // or res.cookie('name', '', { expires: new Date(0) });
  res.send('Cookie cleared');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
