'use strict';

var TaskQ     = require('./TaskQ.js');
let request   = require('request');
let omdb      = require('omdb');
let _fs       = require('fs');
let _medias;

// this must be removed 
function createAdditionalDataClosure(obj, taskQueue, medias) {
	return function(err, data) {
		if (!err) {
			obj.movieData = data;
		}
		taskQueue.taskCompleted();
	}
}


function fetchAdditionalData(medias, callback) {
	let taskQueue = new TaskQ();
	let keys      = Object.keys(medias);

	taskQueue.registerCallback(callback);
	for (let i = 0, l = keys.length; i < l; i++ ) {
		taskQueue.registerTask(omdb.get, [ { title: keys[i] }, false, createAdditionalDataClosure(medias[keys[i]], taskQueue, medias)]);
	}
	taskQueue.start();
}


function downloadPoster(filename, filepath, medias, taskQueue) {
	if (medias[filename] && medias[filename].movieData) {
		let url = medias[filename].movieData.poster;
	  	request.get({url: url}, function(err, res, body){
    		request(url).pipe(_fs.createWriteStream(filepath)).on('close', function(){
    			medias[filename].movieData.poster = filepath;
    			taskQueue.taskCompleted();
    		});
  		});	
	} else {
		console.log('download Poster failed');
		taskQueue.taskCompleted();
	}

}


function fetchPosters(mediasPath, medias, callback) {
	let taskQueue = new TaskQ();
	let keys      = Object.keys(medias);
	let _path, uri;
	
	taskQueue.registerCallback(callback);

	for (let i = 0, l = keys.length; i < l; i++ ) {
		_path = mediasPath + '/' + keys[i] + '/poster.jpg';
		taskQueue.registerTask(downloadPoster, [keys[i], _path, medias, taskQueue]);
	}
	taskQueue.start();
}

module.exports.fetchMetadata = function(medias, path, callback) {
	_medias = medias;
	fetchAdditionalData(_medias, function() {
		fetchPosters(path, _medias, function() {
			callback(_medias);
		});
	});
}