import { Component } from '@angular/core';
import { ClockService } from '../_services/clock-service/clock.service';

@Component({
  selector: 'app-clock-module',
  templateUrl: './clock-module.component.html',
  styleUrls: ['./clock-module.component.scss']
})
export class ClockModuleComponent {
  constructor(public _clockService: ClockService) {
  }
}
