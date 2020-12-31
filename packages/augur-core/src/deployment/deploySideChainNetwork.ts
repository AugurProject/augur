#!/usr/bin/env node

const compilerOutput = require('@augurproject/artifacts/build/contracts.json');
import {Account, accountFromPrivateKey, deploySideChain} from '../libraries/SideChainDeployer';
import { buildConfig } from '@augurproject/artifacts';
import { Contracts } from '..';

export async function deployToNetwork(networkName: string) {
    const config = buildConfig(networkName);
    const account = accountFromPrivateKey(config.deploy.privateKey || process.env.ETHEREUM_PRIVATE_KEY);
    await deploySideChain(networkName, config, account, new Contracts(compilerOutput))
}

if (require.main === module) {
    if (process.argv.length < 3) {
        console.error(
            `Must pass in 2 args, the last of which is the network name. Given args: ${process.argv}`
        );
        process.exitCode = 1;
    } else {
        const network = process.argv[2] as string;
        deployToNetwork(network)
            .then(() => {
                console.log('Deployment to all networks succeeded');
                process.exitCode = 0;
            })
            .catch(error => {
                console.log('Deployment interrupted with error: ', error);
                process.exitCode = 1;
            });
    }
}
