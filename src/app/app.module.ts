import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';

// Services
import { SpotifyService } from './_services/spotify.service';
import { WeatherService } from './_services/weather.service';
import { StorageService } from './_services/storage.service';

// Components
import { AppComponent } from './app.component';
import { SpotifyModuleComponent } from './spotify-module/spotify-module.component';
import { WeatherModuleComponent } from './weather-module/weather-module.component';
import { ModuleHandlerComponent } from './module-handler/module-handler.component';

@NgModule({
  declarations: [
    AppComponent,
    SpotifyModuleComponent,
    WeatherModuleComponent,
    ModuleHandlerComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [SpotifyService, WeatherService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
