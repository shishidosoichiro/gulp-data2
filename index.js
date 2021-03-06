'use strict';

var map = require('map-stream');
var Stream = require('stream').Stream;
var flow = require('flow');

var slice = function(array, begin, end){
	return Array.prototype.slice.call(array, begin, end);
};

var data = module.exports = function(callbacks){
	callbacks = slice(arguments);

	return map(function(file, next){
		var resolve = function(data){
			file.data = data;
			if (data instanceof Buffer) file.contents = data;
			else if (data instanceof Stream) file.contents = data;
			next(null, file)
		};

		// if directory, do nothing.
		if (file.isDirectory()) return next(null, file);

		// if no data, set contents to data.
		if (file.data === undefined) file.data = file.contents;

		var res = flow(callbacks)(file.data);
		if (res instanceof Promise) return res.then(resolve, next);
		else return resolve(res);
	})
};
