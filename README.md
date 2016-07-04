# gulp-flow

[![Build Status](https://travis-ci.org/shishidosoichiro/gulp-flow.svg?branch=master)](https://travis-ci.org/shishidosoichiro/gulp-flow)
[![Coverage Status](https://coveralls.io/repos/github/shishidosoichiro/gulp-flow/badge.svg?branch=master)](https://coveralls.io/github/shishidosoichiro/gulp-flow?branch=master)

set data(json, xml, ...etc) to 'data' property of vinyl object like gulp-data

```js
var flow = require('gulp-flow');
var Req = require('req');

var req = Req('http://localhost:3000/api').contentType('application/json');

src('./data/user/*.json')
.pipe(flow(
	String,
	JSON.parse,
	function(json){
		// iroiro
		...
		
		return json;
	},
	JSON.stringify,
	Buffer
))
.pipe(log)
```
