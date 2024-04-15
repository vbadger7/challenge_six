//delcaring the constants and the variables
const API_KEY = '1ad35b3b3bde37d5b3f98b43d7b0c443'; 
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

//event listener for the form submission 
searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
    cityInput.value = '';
  }
});

//fetches the current weather from API
function getWeather(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      saveToLocalStorage(city);
    })
    .catch(error => console.error('Error fetching current weather:', error));

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => displayForecast(data))
    .catch(error => console.error('Error fetching forecast:', error));
}

//displays the current weather that was fetched from above
function displayCurrentWeather(data) {
    currentWeather.innerHTML = `
    <div class="card">
      <h2>${data.name}</h2>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Temperature: ${Math.round((data.main.temp - 273.15) * 9/5 + 32)}°F</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
      <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
    </div>
  `;
}

//displays the forecast
function displayForecast(data) {
    forecast.innerHTML = ''; 
    for (let i = 0; i < data.list.length; i += 8) { 
      const forecastData = data.list[i];
      const forecastDate = new Date(forecastData.dt * 1000);
      const forecastDay = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
      const temperatureFahrenheit = Math.round((forecastData.main.temp - 273.15) * 9/5 + 32); 
      forecast.innerHTML += `
        <div class="card">
          <h2>${(forecastDay),(forecastDate.toLocaleDateString())}</h2>
          <p>Temperature: ${temperatureFahrenheit}°F</p>
          <p>Humidity: ${forecastData.main.humidity}%</p>
          <p>Wind Speed: ${forecastData.wind.speed} m/s</p>
          <img src="http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png" alt="${forecastData.weather[0].description}">
        </div>
      `;
  }
}

//saves the searches are saved on the local storage
function saveToLocalStorage(city) {
  let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    displaySearchHistory();
  }
}
//on window reload it runs the displaySearchHistory function
window.onload = displaySearchHistory;

//funtion to display the searched history
function displaySearchHistory() {
  searchHistory.innerHTML = '';
  const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  history.forEach(city => {
    const cityCard = document.createElement('div');
    cityCard.classList.add('card');
    cityCard.innerHTML = `
      <p>${city}</p>
    `;
    cityCard.addEventListener('click', () => {
      getWeather(city);
    });
    searchHistory.appendChild(cityCard);
  });
}
