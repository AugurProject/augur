import path from 'path';
import { spawn } from 'child_process';

// Iterate + deploy the build (either dev or production) to the respective machines
// Ref the key locally ONLY

// Arguements it should accept:
// env -- dev,prod
// user -- probably not now
//

const USER = 'ua';
const DEV_SERVERS = [
  '173.230.146.39', // IPFS Node 1
  '45.33.54.37', // IPFS Node 2
  '23.239.21.136' // IPFS Node 3
];

const PRODUCTION_SERVERS = []; // TODO

const FLAGS = process.argv.filter(arg => arg.indexOf('--'));

switch(FLAGS) {

}
