
"use strict";

const titlebar = require('titlebar')();
const mediaScanner = require('./js/Lib/MediaScanner.js');
const streamer = require('./js/Lib/Streamer.js');
const ipc = require('ipc');
// const deviceScanner = require('./js/Lib/DeviceScanner.js');
// const path          = require('path');


window.$ = window.jQuery = require('jquery');

const movieDir = '/Users/letteriodantoni/Desktop/movies';
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

function loadUpnpClient(path) {
	// var devices = deviceScanner.getDevices();
	// if (devices.length > 0) {
	// 	streamer.initRenderClient(devices[0]);
	// 	console.log(path);
	// 	streamer.stream(path);
	// }
	// var source = $('<source>').attr({
	// 	src: 'http://192.168.1.101:3000/'+path
	// }).appendTo($('#video-player'));
	// $('.player-wrapper').addClass('visible');
}

function loadHtmlPlayer(path) {
	let playerWrapper = $('.player-wrapper');
	let player = new Player({
		el: $('.player-wrapper'),
		videoUrl: 'http://127.0.0.1:3000/' + path
	});

	playerWrapper.addClass('visible');
	player.start();

	player.on('close', function(){
		playerWrapper.removeClass('visible');
		player.remove();
	});
}

function onMovieSelected(movie) {
	const components = movie.split('/');
	const l = components.length;
	const path = '' + components[l-2] + '/' + components[l-1];

	loadHtmlPlayer(path);

}

function searchMedia() {
	mediaScanner.scanMedia({
		path: movieDir,
		onScanEnd : function(result) {
			if (result) {
				medias = result;
				mediaList = new MediaListView({medias: medias, el: $('.main-wrapper')});
				mediaList.on('movie:selected', onMovieSelected);
				mediaList.buildLayout();
				mediaList.render();
			}
		}
	});
}

onload = function() {
	addTitleBarObservers();
	titlebar.appendTo('#titlebar');
	searchMedia();
	// deviceScanner.discover();
	streamer.startServer();

}
