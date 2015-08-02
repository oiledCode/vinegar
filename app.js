'use strict';
/*
 *
 */
let app            = require('app');
let BrowserWindow  = require('browser-window');
let ipc            = require('ipc');
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

	});

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
});
