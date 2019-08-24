import { Component } from '@angular/core';
import { SpotifyService } from '../../_services/spotify.service';
import * as anime from 'animejs';

enum ViewStates {
  SONGLIST,
  PLAYLIST,
}

@Component({
  selector: 'app-big-player',
  templateUrl: './big-player.component.html',
  styleUrls: ['./big-player.component.scss']
})
export class BigPlayerComponent {
  ViewStates = ViewStates;
  isAnimating = false;
  playlists: any;
  selectedPlaylist: any;
  currentView = ViewStates.PLAYLIST;

  constructor(private _spotifyService: SpotifyService) {
    this._spotifyService.spotifyReady.subscribe((isReady) => {
      if (isReady) {
        this.loadPlaylists();
      }
    });
  }

  /**
   * Returns a promises that resolves with the user's public playlists
   */
  loadPlaylists() {
    return new Promise((resolve, reject) => {
      this._spotifyService.getUserPlaylists().then((playlists) => {
        this.playlists = playlists;
        resolve();
      }).catch(() => reject());
    });
  }

  /**
   * Select a playlist to receive data from and be displayed
   * @param playlistSelected the playlist to obtain data and display from
   */
  selectPlaylist(playlistSelected: any) {
    const tmp = this.hideListView();
    this._spotifyService.getSongsUrl(playlistSelected.href).subscribe(
      res => {
        this.selectedPlaylist = res;
        this.currentView = ViewStates.SONGLIST;
        tmp.then(() => {
          this.showListView();
          this.showBackButton();
        });
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
   * Go back to PLAYLIST view
   */
  goBack() {
    if (this.isAnimating || this.currentView === ViewStates.PLAYLIST) {
      return;
    }
    this.hideBackButton();
    this.hideListView().then(() => {
      this.currentView = ViewStates.PLAYLIST;
      this.showListView().then(() => this.isAnimating = false);
    });
  }

  /**
   * Hides the list view
   */
  hideListView() {
    return anime({
      targets: '#bodyContainer',
      height: 0,
      easing: 'easeOutExpo',
      duration: 250
    }).finished;
  }

  /**
   * Shows the list view
   */
  showListView() {
    return anime({
      targets: '#bodyContainer',
      height: [0, 440],
      easing: 'easeOutExpo',
      duration: 300
    }).finished;
  }

  /**
   * Hide the back button
   */
  hideBackButton() {
    return anime({
      targets: '#backIcon',
      easing: 'easeOutExpo',
      duration: 300,
      opacity: 0
    });
  }

  /**
   * Show the back button
   */
  showBackButton() {
    return anime({
      targets: '#backIcon',
      easing: 'easeOutExpo',
      duration: 300,
      opacity: 1
    });
  }
}
