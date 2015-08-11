'use strict';
/*
 *
 */
const app            = require('app');
const dialog         = require('dialog');
const BrowserWindow  = require('browser-window');
const ipc            = require('ipc');
const tex            = require('./js/Lib/ThumbExtractor.js');


let win;

/*
 *
 */
app.on('ready', function(){
	win = new BrowserWindow({
		title: 'vinegar',
		width: 960,
		'min-width': 960,
		height: 600,
		'min-height' : 300,
		frame: false,
		transparent: false,
	});

	win.openDevTools({detach: true});

	win.loadUrl('file://' + __dirname + '/index.html');


	ipc.on('close', function(){
		app.quit();
	});

	ipc.on('minimize', function(){
		win.minimize();
	});

	ipc.on('maximize', function(){
		win.maximize();
	});

	ipc.on('fullscreen', function(){
		win.setFullScreen(!win.isFullScreen());
	});

	ipc.on('dialog', function(event, arg){
		dialog.showOpenDialog({
			title: 'Add medias',
			properties : ['openDirectory'],
		}, function(result) {
			event.sender.send('dialog:response', result);
		});
	});

	ipc.on('thumbnails:request', function(event, arg){
		tex(arg, function(data){
			event.sender.send('thumbnails:generated', data);
		});
	});
});
