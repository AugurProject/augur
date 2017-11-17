#!/usr/bin/env node

"use strict";
const replace = require('replace-in-file');
/*
	usage: node replace-user <hash value>
	run in augur-node root dir
*/

if (process.argv.length != 3) throw new Error('usage: node replace-user <user hash>');
const user_hash = process.argv[2];

const options = {
	files: 'src/seeds/test/*',
	from: /0x0000000000000000000000000000000000000b0b/g,
	to: user_hash,
};

try {
	const changes = replace.sync(options);
	console.log('Modified files:', changes.join(', '));
} catch (error) {
	console.error('Error occurred:', error);
}

try {
	const changes = replace.sync({
		files: 'src/seeds/test/*',
		from: /0x000000000000000000000000000000000000000b/g,
		to: '0xa1d76546015cfe50183497ca65fcbd5c656f7813',
	});
	console.log('Modified files:', changes.join(', '));
} catch (error) {
	console.error('Error occurred:', error);
}
