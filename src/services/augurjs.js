if (process.env.NODE_ENV === 'dummy') {
	module.exports = require('./augurjs-dummy');
}
else {
	module.exports = require('./augurjs-real');
}