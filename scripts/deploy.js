// TODO -- exit deploy if actual errors occur -- right now getting false positives from git

const path = require('path');
const { eachOfSeries } = require('../node_modules/async');
const { spawn } = require('child_process');

// DEV SERVERS
const DEV_USER = process.env.DEV_USER;
const DEV_SERVERS = process.env.DEV_IPFS_NODES.split(' ');
const DEV_LOAD_BALANCER = process.env.DEV_LOAD_BALANCER;

// TODO PRODUCTION SERVERS
const PRODUCTION_USER = null;
const PRODUCTION_SERVERS = null;
const PRODUCTION_LOAD_BALANCER = null;

const FLAGS = JSON.parse(process.env.npm_config_argv).original.filter(arg => arg.indexOf('--') !== -1);

const isProduction = FLAGS.indexOf('--prod') !== -1 || FLAGS.indexOf('--production') !== -1;

const BRANCH = isProduction ? process.env.PRODUCTION_BRANCH : process.env.DEV_BRANCH;

if (isProduction) {
  console.log('== DEPLOYING TO -- PRODUCTION SERVERS ==');

  eachOfSeries(
    PRODUCTION_SERVERS,
    (item, key, callback) => deployBuild(item, PRODUCTION_USER, BRANCH, isProduction, callback),
    e => {
      if (e != null) return console.log('Failed to deployed to all servers, code: ', e);

      console.log('Succesfully deployed to all servers.');
      purgeLoadBalancerCache(PRODUCTION_LOAD_BALANCER, PRODUCTION_USER);
    }
  );
} else {
  console.log('== DEPLOYING TO -- DEVELOPMENT SERVERS ==');

  eachOfSeries(
    DEV_SERVERS,
    (item, key, callback) => deployBuild(item, DEV_USER, BRANCH, isProduction, callback),
    e => {
      if (e != null) return console.log('Failed to deployed to all servers, code: ', e);

      console.log('Succesfully deployed to all servers.');
      purgeLoadBalancerCache(DEV_LOAD_BALANCER, DEV_USER);
    }
  );
}

function deployBuild(server, user, branch, isProduction, callback) {
  console.log('Deploying to: ', server);

  const deploy = spawn('ssh',
    [
      `${user}@${server}`,
      "echo '-- LOGGED IN --';",
      "echo '-- BLOCKING INBOUND TRAFFIC --';",
      "sudo ufw deny 80 && sudo ufw status;",
      "echo '-- RESTARTING IPFS NODE --';",
      "systemctl --user restart ipfs;",
      "echo '-- CHANGING DIRECTORY TO `ipfs-deploy` --';",
      "cd ~/ipfs-deploy;",
      "echo '-- REMOVING OLD BUILD --';",
      "rm -rf augur;",
      "echo '-- CLONING NEW BUILD --';",
      "git clone https://github.com/AugurProject/augur.git;",
      "echo '-- TRAVERSING INTO AUGUR --';",
      "cd ~/ipfs-deploy/augur;",
      "echo '-- CHECKING OUT CORRECT BRANCH --';",
      `git checkout ${branch};`,
      "echo '-- BUILDING AUGUR --';",
      `npm i && npm run build${isProduction ? '' : ' --dev'};`,
      "echo '-- ADDING BUILD TO IPFS --';",
      "export NEW_BUILD_HASH=$(/home/"+user+"/bin/ipfs add -r build/ | tail -n 1 | awk '{print $2}');",
      "echo '-- PUBLISHING BUILD --';",
      "/home/"+user+"/bin/ipfs name publish --key=augur-dev $NEW_BUILD_HASH;",
      "echo '-- UPDATE HASH FOR IPFS REPUBLISH CRON JOB --';",
      "echo $NEW_BUILD_HASH > ~/ipfs-deploy/NEW_BUILD_HASH;",
      "echo '-- PURGING NGINX CACHE --';",
      "cd /etc/nginx && sudo rm -rf ./cache/* && sudo mkdir ./cache/temp && sudo chown www-data ./cache/temp;",
      "sudo service nginx restart;",
      "echo '-- ENABLING INBOUND TRAFFIC --';",
      "sudo ufw allow 80 && sudo ufw status;"
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

function purgeLoadBalancerCache(server, user) {
  const purge = spawn('ssh',
    [
      `${user}@${server}`,
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
