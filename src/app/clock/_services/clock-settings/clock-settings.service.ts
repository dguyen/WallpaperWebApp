import { Injectable } from '@angular/core';
import { StorageService } from 'src/app/_services/storage/storage.service';
import { BehaviorSubject } from 'rxjs';

export enum TimeFormat {
  hour24,
  hour12
}

export interface ClockSettings {
  clockStyle: string;
  format: TimeFormat;
  padHours: boolean;
  showSeconds: boolean;
  showAmPm: boolean;
  autoResize: boolean;
}

const DEFAULT_SETTINGS: ClockSettings = {
  clockStyle: 'ClockOne',
  format: TimeFormat.hour12,
  padHours: false,
  showSeconds: false,
  showAmPm: true,
  autoResize: false,
};

@Injectable({
  providedIn: 'root'
})
export class ClockSettingsService {
  private storageRef = 'clockSettings';
  clockSettings: ClockSettings;
  settingUpdate = new BehaviorSubject<ClockSettings>(null);

  constructor(public _storageService: StorageService) {
    this.loadStorage();
  }

  private loadStorage() {
    this.clockSettings = this._storageService.getStorageJSON(this.storageRef);
    if (!this.clockSettings) {
      this._storageService.setStorage(this.storageRef, DEFAULT_SETTINGS);
      this.loadStorage();
    }
    this.settingUpdate.next(this.clockSettings);
    this.getSettings();
  }

  /**
   * Returns clock settings
   */
  getSettings(): ClockSettings {
    return this.clockSettings;
  }

  /**
   * Update the clock settings
   * @param newSettings the new settings
   */
  updateSettings(newSettings: ClockSettings) {
    this._storageService.setStorage(this.storageRef, newSettings);
    this.settingUpdate.next(this.clockSettings);
  }
}
