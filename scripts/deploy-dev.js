const path = require('path');
const { spawn } = require('child_process');

const SSH_USER_HOST = 'augur@eth2.augur.net';

deployDev();

function deployDev() {
  const deploy = spawn('ssh',
    [
      `${SSH_USER_HOST}`,
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
      "git checkout seadragon;",
      "echo '-- ADDING BUILD TO IPFS --';",
      "export NEW_BUILD_HASH=$(/home/augur/go/bin/ipfs add -r build/ | tail -n 1 | awk '{print $2}');",
      "echo '-- PUBLISHING BUILD --';",
      "/home/augur/go/bin/ipfs name publish --key=augur-dev $NEW_BUILD_HASH;",
      "echo '-- UPDATE HASH FOR IPFS REPUBLISH CRON JOB --';",
      "echo $NEW_BUILD_HASH > ~/ipfs-deploy/NEW_BUILD_HASH;"
    ]
  )

  deploy.stdout.on('data', data => console.log(`${data}`));
  deploy.stderr.on('data', data => console.log(`ERR -- ${data}`));

  deploy.on('close', (code) => {
    if (code === 0) {
      console.log('App successfully deployed to IPFS.');
    } else {
      console.log(`App failed to deploy to IPFS -- code: ${code}`);
    }
  });
}
