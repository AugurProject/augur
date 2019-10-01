#!/usr/bin/env node

import { ethers } from 'ethers';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { ContractDeployer } from "../libraries/ContractDeployer";
import { isNetwork, NetworkConfiguration, NETWORKS } from "../libraries/NetworkConfiguration";
import { CreateDeployerConfiguration } from "../libraries/DeployerConfiguration";
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';

export async function deployToNetworks(networks: Array<NETWORKS>) {
    // Create all network configs up front so that an error in any of them
    // causes us to die
    const networkConfigurations = networks.map((network) => NetworkConfiguration.create(network));
    for(let network of networkConfigurations) {
        // Deploy sequentially
        const deployerConfiguration = CreateDeployerConfiguration(network.networkName);
        const provider = new ethers.providers.JsonRpcProvider(network.http);
        const signer = await EthersFastSubmitWallet.create(<string>network.privateKey, provider);
        const dependencies = new ContractDependenciesEthers(provider, signer, signer.address);
        await ContractDeployer.deployToNetwork(network, dependencies, provider, signer, deployerConfiguration);
    }
}

if (require.main === module) {
    const networks = process.argv.slice(2).filter(isNetwork);
    deployToNetworks(networks).then(() => {
        console.log("Deployment to all networks succeeded");
        process.exitCode = 0;
    }).catch((error) => {
        console.log("Deployment interrupted with error: ", error);
        process.exitCode = 1;
    });
}
