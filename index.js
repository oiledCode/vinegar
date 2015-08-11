
"use strict";


const titlebar     = require('titlebar')();
const ipc          = require('ipc');
const mediaScanner = require('./js/Lib/MediaScanner.js');
const streamer     = require('./js/Lib/Streamer.js');
const db           = require('./js/Lib/Database.js');



window.$ = window.jQuery = require('jquery');

let movieDir = '/Users/letteriodantoni/Desktop/movies';
let medias = {};
let mediaList;

function addTitleBarObservers() {
	titlebar.on('close', function onClose() {
		ipc.send('close');
	});

	titlebar.on('minimize', function onMinimize() {
		ipc.send('minimize');
	});

	titlebar.on('maximize', function onMaximize() {
		ipc.send('maximize');
	});

	titlebar.on('fullscreen', function onFullScreen() {
		ipc.send('fullscreen');
	});
}



function loadHtmlPlayer(media) {
	let playerWrapper = $('.player-wrapper');
	
	let player = new Player({
		el: $('.player-wrapper'),
		media : media
	});

	playerWrapper.addClass('visible');
	player.start();

	player.on('close', function(){
		playerWrapper.removeClass('visible');
		player.remove();
	});

	return player;
}

function onMovieSelected(mediaKey) {
	let media    = medias[mediaKey];
	db.createOrOpenDB('medias');
	if (!media.getThumbnailsData()) {
		let player = loadHtmlPlayer(media);
		ipc.on('thumbnails:generated', function(data){
			media.setThumbnailsData(data);
			db.alterDocument(mediaKey, media);
			medias[mediaKey] = media;
			player.setThumbnailsData(data);
		});
		ipc.send('thumbnails:request', media.getVideo());
	} else {
		loadHtmlPlayer(media);
	}
	console.log(media.getThumbnailsData());
}

function onMediaListRendered() {

}

function searchMedia() {
	mediaScanner.scanMedia({
		path: movieDir,
		onScanEnd : function(result) {
			if (result) {
				medias = result;
				mediaList = new MediaListView({medias: medias, el: $('.main-wrapper')});
				mediaList.on('movie:selected', onMovieSelected);
				mediaList.on('rendered', onMediaListRendered);
				mediaList.render();
			}
		}
	});
}

function addUIObserver() {
	searchMedia();
	// ipc.on('dialog:response', function(arg) {
	// 		movieDir = arg[0];
	// 		searchMedia();
	// });
	// $('.add-media-button').on('click', function(){
	// 	ipc.send('dialog');
	// });
}

onload = function() {
	addTitleBarObservers();
	titlebar.appendTo('#titlebar');
	addUIObserver();
	streamer.startServer();

}
