#!/usr/bin/env node

import { ethers } from 'ethers';
import { ContractDependenciesEthers } from '../libraries/ContractDependenciesEthers';
import { ContractDeployer } from "../libraries/ContractDeployer";
import { NetworkConfiguration } from "../libraries/NetworkConfiguration";
import { DeployerConfiguration } from "../libraries/DeployerConfiguration";
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';

export async function deployToNetworks(networks: Array<string>) {
    // Create all network configs up front so that an error in any of them
    // causes us to die
    const networkConfigurations = networks.map((network) => NetworkConfiguration.create(network));
    const deployerConfiguration = DeployerConfiguration.create();
    for(let network of networkConfigurations) {
        // Deploy sequentially
        const provider = new ethers.providers.JsonRpcProvider(network.http);
        const signer = await EthersFastSubmitWallet.create(<string>network.privateKey, provider);
        const dependencies = new ContractDependenciesEthers(provider, signer, network.gasPrice.toNumber());
        await ContractDeployer.deployToNetwork(network, dependencies, provider, signer, deployerConfiguration);
    }
}

if (require.main === module) {
    const networks: Array<string> = process.argv.slice(2);
    deployToNetworks(networks).then(() => {
        console.log("Deployment to all networks succeeded");
        process.exitCode = 0;
    }).catch((error) => {
        console.log("Deployment interrupted with error: ", error);
        process.exitCode = 1;
    });
}
