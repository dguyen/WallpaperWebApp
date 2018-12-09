import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Services
import { WeatherService } from './_services/weather.service';
import { StorageService } from './_services/storage.service';

// Components
import { AppComponent } from './app.component';
import { WeatherModuleComponent } from './weather-module/weather-module.component';
import { ModuleHandlerComponent } from './module-handler/module-handler.component';

// Modules
import { SpotifyModule } from './spotify/spotify.module';

@NgModule({
  declarations: [
    AppComponent,
    WeatherModuleComponent,
    ModuleHandlerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    SpotifyModule
  ],
  providers: [WeatherService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
