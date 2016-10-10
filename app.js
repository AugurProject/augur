var express = require('express');
var helmet = require('helmet');
var PROD_HOST = 'app.augur.net';

var app = express();
app.use(helmet());
// static handlers
app.use(express.static('build'));

// redirect production site to secure version
app.get('*', function(req,res,next) {
    if (req.headers['x-forwarded-proto'] != 'https' && req.get('host') == PROD_HOST) {
	    res.redirect('https://' + PROD_HOST + req.url);
    } 
    else {
        next();   // continue to other routes if we're not redirecting
    }
});


app.get('/', function(req, res) {
    console.log('loaded');
});

app.listen(process.env.PORT || 8080);