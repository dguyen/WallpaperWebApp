import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockModuleComponent } from './clock-module/clock-module.component';
import { ClockOneComponent } from './clock-module/clocks/clock-one/clock-one.component';

@NgModule({
  declarations: [
    ClockModuleComponent,
    ClockOneComponent
  ],
  entryComponents: [
    ClockModuleComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ClockModule { }
