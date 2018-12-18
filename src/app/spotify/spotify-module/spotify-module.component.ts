import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../_services/spotify.service';
import * as anime from 'animejs';

@Component({
  selector: 'app-spotify-module',
  templateUrl: './spotify-module.component.html',
  styleUrls: ['./spotify-module.component.scss']
})

export class SpotifyModuleComponent implements OnInit {
  loading = true;
  loadingText = '';
  playlists: any;
  userProfile: any;
  selectedPlaylist: any;
  currentView = 'loadingView';
  repeatState = 'off';
  isShuffle = false;
  isPlaying = false;

  constructor(private _spotifyService: SpotifyService) {
    this.initialize();
  }

  ngOnInit() {
  }

  // Todo: Highlighting song if currently being played
  highlight(evt) {
    // console.log(evt);
  }

  initialize() {
    this._spotifyService.initialized.then(() => {
      this.loadData();
    }).catch(() => {
      this.setRetry('Problem connecting to spotify...', 5).then(() => {
        this._spotifyService.connectSpotify();
        this.initialize();
      });
    });
  }

  setRetry(errorText: string, timeout: number) {
    return new Promise((resolve) => {
      if (document.getElementById('container').style.width !== '300px') {
        anime({
          targets: '#container',
          width: 300
        });
      }
      const tmp = setInterval(() => {
        this.loadingText = errorText + ' Retrying in ' + timeout;
        timeout -= 1;
        if (timeout < 0) {
          clearInterval(tmp);
          this.loadingText = errorText + ' Retrying...';
          resolve();
          anime({
            targets: '#spotifyLogo',
            rotate: ['0turn', '1turn'],
          });
          return;
        }
      }, 1000);
    });
  }

  loadData() {
    this.loadPlayerData();
    this.getProfile();
    this.getPlaylists();
  }

  loadPlayerData() {
    this._spotifyService.getPlayerData().then((playerData) => {
      this.isPlaying = playerData['is_playing'];
      this.repeatState = playerData['repeat_state'];
      this.isShuffle = playerData['shuffle_state'];
    }).catch((err) => {
      throw new Error(err);
    });
  }

  getProfile() {
    this._spotifyService.getUserProfile().then((profile) => {
      this.userProfile = profile;
    }).catch(() => {
      this.setRetry('Profile could not be obtained...', 5000).then(() => this.getProfile());
    });
  }

  getPlaylists() {
    this._spotifyService.getUserPlaylists().then((playlists) => {
      this.playlists = playlists;
      this.loading = false;
      this.currentView = 'playlistView';
      this.showSpotify();
    }).catch(() => {
      this.setRetry('Problem retrieving playlists...', 5000).then(() => this.getPlaylists());
    });
  }

  showSpotify() {
    return anime.timeline().add({
      targets: '#container, #spotifyContainer',
      easing: 'easeOutExpo',
      width: 300,
      height: 580
    }).add({
      targets: '#spotifyLogoContainer',
      easing: 'easeOutExpo',
      offset: 0,
      translateX: 250
    }).finished;
  }

  changeView(view) {
    if (view !== 'loadingView' && view !== 'playlistView' && view !== 'songView') {
      throw new Error('Invalid view');
    }
    anime({
      targets: '#bodyContainer',
      height: 0,
      easing: 'easeOutExpo',
      duration: 250
    }).finished.then(() => {
      this.currentView = view;
      anime({
        targets: '#bodyContainer',
        height: [0, 440],
        easing: 'easeOutExpo',
        duration: 350
      });
    });
  }

  selectPlaylist(playlistSelected) {
    console.log('Playlist: ' + playlistSelected.name);
    this._spotifyService.getSongsUrl(playlistSelected.href).subscribe(
      res => {
        this.selectedPlaylist = res;
        this.changeView('songView');
      },
      err => {

      }
    );
  }

  playSong(songUri, albumUri) {
    this._spotifyService.mediaPlaySong(albumUri, songUri).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }

  getArtistNames(artists) {
    let combined = '';
    artists.forEach(artist => {
      combined += artist.name + ', ';
    });
    return artists.length > 0 ? combined.slice(0, -2) : combined;
  }

  getDuration(millis) {
    let minuteSecond = (Math.round(millis / 60000 * 100) / 100).toString();
    if (minuteSecond.length === 1) {
      minuteSecond += '.00';
    }
    if (minuteSecond.length === 3) {
      minuteSecond += '0';
    }
    return minuteSecond.replace('.', ':');
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
