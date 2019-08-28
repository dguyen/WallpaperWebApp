import { Component, OnInit } from '@angular/core';
import { ClockOneComponent } from '../clock-one/clock-one.component';
import { ClockService } from 'src/app/clock/_services/clock-service/clock.service';
import { ClockSettingsService } from 'src/app/clock/_services/clock-settings/clock-settings.service';

@Component({
  selector: 'app-clock-two',
  templateUrl: '../clock-one/clock-one.component.html',
  styleUrls: ['../clock-one/clock-one.component.scss']
})
export class ClockTwoComponent extends ClockOneComponent implements OnInit {
  constructor(public _clockService: ClockService, public _clockSettings: ClockSettingsService) {
    super(_clockService, _clockSettings);
  }

  ngOnInit() {
    // Invert the clock and day
    document.getElementById('content').insertBefore(document.getElementById('clock'), document.getElementById('day'));
  }
}
