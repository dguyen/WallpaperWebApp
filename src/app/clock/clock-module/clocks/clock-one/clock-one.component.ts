import { Component, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ClockService, Time } from 'src/app/clock/_services/clock-service/clock.service';
import { ClockSettings, ClockSettingsService } from 'src/app/clock/_services/clock-settings/clock-settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clock-one',
  templateUrl: './clock-one.component.html',
  styleUrls: ['./clock-one.component.scss']
})
export class ClockOneComponent implements OnDestroy {
  @Output() openSetting = new EventEmitter();
  private destroySubs = [];
  time: Time;
  clockSettings: ClockSettings;
  hourMinutes: '';

  constructor(public _clockService: ClockService, public _clockSettings: ClockSettingsService) {
    this.setupListener();
  }

  ngOnDestroy() {
    this.destroySubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  /**
   * Listener for clock/setting updates
   */
  setupListener() {
    if (this.destroySubs.length > 0) {
      return;
    }
    this.destroySubs = [
      this._clockService.clockLoop.subscribe((newTime: Time) => {
        if (newTime) {
          this.time = newTime;
        }
      }),
      this._clockSettings.settingUpdate.subscribe((newSetting: ClockSettings) => {
        if (newSetting) {
          this.clockSettings = newSetting;
        }
      })
    ];
  }

  /**
   * Open the setting panel
   */
  openSettings() {
    this.openSetting.emit(null);
  }

  /**
   * Returns time in HH:MM format
   */
  getHourMinutes() {
    if (this.time) {
      return this.time.hour + ':' + this.time.minutes;
    }
  }

  /**
   * Returns seconds
   */
  getSeconds() {
    if (this.time) {
      return this.time.seconds;
    }
  }

  /**
   * Returns AM or PM
   */
  getAmPm() {
    if (this.time) {
      return this.time.amPm;
    }
  }

  /**
   * Get the date string such as 'Monday, 26th August'
   */
  getDateString() {
    if (this.time) {
      return this.time.day + ', ' + this.time.date + ' ' + this.time.month;
    }
  }
}
