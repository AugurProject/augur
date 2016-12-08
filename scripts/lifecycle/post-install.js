const execa = require('execa');

// Workaround for yarn's lifecycle script handling (failing in these cases)
execa.shell(`npm i airbitz-core-js-ui augur.js cssnano`);
