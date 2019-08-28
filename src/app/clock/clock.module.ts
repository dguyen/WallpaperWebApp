import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClockDirective } from './clock.directive';

// Components
import { ClockModuleComponent } from './clock-module/clock-module.component';
import { ClockSettingComponent } from './clock-module/clock-setting/clock-setting.component';
import { ClockOneComponent } from './clock-module/clocks/clock-one/clock-one.component';
import { ClockTwoComponent } from './clock-module/clocks/clock-two/clock-two.component';

@NgModule({
  declarations: [
    ClockModuleComponent,
    ClockOneComponent,
    ClockSettingComponent,
    ClockDirective,
    ClockTwoComponent
  ],
  entryComponents: [
    ClockModuleComponent,
    ClockOneComponent,
    ClockTwoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ClockModule { }
