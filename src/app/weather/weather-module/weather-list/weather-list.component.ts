import { Component } from '@angular/core';
import { WeatherService, Day } from '../../_services/weather-service/weather.service';

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  styleUrls: ['./weather-list.component.scss']
})
export class WeatherListComponent {
  isLoading = true;
  weekData: Day[];

  constructor(public _weatherService: WeatherService) {
    this.updateData();
  }

  /**
   * Update the list data
   */
  updateData() {
    this.isLoading = true;
    this._weatherService.getWeekForecast().then((days) => {
      this.weekData = days;
      this.isLoading = false;
    });
  }
}
