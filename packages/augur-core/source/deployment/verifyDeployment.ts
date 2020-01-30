#!/usr/bin/env node

import { ethers } from 'ethers';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { CreateDeployerConfiguration } from '../libraries/DeployerConfiguration';
import { NetworkConfiguration } from '../libraries/NetworkConfiguration';
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';
import { DeploymentVerifier } from '../libraries/DeploymentVerifier';
import { getAddressesForNetwork, NetworkId } from '@augurproject/artifacts';


// the rest of the code in this file is for running this as a standalone script, rather than as a library
export async function verifyDeployment() {
    require('source-map-support').install();

    const networkConfiguration = NetworkConfiguration.create();
    const provider = new ethers.providers.JsonRpcProvider(networkConfiguration.http);
    const signer = await EthersFastSubmitWallet.create(<string>networkConfiguration.privateKey, provider);
    const dependencies = new ContractDependenciesEthers(provider, signer, signer.address);
    const network = await provider.getNetwork();
    const addresses = getAddressesForNetwork(network.chainId.toString() as NetworkId);

    const error = await DeploymentVerifier.verifyDeployment(addresses, dependencies, provider, CreateDeployerConfiguration(networkConfiguration.networkName));
    if (error) {
        throw new Error(error);
    }
    console.log("Verification Succeeded!");
}

verifyDeployment().then(() => {
    process.exitCode = 0;
}).catch(error => {
    console.log(error);
    process.exitCode = 1;
});
