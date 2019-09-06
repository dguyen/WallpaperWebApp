import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeatherSettingsService, WeatherSettings, DegreeFormat } from '../weather-settings/weather-settings.service';
import { BehaviorSubject } from 'rxjs';
import { Countries } from './countries.js';

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
  currentWeatherReport: any;
  weatherUpdates = new BehaviorSubject<boolean>(null);
  weatherSettings: WeatherSettings;
  currentForecast: CurrentWeather;

  constructor(private _http: HttpClient, private _weatherSetting: WeatherSettingsService) {
    this._weatherSetting.settingUpdate.subscribe((settings: WeatherSettings) => {
      if (settings && this.isUpdateRequired(settings)) {
        this.weatherSettings = JSON.parse( JSON.stringify(settings));
        Promise.all([
          this.initialize(),
          this.updateCurrentForecast()
        ]).then(() => this.weatherUpdates.next(true))
          .catch((err) => console.log(err));
      } else {
        this.weatherSettings = JSON.parse(JSON.stringify(settings));
        this.weatherUpdates.next(true);
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
        }
      }).subscribe((res) => {
        this.weatherReport = res;
        resolve();
      }, (err) => reject(err));
    });
  }

  /**
   * Checks if the data is required to update
   * @param newSettings the new settings to compare values with
   */
  isUpdateRequired(newSettings: WeatherSettings): boolean {
    if (!newSettings) {
      return false;
    } else if (!this.weatherSettings) {
      return true;
    }
    // Only update if location is changed
    return this.weatherSettings.country !== newSettings.country || this.weatherSettings.zipCode !== newSettings.zipCode;
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
    return new Promise((resolve) => {
      if (this.weatherReport) {
        resolve(this.getDayData());
        return;
      }
      this.weatherUpdates.subscribe((res) => {
        if (res) {
          resolve(this.getDayData());
          return;
        }
      });
    });
  }

  /**
   * Returns a promise that resolves with the current weather
   */
  getCurrentForecast(): Promise<CurrentWeather> {
    return new Promise((resolve, reject) => {
      if (!this.currentForecast) {
        this.updateCurrentForecast().then((newForecast) => {
          resolve(newForecast);
          return;
        }).catch((err) => reject(err));
      } else {
        resolve(this.formatCurrentWeather());
        return;
      }
    });
  }

  /**
   * Format the current weather report into CurrentWeather
   */
  formatCurrentWeather(): CurrentWeather {
    if (!this.currentWeatherReport) {
      return null;
    }
    return {
      min: this.convertToRequired(this.currentWeatherReport['main'].temp_min).toString(),
      max: this.convertToRequired(this.currentWeatherReport['main'].temp_max).toString(),
      current: this.convertToRequired(this.currentWeatherReport['main'].temp, false).toString(),
      location: this.currentWeatherReport['name'],
      icon: this.getWeatherIcon(this.currentWeatherReport['weather'][0].icon)
    };
  }

  /**
   * Update the current forecast
   */
  updateCurrentForecast(): Promise<CurrentWeather> {
    return new Promise((resolve, reject) => {
      this._http.post('https://api.openweathermap.org/data/2.5/weather', null, {
        params: {
          zip: this.weatherSettings.zipCode + ',' + this.weatherSettings.country,
          APPID: this.weatherSettings.apiKey,
        }
      }).subscribe((res) => {
        this.currentWeatherReport = res;
        const newForecast = this.formatCurrentWeather();
        this.currentForecast = newForecast;
        resolve(newForecast);
        return;
      }, (err) => reject(err));
    });
  }

  /**
   * Update the day data
   */
  updateDayData() {
    return this.initialize();
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
    let min: number, max: number, dateHolder: Date, currentDay: number, icon: string;
    const output: Day[] = [];
    for (let i = 0; i < data.length; i++) {
      if (i === 0 || currentDay !== dateHolder.getDay() || i >= data.length - 1) {
        if (i > 0) {
          output.push({
            min: this.convertToRequired(min).toString(),
            max: this.convertToRequired(max).toString(),
            icon: this.getWeatherIcon(icon ? icon : data[i - 1].weather[0].icon),
            day: this.getDay(currentDay)
          });
        }
        currentDay = new Date(data[i].dt * 1000).getDay();
        min = data[i].main.temp_min;
        max = data[i].main.temp_max;
        icon = null;
      }
      dateHolder = new Date(data[i].dt * 1000);
      if (dateHolder.getHours() >= 10 && dateHolder.getHours() <= 15) {
        icon = data[i].weather[0].icon;
      }
      if (data[i].main.temp_min < min) {
        min = data[i].main.temp_min;
      }
      if (data[i].main.temp_max > max) {
        max = data[i].main.temp_max;
      }
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

  /**
   * Converts the given temperature to the given preference in WeatherSettings
   * @param kelvin the temperature to convert
   */
  convertToRequired(kelvin: number, round: boolean = true) {
    if (this.weatherSettings.degreesFormat === DegreeFormat.CELSIUS) {
      return round ? Math.round(this.convertToCelsius(kelvin)) : Math.round(this.convertToCelsius(kelvin) * 10) / 10;
    }
    return round ? Math.round(this.convertToFahrenheit(kelvin)) : Math.round(this.convertToFahrenheit(kelvin) * 10) / 10;
  }

  /**
   * Converts Kelvin to Celsius
   * @param kelvin the temperature to convert in Kelvin
   */
  convertToCelsius(kelvin: number) {
    return kelvin - 273.15;
  }

  /**
   * Converts Kelvin to Fahrenheit
   * @param kelvin the temperature to convert in Kelvin
   */
  convertToFahrenheit(kelvin: number): number {
    return kelvin * (9 / 5) - 459.67;
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
      case '10d': imgClass = 'wi wi-day-rain'; break;
      case '11d': imgClass = 'wi wi-day-thunderstorm'; break;
      case '13d': imgClass = 'wi wi-day-snow'; break;
      case '50d': imgClass = 'wi wi-day-fog'; break;
      // Night
      case '01n': imgClass = 'wi wi-night-clear'; break;
      case '02n': imgClass = 'wi wi-night-alt-cloudy'; break;
      case '03n': imgClass = 'wi wi-cloud'; break;
      case '04n': imgClass = 'wi wi-night-alt-cloudy'; break;
      case '09n': imgClass = 'wi wi-night-alt-showers'; break;
      case '10n': imgClass = 'wi wi-night-alt-rain'; break;
      case '11n': imgClass = 'wi wi-night-alt-lightning'; break;
      case '13n': imgClass = 'wi wi-night-alt-snow'; break;
      case '50n': imgClass = 'wi wi-night-fog'; break;
      default: imgClass = 'wi wi-cloud';
    }
    return imgClass;
  }

  /**
   * Get the day of the week
   * @param fullDay (optional) whether to return the full day or shorthand e.g. Tuesday or Tue
   */
  getDay(day: number, fullDay: boolean = true): string {
    switch (day) {
      case 0: return fullDay ? 'Sunday' : 'Sun';
      case 1: return fullDay ? 'Monday' : 'Mon';
      case 2: return fullDay ? 'Tuesday' : 'Tue';
      case 3: return fullDay ? 'Wednesday' : 'Wed';
      case 4: return fullDay ? 'Thursday' : 'Thu';
      case 5: return fullDay ? 'Friday' : 'Fri';
      case 6: return fullDay ? 'Saturday' : 'Sat';
      default: return 'UnknownDay';
    }
  }
}
