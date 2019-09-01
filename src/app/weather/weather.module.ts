import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './_services/weather-service/weather.service';

// Components
import { WeatherModuleComponent } from './weather-module/weather-module.component';
import { SetupWeatherComponent } from './weather-module/setup-weather/setup-weather.component';
import { WeatherListComponent } from './weather-module/weather-list/weather-list.component';
import { CurrentTempComponent } from './weather-module/current-temp/current-temp.component';

@NgModule({
  declarations: [
    WeatherModuleComponent,
    SetupWeatherComponent,
    WeatherListComponent,
    CurrentTempComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    WeatherService
  ],
  entryComponents: [
    WeatherModuleComponent,
  ],
  exports: [
    WeatherModuleComponent
  ]
})
export class WeatherModule { }
