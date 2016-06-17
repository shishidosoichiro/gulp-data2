'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var es = require('event-stream');
var File = require('vinyl');

var data = require('../');
var file = new File({
	cwd: "/",
	base: "/test/",
	path: "/test/file.coffee",
	contents: new Buffer("test = 123")
});
var jsonfile = new File({
	cwd: "/",
	base: "/test/",
	path: "/test/file.json",
	contents: new Buffer('{"test": 123}')
});

describe('gulp-data2', function(){
	it('should give data only to callback.', function(){
		es.readArray([file])
		.pipe(data(function(data){
			data.should.equal('test = 123')
			return {data: data}
		}))
		.pipe(es.map(function(file){
			file.data.should.deep.equal({data: 'test = 123'});
		}))
	});

	it('should convert file contents to json easily.', function(){
		es.readArray([jsonfile])
		.pipe(data(JSON.parse))
		.pipe(data(function(data){
			data.should.deep.equal({test: 123})
		}))
	});
});
