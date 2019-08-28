import { Component, ComponentFactoryResolver, ViewChild, OnInit } from '@angular/core';
import { ClockDirective } from '../clock.directive';
import * as anime from 'animejs';

// Services
import { ClockService } from '../_services/clock-service/clock.service';
import { ClockListService } from '../_services/clock-list/clock-list.service';
import { ClockSettingsService, ClockSettings } from '../_services/clock-settings/clock-settings.service';

@Component({
  selector: 'app-clock-module',
  templateUrl: './clock-module.component.html',
  styleUrls: ['./clock-module.component.scss']
})
export class ClockModuleComponent implements OnInit {
  @ViewChild(ClockDirective) appClock: ClockDirective;
  showSetting = false;
  currentClock: string;

  constructor(
    public _clockService: ClockService,
    private _clockList: ClockListService,
    private compFactoryResolver: ComponentFactoryResolver,
    private _clockSetting: ClockSettingsService) {
  }

  ngOnInit() {
    this.setupListener();
  }

  setupListener() {
    this._clockSetting.settingUpdate.subscribe((clockSetting: ClockSettings) => {
      if (clockSetting && (this.currentClock !== clockSetting.clockStyle)) {
        this.updateClockStyle(clockSetting.clockStyle);
      }
    });
  }

  updateClockStyle(newStyle: string) {
    const clockItem = this._clockList.getClock(newStyle);
    if (clockItem) {
      this.currentClock = newStyle;
      this.appClock.viewContainerRef.clear();
      const compFactory = this.compFactoryResolver.resolveComponentFactory(clockItem.component);
      const viewContainerRef = this.appClock.viewContainerRef;
      const compRef = viewContainerRef.createComponent(compFactory);
      compRef.instance.openSetting.subscribe(() => this.openSetting());
    }
  }

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
