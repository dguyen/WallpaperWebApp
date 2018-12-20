import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyModuleComponent } from './spotify-module/spotify-module.component';
import { SpotifyService } from './_services/spotify.service';
import { MediaControllerComponent } from './spotify-module/media-controller/media-controller.component';

@NgModule({
  declarations: [
    SpotifyModuleComponent,
    MediaControllerComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    SpotifyService
  ],
  exports: [
    SpotifyModuleComponent
  ]
})
export class SpotifyModule { }
