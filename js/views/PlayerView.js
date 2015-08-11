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

function getThumbUrlForTimeStamp(time, thumbData) {
	let obj;
	let found = false;
	for(let i = 0, l = thumbData.length; i < l && !found; i++) {
		obj = thumbData[i];
		if ((time <= obj.to && time >= obj.from)) {
			found = true;
		}
	}
	return obj.path;
}

function addObservers() {
	this.$player.on('timeupdate', function(){
		onTimeUpdate.call(this);
	}.bind(this));

	$('.close-icon').on('click', function(){
		onPlayerClose.call(this);
	}.bind(this));
};

function addThumbnailsPreviewObserver() {
	$('.video-progress-container').on('mouseover mousemove', function(e) {
		var tooltip    = $('.thumbnail-preview');
		var percentage = e.pageX / $('.video-progress-container')[0].offsetWidth
		var time       = Math.floor(percentage * this.$player[0].duration);
		var url        = 'url(file://' + this.thumbPath + getThumbUrlForTimeStamp(time, this.thumbData) + ')';
		tooltip.css({
			'left' : (e.pageX - tooltip.outerWidth() / 2) + "px",
			'background-image': url
		});
	
	}.bind(this));
}


var Player = function(options) {
	this.$el       = options.el;
	this.media     = options.media;
	this.$player   = buildPlayer({ video_url: this.media.getVideo(), sub_url: this.media.getSubTitles('srt') } );
	this.thumbData = this.media.getThumbnailsData();
	this.thumbPath = this.media.getThumbnailsPath();
	this.$player.appendTo(this.$el);
	

	addObservers.call(this);
	if (this.thumbData) {
		addThumbnailsPreviewObserver.call(this);
	}
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

Player.prototype.setThumbnailsData = function(data) {
	this.thumbData = data;
	addThumbnailsPreviewObserver.call(this);
};

Player.prototype.__proto__ = events.EventEmitter.prototype;