import { ethers } from 'ethers';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { CompilerConfiguration } from '../libraries/CompilerConfiguration';
import { ContractCompiler } from '../libraries/ContractCompiler';
import { ContractDeployer } from '../libraries/ContractDeployer';
import { DeployerConfiguration } from '../libraries/DeployerConfiguration';
import { NetworkConfiguration } from '../libraries/NetworkConfiguration';
import { EthersFastSubmitWallet } from '../libraries/EthersFastSubmitWallet';
require('source-map-support').install();

async function doWork(): Promise<void> {
    const compilerConfiguration = CompilerConfiguration.create();
    const contractCompiler = new ContractCompiler(compilerConfiguration);
    const compiledContracts = await contractCompiler.compileContracts();

    const networkConfiguration = NetworkConfiguration.create();

    const provider = new ethers.providers.JsonRpcProvider(networkConfiguration.http);
    const signer = await EthersFastSubmitWallet.create(<string>networkConfiguration.privateKey, provider);
    const dependencies = new ContractDependenciesEthers(provider, signer, signer.address);

    const deployerConfiguration = DeployerConfiguration.create();
    const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, provider, signer, compiledContracts);
    await contractDeployer.deploy();
}

doWork().then(() => {
    process.exit();
}).catch(error => {
    console.log(error);
    process.exit();
});
