import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherModuleComponent } from './weather-module/weather-module.component';
import { WeatherService } from './_services/weather.service';

@NgModule({
  declarations: [
    WeatherModuleComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    WeatherService
  ],
  exports: [
    WeatherModuleComponent
  ]
})
export class WeatherModule { }
