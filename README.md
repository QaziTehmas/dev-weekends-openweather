# OpenWeather Consumer

Small Node.js + Express app that queries OpenWeather through a local proxy and serves a browser UI.

## Requirements

- Node.js 18 or newer
- An OpenWeather API key

## Setup

1. Copy `.env.example` to `.env`.
2. Set `OPENWEATHER_API_KEY` to your real OpenWeather key.
3. Run:

```powershell
npm install
npm start
```

4. Open `http://localhost:3000` and search for a city.

## What happens on errors

- Missing city input returns a 400 response.
- A slow OpenWeather request returns a 504.
- An invalid OpenWeather key returns a clear 401 response telling you to check `OPENWEATHER_API_KEY`.
- Rate limits return a 429 with a retry message.

## Why the proxy exists

The server keeps the OpenWeather key off the client side and gives us one place to validate input and normalize API failures.
