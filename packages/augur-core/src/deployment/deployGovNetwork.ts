#!/usr/bin/env node

import { ethers } from 'ethers';
import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import { GovernanceDeployer } from '../libraries/GovernanceDeployer';
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';
import { buildConfig } from '@augurproject/artifacts';

export async function deployToNetwork(networkName: string) {
    const config = buildConfig(networkName);
    const provider = new ethers.providers.JsonRpcProvider(config.ethereum.http);
    const privateKey =
        config.deploy.privateKey || process.env.ETHEREUM_PRIVATE_KEY;
    const paraCash = process.env.PARA_CASH_ADDRESS;

    const signer = await EthersFastSubmitWallet.create(
        privateKey as string,
        provider
    );
    const dependencies = new ContractDependenciesEthers(
        provider,
        signer,
        signer.address
    );
    await GovernanceDeployer.deployToNetwork(
        networkName,
        config,
        dependencies,
        provider,
        signer,
        paraCash
    );
}

if (require.main === module) {
    if (!process.env.PARA_CASH_ADDRESS) {
        console.error(
            `Must specify a PARA_CASH_ADDRESS ENV variable for a parallel deploy`
        );
        process.exitCode = 1;
    }
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
