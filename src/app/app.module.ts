import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { ModuleHandlerComponent } from './module-handler/module-handler.component';
import { AppSettingsComponent } from './module-handler/app-settings/app-settings.component';
import { SelectSettingComponent } from './module-handler/select-setting/select-setting.component';
import { GenericModuleSettingsComponent } from './module-handler/generic-module-settings/generic-module-settings.component';

// Modules
import { SpotifyModule } from './spotify/spotify.module';
import { WeatherModule } from './weather/weather.module';
import { ClockModule } from './clock/clock.module';

// Directives
import { ModuleDirective } from './module-handler/module.directive';

@NgModule({
  declarations: [
    AppComponent,
    ModuleHandlerComponent,
    AppSettingsComponent,
    SelectSettingComponent,
    GenericModuleSettingsComponent,
    ModuleDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    SpotifyModule,
    WeatherModule,
    ClockModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
