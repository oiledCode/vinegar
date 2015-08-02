var events = require('events');

var MediaListView = function(options) {
	this.medias  = options.medias;
	this.$el        = options.el;
	this.defaultPoster = __dirname + '/defaultPoster.jpg';
	events.EventEmitter.call(this);
	
	return this; 
}

function createMediainfoBox(info) {
	var box = $('<span>', {'class': 'movie-title'}).text(info.movieData.title);
	return box;

}

function createPosterCard(poster, video) {
	var card = $('<div>', {'class' : 'poster-card'})
		.css('background-image','url(file://'+poster+')')
		.data('video', video);
	return card;
}

function createMovieCard(poster, video) {
	var card  = $('<div>', {'class' : 'movie-card'});
	return card;
}

MediaListView.prototype.render = function() {
	console.log('MediaListView render');
}

MediaListView.prototype.buildLayout = function() {
	var keys = Object.keys(this.medias);
	for (var i=0, l=keys.length; i<l; i++) {
		var poster    = this.defaultPoster;
		var video     = this.medias[keys[i]].video.replace(/ /g, '%20');
		
		if (this.medias[keys[i]].movieData) {
			var poster = this.medias[keys[i]].movieData.poster.replace(/ /g, '%20');
		}
		createMovieCard()
		.append(createPosterCard(poster, video))
		.append(createMediainfoBox(this.medias[keys[i]]))
		.appendTo(this.$el);
	}
	this.$el.on('click', '.poster-card', function(e){
		this.emit('movie:selected',$(e.target).data('video'));
	}.bind(this));
}

MediaListView.prototype.__proto__ = events.EventEmitter.prototype;