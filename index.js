require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;
if (!OPENWEATHER_KEY) {
  console.warn('Warning: OPENWEATHER_API_KEY not set. See README.md');
}

function extractOpenWeatherMessage(payload) {
  if (!payload) return 'API error';
  if (typeof payload === 'string') return payload;
  if (typeof payload.message === 'string') return payload.message;
  return 'API error';
}

function mapOpenWeatherError(error) {
  if (!error.response) {
    return { status: 500, message: 'Unexpected error contacting OpenWeather' };
  }

  const upstreamStatus = error.response.status;
  const upstreamMessage = extractOpenWeatherMessage(error.response.data);

  if (upstreamStatus === 401) {
    return {
      status: 401,
      message: 'OpenWeather rejected the API key. Check OPENWEATHER_API_KEY in .env and make sure it is a valid key.'
    };
  }

  if (upstreamStatus === 429) {
    return {
      status: 429,
      message: 'OpenWeather rate limit reached. Try again in a moment.'
    };
  }

  return { status: upstreamStatus, message: upstreamMessage };
}

app.get('/api/weather', async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing query parameter `q` (city name).' });
  if (!OPENWEATHER_KEY) {
    return res.status(503).json({ error: 'OpenWeather API key is not configured. Set OPENWEATHER_API_KEY in .env.' });
  }

  const url = 'https://api.openweathermap.org/data/2.5/weather';
  try {
    const resp = await axios.get(url, {
      params: { q, appid: OPENWEATHER_KEY, units: 'metric' },
      timeout: 7000
    });
    return res.json({ ok: true, data: resp.data });
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'OpenWeather timed out' });
    }
    const mapped = mapOpenWeatherError(err);
    return res.status(mapped.status).json({ error: mapped.message });
  }
});

// EDGE CASE handling: invalid city input is validated above (see /api/weather)


const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other process or set PORT to a different value.`);
    process.exit(1);
  }

  throw error;
});
