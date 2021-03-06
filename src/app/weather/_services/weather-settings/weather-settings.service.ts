import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/_services/storage/storage.service';
import { BehaviorSubject } from 'rxjs';

export enum DegreeFormat {
  CELSIUS = 'metric',
  FAHRENHEIT = 'imperial'
}

export interface WeatherSettings {
  degreesFormat: DegreeFormat;
  enableBackground: boolean;
  roundTemp: boolean;
  country: string;
  zipCode: string;
  apiKey: string;
}

const DEFAULT_SETTINGS: WeatherSettings = {
  degreesFormat: DegreeFormat.CELSIUS,
  enableBackground: true,
  roundTemp: true,
  country: 'AU',
  zipCode: '3000',
  apiKey: '084b04a1bd24b3a2834390ec8153f9b1'
};

@Injectable({
  providedIn: 'root'
})
export class WeatherSettingsService {
  private storageRef = 'weatherSettings';
  weatherSettings: WeatherSettings;
  settingUpdate = new BehaviorSubject<WeatherSettings>(null);

  constructor(private _storageService: StorageService) {
    this.loadStorage();
  }

  private loadStorage() {
    this.weatherSettings = this._storageService.getStorageJSON(this.storageRef);
    if (!this.weatherSettings) {
      this._storageService.setStorage(this.storageRef, DEFAULT_SETTINGS);
      this.loadStorage();
    }
    this.settingUpdate.next(this.weatherSettings);
    this.getSettings();
  }

  /**
   * Returns weather settings
   */
  getSettings(): WeatherSettings {
    return this.weatherSettings;
  }

  /**
   * Update the weather settings
   * @param newSettings the new settings
   */
  updateSettings(newSettings: WeatherSettings) {
    this.weatherSettings = newSettings;
    this._storageService.setStorage(this.storageRef, newSettings);
    this.settingUpdate.next(newSettings);
  }
}
