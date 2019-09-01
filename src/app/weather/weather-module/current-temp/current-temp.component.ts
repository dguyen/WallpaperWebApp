import { Component } from '@angular/core';
import { WeatherService, CurrentWeather } from '../../_services/weather-service/weather.service';

@Component({
  selector: 'app-current-temp',
  templateUrl: './current-temp.component.html',
  styleUrls: ['./current-temp.component.scss']
})
export class CurrentTempComponent {
  currentWeather: CurrentWeather = null;

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
