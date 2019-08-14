import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SpotifyService } from '../../_services/spotify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setup-spotify',
  templateUrl: './setup-spotify.component.html',
  styleUrls: ['./setup-spotify.component.scss']
})
export class SetupSpotifyComponent implements OnInit {
  @Output() spotifyLinked = new EventEmitter();
  setupLink = environment.apiServer + '/setup';
  token = '';
  isLoading = false;
  errorMsg = '';

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {}

  /**
   * Copy an element's value onto the user's clipboard
   * @param element a html input element
   */
  copy(element: HTMLInputElement) {
    element.focus();
    element.select();
    document.execCommand('copy');
  }

  /**
   * Opens a prompt for a user to paste their spotify token
   */
  getToken() {
    this.token = prompt('Please paste your Spotify token here');
  }

  /**
   * Checks if inputted token is valid, if valid component will emit an event on spotifyLinked
   */
  linkSpotify() {
    if (this.isLoading) { return; }
    this.isLoading = true;
    this.errorMsg = '';
    this._spotifyService.setupToken(this.token).then(() => {
      this.spotifyLinked.emit(null);
      this.isLoading = false;
      this.errorMsg = '';
    }).catch((err) => {
      this.isLoading = false;
      if (err === 'refresh_token must be supplied') {
        this.errorMsg = 'Please paste your spotify token above';
      } else if (err === 'Invalid refresh token') {
        this.errorMsg = 'Invalid refresh token, please check your spotify token ';
      } else {
        this.errorMsg = 'Something went wrong, please try again later';
      }
    });
  }
}
