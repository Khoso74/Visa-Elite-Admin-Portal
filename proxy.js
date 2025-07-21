const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const url = 'https://script.google.com/macros/s/AKfycbxIkJL8tNlrZKL2jS2zcfDL3_-XssqRGYWeZvWgbqPTK_pG2FOUSKNYAw-cpgugihdC/exec';
  const response = await fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
  const data = await response.text();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(response.status).send(data);
};
