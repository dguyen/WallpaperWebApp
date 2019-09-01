import { Component } from '@angular/core';
import { WeatherService, CurrentWeather } from '../_services/weather-service/weather.service';
import * as anime from 'animejs';

@Component({
  selector: 'app-weather-module',
  templateUrl: './weather-module.component.html',
  styleUrls: ['./weather-module.component.scss',
    '../../../../src/assets/weather_icon/css/weather-icons.css'
  ]
})

export class WeatherModuleComponent {
  showSetting = false;
  currentWeather: CurrentWeather;

  constructor(public _weatherService: WeatherService) {
    this._weatherService.weatherUpdates.subscribe((hasUpdated) => {
      if (hasUpdated) {
        this._weatherService.getCurrentForecast().then((forecast: CurrentWeather) => {
          this.currentWeather = forecast;
        });
      }
    });
  }

  /**
   * Close the weather setting component
   */
  closeSetting() {
    this.showSetting = false;
  }

  /**
   * Open the weather setting component
   */
  openSetting() {
    if (this.showSetting) {
      return;
    }
    this.showSetting = true;
    anime({
      targets: '#weatherSetupContainer',
      easing: 'easeOutExpo',
      opacity: 1,
    });
  }
}
