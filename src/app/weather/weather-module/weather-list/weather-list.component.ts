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
    this._weatherService.weatherUpdates.subscribe((hasUpdate) => {
      if (hasUpdate) {
        this.updateData();
      }
    });
  }

  /**
   * Update the list data
   */
  updateData() {
    this.isLoading = true;
    this._weatherService.getWeekForecast().then((days) => {
      // Do not show the first day of the list if it is the current day
      if (days[0].day === this._weatherService.getDay(new Date().getDay())) {
        this.weekData = days.slice(1);
      } else {
        this.weekData = days;
      }
      this.isLoading = false;
    });
  }
}
