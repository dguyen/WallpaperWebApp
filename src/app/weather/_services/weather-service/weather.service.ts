import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherSettingsService, WeatherSettings } from '../weather-settings/weather-settings.service.js';
import { BehaviorSubject } from 'rxjs';
import { Countries } from './countries.js';

const MOCKUP_DATA: Day[] = [{
  day: 'Monday',
  icon: 'wi wi-day-sunny',
  max: '27',
  min: '14'
}, {
  day: 'Tuesday',
  icon: 'wi wi-day-showers',
  max: '20',
  min: '12'
}, {
  day: 'Wednesday',
  icon: 'wi wi-day-sleet-storm',
  max: '10',
  min: '5'
}, {
  day: 'Thursday',
  icon: 'wi wi-windy',
  max: '24',
  min: '14'
}, {
  day: 'Friday',
  icon: 'wi wi-day-sunny',
  max: '27',
  min: '13'
}];

const MOCKUP_DATA_2: CurrentWeather = {
  min: '22',
  max: '39',
  current: '35',
  icon: 'wi wi-day-snow ',
  location: 'Glen Waverley'
};

export interface CurrentWeather {
  min: string;
  max: string;
  current: string;
  icon: string;
  location: string;
}

export class Day {
  day: string;
  icon: string;
  max: string;
  min: string;
}

@Injectable()
export class WeatherService {
  weatherReport: any;
  weatherUpdates = new BehaviorSubject<boolean>(null);
  weatherSettings: WeatherSettings;

  constructor(private _http: HttpClient, private _weatherSettings: WeatherSettingsService) {
    this._weatherSettings.settingUpdate.subscribe((settings: WeatherSettings) => {
      if (settings) {
        this.weatherSettings = settings;
        this.initialize().then(() => {
          this.weatherUpdates.next(true);
        }).catch((err) => {
          console.log(err);
        });
      }
    });
  }

  /**
   * Obtains new forecast data from the api and sets the data to the variable weatherReport
   * @param zipCode (optional) zip code of location
   * @param country (optional) two letter country code
   * @param api (optional) api key
   */
  initialize(
    zipCode: string = this.weatherSettings.zipCode,
    country: string = this.weatherSettings.country,
    api: string = this.weatherSettings.apiKey) {

    return new Promise((resolve, reject) => {
      this._http.post('https://api.openweathermap.org/data/2.5/forecast', null, {
        params: {
          zip: zipCode + ',' + country,
          APPID: api,
          units: this.weatherSettings.degreesFormat
        }
      }).subscribe((res) => {
        this.weatherReport = res;
        resolve();
      }, (err) => reject(err));
    });
  }

  /**
   * Returns list of countries
   */
  getCountries() {
    return Countries;
  }

  /**
   * Returns a promise that resolves with the weekly forecast
   */
  getWeekForecast(): Promise<Day[]> {
    return new Promise((resolve, reject) => {
      resolve(MOCKUP_DATA);
    });
  }

  /**
   * Returns a promise that resolves with the current weather
   */
  getCurrentForecast(): Promise<CurrentWeather> {
    return new Promise((resolve, reject) => {
      resolve(MOCKUP_DATA_2);
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
  getWeatherIcon(iconId: string) {
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
