'use strict'
import anime from "animejs/lib/anime";
import { config } from "dotenv";
config();

const searchForm = document.querySelector(".weather__search--form");
const searchInput = document.querySelector(".weather__search--input");
const searchError = document.querySelector(".weather__search--error");
const loading = document.querySelector(".weather__information--loading");

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
      this._showWeatherInformation(value)
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
      // duration: duration,
    })
  }

  _showInformation(duration, className) {
    anime({
      targets: className,
      translateY: [-10, 0],
      easing: "easeInOutQuad",
      duration: duration * 1000
    });
  }

  async _showWeatherInformation(cityName) {
    this._showLoading();
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.APIKEY}`
    const weather = await fetch(url);
    const weatherData = await weather.json();
    const dayOrNight = weatherData.weather[0].icon[2];

    this._hideLoading(1);
  }

}

const app = new App();