import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../_services/spotify.service';
import anime from 'animejs';
import $ from 'jquery';

@Component({
  selector: 'app-spotify-module',
  templateUrl: './spotify-module.component.html',
  styleUrls: ['./spotify-module.component.scss']
})

export class SpotifyModuleComponent implements OnInit {
  playlists: any;
  userProfile: any;
  selectedPlaylist: any;
  currentView = 'loadingView';

  constructor(private _spotifyService: SpotifyService) {
    _spotifyService.initialized.then(() => {
      this.initialize();
    }).catch((err) => {
      console.log(err);
    });
  }

  ngOnInit() {
  }

  // Todo: Highlighting song if currently being played
  highlight(evt) {
    // console.log(evt);
  }

  initialize() {
    this._spotifyService.getUserProfile().then((profile) => {
      this.userProfile = profile;
      this.changeHeaderText('Welcome ' + profile['id']);
    }).catch((err) => {
      // Todo: Notify user their profile could not be obtained
      console.log('Profile could not be obtained:' + err);
    });

    this._spotifyService.getUserPlaylists().then((playlists) => {
      this.playlists = playlists;
      this.changeView('playlistView');
    }).catch((err) => {
      // Todo: Notify user playlists could not be obtained
      console.log('Playlists could not be obtained:' + err);
    });
  }

  changeView(view) {
    if (view !== 'loadingView' && view !== 'playlistView' && view !== 'songView') {
      throw new Error('Invalid view');
    }

    anime({
      targets: '#bodyContainer',
      height: 0,
      easing: 'easeOutExpo',
      duration: 500
    }).finished.then(() => {
      this.currentView = view;
      anime({
        targets: '#bodyContainer',
        height: [0, 450],
        easing: 'easeOutExpo',
        duration: 650
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

      });
  }

  playSong(songUri, albumUri) {
    this._spotifyService.mediaPlaySong(albumUri, songUri).subscribe(
      res => console.log(res),
      err => console.log(err));
  }

  getArtistNames(artists) {
    let combined = '';
    artists.forEach(artist => {
      combined += artist.name + ', ';
    });
    return artists.length > 0 ? combined.slice(0, -3) : combined;
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

  toggleSong() {
    // let tmp = '',
    // currentlyPlaying = false;
    // currentlyPlaying ? tmp = 'pause' : tmp = 'play';
    // this._spotifyService.mediaPausePlay(tmp);
  }

  seek(method: string) {
    this._spotifyService.mediaSeek(method);
  }

  changeHeaderText(newText: string) {
    $('#headerLetters').each(function () {
      $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, '<span id=headerLetters>$&</span>'));
    });
    anime({
      targets: '#headerLetters',
      scaleX: [1, 0],
      opacity: [1, 0],
      duration: 500,
      easing: 'easeOutExpo'
    }).finished.then(() => {
      $('#headerLetters').text(newText);
      $('#headerLetters').each(function () {
        $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, '<span id=headerLetters>$&</span>'));
      });

      anime.timeline().add({
        targets: '#line',
        scaleY: [0, 1],
        opacity: [0.5, 1],
        easing: 'easeOutExpo',
        duration: 700,
      })
      .add({
        targets: '#line',
        translateX: [0, $('#headerLetters').width()],
        easing: 'easeOutExpo',
        duration: 700,
        delay: 100
      }).add({
        targets: '#headerLetters',
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 600,
        offset: '-=775',
        delay: function (el, i) {
          return 34 * (i + 1);
        }
      }).add({
        targets: '#line',
        translateX: [$('#headerLetters').width()],
        scaleY: [1, 0],
        opacity: [1, 0],
        easing: 'easeOutExpo',
        duration: 700
      });
    });
  }
}
