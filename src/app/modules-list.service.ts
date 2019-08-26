import { Injectable, Type } from '@angular/core';

// Modules
import { SpotifyModuleComponent } from './spotify/spotify-module/spotify-module.component';
import { WeatherModuleComponent } from './weather/weather-module/weather-module.component';
import { ClockModuleComponent } from './clock/clock-module/clock-module.component';

@Injectable({
  providedIn: 'root'
})
export class ModulesListService {
  /**
   * Returns the avaliable modules in this application
   */
  getModules() {
    return avaliableModules;
  }
}

export class ModuleItem {
  constructor(public component: Type<any>, public data: any) {}
}

/**
 * Add any new modules here
 */
const avaliableModules = <ModuleItem[]>[
  new ModuleItem(SpotifyModuleComponent, { name: 'Spotify Module', selector: 'app-spotify-module'}),
  new ModuleItem(WeatherModuleComponent, { name: 'Weather Module', selector: 'app-weather-module'}),
  new ModuleItem(ClockModuleComponent, { name: 'Clock Module', selector: 'app-clock-module'}),
];
