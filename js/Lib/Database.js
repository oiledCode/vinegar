'use strict';

let store;
let PouchDB = require('pouchdb');
require('pouchdb-all-dbs')(PouchDB);


module.exports.exist = function(dbname, cb) {
	PouchDB.allDbs(function (err, dbs) {
	  if (err) {
	  	cb(err, false);
	  }
	  return cb(null, (dbs.indexOf(dbname)!== -1) ) 
	});
}

module.exports.createOrOpenDB = function(dbname) {
	store = new PouchDB(dbname);
}

module.exports.deleteDB = function(dbname, cb) {

}

module.exports.getDocument = function(id, cb) {

}

module.exports.getAllDocuments = function(cb) {
	store.allDocs({
	  include_docs: true, 
	  attachments: true
	}).then(function (result) {
		cb(null, result.rows);
	}).catch(function (err) {
	  cb(err);
	});
}

module.exports.putDocuments = function(documents, cb) {
	let _documents = [];
	let _keys = [];
	Object.keys(documents).forEach(function(k, i){
		_documents.push( { _id: k.replace(/ /g, '_'), media: documents[k] } );
	});

	store.bulkDocs(_documents, function(err, result) {
		if (err) {
			console.error(err);
		} else {
			// console.log(result)
		}
	});
}


module.exports.alterDocument = function(id, value) {
	store.get(id).then(function(doc) {
	  return store.put({
	    _id: id,
	    _rev: doc._rev,
	    media: value
	  });
	}).then(function(response) {
	  // handle response
	  console.log(response)
	}).catch(function (err) {
	  console.log(err);
	});
}