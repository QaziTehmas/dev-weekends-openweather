const $ = s => document.querySelector(s);
const btn = $('#btn');
const cityInput = $('#city');
const out = $('#out');
const status = $('#status');

btn.addEventListener('click', async () => {
  const q = cityInput.value.trim();
  out.textContent = '';
  status.textContent = '';
  if (!q) { status.textContent = 'Please enter a city name.'; return; }
  status.textContent = 'Loading...';
  try {
    const resp = await fetch(`/api/weather?q=${encodeURIComponent(q)}`);
    const json = await resp.json();
    if (!resp.ok) {
      status.textContent = 'Error: ' + (json.error || resp.statusText);
      return;
    }
    status.textContent = 'Success';
    const w = json.data;
    out.textContent = `Location: ${w.name}, ${w.sys.country}\n` +
      `Weather: ${w.weather[0].main} - ${w.weather[0].description}\n` +
      `Temp: ${w.main.temp} °C (feels like ${w.main.feels_like} °C)\n` +
      `Wind: ${w.wind.speed} m/s\n`;
  } catch (err) {
    status.textContent = 'Network or unexpected error';
  }
});
