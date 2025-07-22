// proxy.js (Node.js/Express server)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000; // ya koi aur port

app.use(cors());
app.use(bodyParser.json());

app.post('/proxy', async (req, res) => {
  const { url, data } = req.body;

  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
