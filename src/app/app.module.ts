import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



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
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [SpotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
