const path = require('path');
const shell = require('shelljs');

const srcPath = path.resolve(__dirname, '../src');
const testPath = path.resolve(__dirname, '../test');

shell.exec(`eslint --ext .js .jsx ${srcPath}`);
shell.exec(`eslint --ext .js ${testPath}`);
shell.exec(`stylelint '${srcPath}/**/*.less'`);
