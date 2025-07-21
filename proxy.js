const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://khoso74.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end(); // No content for OPTIONS
    return;
  }

  const url = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec'; // Replace if new
  const response = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
  const data = await response.text();
  res.setHeader('Access-Control-Allow-Origin', 'https://khoso74.github.io');
  res.status(response.status).send(data);
};
