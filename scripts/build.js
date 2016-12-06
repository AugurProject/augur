const shell = require('shelljs');
const Spinner = require('cli-spinner').Spinner;

const spinner = new Spinner('Building');
spinner.setSpinnerString(18);
spinner.setSpinnerTitle('Heyo...');
spinner.start();

shell.exec('echo test');
