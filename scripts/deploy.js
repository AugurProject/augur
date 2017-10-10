// TODO -- exit deploy if actual errors occur -- right now getting false positives from git

const path = require('path');
const { eachOfSeries } = require('../node_modules/async');
const { spawn } = require('child_process');

const USER = process.env.DU;
const DEVELOPMENT_SERVERS = [
  process.env.IPFS1,
  process.env.IPFS2,
  process.env.IPFS3
];
const DEVELOPMENT_LOAD_BALANCER = process.env.DLB1;

const PRODUCTION_SERVERS = []; // TODO
const PRODUCTION_LOAD_BALANCER = ''; // TODO

const FLAGS = process.argv.filter(arg => arg.indexOf('--') !== -1);

const isProduction = FLAGS.indexOf('--prod') !== -1 || FLAGS.indexOf('--production') !== -1;

if (isProduction) {
  console.log('== DEPLOYING TO -- PRODUCTION SERVERS ==');

  eachOfSeries(
    PRODUCTION_SERVERS,
    (item, key, callback) => deployBuild(item, callback),
    e => e == null ?
      console.log('Succesfully deployed to all servers.') :
      console.log('Failed to deployed to all servers, code: ', e)
  );
} else {
  console.log('== DEPLOYING TO -- DEVELOPMENT SERVERS ==');

  eachOfSeries(
    DEVELOPMENT_SERVERS,
    (item, key, callback) => deployBuild(item, callback),
    e => {
      if (e != null) return console.log('Failed to deployed to all servers, code: ', e);

      console.log('Succesfully deployed to all servers.');
      purgeLoadBalancerCache(DEVELOPMENT_LOAD_BALANCER);
    }
  );
}

function deployBuild(server, callback) {
  console.log('Deploying to: ', server);

  const deploy = spawn('ssh',
    [
      `${USER}@${server}`,
      "echo '-- LOGGED IN --';",
      "echo '-- CHANGING DIRECTORY TO `ipfs-deploy` --';",
      "cd ~/ipfs-deploy;",
      "echo '-- REMOVING OLD BUILD --';",
      "rm -rf augur;",
      "echo '-- CLONING NEW BUILD --';",
      "git clone https://github.com/AugurProject/augur.git;",
      "echo '-- TRAVERSING INTO AUGUR --';",
      "cd ~/ipfs-deploy/augur;",
      "echo '-- CHECKING OUT CORRECT BRANCH --';",
      "git checkout v3;",
      "echo '-- ADDING BUILD TO IPFS --';",
      "export NEW_BUILD_HASH=$(/home/"+USER+"/bin/ipfs add -r build/ | tail -n 1 | awk '{print $2}');",
      "echo '-- PUBLISHING BUILD --';",
      "/home/"+USER+"/bin/ipfs name publish --key=augur-dev $NEW_BUILD_HASH;",
      "echo '-- UPDATE HASH FOR IPFS REPUBLISH CRON JOB --';",
      "echo $NEW_BUILD_HASH > ~/ipfs-deploy/NEW_BUILD_HASH;",
      "echo '-- PURGING NGINX CACHE --';",
      "cd /etc/nginx && sudo rm -rf ./cache/* && sudo mkdir ./cache/temp && sudo chown www-data ./cache/temp;",
      "sudo service nginx restart;"
    ]
  )

  deploy.stdout.on('data', data => console.log(`${data}`));
  deploy.stderr.on('data', data => console.log(`ERR -- ${data}`));

  deploy.on('close', (code) => {
    if (code === 0) {
      console.log(`App successfully deployed to ${server}.`);
      callback();
    } else {
      console.log(`App failed to deploy to ${server} -- code: ${code}`);
      callback(code);
    }
  });
}

function purgeLoadBalancerCache(server) {
  const purge = spawn('ssh',
    [
      `${USER}@${server}`,
      "echo '-- LOGGED IN --';",
      "echo '-- PURGING LOAD BALANCER NGINX CACHE --';",
      "cd /etc/nginx && sudo rm -rf ./cache/* && sudo mkdir ./cache/temp && sudo chown www-data ./cache/temp;",
      "sudo service nginx restart;"
    ]
  )

  purge.stdout.on('data', data => console.log(`${data}`));
  purge.stderr.on('data', data => console.log(`ERR -- ${data}`));

  purge.on('close', (code) => {
    if (code === 0) {
      console.log(`Load Balancer Cache Purged Successfully For: ${server}.`);
    } else {
      console.log(`Load Balancer Failed to Purge Cache For: ${server} -- code: ${code}`);
    }
  });
}
