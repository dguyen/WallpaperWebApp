import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { SpotifyModuleComponent } from './spotify-module/spotify-module.component';
import { MediaControllerComponent } from './spotify-module/media-controller/media-controller.component';
import { SetupSpotifyComponent } from './spotify-module/setup-spotify/setup-spotify.component';
import { SelectDeviceComponent } from './spotify-module/select-device/select-device.component';
import { BigPlayerComponent } from './spotify-module/big-player/big-player.component';

// Services
import { SpotifyService } from './_services/spotify.service';

@NgModule({
  declarations: [
    SpotifyModuleComponent,
    MediaControllerComponent,
    SetupSpotifyComponent,
    SelectDeviceComponent,
    BigPlayerComponent,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    SpotifyService
  ],
  entryComponents: [
    SpotifyModuleComponent
  ],
  exports: [
    SpotifyModuleComponent
  ]
})
export class SpotifyModule { }
