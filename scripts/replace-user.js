#!/usr/bin/env node
"use strict";
const replace = require('replace-in-file');

if ( process.argv.length < 3 ) throw new Error('Pass in user hash as arguments');

process.argv.slice(2).map(function(user_hash) {
	const options = {
	  files: 'src/seeds/test/*',
	  from: /0x0000000000000000000000000000000000000b0b/g,
	  to: user_hash,
	};

	try {
	  const changes = replace.sync(options);
	  console.log('Modified files:', changes.join(', '));
	}
	catch (error) {
	  console.error('Error occurred:', error);
	}

});