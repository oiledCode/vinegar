var MediaCollection = function() {
	this.medias = {};
	return this;
}

MediaCollection.prototype.add = function(id, options) {
	this.medias[i] = new Media(options);
};

MediaCollection.prototype.getMedia = function(id) {
	return this.medias[id];
};