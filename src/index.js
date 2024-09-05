const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

const users = [
  {
    name: 'username',
    password: 'password',
    role: 'admin',
  },
];

const sessions = {};

const app = express();
app.use(cookieParser());

app.use(bodyParser.json());

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

app.get('/dashboard', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId && sessions[sessionId]) {
    res.send('Dashboard');
    return;
  }
  return res.status(401).send('Unauthorized');
});
// when the user logs in, we create a session id and store it in the session storage
// and send the session id to the client as a cookie
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    user => user.name === username && user.password === password,
  );
  if (user) {
    const sessionId = uuidv4();
    // store the session id to the session storage (it can be a database or in-memory storage)
    sessions[sessionId] = {
      name: username,
      role: user.role,
    };
    res.setHeader('Set-Cookie', `sessionId=${sessionId}`);
    res.send('Logged in');
    return;
  }
  return res.status(401).send('Unauthorized');
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
