import { Component, Output, EventEmitter } from '@angular/core';
import { ClockSettingsService, ClockSettings, TimeFormat } from '../../_services/clock-settings/clock-settings.service';

// Todo add dynamic loading of clocks
const TMP_CLOCKS = [
  { name: 'ClockOne' },
  { name: 'ClockTwo' },
  { name: 'ClockThree' },
];

@Component({
  selector: 'app-clock-setting',
  templateUrl: './clock-setting.component.html',
  styleUrls: ['./clock-setting.component.scss']
})
export class ClockSettingComponent {
  @Output() closeSetting = new EventEmitter();
  timeFormat = TimeFormat;
  settings: ClockSettings;
  selectedClock = {
    name: 'ClockOne'
  };
  clocks = TMP_CLOCKS;

  constructor(public _clockSettings: ClockSettingsService) {
    _clockSettings.settingUpdate.subscribe((settings: ClockSettings) => {
      if (settings) {
        this.settings = settings;
      }
    }).unsubscribe();
  }

  /**
   * Update the clock settings
   */
  updateSettings() {
    this._clockSettings.updateSettings(this.settings);
  }

  /**
   * Change the selected clock to the next one in clocks list
   */
  nextClock() {
    const clockIndex = this.clocks.findIndex((data) => data.name === this.selectedClock.name);
    if (clockIndex + 1 >= this.clocks.length) {
      this.selectedClock = this.clocks[0];
    } else {
      this.selectedClock = this.clocks[clockIndex + 1];
    }
  }

  /**
   * Change the selected clock to the previous one in clocks list
   */
  prevClock() {
    const clockIndex = this.clocks.findIndex((data) => data.name === this.selectedClock.name);
    if (clockIndex - 1 < 0) {
      this.selectedClock = this.clocks[this.clocks.length - 1];
    } else {
      this.selectedClock = this.clocks[clockIndex - 1];
    }
  }

  /**
   * Close the settings panel
   */
  closeSettings() {
    this.closeSetting.emit(null);
  }
}
