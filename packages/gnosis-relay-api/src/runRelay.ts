/*
 We need to do the following here:
 1. Identify currently running network ID and grab the safe contract address.
 2. Set 'SAFE_CONTRACT_ADDRESS' env var with above value
 3. Identify currently running network ID and ProxyFactory contract address.
 4. 'SAFE_PROXY_FACTORY_ADDRESS'
 3. Set 'DEPLOY_MASTER_COPY_ON_INIT' to 0
 4.
 */
import { ContractAddresses } from '@augurproject/artifacts';

const util = require('util');
const { spawnSync } = require('child_process');
const exec = util.promisify(require('child_process').exec);

type ContractNames = keyof ContractAddresses;
async function getContractAddress(contractName: ContractNames) {
  const address = await exec(
    `/usr/bin/env yarn --silent workspace @augurproject/tools flash run get-contract-address -n ${contractName}`
  );
  return address.stdout.split('\n')[1];
}

// const os = require( 'os' );
// const networkInterfaces = os.networkInterfaces( );
//
// console.log( networkInterfaces );

(async () => {
  const gnosisSafeAddress = await getContractAddress('GnosisSafe');
  const proxyFactoryAddress = await getContractAddress('ProxyFactory');

  spawnSync(
    'docker-compose -f support/gnosis/docker-compose.yml up',
    {
      env: {
        SAFE_CONTRACT_ADDRESS: gnosisSafeAddress,
        SAFE_PROXY_FACTORY_ADDRESS: proxyFactoryAddress,
        DEPLOY_MASTER_COPY_ON_INIT: 0,
        ETHEREUM_NODE_URL: 'http://127.0.0.1:8545'
      },
      shell: true,
      stdio: 'inherit'
    }
  );
})();
