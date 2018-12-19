import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {
  weatherReport: any;
  apiID = '084b04a1bd24b3a2834390ec8153f9b1';
  units = 'metric';
  initialized: any;
  zip = '3149,au';

  constructor(private _http: HttpClient) {
    this.initialized = this.initialize();
  }

  /*
  * Obtains new forecast data from the api and sets the data to the variable weatherReport
  * @param {}
  * @return {promise} a promise the resolves when successful and rejects when fails
  */
  initialize() {
    return new Promise((resolve, reject) => {
      this._http.post('https://api.openweathermap.org/data/2.5/forecast', null, {
        params: {
          zip: this.zip,
          APPID: this.apiID,
          units: this.units
        }
      }).subscribe((res) => {
        this.weatherReport = res;
        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

  /*
  * Obtains all the forecase data for 4-5 days into an array
  * @param {}
  * @return {array} contains an object for each day, each object has (min,max,avg,icon,date)
  */
  getDayData() {
    if (!this.weatherReport) {
      throw new Error('Service not initialized');
    }
    const data = this.weatherReport.list;
    let min = data[0].main.temp_min,
      max = data[0].main.temp_max,
      avg = 0,
      cnt = 0;

    let dateHolder = new Date(data[0].dt_txt);
    const output = [];
    for (let i = 0; i < data.length; i++) {
      if (dateHolder.getDate() < new Date(data[i].dt_txt).getDate()) {
        avg = avg / cnt;
        output.push({
          min: Math.round(min),
          max: Math.round(max),
          avg: Math.round(avg),
          icon: this.getWeatherIcon(data[i].weather[0].icon),
          date: dateHolder
        });
        dateHolder = new Date(data[i].dt_txt);
        min = data[i].main.temp_min;
        max = data[i].main.temp_max;
        avg = 0;
        cnt = 0;
      }
      if (data[i].main.temp_min < min) {
        min = data[i].main.temp_min;
      }
      if (data[i].main.temp_max > max) {
        max = data[i].main.temp_max;
      }
      avg += data[i].main.temp;
      cnt += 1;
    }
    return output;
  }

  /*
  * Gets the current temperature
  * @param {}
  * @return {number} the current temperature
  */
  getCurrentTemp() {
    if (!this.weatherReport) {
      throw new Error('Service not initialized');
    }
    const data = this.weatherReport.list;

    for (let i = 0; i < data.length; i++) {
      if (data[i].dt * 1000 > Date.now()) {
        return data[i].main.temp;
      }
    }
    throw new Error('Outdated data');
  }

  /*
  * Converts icon id from api to css classes representing the current weather
  * NOTE: icon data from https://openweathermap.org/weather-conditions
  * @param {string} an id from the api that represents the type of weather (see NOTE)
  * @return {string} a css class that supplies an image of the weather
  */
  getWeatherIcon(iconId) {
    let imgClass = null;
    switch (iconId) {
      // Day
      case '01d': imgClass = 'wi wi-day-sunny'; break;
      case '02d': imgClass = 'wi wi-day-cloudy'; break;
      case '03d': imgClass = 'wi wi-cloud'; break;
      case '04d': imgClass = 'wi wi-cloudy'; break;
      case '09d': imgClass = 'wi wi-day-showers'; break;
      case '10d': imgClass = 'wi wi-day-showers'; break;
      case '11d': imgClass = 'wi wi-day-sleet-storm'; break;
      case '13d': imgClass = 'wi wi-day-snow'; break;
      case '50d': imgClass = 'wi wi-windy'; break;
      // Night
      case '01n': imgClass = 'wi wi-night-sunny'; break;
      case '02n': imgClass = 'wi wi-night-cloudy'; break;
      case '03n': imgClass = 'wi wi-cloud'; break;
      case '04n': imgClass = 'wi wi-cloudy'; break;
      case '09n': imgClass = 'wi wi-night-showers'; break;
      case '10n': imgClass = 'wi wi-night-showers'; break;
      case '11n': imgClass = 'wi wi-night-sleet-storm'; break;
      case '13n': imgClass = 'wi wi-night-snow'; break;
      case '50n': imgClass = 'wi wi-windy'; break;
      default: imgClass = 'wi wi-cloud';
    }
    return imgClass;
  }
}