import { Component, Output, EventEmitter } from '@angular/core';
import { WeatherService } from '../../_services/weather-service/weather.service';
import { WeatherSettingsService, WeatherSettings, DegreeFormat } from '../../_services/weather-settings/weather-settings.service';

@Component({
  selector: 'app-setup-weather',
  templateUrl: './setup-weather.component.html',
  styleUrls: ['./setup-weather.component.scss']
})
export class SetupWeatherComponent {
  @Output() closeSetting = new EventEmitter();
  degreesFormat = DegreeFormat;
  weatherSettings: WeatherSettings;
  countries = [];
  selectedCountry = {
    name: 'Australia',
    code: 'AU',
  };
  errorMsg = '';
  zipCode = '';

  constructor(private _weatherService: WeatherService, private _weatherSettings: WeatherSettingsService) {
    this.countries = this._weatherService.getCountries();
    this._weatherSettings.settingUpdate.subscribe((settings: WeatherSettings) => {
      if (settings) {
        this.weatherSettings = settings;
        this.selectedCountry.code = settings.country;
        this.selectedCountry.name = this.countries.filter((x) => x.code === settings.country)[0].name;
        this.zipCode = settings.zipCode;
      }
    });
  }

  /**
   * Update the location
   */
  updateLocation() {
    this.weatherSettings.country = this.selectedCountry.code;
    this.weatherSettings.zipCode = this.zipCode;
    this._weatherService.initialize(this.zipCode, this.selectedCountry.code).then(() => {
      this.updateSettings();
      this.errorMsg = '';
    }).catch((err) => {
      if (err.error.message === 'city not found') {
        this.errorMsg = 'Invalid Zip Code';
      } else {
        this.errorMsg = 'Invalid location';
      }
    });
  }

  /**
   * Update the weather settings
   */
  updateSettings() {
    this._weatherSettings.updateSettings(this.weatherSettings);
  }

  updateApiKey() {
    const apikey = prompt('Enter API Key');
    if (apikey) {
      this._weatherService.initialize(undefined, undefined, apikey).then(() => {
        this.weatherSettings.apiKey = apikey;
        this.updateSettings();
      }).catch(() => {
        alert('Invalid API key. For more information visit \'https://openweathermap.org/faq#error401\'');
      });
    }
  }

  /**
   * Fires when an item is selected from the custom selector component
   * @param item the item selected
   */
  countrySelected(newCountry) {
    this.selectedCountry = newCountry;
  }

  /**
   * Display a prompt for the user to input a new zip code
   */
  changeZipCode() {
    const newZipCode = prompt('Enter new zip code');
    if (!newZipCode) {
      return;
    }
    this.zipCode = newZipCode;
  }

  /**
   * Returns the formatted view of the country
   * @param country country to format
   */
  formatCountry(country: any) {
    return country.name;
  }

  /**
   * Close the setup window
   */
  closeSettings() {
    this.closeSetting.emit(null);
  }

  /**
   * Compare function for selector
   */
  compareFn(a: any, b: any) {
    return a && b && a.code.toLowerCase() === b.code.toLowerCase();
  }
}
