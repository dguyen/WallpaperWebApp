import { Component, OnInit } from '@angular/core';

import { SpotifyService } from '../_services/spotify.service';

import anime from '../../../node_modules/animejs/anime.js';
import $ from '../../../node_modules/jquery/dist/jquery.js';

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
				this.userProfile = res;
				this.changeHeaderText('Welcome ' + res.id);
			},
			err => console.log(err));	

		this._spotifyService.getUserPlaylists().subscribe(
			res => {
				console.log(res);
				this.playlists = res.items;
				this.changeView('playlistView');
			},
			err => console.log(err));
	}

	changeView(view){
		if(view != 'loadingView' && view != 'playlistView' && view != 'songView')
			console.log('Invalid view');
		
		if(this.currentView == 'loadingView'){
			anime({
				targets: '#bodyContainer',
				height: [0, 450],
				easing: 'easeOutExpo',
				duration: 1000
			})
		}
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



	changeHeaderText(newText: string){			
		$('#headerLetters').each(function(){
			$(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span id='headerLetters'>$&</span>"));
		});
		anime({
			targets: '#headerLetters',
			scaleX: [1, 0],
			opacity: [1, 0],
			duration: 500,
			easing: 'easeOutExpo'
		}).finished.then(() => {
			$('#headerLetters').text(newText)
			$('#headerLetters').each(function(){
				$(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span id='headerLetters'>$&</span>"));
			});
		
			anime.timeline()
			.add({
				targets: '#line',
				scaleY: [0, 1],
				opacity: [0.5, 1],
				easing: "easeOutExpo",
				duration: 700
			})
			.add({
				targets: '#line',
				translateX: [0, $("#headerLetters").width()],
				easing: "easeOutExpo",
				duration: 700,
				delay: 100
			}).add({
				targets: '#headerLetters',
				opacity: [0, 1],
				easing: "easeOutExpo",
				duration: 600,
				offset: '-=775',
				delay: function(el, i) {
					return 34 * (i+1)
				}
			}).add({
				targets: '#line',
				translateX: [$("#headerLetters").width()],
				scaleY: [1, 0],
				opacity: [1, 0],
				easing: "easeOutExpo",
				duration: 700
			})

		})
	}

}