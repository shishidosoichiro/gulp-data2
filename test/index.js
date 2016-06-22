'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should();
var es = require('event-stream');
var File = require('vinyl');

var data = require('../');
var string = data.string;

describe('gulp-data2', function(){
	var file;
	var jsonfile;
	beforeEach(function(){
		file = new File({
			cwd: "/",
			base: "/test/",
			path: "/test/file.coffee",
			contents: new Buffer("test = 123")
		});
		jsonfile = new File({
			cwd: "/",
			base: "/test/",
			path: "/test/file.json",
			contents: new Buffer('{"test": 123}')
		});
	})

	it('should give data only to callback.', function(done){
		es.readArray([file])
		.pipe(data(String))
		.pipe(data(function(data){
			data.should.equal('test = 123')
			return {data: data}
		}))
		.pipe(es.map(function(file, next){
			file.data.should.deep.equal({data: 'test = 123'});
			next();
		}))
		.on('end', done)
	});

	it('should receive promise from callback.', function(done){
		es.readArray([file])
		.pipe(data(String))
		.pipe(data(function(data){
			return new Promise(function(resolve, reject){
				resolve({data: data})
			})
		}))
		.pipe(es.map(function(file, next){
			file.data.should.deep.equal({data: 'test = 123'});
			next();
		}))
		.on('end', done)
	});

	it('should emit \'error\', if callback return rejected Promise.', function(done){
		es.readArray([file])
		.pipe(data(String))
		.pipe(data(function(data){
			return new Promise(function(resolve, reject){
				reject({err: data})
			})
		}))
		.on('error', function(e){
			e.should.deep.equal({err: 'test = 123'});
			done();
		})
		.pipe(es.map(function(file, next){
			done('not rejected.')
		}))
	});

	it('should convert file contents to json easily.', function(done){
		es.readArray([jsonfile])
		.pipe(data(String))
		.pipe(data(JSON.parse))
		.pipe(data(function(data){
			data.should.deep.equal({test: 123})
			data.test2 = 2345
			return data;
		}))
		.pipe(data(JSON.stringify))
		.pipe(data(Buffer))
		.pipe(es.map(function(file, next){
			var data = file.contents.toString();
			var json = JSON.parse(data);
			json.test.should.equal(123);
			json.test2.should.equal(2345);
			next();
		}))
		.on('end', done)
	});

	it('should flow functions.', function(done){
		es.readArray([jsonfile])
		.pipe(data(String, JSON.parse, function(data){
			return new Promise(function(resolve, reject){
				data.should.deep.equal({test: 123});
				data.test2 = 2345;
				resolve(data);
			});
		}, JSON.stringify, Buffer))
		.pipe(es.map(function(file, next){
			var data = file.contents.toString();
			var json = JSON.parse(data);
			json.test.should.equal(123);
			json.test2.should.equal(2345);
			next();
		}))
		.on('end', done)
	});

	it('should emit \'error\', if a callback reject a promise.', function(done){
		es.readArray([jsonfile])
		.pipe(data(String, JSON.parse, function(data){
			return new Promise(function(resolve, reject){
				reject('error!');
			});
		}, JSON.stringify, Buffer))
		.on('error', function(e){
			e.should.equal('error!')
			done()
		})
		.on('end', function(){
			done('failed')
		})
	});

	it('should emit \'error\', if a callback throw a error.', function(done){
		es.readArray([jsonfile])
		.pipe(data(String, JSON.parse, function(data){
			throw 'error!';
		}, JSON.stringify, Buffer))
		.on('error', function(e){
			e.should.equal('error!')
			done()
		})
		.on('end', function(){
			done('failed')
		})
	});

});
