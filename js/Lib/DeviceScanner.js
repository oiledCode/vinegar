'use strict';

let ssdp    = require('node-ssdp').Client;
var client  = new ssdp();
let devices = [];

module.exports.discover = function() {
	client.on('response', function inResponse(headers, code, rinfo) {
		if (headers.USN.indexOf('RenderingControl') !== -1) { 
	  		devices.push(headers);
		}
	});
	client.search('urn:schemas-upnp-org:service:RenderingControl:1')
}

module.exports.getDevices = function() {
	return devices;
}