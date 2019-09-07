import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './_services/weather-service/weather.service';

// Modules
import { SharedModule } from '../shared/shared.module';

// Components
import { WeatherModuleComponent } from './weather-module/weather-module.component';
import { SetupWeatherComponent } from './weather-module/setup-weather/setup-weather.component';
import { WeatherListComponent } from './weather-module/weather-list/weather-list.component';
import { CurrentTempComponent } from './weather-module/current-temp/current-temp.component';
import { CurrentWeatherRowComponent } from './weather-module/current-weather-row/current-weather-row.component';

@NgModule({
  declarations: [
    WeatherModuleComponent,
    SetupWeatherComponent,
    WeatherListComponent,
    CurrentTempComponent,
    CurrentWeatherRowComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
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
