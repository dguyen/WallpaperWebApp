import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { ModuleHandlerComponent } from './module-handler/module-handler.component';

// Modules
import { SpotifyModule } from './spotify/spotify.module';
import { WeatherModule } from './weather/weather.module';

@NgModule({
  declarations: [
    AppComponent,
    ModuleHandlerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    SpotifyModule,
    WeatherModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
