import { Component } from '@angular/core';
import { WeatherService, CurrentWeather } from '../../_services/weather-service/weather.service';

@Component({
  selector: 'app-current-weather-row',
  templateUrl: './current-weather-row.component.html',
  styleUrls: ['./current-weather-row.component.scss']
})
export class CurrentWeatherRowComponent {
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
}
