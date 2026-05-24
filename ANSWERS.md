# ANSWERS

1) How to run

- See README.md — set `OPENWEATHER_API_KEY` in `.env`, then `npm install` and `npm start`.

2) Stack choice

- Node.js + Express: lightweight, easy proxying from server to OpenWeather, and simple static frontend. Worse choices: heavy frameworks (e.g. full React + backend) would be overkill for this assessment.

3) One real edge case

- Handling OpenWeather timeout: see [index.js](index.js) where the axios call uses `timeout: 7000` and returns a 504 when `err.code === 'ECONNABORTED'`.

4) AI usage

- I used AI to draft UI copy and to help write README instructions. (List tools/prompts used when applicable.)

5) Honest gap

- Not production hardened: no caching, no rate-limiting, minimal tests. With a day I'd add caching, retries with backoff, and tests.

