import { Component } from '@angular/core';
import { ClockService } from '../_services/clock-service/clock.service';
import * as anime from 'animejs';

@Component({
  selector: 'app-clock-module',
  templateUrl: './clock-module.component.html',
  styleUrls: ['./clock-module.component.scss']
})
export class ClockModuleComponent {
  showSetting = false;

  constructor(public _clockService: ClockService) {}

  /**
   * Open the clock setting component
   */
  openSetting() {
    if (this.showSetting) {
      return;
    }
    this.showSetting = true;
    anime({
      targets: '#clockSettingContainer',
      easing: 'easeOutExpo',
      opacity: 1,
    });
  }

  /**
   * Close the clock setting component
   */
  closeSetting() {
    if (!this.showSetting) {
      return;
    }
    this.showSetting = false;
    document.getElementById('clockSettingContainer').style.opacity = '0';
  }
}
