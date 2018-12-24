import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyModuleComponent } from './spotify-module/spotify-module.component';
import { SpotifyService } from './_services/spotify.service';
import { MediaControllerComponent } from './spotify-module/media-controller/media-controller.component';
import { SetupSpotifyComponent } from './spotify-module/setup-spotify/setup-spotify.component';
import { SelectDeviceComponent } from './spotify-module/select-device/select-device.component';

@NgModule({
  declarations: [
    SpotifyModuleComponent,
    MediaControllerComponent,
    SetupSpotifyComponent,
    SelectDeviceComponent
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
