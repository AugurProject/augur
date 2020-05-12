#!/usr/bin/env node

import { ethers } from 'ethers';
import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';
import { DeploymentVerifier } from '../libraries/DeploymentVerifier';
import { buildConfig } from '@augurproject/artifacts';

// the rest of the code in this file is for running this as a standalone script, rather than as a library
export async function verifyDeployment() {
    require('source-map-support').install();

    const config = buildConfig('mainnet');
    const provider = new ethers.providers.JsonRpcProvider(config.ethereum.http);
    const signer = await EthersFastSubmitWallet.create(
        config.deploy.privateKey as string,
        provider
    );
    const dependencies = new ContractDependenciesEthers(
        provider,
        signer,
        signer.address
    );

    const error = await DeploymentVerifier.verifyDeployment(
        dependencies,
        provider,
        config
    );
    if (error) {
        throw new Error(error);
    }
    console.log('Verification Succeeded!');
}

verifyDeployment()
    .then(() => {
        process.exitCode = 0;
    })
    .catch(error => {
        console.log(error);
        process.exitCode = 1;
    });
