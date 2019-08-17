import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { StorageService } from 'src/app/_services/storage/storage.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class SpotifyService {
  private server = environment.apiServer;
  private refreshToken = null;
  private headers = new HttpHeaders().set('Content-type', 'application/json');
  private token: string = null;
  private tokenExpiry = 0;
  private playerSync = null;
  spotifyReady = new BehaviorSubject(null);
  spotifyError = new Subject();
  playerUpdate = new Subject();
  currentlyPlaying = {
    playlistUri: null,
    songUri: null
  };

  constructor(private _http: HttpClient, private _storageService: StorageService) { }

  /**
   * Obtains the refresh token and attempts to connect to spotify
   */
  initializeSpotify() {
    return new Promise((resolve, reject) => {
      this.refreshToken = this._storageService.getStorageJSON('refresh_token');
      if (this.refreshToken) {
        this.initializeTokens().then(() => {
          this.setupPlayerSync().then(() => resolve()).catch((err) => reject(err));
        }).catch((err) => reject(err));
      } else {
        reject('No refresh_token found');
        return;
      }
    });
  }

  /**
   * Sets up how often the player is synced
   */
  setupPlayerSync() {
    return new Promise((resolve, reject) => {
      this.getPlayerData().then(() => {
        resolve();
        this.playerSync = setInterval(() => this.getPlayerData(), 10000);
      }).catch((err) => reject(err));
    });
  }

  /**
   * Stops the player from automatically syncing
   */
  stopPlayerSync() {
    if (this.playerSync) {
      clearInterval(this.playerSync);
    }
  }

  /**
   * Obtain refresh token from spotify if user has not used application yet
   */
  setupToken(token: string) {
    return new Promise((resolve, reject) => {
      if (!token || token.length <= 100) {
        reject('Invalid refresh token');
        return;
      }
      this._http.get(this.server + '/api/refresh_token', {
        params: { 'refresh_token': token }
      }).subscribe(
        res => {
          if (res['access_token']) {
            this._storageService.setStorage('refresh_token', token);
            resolve();
            return;
          }
          reject('Invalid refresh token');
        },
        err => reject(err.error.message ? err.error.message : err)
      );
    });
  }

  /*
  * Retrieves an active token by using the refresh token
  */
  initializeTokens() {
    return new Promise((resolve, reject) => {
      this._http.get(this.server + '/api/refresh_token', {
        params: { 'refresh_token': this.refreshToken }
      }).subscribe(
        res => {
          if (res['access_token']) {
            this.token = res['access_token'];
          }
          this.headers = this.headers.append('Authorization', 'Bearer ' + this.token);
          this.tokenExpiry = res['expires_in'];
          setInterval(() => { this.initializeTokens(); }, (this.tokenExpiry - 20) * 1000);
          this.spotifyReady.next(true);
          resolve();
        },
        err => {
          reject(err);
        }
      );
    });
  }

  /*
  * Pauses or resumes media on selected device
  * @param {string} can only be 'pause' or 'play'
  * @return {Promise}
  */
  mediaPausePlay(method: string) {
    this.checkToken();
    if (method !== 'pause' && method !== 'play') {
      throw new Error('Invalid input');
    }
    return new Promise((resolve, reject) => {
      this._http.put('https://api.spotify.com/v1/me/player/' + method, null,
        { headers: this.headers }
      ).subscribe(
        () => resolve(),
        (err) => {
          if (err.json().status === 403) {
            throw new Error('Media already ' + method + ' or user not premium');
          }
          reject(err);
      });
    });
  }

  /*
  * Plays a song
  * @param {string} a context uri representing the context to play
  * @return {Observable}
  */
  mediaPlaySong(albumUri: string, songUri: number) {
    this.checkToken();
    return new Promise((resolve, reject) => {
      this._http.put('https://api.spotify.com/v1/me/player/play', {
        context_uri: albumUri,
        offset: { 'uri': songUri }
      }, {
        headers: this.headers
      }).subscribe(() => {
        resolve();
        this.currentlyPlaying.songUri = songUri;
        this.currentlyPlaying.playlistUri = albumUri;
        setTimeout(() => this.getPlayerData(), 500);
      }, (err) => reject(err));
    });
  }

  /*
  * Seeks either the next playable song or previous playable song
  * @param {string} can only be 'next' or 'previous'
  * @return {Promise}
  */
  mediaSeek(method: string) {
    this.checkToken();
    if (method !== 'next' && method !== 'previous') {
      throw new Error('Invalid input');
    }
    return new Promise((resolve, reject) => {
      this._http.post('https://api.spotify.com/v1/me/player/' + method, null, { headers: this.headers }).subscribe(() => {
        resolve();
        setTimeout(() => this.getPlayerData(), 500);
      }, (err) => {
        if (err.json().status === 403) {
          throw new Error('Media already ' + method + ' or user not premium');
        }
        reject(err);
      });
    });
  }

  /*
  * Changes the volume of spotify on the selected device
  * @param {Number} a number between 0-100 representing volume percent
  * @return {Observable}
  */
  mediaVolumeChange(volume: number) {
    this.checkToken();
    if (volume < 0 || volume > 100 || isNaN(volume)) {
      throw new Error('Invalid input');
    }

    return this._http.put('https://api.spotify.com/v1/me/player/volume', {}, {
      headers: this.headers,
      params: new HttpParams().set('volume_percent', volume.toString())
    }).subscribe();
  }

  /*
  * Obtains infomation about the selected user
  * @param {}
  * @return {Promise} if resolves, an object containg user data, else rejects with an error
  */
  getUserProfile() {
    this.checkToken();
    return new Promise((resolve, reject) => {
      this._http.get('https://api.spotify.com/v1/me', { headers: this.headers }).subscribe(
        (res) => resolve(res),
        (err) => reject(err));
    });
  }

  /*
  * Obtains all of a selected user's public playlists
  * @param {}
  * @return {Promise}
  */
  getUserPlaylists() {
    this.checkToken();
    return new Promise((resolve, reject) => {
      this._http.get('https://api.spotify.com/v1/me/playlists', { headers: this.headers }).subscribe(
        (res) => resolve(res['items']),
        (err) => reject(err));
    });
  }

  /*
  * Obtains all songs from a specified playlist
  * @param {string} a string reference to the playlist
  * @return {Observable}
  */
  getSongsUrl(url: string) {
    this.checkToken();
    return this._http.get(url, { headers: this.headers });
  }

  /*
  * Obtains all songs from a specified playlist
  * @param {string, string} a string with the user id the playlist is from, and a string with the playlist id
  * @return {Observable}
  */
  getSongs(user_id: string, playlist_id: string) {
    this.checkToken();
    return this._http.get('https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks', {
      headers: this.headers
    });
  }

  /*
  * Obtains all of a user's devices connected to spotify connect
  * @param {Number} a number between 0-100 representing volume percent
  * @return {Promise}
  */
  getDevices(): Promise<any> {
    this.checkToken();
    return new Promise((resolve, reject) => {
      this._http.get('https://api.spotify.com/v1/me/player/devices', {
        headers: this.headers
      }).subscribe(
        res => resolve(res['devices']),
        err => reject(err)
      );
    });
  }

  /**
   * Set a device to playback on
   * @param deviceId the new device to stream audio to
   */
  setDevice(deviceId: string): Promise<any> {
    this.checkToken();
    return new Promise((resolve, reject) => {
      this._http.put('https://api.spotify.com/v1/me/player', {
        device_ids: [deviceId],
        play: true
      }, {
        headers: this.headers
      }).subscribe((res) => resolve(res), (err) => reject(err));
    });
  }

  /**
   * Throws an error if user is not initialized
   */
  checkToken() {
    if (!this.token) {
      throw new Error('User not initialized');
    }
  }

  /**
   * Retrieves data about the status of the current player
   * @return a promise that either resolves with a set of data representing the player, or rejects with an error
   */
   getPlayerData(): Promise<any> {
    try { this.checkToken(); } catch (err) { return; }

    return new Promise((resolve, reject) => {
      this._http.get('https://api.spotify.com/v1/me/player', {
        headers: this.headers
      }).subscribe(
        res => {
          if (!res) {
            this.spotifyError.next('No device found');
            this.stopPlayerSync();
            reject('No device found');
            return;
          }
          this.updateCurrentSong(res);
          this.playerUpdate.next(res);
          resolve(res);
        },
        err => {
          // If unauthorized, retry obtaining token once
          if (err.status === 401) {
            this.initializeTokens().then(() => {
              this.getPlayerData().then((playerData) => resolve(playerData));
            }).catch(() => {
              reject('Unauthorized user');
            });
          }
          reject(err);
        }
      );
    });
  }

  private updateCurrentSong(songData: any) {
    if (songData['context']) {
      this.currentlyPlaying.playlistUri = songData['context']['uri'];
    }
    if (songData['item']) {
      this.currentlyPlaying.songUri = songData['item']['uri'];
    }
  }

  /**
   * Set the shuffle state of the media player
   * @param newState true to set shuffle on false to set toggle off
   */
  setShuffle(newState: boolean): Promise<any> {
    this.checkToken();
    return new Promise((resolve, reject) => {
      this._http.put('https://api.spotify.com/v1/me/player/shuffle', {}, {
        headers: this.headers,
        params: new HttpParams().set('state', newState.toString())
      }).subscribe(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  /**
   * Set the replay state of the media player
   * @param newState the new state of replay ('off', 'context', 'track')
   */
  setReplay(newState: string): Promise<any> {
    if (newState !== 'off' && newState !== 'context' && newState !== 'track') {
      throw new Error('Invalid view');
    }
    this.checkToken();
    return new Promise((resolve, reject) => {
      this._http.put('https://api.spotify.com/v1/me/player/repeat', {}, {
        headers: this.headers,
        params: new HttpParams().set('state', newState)
      }).subscribe(
        res => resolve(res),
        err => reject(err)
      );
    });
  }
}
