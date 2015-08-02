'use strict'

var events = require('events');

/*
 * Player events handlers
 */
function onPlayerClose() {
	this.$player[0].pause();
	this.$player.find('source').attr('src', '');
	this.emit('close');
};

function onTimeUpdate() {
	let player      = this.$player[0];
	let progressBar = $('#video-progressbar')[0];
   	let percentage  = (100.0 / player.duration) * player.currentTime;
   	progressBar.value = percentage;
};

function buildPlayer(options) {
	var $videoEl = $('<video id="video-player" autoplay></video>');
	var $source  = $('<source>').attr('src', options.video_url);
	
	$source.appendTo($videoEl);
	
	return $videoEl;
};

function addObservers() {
	this.$player.on('timeupdate', function(){
		onTimeUpdate.call(this);
	}.bind(this));

	$('.close-icon').on('click', function(){
		onPlayerClose.call(this);
	}.bind(this));
};


var Player = function(options) {
	this.$el      = options.el;
	this.videoUrl = options.videoUrl;
	this.subUrl   = options.subUrl;
	this.$player  = buildPlayer({ video_url: this.videoUrl, sub_url: this.subUrl } );
	
	this.$player.appendTo(this.$el);
	
	addObservers.call(this);
	
	return this;
};

Player.prototype.start = function() {
	this.$el.addClass('visible');
};

Player.prototype.stop = function() {
	
};

Player.prototype.remove = function() {
	this.$player.remove();
};

Player.prototype.__proto__ = events.EventEmitter.prototype;