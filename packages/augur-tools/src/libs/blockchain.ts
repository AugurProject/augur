import * as path from "path";
import { CompilerOutput } from "solc";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { DeployerConfiguration, EthersFastSubmitWallet } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { ContractDeployer } from "@augurproject/core";

import { Account } from "../constants";

const augurCorePath = path.join(__dirname, "../../../augur-core/");

export function makeDeployerConfiguration(writeArtifacts = true) {
  const contractInputRoot = path.join(augurCorePath, "../augur-artifacts/src");
  const artifactOutputRoot = writeArtifacts ? path.join(augurCorePath, "../augur-artifacts/src") : null;
  const createGenesisUniverse = true;
  const useNormalTime = false;
  const isProduction = false;
  const augurAddress = "0xabc";
  const legacyRepAddress = "0xdef";
  return new DeployerConfiguration(
    contractInputRoot,
    artifactOutputRoot,
    augurAddress,
    createGenesisUniverse,
    isProduction,
    useNormalTime,
    legacyRepAddress
  );
}

export interface UsefulContractObjects {
  provider: EthersProvider;
  signer: EthersFastSubmitWallet;
  dependencies: ContractDependenciesEthers;
  addresses: ContractAddresses;
}

export async function deployContracts(provider: EthersProvider,  accounts: Account[], compiledContracts: CompilerOutput, writeArtifacts = false): Promise<UsefulContractObjects> {
  const signer = await makeSigner(accounts[0], provider);
  const dependencies = makeDependencies(accounts[0], provider, signer);

  const deployerConfiguration = makeDeployerConfiguration(writeArtifacts);
  const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, provider.provider, signer, compiledContracts);
  const addresses = await contractDeployer.deploy();

  return {provider, signer, dependencies, addresses};
}

export async function makeSigner(account: Account, provider: EthersProvider) {
  return EthersFastSubmitWallet.create(account.secretKey, provider);
}

export function makeDependencies(account: Account, provider: EthersProvider, signer: EthersFastSubmitWallet) {
  return new ContractDependenciesEthers(provider, signer, account.publicKey);
}
