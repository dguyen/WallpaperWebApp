import { Component, OnInit } from '@angular/core';

import { SpotifyService } from '../_services/spotify.service';

import anime from 'animejs';
import $ from 'jquery';

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
		// $('#playlists').draggable({
		// 	cursor: 'move',
		// 	containment: 'parent'
		// })
	}
	
	ngOnInit() {
	}

	// Todo: Highlighting song if currently being played
	test(evt){
		// $(evt.target).closest('li').children('.songText').each(function() {
		// 	$(this).addClass('listTextColor');
		// 	console.log(1);
		// })
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
				this.playlists = res.items;
				this.changeView('playlistView');
			},
			err => console.log(err));
	}

	changeView(view){
		if(view != 'loadingView' && view != 'playlistView' && view != 'songView')
			console.log('Invalid view');
		
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
			})	
		})
	}


	selectPlaylist(playlistSelected){
		console.log('Playlist: ' + playlistSelected.name);
		this._spotifyService.getSongsUrl(playlistSelected.href).subscribe(
			res => {
				this.selectedPlaylist = res;
				this.changeView('songView');
			},
			err => {

			})
	}

	playSong(songUri, albumUri){
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
		var tmp = '', 
			currentlyPlaying = false;
		
		currentlyPlaying ? tmp = 'pause': tmp = 'play';
		// this._spotifyService.mediaPausePlay(tmp);
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
				duration: 700,
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