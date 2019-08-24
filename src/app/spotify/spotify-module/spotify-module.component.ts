import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../_services/spotify.service';
import * as anime from 'animejs';

enum ViewStates {
  LOADING,
  ERROR,
  DEVICESELECT,
  BIGPLAYER,
  SETUP,
}

@Component({
  selector: 'app-spotify-module',
  templateUrl: './spotify-module.component.html',
  styleUrls: ['./spotify-module.component.scss']
})
export class SpotifyModuleComponent implements OnInit {
  private errorListener = null;
  ViewStates = ViewStates; // Required for html templating
  isAnimating = false;
  errorText = '';
  currentView: ViewStates = ViewStates.LOADING;

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
      if (data === 'No device found' && this.currentView !== ViewStates.DEVICESELECT) {
        this.hideView().then(() => this.showDeviceList());
      }
    });
  }

  /**
   * Initializes the Spotify module and handles errors
   */
  initialize() {
    this._spotifyService.initializeSpotify().then(() => {
      this.showBigPlayer();
      this.setupListener();
    }).catch((err) => {
      if (err ===  'No refresh_token found') {
        this.showSpotifySetup();
      } else if (err === 'No device found') {
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

  /**
   * Fires when user clicks 'Link Spotify' during setup
   */
  spotifyLinked() {
    this.hideSpotifySetup().then(() => {
      this.initialize();
    });
  }

  /**
   * Displays an error message and resolves when a predetermined time has passed
   * @param errorText error text to be displayed
   * @param timeout the interval till promises is resolved
   */
  setRetry(errorText: string, timeout: number) {
    return new Promise((resolve) => {
      if (document.getElementById('container').style.width !== '300px') {
        anime({
          targets: '#container',
          width: 300
        });
      }
      const tmp = setInterval(() => {
        this.errorText = errorText + ' Retrying in ' + timeout;
        timeout -= 1;
        if (timeout < 0) {
          clearInterval(tmp);
          this.errorText = errorText + ' Retrying...';
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
   * Hide the view
   * @param view (optional) the view to hide
   */
  hideView(view = this.currentView) {
    return new Promise((resolve, reject) => {
      switch (view) {
        case ViewStates.BIGPLAYER:
          this.hideBigPlayer().then(() => resolve());
          break;
        case ViewStates.SETUP:
          this.hideSpotifySetup().then(() => resolve());
          break;
        case ViewStates.DEVICESELECT:
          this.hideDeviceList().then(() => resolve());
          break;
        default:
          reject();
          return;
      }
    });
  }

  /**
   * Set the dimensions of a HTMLElement
   * @param ref a reference to the HTMLElement to modfiy
   * @param height (optional) the height to set default=0
   * @param width (optional) the width to set default=0
   */
  setDimensions(ref: HTMLElement, height: number = 0, width: number = 0) {
    ref.style.height = height.toString();
    ref.style.width = width.toString();
  }

  /**
   * Show big player component
   */
  showBigPlayer() {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    this.setDimensions(document.getElementById('bigPlayerContainer'));
    this.currentView = ViewStates.BIGPLAYER;
    return anime.timeline().add({
      targets: '#container, #bigPlayerContainer',
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
    }).finished.then(() => this.isAnimating  = false);
  }

  /**
   * Hide big player component
   */
  hideBigPlayer() {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    return anime.timeline().add({
      targets: '#container, #bigPlayerContainer',
      easing: 'easeOutExpo',
      width: 50,
      height: 50,
      duration: 200,
    }).add({
      targets: '#spotifyLogoContainer',
      easing: 'easeOutExpo',
      offset: 0,
      translateX: 0,
      duration: 200,
    }).add({
      targets: '#header',
      easing: 'easeOutExpo',
      'border-bottom-left-radius': 15,
      'border-bottom-right-radius': 15,
      offset: 0,
      duration: 200,
    }).finished.then(() => this.isAnimating  = false);
  }

  /**
   * Show spotify setup component
   */
  showSpotifySetup() {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    this.setDimensions(document.getElementById('spotifySetupContainer'));
    this.currentView = ViewStates.SETUP;
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
    }).finished.then(() => this.isAnimating = false);
  }

  /**
   * Hides Spotify setup view
   */
  hideSpotifySetup() {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
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
    }).finished.then(() => this.isAnimating = false);
  }

  /**
   * Show device list view
   */
  showDeviceList() {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
    this.setDimensions(document.getElementById('selectDeviceContainer'));
    this.currentView = ViewStates.DEVICESELECT;
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
    }).finished.then(() => this.isAnimating = false);
  }

  /**
   * Hide device list view
   */
  hideDeviceList() {
    if (this.isAnimating) {
      return;
    }
    this.isAnimating = true;
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
    }).finished.then(() => {
      this.isAnimating = false;
    });
  }
}
