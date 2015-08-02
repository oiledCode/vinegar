'use strict';
let fs             = require('fs');
// var Promise        = require('bluebird');
let path           = require('path');
let db             = require('./Database.js');
let metaDownloader = require('./MediaMetadataDownloader.js');

/*x
 * Promisification
 */
// Promise.promisifyAll(fs)

/*
 *
 */
function isVideo(extname) {
	return (extname === 'avi' || extname == 'mp4' || extname === 'mkv');
};

/*
 *
 */
function isSubtitle(extname){
	return (extname === 'srt' || extname === 'vtt');
}

/*
 *
 */
function walkDir(mediasPath, callback) {
	let _medias     = {};
	let _dirContent = [];

	fs.readdir(mediasPath, function(error, files) {
		if (error) {
			callback(error, null);
		} 
		for(let i=0, l=files.length; i<l; i++){
			let file  = files[i];
			let _path = mediasPath + '/' +  file;
			if (fs.lstatSync(_path).isDirectory()) {
				_medias[file] = {};
				_dirContent.push({path: _path, file: file});
			}
		}
		for(let j=0, n =_dirContent.length; j < n; j++ ) {
			let obj = _dirContent[j];
			let files = fs.readdirSync(obj.path);
			for(let k=0, m=files.length; k<m; k++){
				let file  = files[k];
				let _path = obj.path + '/' +  file;
				let ext   = path.extname(file).substr(1);
				if (fs.lstatSync(_path).isFile()) {
					if (isVideo(ext)) {
						_medias[obj.file].video = _path;
					} else if(isSubtitle(ext)) {
						_medias[obj.file][ext] = _path;
					} 
				} 
			}
		}
		callback(null, _medias);
	});
}

function createMediaObjectFromDBResponse(response) {
	let medias = {};
	for (let i = 0, l = response.length; i < l; i++) {
		medias[response[i].id] = response[i].doc.media;
	}
	return medias;
}

module.exports.scanMedia = function(options) {
	db.exist('medias', function(err, result) {
		if (!err && result) {
			console.log('DATABASE EXIST');
			db.createOrOpenDB('medias');
			db.getAllDocuments(function(err, result) {
				if (err) {
					console.error(err);
				} else {
					options.onScanEnd(createMediaObjectFromDBResponse(result));
				}
			});
		} else {
			console.log('DATABASE DOES NOT EXIST');
			walkDir(options.path, function(error, result) {
				if (!error) {
					metaDownloader.fetchMetadata(result, options.path, function(result) {
							options.onScanEnd(result);
							db.createOrOpenDB('medias');
							db.putDocuments(result, function(err, result){
								if (err) {
									console.error(err)
								} else {
									// console.log(result);
								}
							});
					});
				} else {
					console.error('error MediaScanner.js line 123 : ' + error);
				}
			});	
		}
	});

}