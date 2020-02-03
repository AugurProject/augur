#!/usr/bin/env node

import { ethers } from 'ethers';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { ContractDeployer } from "../libraries/ContractDeployer";
import { isNetwork, NetworkConfiguration, NETWORKS } from "../libraries/NetworkConfiguration";
import { CreateDeployerConfiguration } from "../libraries/DeployerConfiguration";
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';

export async function deployToNetwork(networkName: NETWORKS) {
    const network = NetworkConfiguration.create(networkName);
    const deployerConfiguration = CreateDeployerConfiguration(network.networkName);
    const provider = new ethers.providers.JsonRpcProvider(network.http);
    const signer = await EthersFastSubmitWallet.create(<string>network.privateKey, provider);
    const dependencies = new ContractDependenciesEthers(provider, signer, signer.address);
    await ContractDeployer.deployToNetwork(network, dependencies, provider, signer, deployerConfiguration);
}

if (require.main === module) {
    const network = process.argv[2];
    deployToNetwork(network as NETWORKS).then(() => {
        console.log("Deployment to all networks succeeded");
        process.exitCode = 0;
    }).catch((error) => {
        console.log("Deployment interrupted with error: ", error);
        process.exitCode = 1;
    });
}
