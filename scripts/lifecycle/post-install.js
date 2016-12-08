const shell = require('shelljs');

// Workaround for yarn's lifecycle script handling (failing in these cases)
shell.exec(`npm i airbitz-core-js-ui augur.js cssnano`);
