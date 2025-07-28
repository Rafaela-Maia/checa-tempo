document


async function getLatLon(city) {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=pt&format=json`);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    return {
      lat: data.results[0].latitude,
      lon: data.results[0].longitude,
      name: data.results[0].name,
      country: data.results[0].country
    };
  } else {
    throw new Error('Cidade não encontrada');
  }
}


async function getWeather(lat, lon) {
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto&lang=pt`);
  const data = await res.json();
  if (data.current_weather) {
    return data.current_weather;
  } else {
    throw new Error('Previsão não encontrada');
  }
}

document.getElementById('weather-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const city = document.getElementById('city-input').value.trim();
  const resultDiv = document.getElementById('weather-result');
  resultDiv.innerHTML = '<p>Buscando previsão...</p>';
  try {
    const loc = await getLatLon(city);
    const weather = await getWeather(loc.lat, loc.lon);
    const desc = weather.weathercode === 0 ? 'Céu limpo' :
      weather.weathercode === 1 ? 'Principalmente limpo' :
      weather.weathercode === 2 ? 'Parcialmente nublado' :
      weather.weathercode === 3 ? 'Nublado' :
      weather.weathercode === 45 ? 'Névoa' :
      weather.weathercode === 48 ? 'Névoa gelada' :
      weather.weathercode === 51 ? 'Garoa leve' :
      weather.weathercode === 53 ? 'Garoa moderada' :
      weather.weathercode === 55 ? 'Garoa densa' :
      weather.weathercode === 61 ? 'Chuva leve' :
      weather.weathercode === 63 ? 'Chuva moderada' :
      weather.weathercode === 65 ? 'Chuva forte' :
      weather.weathercode === 80 ? 'Aguaceiros leves' :
      weather.weathercode === 81 ? 'Aguaceiros moderados' :
      weather.weathercode === 82 ? 'Aguaceiros violentos' :
      'Condição desconhecida';
    resultDiv.innerHTML = `
      <div class="desc">${desc}</div>
      <div class="temp">${weather.temperature}°C</div>
      <p>Vento: ${weather.windspeed} km/h</p>
      <p>${loc.name}, ${loc.country}</p>
    `;
  } catch (err) {
    resultDiv.innerHTML = `<p>${err.message}</p>`;
  }
});
