import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { HttpModule } from '@angular/http';

// Components
import { AppComponent } from './app.component';

// Services
import { SpotifyService } from './_services/spotify.service';
import { SpotifyModuleComponent } from './spotify-module/spotify-module.component';

@NgModule({
  declarations: [
    AppComponent,
    SpotifyModuleComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [SpotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
