import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class SpotifyService {
    refreshToken: String = "AQAJVocyTnbHcB8ctZ-NXag5Ys6B8wqaZoMQoiGCI9oMOinlzVsTLZTwkrk_NJopZAuDUcokch2r-ZzL6D79oXHCeMZGa_LvZ6t-W8sgYtCvc71pUBaRCIY4vsUPBt7iM5w"
    token: String = null;
    headers = new Headers();
    // result: any;
    initialized: any;


    constructor(private _http: Http) { 
        this.headers.append('Content-type', 'application/json');
        this.initialized = this.obtainToken();
    }

    /*
    * Retrieves an active token by using the refresh token
    * @param {} 
    * @return {}
    */
    obtainToken(){
        return new Promise((resolve, reject) => {
            this._http.get('/api/refresh_token', {
                params: {'refresh_token': this.refreshToken}
            }).subscribe(
                res => {
                    var tmp = res.json().access_token;
                    if(tmp) this.token = tmp;
                    this.headers.append('Authorization', 'Bearer ' + this.token);
                    resolve();
                },
                err => {
                    reject(err);
                }
            );
        })
    }

    /*
    * Pauses or resumes media on selected device
    * @param {string} can only be 'pause' or 'play'
    * @return {Observable}
    */
    mediaPausePlay(method: string){
        if(!this.token) throw "User not initialized";
        if(method !== "pause" && method !== "play") throw "Invalid input"

        return this._http.put('https://api.spotify.com/v1/me/player/' + method, null, 
                {headers: this.headers}
            ).subscribe(
                (res) => {},
                (err) => {
                    if(err.json().status === 403){
                        throw "Media already " + method + " or user not premium";
                    }
                    
                });
    }

    /*
    * Plays a song
    * @param {string} a context uri representing the context to play
    * @return {Observable}
    */
    mediaPlaySong(albumUri: string, songUri : number){
        if(!this.token) throw "User not initialized";

        return this._http.put('https://api.spotify.com/v1/me/player/play', 
                { 
                    context_uri: albumUri,
                    offset: {'uri': songUri}
                }, 
                {headers: this.headers}
            );
    }

    /*
    * Seeks either the next playable song or previous playable song 
    * @param {string} can only be 'next' or 'previous'
    * @return {Observable}
    */
    mediaSeek(method: string){
        if(!this.token) throw "User not initialized";
        if(method !== "next" && method !== "previous") throw "Invalid input"

        return this._http.post('https://api.spotify.com/v1/me/player/' + method, null, 
                {headers: this.headers}).subscribe(
                (res) => {},
                (err) => {
                    if(err.json().status === 403){
                        throw "Media already " + method + " or user not premium";
                    }
                    
                });
    }

    /*
    * Changes the volume of spotify on the selected device
    * @param {Number} a number between 0-100 representing volume percent
    * @return {Observable}
    */
    mediaVolumeChange(volume: number){
        if(!this.token) throw "User not initialized";
        if(volume < 0 || volume > 100 || isNaN(volume)) throw "Invalid input";

        return this._http.put('https://api.spotify.com/v1/me/player/volume' , {}, { 
                    headers: this.headers,
                    params: { 'volume_percent': volume }
                })
                .subscribe(res => {}, err => {console.log(err)});

    }

    /*
    * Obtains infomation about the selected user
    * @param {} 
    * @return {Observable} if successful, an object containg user data, else an error
    */
    getUserProfile(){
        if(!this.token) throw "User not initialized";

        return this._http.get('https://api.spotify.com/v1/me', {
            headers: this.headers
        }).map(res => res.json());
    }

    /*
    * Obtains all of a selected user's public playlists 
    * @param {}
    * @return {Observable}
    */
    getUserPlaylists(){
        if(!this.token) throw "User not initialized";

        return this._http.get('https://api.spotify.com/v1/me/playlists', {
            headers: this.headers
        }).map(res => res.json());
    }

    /*
    * Obtains all songs from a specified playlist 
    * @param {string} a string reference to the playlist
    * @return {Observable}
    */  
    getSongsUrl(url){
        if(!this.token) throw "User not initialized";

        return this._http.get(url, {
            headers: this.headers
        }).map(res => res.json()); 
    }

    /*
    * Obtains all songs from a specified playlist 
    * @param {string, string} a string with the user id the playlist is from, and a string with the playlist id
    * @return {Observable}
    */  
    getSongs(user_id, playlist_id){
        if(!this.token) throw "User not initialized";

        return this._http.get('https://api.spotify.com/v1/users/' + user_id + '/playlists/' + playlist_id + '/tracks', {
            headers: this.headers
        }).map(res => res.json()); 
    }

    /*
    * Obtains all of a user's devices connected to spotify connect
    * @param {Number} a number between 0-100 representing volume percent
    * @return {Observable}
    */
    getDevices(){
        if(!this.token) throw "User not initialized";

        return this._http.get('https://api.spotify.com/v1/me/player/devices', {
            headers: this.headers
        }).subscribe(
            res => {
                console.log(res.json().devices);
            },
            err => {
                console.log(err);
            }
        )

 
    }






}
