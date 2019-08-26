import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ClockSettingsService, ClockSettings, TimeFormat } from '../clock-settings/clock-settings.service';

export class Time {
  hour: string;
  minutes: string;
  seconds: string;
  amPm: string;
  day: string;
  month: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClockService {
  private clockInterval: any;
  private listenerRef: Subscription;
  clockSettings: ClockSettings;
  clockLoop = new BehaviorSubject<Time>(null);
  time: Time;

  constructor(public _clockSettings: ClockSettingsService) {
    this.setupListener();
  }

  /**
   * Listens for new settings and starts the clock once
   */
  private setupListener() {
    if (this.listenerRef) {
      return;
    }
    let tmp = false;
    this.listenerRef = this._clockSettings.settingUpdate.subscribe((newSettings: ClockSettings) => {
      if (!newSettings) {
        return;
      }
      this.clockSettings = newSettings;
      if (!tmp) {
        this.startClock();
        tmp = true;
      }
    });
  }

  /**
   * Start the clock loop
   */
  startClock() {
    if (this.clockInterval) {
      return;
    }
    this.updateClock();
    this.clockInterval = setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  /**
   * Stops the clock if it has started
   */
  stopClock() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  /**
   * Update the clock time
   */
  updateClock() {
    this.time = this.getTime();
    this.clockLoop.next(this.time);
  }

  /**
   * Get the time in format HH:MM or HH:MM:SS
   */
  getTime(): Time {
    return {
      hour: this.getHours(),
      minutes: this.getMinutes(),
      seconds: this.getSeconds(),
      amPm: this.getAmPm(),
      day: this.getDay(),
      month: this.getMonth(),
      date: this.getDate()
    };
  }

  /**
   * Get the current hour of the day
   * @param format (optional) 12 hours or 24 hours format, default is obtained from settings
   */
  getHours(format: TimeFormat = this.clockSettings.format, padHours: boolean = this.clockSettings.padHours): string {
    const date = new Date();
    const hours = date.getHours();
    if (hours === 0) {
      return '12';
    } else if (format === TimeFormat.hour24) {
      return hours.toString();
    } else {
      const shortHours = hours > 12 ? (hours - 12).toString() : hours.toString();
      return padHours ? shortHours.padStart(2, '0') : shortHours;
    }
  }

  /**
   * Returns the current minute of the hour
   */
  getMinutes() {
    const date = new Date();
    return date.getMinutes().toString().padStart(2, '0');
  }

  /**
   * Returns the current second of the minute
  */
  getSeconds() {
    const date = new Date();
    return date.getSeconds().toString().padStart(2, '0');
  }

  /**
   * Returns am or pm depending on the hour
   */
  getAmPm() {
    const date = new Date();
    return date.getHours() >= 12 ? 'pm' : 'am';
  }

  /**
   * Get the day of the week
   * @param fullDay (optional) whether to return the full day or shorthand e.g. Tuesday or Tue
   */
  getDay(fullDay: boolean = true): string {
    const day = new Date().getDay();
    switch (day) {
      case 0: return fullDay ? 'Sunday' : 'Sun';
      case 1: return fullDay ? 'Monday' : 'Mon';
      case 2: return fullDay ? 'Tuesday' : 'Tue';
      case 3: return fullDay ? 'Wednesday' : 'Wed';
      case 4: return fullDay ? 'Thursday' : 'Thu';
      case 5: return fullDay ? 'Friday' : 'Fri';
      case 6: return fullDay ? 'Saturday' : 'Sat';
      default: return 'UnknownDay';
    }
  }

  /**
   * Get the month of the year
   * @param fullMonth (optional) whether to return the full month or shorthand e.g. July or Jul
   */
  getMonth(fullMonth: boolean = true) {
    const month = new Date().getMonth();
    switch (month) {
      case 0: return fullMonth ? 'January' : 'Jan';
      case 1: return fullMonth ? 'February' : 'Feb';
      case 2: return fullMonth ? 'March' : 'Mar';
      case 3: return fullMonth ? 'April' : 'Apr';
      case 4: return fullMonth ? 'May' : 'May';
      case 5: return fullMonth ? 'June' : 'Jun';
      case 6: return fullMonth ? 'July' : 'Jul';
      case 7: return fullMonth ? 'August' : 'Aug';
      case 8: return fullMonth ? 'September' : 'Sep';
      case 9: return fullMonth ? 'October' : 'Oct';
      case 10: return fullMonth ? 'November' : 'Nov';
      case 11: return fullMonth ? 'December' : 'Dec';
      default: return 'Unknown';
    }
  }

  /**
   * Get the current date
   * @param incIndicator whether to included the ordinal indicator or not (st, nd, rd, etc)
   */
  getDate(incIndicator: boolean = true): string {
    const dateNumber = new Date().getDate();
    if (!incIndicator) {
      return dateNumber.toString();
    }
    switch (dateNumber) {
      case 1:
      case 21:
      case 31: return dateNumber.toString() + 'st';
      case 2:
      case 22: return dateNumber.toString() + 'nd';
      case 3:
      case 23: return dateNumber.toString() + 'rd';
      default: return dateNumber.toString() + 'th';
    }
  }
}
