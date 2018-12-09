import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyModuleComponent } from './spotify-module/spotify-module.component';
import { SpotifyService } from './_services/spotify.service';

@NgModule({
  declarations: [
    SpotifyModuleComponent
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
