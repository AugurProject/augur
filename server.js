// basic node-static server wrapper for app

var static = require('node-static'),
    http = require('http'),
    util = require('util');

var webroot = './app',
 	port = process.env.PORT || 8080 

var file = new(static.Server)(webroot, { cache: 600 });

http.createServer(function(req, res) {

  // static URIs
  var re = /\/(css|images|app\.js)/;

  // route to app if not static URI
  if (!req.url.match(re)) req.url = '/augur.html';

	file.serve(req, res, function(err, result) {

		if (err) {

    		console.error('Error serving %s - %s', req.url, err.message);

  			res.writeHead(err.status, err.headers);
  			res.end();

  		} else {

    		console.log('%s', req.url); 
  		}
	});

}).listen(port);

console.log('node-static running at http://localhost:%d', port);
