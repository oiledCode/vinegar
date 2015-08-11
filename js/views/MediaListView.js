'use strict';

var events = require('events');

var MediaListView = function(options) {
	this.medias  = options.medias;
	this.$el        = options.el;
	events.EventEmitter.call(this);
	
	return this; 
}

function createMediainfoBox(info) {
	var box = $('<span>', {'class': 'movie-title'}).text(info);
	return box;
}

function createPosterCard(posterURL , key) {
	let card; 
	
	card = $('<div>', {'class' : 'poster-card'})
		.css('background-image','url(file://'+posterURL+')')
		.data('mediakey', key);
	
	return card;
}

function createMovieCard(poster, video) {
	var card  = $('<div>', {'class' : 'movie-card'});
	return card;
}


MediaListView.prototype.render = function() {
	$.each(medias, function(key, media){
		createMovieCard()
			.append(createPosterCard(media.getMoviePoster(), key))
			.append(createMediainfoBox(media.getTitle()))
			.appendTo(this.$el);
	}.bind(this));
	this.emit('rendered');
	this.$el.on('click', '.poster-card', function(e){
		this.emit('movie:selected', $(e.target).data('mediakey'));
	}.bind(this));
}

MediaListView.prototype.__proto__ = events.EventEmitter.prototype;