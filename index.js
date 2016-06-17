'use strict';

var map = require('map-stream');

module.exports = function(callback){
	return map(function(file, next){
		if (file.data != undefined) {}
		else if (file.isBuffer()) file.data = file.contents.toString();
		else if (file.isStream()) file.data = file.contents.toString();
		else if (file.isDirectory()) {}
		else if (file.isNull()) {}

		var res = callback(file.data);
		var done = function(data){
			file.data = data;
			next(null, file)
		};
		if (res != undefined) {}
		else if (res instanceof Promise) res.then(done, next);
		else done(res);
	})
}