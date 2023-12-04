'use strict'
import anime from "animejs/lib/anime";
import { config } from "dotenv";
config();

const searchForm = document.querySelector(".weather__search--form");
const searchInput = document.querySelector(".weather__search--input");
const searchError = document.querySelector(".weather__search--error");

class App {
  #loadingClassName = ".weather__information--loading"
  constructor() {
    searchForm.addEventListener("submit", this._handleForm.bind(this))
  }

  _handleForm(e){
    e.preventDefault();
    let value = searchInput.value
    if(!value) searchError.classList.remove("hide");
    else {
      searchError.classList.add("hide");
      this._fetchWeatherInformation(value)
    }
  }

  _hideLoading(duration) {
    anime({
      targets: this.#loadingClassName,
      translateX: 900,
      duration: duration * 1000,
      easing: "easeInOutExpo"
    })
  }

  _showLoading() {
    anime({
      targets: this.#loadingClassName,
      translateX: [-900, 0],
      easing: "easeInOutQuad"
    })
  }

  _showInformation(data) {
    let weatherInformation = document.querySelector(".weather__information");
    let weatherCard = document.querySelector(".weather__information--card");
    let html = `
    <div class="weather__information--card">
        <div class=" weather__information--main-row">
          <img src="./icons/${data.icon}.png" class="weather__information--icon lazy-load" alt="${data.main}">
          <p class="weather__information--city lazy-load">${data.name}</p>
        </div>
        <div class="weather__information--row">
          <p class="weather__information--side1 lazy-load">Weather</p>
          <p class="line lazy-load"></p>
          <p class="weather__information--side2 lazy-load">${data.main}</p>
        </div>
        <div class="weather__information--row">
          <p class="weather__information--side1 lazy-load">Description</p>
          <p class="line lazy-load"></p>
          <p class="weather__information--side2 lazy-load">${data.description}</p>
        </div>
        <div class="weather__information--row">
          <p class="weather__information--side1 lazy-load">Temperature</p>
          <p class="line lazy-load"></p>
          <p class="weather__information--side2 weather__information--degree lazy-load">${data.temp}&#x2103;</p>
        </div>
        <div class="weather__information--row">
          <p class="weather__information--side1 lazy-load">Humidity</p>
          <p class="line lazy-load"></p>
          <p class="weather__information--side2 lazy-load">${data.humidity}</p>
        </div>
        <div class="weather__information--row">
          <p class="weather__information--side1 lazy-load">Wind Speed</p>
          <p class="line lazy-load"></p>
          <p class="weather__information--side2 lazy-load">${data.windSpeed}</p>
        </div>
      </div>`;
      if(weatherCard) weatherInformation.removeChild(weatherCard);
      weatherInformation.insertAdjacentHTML('beforeend', html);
      this._hideLoading(1);
      this._showInformationAnimation();
  }

  async _fetchWeatherInformation(cityName) {
    try{
      this._showLoading();
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.APIKEY}&units=metric`
      const weather = await fetch(url);
      const weatherData = await weather.json();
      
      if(weatherData.cod !== 200) throw new Error(`Can't Fetch Data => Error Code: ${weatherData.cod}`)

      let description = weatherData.weather[0].description;
      console.log(description)

      if(description.includes(" ")){
        let descriptionsArray = description.split(" ");
        console.log(descriptionsArray)
        descriptionsArray = descriptionsArray.map(desc => desc[0].toUpperCase() + desc.slice(1));
        console.log(descriptionsArray)
        description = descriptionsArray.join(" ");
      } 
      else description = description[0].toUpperCase() + description.slice(1);

      let data = {
        icon: weatherData.weather[0].icon,
        name: weatherData.name,
        main: weatherData.weather[0].main,
        description: description,
        temp: Math.floor(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
      }

      this._showInformation(data);
    } catch(error) {
      console.error(error);
      this._hideLoading(1);
    }
  }

  _showInformationAnimation() {
    let lazyLoads = document.querySelectorAll(".lazy-load");
    let speed = 0.6;
    console.log(lazyLoads);
    lazyLoads.forEach(el => {
      el.style.animation = `show-info ${speed}s ${speed}s 1 forwards `;
      speed += 0.2;
    })
  }

}

const app = new App();