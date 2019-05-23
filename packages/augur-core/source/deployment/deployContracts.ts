#!/usr/bin/env node

import { ethers } from 'ethers';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { ContractDeployer } from "../libraries/ContractDeployer";
import { DeployerConfiguration } from '../libraries/DeployerConfiguration';
import { NetworkConfiguration } from '../libraries/NetworkConfiguration';
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';

// the rest of the code in this file is for running this as a standalone script, rather than as a library
export async function deployContracts() {
    require('source-map-support').install();

    const networkConfiguration = NetworkConfiguration.create();

    const provider = new ethers.providers.JsonRpcProvider(networkConfiguration.http);
    const signer = await EthersFastSubmitWallet.create(<string>networkConfiguration.privateKey, provider);
    const dependencies = new ContractDependenciesEthers(provider, signer, signer.address);

    await ContractDeployer.deployToNetwork(networkConfiguration, dependencies, provider, signer, DeployerConfiguration.create());
}

deployContracts().then(() => {
    process.exitCode = 0;
}).catch(error => {
    console.log(error);
    process.exitCode = 1;
});
