'use strict';

let http           = require('http');
let vidStreamer    = require('vid-streamer');
let RenderClient   = require('upnp-mediarenderer-client');
let server;
let renderClient;

module.exports.startServer = function(options) {
	server = http.createServer(vidStreamer).listen(3000);	
}

module.exports.initRenderClient = function(device) {
	renderClient = new RenderClient(device.LOCATION);
}

module.exports.stream = function(url, params) {
	url = 'http://127.0.0.1:3000/'+url; // change ip : use a module to retrieve the network address
	let options = { 
  		autoplay: true,
  		contentType: 'video/mp4',
  		metadata: {
    		title: 'Some Movie Title',
    		creator: 'John Doe',
    		type: 'video', // can be 'video', 'audio' or 'image'
  		}
	};
	
	renderClient.load(url, options, function(err, result) {
		if (err) throw err;
	});

	renderClient.on('status', function(status) {
  		console.log(status);
	});

	renderClient.on('loading', function() {
	  console.log('loading');
	});

	renderClient.on('playing', function() {
	  console.log('playing');

	  renderClient.getPosition(function(err, position) {
	    console.log(position); // Current position in seconds
	  });

	  renderClient.getDuration(function(err, duration) {
	    console.log(duration); // Media duration in seconds
	  });
	});

	renderClient.on('paused', function() {
	  console.log('paused');
	});

	renderClient.on('stopped', function() {
	  console.log('stopped');
	});

	renderClient.on('speedChanged', function(speed) {
	  // Fired when the user rewinds of fast-forwards the media from the remote
	  console.log('speedChanged', speed);
	});
}

