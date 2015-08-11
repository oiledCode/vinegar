'use strict';
let fs             = require('fs');
let path           = require('path');
let db             = require('./Database.js');
let metaDownloader = require('./MediaMetadataDownloader.js');
let ptn            = require('parse-torrent-name');
let Media          = require('../models/Media.js')


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
function normalizeDirName(dirname) {
	return dirname.replace(/ /g, '_');
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
		    let ndn   = normalizeDirName(file)

			
			if (fs.lstatSync(_path).isDirectory()) {
				let dirContent = fs.readdirSync(_path);
				_medias[ndn] = new Media();
				_medias[ndn].setPath(_path);
				_medias[ndn].setDefaultPoster(__dirname + '/defaultPoster.jpg'); // this path is wrong !!
				for(let j = 0, k = dirContent.length; j < k; j++) {
					let entry     = dirContent[j];
					let entryPath = _path + '/' + entry;
					let ext       = path.extname(entry).substr(1);
					if(fs.lstatSync(entryPath).isFile()){
						if (isVideo(ext)) {
							_medias[ndn].setVideo(entry);
							_medias[ndn].setMediaInfo(ptn(entry));
						} else if(isSubtitle(ext)){
							_medias[ndn].setSubTitles(entry, ext);
						}
					} 
				}
			} else {
				// handle the simple file case
			}
		}
		console.log(_medias);
		callback(null, _medias);
	});
}

function createMediaObjectFromDBResponse(response) {
	let medias = {};
	for (let i = 0, l = response.length; i < l; i++) {
		medias[response[i].id] = new Media(response[i].doc.media);//response[i].doc.media;
	}
	console.log(medias);
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