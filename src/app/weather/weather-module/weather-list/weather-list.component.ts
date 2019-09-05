import { Component } from '@angular/core';
import { WeatherService, Day } from '../../_services/weather-service/weather.service';
import { WeatherSettingsService } from '../../_services/weather-settings/weather-settings.service';

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  styleUrls: ['./weather-list.component.scss']
})
export class WeatherListComponent {
  isLoading = true;
  weekData: Day[];

  constructor(public _weatherService: WeatherService, public _weatherSetting: WeatherSettingsService) {
    this._weatherSetting.settingUpdate.subscribe((hasUpdate) => {
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
      this.weekData = days;
      this.isLoading = false;
    });
  }
}
