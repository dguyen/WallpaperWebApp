import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SpotifyService } from '../../_services/spotify.service';

@Component({
  selector: 'app-setup-spotify',
  templateUrl: './setup-spotify.component.html',
  styleUrls: ['./setup-spotify.component.scss']
})
export class SetupSpotifyComponent implements OnInit {
  @Output() spotifyLinked = new EventEmitter();
  setupLink = 'localhost:3000/setup'; // Todo: Replace with live server

  constructor(private _spotifyService: SpotifyService) { }

  ngOnInit() {
  }

  copy(element: HTMLInputElement) {
    element.focus();
    element.select();
    document.execCommand('copy');
  }

  linkSpotify() {
    this._spotifyService.setupToken().then(() => {
      this.spotifyLinked.emit(null);
    }).catch((err) => {
      console.log(err);
    });
  }
}
