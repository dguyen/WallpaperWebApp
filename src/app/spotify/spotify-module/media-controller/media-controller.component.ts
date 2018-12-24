import { Component } from '@angular/core';
import { SpotifyService } from '../../_services/spotify.service';

@Component({
  selector: 'app-media-controller',
  templateUrl: './media-controller.component.html',
  styleUrls: ['./media-controller.component.scss']
})
export class MediaControllerComponent {
  isShuffle = false;
  isPlaying = false;
  repeatState = 'off';

  constructor(private _spotifyService: SpotifyService) {
    this.loadPlayerData();
  }

  /**
   * Load media player data, and keep data in sync
   */
  loadPlayerData() {
    this._spotifyService.playerUpdate.subscribe((playerData) => {
      this.isPlaying = playerData['is_playing'];
      this.repeatState = playerData['repeat_state'];
      this.isShuffle = playerData['shuffle_state'];
    }, (err) => {
      this._spotifyService.initializeSpotify();
      throw new Error(err);
    });
  }

  /**
   * Toggle pauses/play on current song
   */
  toggleSong() {
    const newAction = this.isPlaying ? 'pause' : 'play';
    this._spotifyService.mediaPausePlay(newAction).then(() => {
      this.isPlaying = !this.isPlaying;
    }).catch((err) => {
      throw new Error(err);
    });
  }

  /**
   * Toggle the shuffle media control
   */
  toggleShuffle() {
    this._spotifyService.setShuffle(!this.isShuffle).then(() => {
      this.isShuffle = !this.isShuffle;
    }).catch((err) => {
      throw new Error(err);
    });
  }

  /**
   * Toggle the repeat media control
   */
  toggleRepeat() {
    let newState = '';
    switch (this.repeatState) {
      case 'off':
        newState = 'context';
        break;
      case 'context':
        newState = 'track';
        break;
      case 'track':
        newState = 'off';
        break;
      default:
        return;
    }

    this.repeatState = newState;
    this._spotifyService.setReplay(newState).catch((err) => {
      this.repeatState = 'off';
      throw new Error(err);
    });
  }

  /**
   * Seek next or previous song
   * @param method 'next' or 'previous'
   */
  seek(method: string) {
    this._spotifyService.mediaSeek(method);
  }
}
