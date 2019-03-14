import { EthersProvider } from "ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { DeployerConfiguration, ContractDeployer } from "@augurproject/core";
import * as path from 'path';
import * as ganache from "ganache-core";
import { CompilerConfiguration} from "@augurproject/core/source/libraries/CompilerConfiguration";
import { ContractCompiler } from "@augurproject/core/source/libraries/ContractCompiler";
import { EthersFastSubmitWallet } from "@augurproject/core/source/libraries/EthersFastSubmitWallet";


export type AccountList = [{
      secretKey: string;
      publicKey: string;
      balance: number;
}];

export async function makeTestAugur(accounts: AccountList): Promise<Augur<any>> {
    const ganacheProvider = ganache.provider({
      accounts,
      // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
      allowUnlimitedContractSize: true,
      gasLimit: 75000000000,
      // vmErrorsOnRPCResponse: true,
    });
    const provider = new EthersProvider(ganacheProvider, 5, 0, 40);
    const signer = await EthersFastSubmitWallet.create(accounts[0].secretKey, provider);
    const dependencies = new ContractDependenciesEthers(provider, signer, accounts[0].publicKey);

    const compilerConfiguration = makeCompilerConfiguration();
    const contractCompiler = new ContractCompiler(compilerConfiguration);
    const compiledContracts = await contractCompiler.compileContracts();

    const deployerConfiguration = makeDeployerConfiguration();
    const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, ganacheProvider, signer, compiledContracts);
    const addresses = await contractDeployer.deploy();

    return Augur.create(provider, dependencies, addresses);
}

function makeCompilerConfiguration() {
    const augurCorePath = path.join(__dirname, "../../../augur-core/");
    const contractSourceRoot = path.join(augurCorePath, "source/contracts/");
    const outputRoot = path.join(augurCorePath, "output/contracts/");
    const useFlattener = false;  // TODO make flattener bin specifiable so this can be true
    const enableSdb = false;  // causes solc errors if true
    return new CompilerConfiguration(contractSourceRoot, outputRoot, enableSdb, useFlattener);
}

function makeDeployerConfiguration() {
    const augurCorePath = path.join(__dirname, "../../../augur-core/");
    const contractInputRoot = path.join(augurCorePath, "output/contracts");
    const artifactOutputRoot  = path.join(augurCorePath, "output/contracts");
    const createGenesisUniverse = true;
    const useNormalTime = false;
    const isProduction = false;
    const augurAddress = "0xabc";
    const legacyRepAddress = "0xdef";
    return new DeployerConfiguration(contractInputRoot, artifactOutputRoot, augurAddress, createGenesisUniverse, isProduction, useNormalTime, legacyRepAddress);
}
