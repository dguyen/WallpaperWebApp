import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClockDirective } from './clock.directive';

// Components
import { ClockModuleComponent } from './clock-module/clock-module.component';
import { ClockOneComponent } from './clock-module/clocks/clock-one/clock-one.component';
import { ClockSettingComponent } from './clock-module/clock-setting/clock-setting.component';

@NgModule({
  declarations: [
    ClockModuleComponent,
    ClockOneComponent,
    ClockSettingComponent,
    ClockDirective
  ],
  entryComponents: [
    ClockModuleComponent,
    ClockOneComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ClockModule { }
