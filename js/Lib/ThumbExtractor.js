'use strict';

let thumbgen = require('thumbnails-webvtt');

function normalizeData(data) {
	return data.map(function(obj, idx){
		let to_components = obj.to.split('.')[0].split(':');
		let from_components = obj.from.split('.')[0].split(':');
		return {
			'from' : (parseInt(from_components[0],10) * 3600) + (parseInt(from_components[1],10) * 60) + parseInt(from_components[2],10)	,
			'to' : (parseInt(to_components[0],10) * 3600) + (parseInt(to_components[1],10) * 60) + parseInt(to_components[2],10),
			'path' : obj.path
		}
	});
}


let extractThumbnails = function(src, callback) {
	src = src.replace(/%20/g, ' ');
	thumbgen(src, { assetsDirectory: 'thumbnails', size: { width: 100 }, secondsPerThumbnail:120}, function(err, metadata) {
		if (err) {
			throw err
  		}
  		callback(normalizeData(metadata.thumbnailsData));
	});
};

module.exports = extractThumbnails;
