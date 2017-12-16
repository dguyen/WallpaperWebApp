import { Component, OnInit } from '@angular/core';

import { SpotifyService } from '../_services/spotify.service';

@Component({
  selector: 'app-spotify-module',
  templateUrl: './spotify-module.component.html',
  styleUrls: ['./spotify-module.component.css']
})

export class SpotifyModuleComponent implements OnInit {
	playlists: any;
	userProfile: any;
	selectedPlaylist: any;
	currentView: string = 'loadingView';
	headerMessage: string = 'Loading';

	constructor(private _spotifyService: SpotifyService){
		_spotifyService.initialized.then((data) => {
			this.initialize();
		}).catch((err) => {
			console.log(err);
		})
	}
	
	ngOnInit() {
	}

	initialize(){
		this._spotifyService.getUserProfile().subscribe(
			res => {
				console.log(res);
				this.userProfile = res;
				this.headerMessage = 'Welcome ' + res.id;
			},
			err => {
				console.log(err);
			});	

		this._spotifyService.getUserPlaylists().subscribe(
			res => {
				console.log(res);
				this.playlists = res.items;
				this.changeView('playlistView');
			},
			err => {
				console.log(err);
			});
	}

	changeView(view){
		console.log('Attempting to changing view...');
		if(view != 'loadingView' && view != 'playlistView' && view != 'songView')
			console.log('Invalid view');
		
		this.currentView = view;
		console.log('View changed to ' + view);
	}

	selectPlaylist(playlistSelected){
		console.log('Playlist: ' + playlistSelected.name);
		this._spotifyService.getSongsUrl(playlistSelected.href).subscribe(
			res => {
				console.log(1);
				console.log(res);
				this.selectedPlaylist = res;
				this.changeView('songView');

				console.log(this.selectedPlaylist)
			},
			err => {

			})
	}

	playSong(songUri, albumUri){
		console.log('Album URI: ' + albumUri);
		console.log('Song URI: ' + songUri);

		this._spotifyService.mediaPlaySong(albumUri, songUri).subscribe(
			res => console.log(res),
			err => console.log(err));
	}

	getArtistNames(artists){
		var combined = ""
		for(var i in artists){
			combined += artists[parseInt(i)].name;
			if(parseInt(i) < artists.length - 1) combined += ', '
		}
		return combined
	}

	getDuration(millis){
		var minuteSecond = (Math.round(millis/60000*100) / 100).toString();
		if(minuteSecond.length == 1) minuteSecond += '.00';
		if(minuteSecond.length == 3) minuteSecond += '0';

		return minuteSecond.replace('.', ':');
	}

	toggleSong(){

	}

	seek(method: string){
		this._spotifyService.mediaSeek(method);
	}


}