// Weather Component
async function fetchWeatherContent() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const location = `${latitude},${longitude}`;

          try {
            const resWeather = await fetch(
              `https://api.weatherapi.com/v1/current.json?key=8d1867c0eb6447ea876202032240802&q=${location}`
            );
            const weather = await resWeather.json();
            resolve(weather);
          } catch (err) {
            console.error('Error fetching weather data:', err);
            reject(err);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          reject(error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      reject('Geolocation not supported');
    }
  });
}
async function Weather() {
  // Call the function to fetch weather information
  const weather = await fetchWeatherContent();

  return `
<section class="input-part">
  <p class="info-txt">
  </p>
  <div class="content">
    <h1 class='weatherTitle'>
      Can we play today?
    </h1>
  </div>
</section>
<img class='center-img' src="${weather?.current.condition.icon}" alt="Weather Icon">
<section class="weather-part">
  <div class="weather">
    ${weather?.current.condition.text}
  </div>
  <div class="temp">
    ${weather?.current.feelslike_c}
    <sup>
      °
    </sup>
    C
  </div>
  <div class="location">
    <span>
      <i class="bi bi-geo-alt">
      </i>
      ${weather?.location.name}, ${weather?.location.country}
    </span>
  </div>
  <div class="bottom-details">
    <div class="humidity">
      ${weather?.current.humidity}
      <div>
        <i class="bi bi-moisture">
        </i>
        Humidity
      </div>
    </div>
    <div class="localTime">
      <i class="bi bi-calendar-week">
      </i>
      ${weather?.location.localtime}
    </div>
  </div>
</section>`;
}

export default Weather;
