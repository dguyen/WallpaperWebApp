import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../_services/spotify.service';
import * as anime from 'animejs';

@Component({
  selector: 'app-spotify-module',
  templateUrl: './spotify-module.component.html',
  styleUrls: ['./spotify-module.component.scss']
})

export class SpotifyModuleComponent implements OnInit {
  private errorListener = null;
  loading = true;
  loadingText = '';
  playlists: any;
  userProfile: any;
  selectedPlaylist: any;
  currentView = 'loadingView';

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
    this.initialize();
  }

  /**
   * Subscribes to SpotifyService's error stream
   */
  setupListener() {
    if (this.errorListener) {
      return;
    }
    // Checks for error post setup
    this.errorListener = this._spotifyService.spotifyError.subscribe((data) => {
      if (data === 'No device found' && this.currentView !== 'deviceView') {
        this.showDeviceList();
      }
    });
  }

  /**
   * Initializes the Spotify module and handles errors
   */
  initialize() {
    this._spotifyService.initializeSpotify().then(() => {
      this.loadData().then(() => {
        this.loading = false;
        this.currentView = 'playlistView';
        this.showSpotify();
        this.setupListener();
      });
    }).catch((err) => {
      if (err ===  'No refresh_token found') {
        this.showSpotifySetup();
      } else if (err === 'No device found') {
        this.loading = false;
        this.showDeviceList();
      } else {
        this.setRetry('Problem connecting to spotify...', 5).then(() => {
          this.initialize();
        });
      }
    });
  }

  /**
   * Hides the device list and attempts to initialize with the new device
   */
  deviceSelected() {
    this.hideDeviceList().then(() => this.initialize());
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

  /**
   * Returns a promise that resolves when profile and playlist data has been obtained
   */
  loadData() {
    return Promise.all([this.getProfile(), this.getPlaylists()]);
  }

  getProfile() {
    return new Promise((resolve, reject) => {
      this._spotifyService.getUserProfile().then((profile) => {
        this.userProfile = profile;
        resolve();
      }).catch(() => {
        this.setRetry('Profile could not be obtained...', 5000).then(() => this.getProfile());
      });
    });
  }

  getPlaylists() {
    return new Promise((resolve, reject) => {
      this._spotifyService.getUserPlaylists().then((playlists) => {
        this.playlists = playlists;
        resolve();
      }).catch(() => {
        this.setRetry('Problem retrieving playlists...', 5000).then(() => this.getPlaylists());
      });
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
    }).add({
      targets: '#header',
      easing: 'easeOutExpo',
      'border-bottom-left-radius': 0,
      'border-bottom-right-radius': 0,
      offset: 0,
    }).finished;
  }

  hideSpotify() {
    return anime.timeline().add({
      targets: '#container, #spotifyContainer',
      easing: 'easeOutExpo',
      width: 50,
      height: 50
    }).add({
      targets: '#spotifyLogoContainer',
      easing: 'easeOutExpo',
      offset: 0,
      translateX: 0
    }).add({
      targets: '#header',
      easing: 'easeOutExpo',
      'border-bottom-left-radius': 15,
      'border-bottom-right-radius': 15,
      offset: 0,
    }).finished;
  }

  changeView(view: string) {
    if (view !== 'loadingView' && view !== 'playlistView' && view !== 'songView') {
      throw new Error('Invalid view');
    }
    this.closeView().then(() => {
      this.currentView = view;
      this.openView();
    });
  }

  closeView() {
    return anime({
      targets: '#bodyContainer',
      height: 0,
      easing: 'easeOutExpo',
      duration: 250
    }).finished;
  }

  openView() {
    return anime({
      targets: '#bodyContainer',
      height: [0, 440],
      easing: 'easeOutExpo',
      duration: 300
    }).finished;
  }

  selectPlaylist(playlistSelected: any) {
    const tmp = this.closeView();
    this._spotifyService.getSongsUrl(playlistSelected.href).subscribe(
      res => {
        this.selectedPlaylist = res;
        this.currentView = 'songView';
        tmp.then(() => this.openView());
      }
    );
  }

  /**
   * Play a song on spotify
   * @param songUri uri of song
   * @param albumUri uri of album
   */
  playSong(songUri: number, albumUri: string) {
    this._spotifyService.mediaPlaySong(albumUri, songUri).catch((err) => {
      throw new Error(err);
    });
  }

  /**
   * Returns a concatenated string of artist names
   * @param artists list of artist objects
   */
  getArtistNames(artists: Array<any>) {
    let combined = '';
    artists.forEach(artist => {
      combined += artist.name + ', ';
    });
    return artists.length > 0 ? combined.slice(0, -2) : combined;
  }

  /**
   * Converts a time in milliseconds into MM:SS format
   * @param millis time to convert in milliseconds
   */
  getDuration(millis: number) {
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
   * Fires when user clicks 'Link Spotify' during setup
   */
  spotifyLinked() {
    this.hideSpotifySetup().then(() => {
      this._spotifyService.initializeSpotify().then(() => {
        this.initialize();
      });
    });
  }

  /**
   * Opens panel for user to setup spotify
   */
  showSpotifySetup() {
    return anime.timeline().add({
      targets: '#container',
      easing: 'easeOutExpo',
      width: '540px',
      height: '350px',
      duration: 500
    }).add({
      targets: '#spotifySetupContainer',
      easing: 'easeOutExpo',
      width: '540px',
      height: '300px',
      offset: 0,
      duration: 500
    }).finished;
  }

  /**
   * Closes panel for user to setup spotify
   */
  hideSpotifySetup() {
    return anime.timeline().add({
      targets: '#container',
      easing: 'easeOutExpo',
      width: '50px',
      height: '50px',
      duration: 250
    }).add({
      targets: '#spotifySetupContainer',
      easing: 'easeOutExpo',
      width: '0px',
      height: '0px',
      duration: 175,
      offset: 0
    }).finished;
  }

  showDeviceList() {
    this.currentView = 'deviceView';
    return anime.timeline().add({
      targets: '#container',
      easing: 'easeOutExpo',
      width: '300px',
      height: '225px',
      duration: 500
    }).add({
      targets: '#selectDeviceContainer',
      easing: 'easeOutExpo',
      width: '300px',
      height: '160px',
      offset: 0,
      duration: 500
    }).finished;
  }

  hideDeviceList() {
    return anime.timeline().add({
      targets: '#container',
      easing: 'easeOutExpo',
      width: '50px',
      height: '50px',
      duration: 250
    }).add({
      targets: '#selectDeviceContainer',
      easing: 'easeOutExpo',
      width: '0px',
      height: '0px',
      duration: 175,
      offset: 0
    }).finished;
  }
}
