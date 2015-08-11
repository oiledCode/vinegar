var Media = function(options) {
	if (options) {
		this.path           = options.path;
		this.video          = options.video;
		this.mediainfo      = options.mediainfo;
		this.subtitles      = options.subtitles;
		this.movieData      = options.movieData;
		this.defaultPoster  = options.defaultPoster;
		this.thumbnailsData = options.thumbnailsData;
	}
	return this;
}

Media.prototype.setDefaultPoster = function(poster) {
	this.defaultPoster = poster;
};
Media.prototype.setPath = function(path) {
	this.path = path;
};
Media.prototype.setMediaInfo = function(mediainfo) {
	this.mediainfo = mediainfo;
};

Media.prototype.setVideo = function(video) {
	this.video = video;
};

Media.prototype.setSubTitles = function(subtitle, type) {
	var subs = this.subtitles || {};
	subs[type] = subtitle;
	this.subtitles = subs;
};

Media.prototype.setMovieData = function(movieData) {
	this.movieData = movieData;
};

Media.prototype.setMoviePoster = function(poster) {
	this.movieData.poster = poster;
};

Media.prototype.getTitle = function() {
	return this.mediainfo.title;
};

Media.prototype.getVideo = function() {
	return this.path + '/' + this.video;
};

Media.prototype.getSubTitles = function(type) {
	return this.subtitles[type];
};

Media.prototype.setMovieData = function(get) {
	return this.movieData;
};

Media.prototype.getMoviePoster = function(poster) {
	if (this.movieData) {
		return this.movieData.poster.replace(/ /g, '%20').replace('(', '%28').replace(')', '%29');
	} else {
		return this.defaultPoster;
	}
};

Media.prototype.setThumbnailsData = function(thumbnailsData) {
	this.thumbnailsData = thumbnailsData;
};

Media.prototype.getThumbnailsData = function() {
	return this.thumbnailsData;
};

Media.prototype.getThumbnailsPath = function(first_argument) {
	return this.path.replace(/ /g, '%20');
};

module.exports = Media;
