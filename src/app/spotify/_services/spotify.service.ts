import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class SpotifyService {
  refreshToken = 'AQAJVocyTnbHcB8ctZ-NXag5Ys6B8wqaZoMQoiGCI9oMOinlzVsTLZTwkrk_NJopZAuDUcokch2r-ZzL6D79oXHCeMZGa_LvZ6t-W8sgYtCvc71pUBaRCIY4vsUPBt7iM5w';
  token: string = null;
  tokenExpiry = 0;
  currentTime = 0;
  headers = new HttpHeaders().set('Content-type', 'application/json');
  // headers = new HttpHeaders();
  initialized: any;

  constructor(private _http: HttpClient) {
    // this.headers.append('Content-type', 'application/json');
    this.initialized = this.initializeTokens();
  }

  obtainNewToken() {
    this._http.get('/api/refresh_token', {
      params: new HttpParams().set('refresh_token', this.refreshToken)
    }).subscribe(
      res => {
        this.token = res['access_token'];
        this.tokenExpiry = res['expires_in'];
      },
      err => {
        throw new Error(err);
      }
    );
  }

  /*
  * Retrieves an active token by using the refresh token
  * @param {}
  * @return {}
  */
  initializeTokens() {
    return new Promise((resolve, reject) => {
      this._http.get('/api/refresh_token', {
        params: { 'refresh_token': this.refreshToken }
      }).subscribe(
        res => {
          if (res['access_token']) {
            this.token = res['access_token'];
          }
          this.headers = this.headers.append('Authorization', 'Bearer ' + this.token);
          this.tokenExpiry = res['expires_in'];
          setInterval(() => { this.obtainNewToken(); }, (this.tokenExpiry - 20) * 1000);
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
  * @return {Observable}
  */
  mediaPausePlay(method: string) {
    this.checkToken();
    if (method !== 'pause' && method !== 'play') {
      throw Error('Invalid input');
    }
    return this._http.put('https://api.spotify.com/v1/me/player/' + method, null,
      { headers: this.headers }
    ).subscribe(
      (res) => { },
      (err) => {
        if (err.json().status === 403) {
          throw new Error('Media already ' + method + ' or user not premium');
        }
    });
  }

  /*
  * Plays a song
  * @param {string} a context uri representing the context to play
  * @return {Observable}
  */
  mediaPlaySong(albumUri: string, songUri: number) {
    this.checkToken();
    return this._http.put('https://api.spotify.com/v1/me/player/play',
      {
        context_uri: albumUri,
        offset: { 'uri': songUri }
      },
      { headers: this.headers }
    );
  }

  /*
  * Seeks either the next playable song or previous playable song
  * @param {string} can only be 'next' or 'previous'
  * @return {Observable}
  */
  mediaSeek(method: string) {
    this.checkToken();
    if (method !== 'next' && method !== 'previous') {
      throw new Error('Invalid input');
    }

    return this._http.post('https://api.spotify.com/v1/me/player/' + method, null, { headers: this.headers }).subscribe(
      (res) => { },
      (err) => {
        if (err.json().status === 403) {
          throw new Error('Media already ' + method + ' or user not premium');
        }
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
  * @return {Observable} if successful, an object containg user data, else an error
  */
  getUserProfile() {
    this.checkToken();
    return this._http.get('https://api.spotify.com/v1/me', { headers: this.headers });
  }

  /*
  * Obtains all of a selected user's public playlists
  * @param {}
  * @return {Observable}
  */
  getUserPlaylists() {
    this.checkToken();
    // return this._http.get('https://api.spotify.com/v1/me/playlists', { headers: this.headers }).map(res => res.json());
    return this._http.get('https://api.spotify.com/v1/me/playlists', { headers: this.headers });
  }

  /*
  * Obtains all songs from a specified playlist
  * @param {string} a string reference to the playlist
  * @return {Observable}
  */
  getSongsUrl(url) {
    this.checkToken();
    return this._http.get(url, { headers: this.headers });
  }

  /*
  * Obtains all songs from a specified playlist
  * @param {string, string} a string with the user id the playlist is from, and a string with the playlist id
  * @return {Observable}
  */
  getSongs(user_id, playlist_id) {
    this.checkToken();

    return this._http.get('https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks', {
      headers: this.headers
    });
  }

  /*
  * Obtains all of a user's devices connected to spotify connect
  * @param {Number} a number between 0-100 representing volume percent
  * @return {Observable}
  */
  getDevices() {
    this.checkToken();
    return this._http.get('https://api.spotify.com/v1/me/player/devices', {
      headers: this.headers
    }).subscribe(
      res => {
        console.log(res['devices']);
      },
      err => {
        console.log(err);
      }
    );
  }

  checkToken() {
    if (!this.token) {
      throw new Error('User not initialized');
    }
  }
}
