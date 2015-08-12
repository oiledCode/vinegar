
"use strict";


const titlebar     = require('titlebar')();
const ipc          = require('ipc');
const mediaScanner = require('./js/Lib/MediaScanner.js');
const streamer     = require('./js/Lib/Streamer.js');
const db           = require('./js/Lib/Database.js');

window.$ = window.jQuery = require('jquery');

let dbNmame  = 'medias';
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
	$('.no-medias').removeClass('visible').remove();
}

function onLibraryResultRetrieved(result){
	if (result) {
		medias = result;
		mediaList = new MediaListView({medias: medias, el: $('.main-wrapper')});
		mediaList.on('movie:selected', onMovieSelected);
		mediaList.on('rendered', onMediaListRendered);
		mediaList.render();
	}
}

function searchMedia() {
	mediaScanner.scanMedia({ path: movieDir, onScanEnd: onLibraryResultRetrieved});
}

function checkLibraryExistence() {
	db.exist(dbNmame, function(err, result) {
		if (!err && result) {
			db.createOrOpenDB(dbNmame);
			db.getAllDocuments(function(err, result) {
				if (err) {
					console.error(err);
				} else {
					onLibraryResultRetrieved(mediaScanner.parseDBResult(result));
				}
			});
		} else {
			addInputLibraryUI();
		}
	});
}

function addInputLibraryUI() {
	$('.no-medias').addClass('visible');
	$('.add-media-button').addClass('visible');
	ipc.on('dialog:response', function(arg) {
		if (arg && arg[0]) {
			$('.add-media-button').removeClass('visible');
			$('.processing-media-loader').addClass('visible');
			movieDir = arg[0];
			searchMedia();
		}
	});
	
	$('.add-media-button').on('click', function(){
		ipc.send('dialog');
	});
}

onload = function() {
	addTitleBarObservers();
	checkLibraryExistence();
	titlebar.appendTo('#titlebar');
	streamer.startServer();

}
