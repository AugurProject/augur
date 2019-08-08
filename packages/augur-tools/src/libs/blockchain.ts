import * as path from "path";
import { CompilerOutput } from "solc";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { DeployerConfigurationOverwrite, CreateDeployerConfiguration, EthersFastSubmitWallet } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { ContractDeployer } from "@augurproject/core";

import { Account } from "../constants";

const augurCorePath = path.join(__dirname, "../../../augur-core/");
const root = path.join(augurCorePath, "../augur-artifacts/src");
const flashDeployerConfigurationDefaults: DeployerConfigurationOverwrite = {
  contractInputPath: path.join(root, 'contracts.json'),
  contractAddressesOutputPath: path.join(root, 'addresses.json'),
  uploadBlockNumbersOutputPath: path.join(root, 'upload-block-numbers.json'),
};

export interface UsefulContractObjects {
  provider: EthersProvider;
  signer: EthersFastSubmitWallet;
  dependencies: ContractDependenciesEthers;
  addresses: ContractAddresses;
}

export async function deployContracts(provider: EthersProvider,  accounts: Account[], compiledContracts: CompilerOutput, config: DeployerConfigurationOverwrite): Promise<UsefulContractObjects> {
  config = Object.assign({}, flashDeployerConfigurationDefaults, config);
  const deployerConfiguration = CreateDeployerConfiguration(config);

  const signer = await makeSigner(accounts[0], provider);
  const dependencies = makeDependencies(accounts[0], provider, signer);

  const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, provider.provider, signer, compiledContracts);
  const addresses = await contractDeployer.deploy();

  return { provider, signer, dependencies, addresses };
}

export async function makeSigner(account: Account, provider: EthersProvider) {
  return EthersFastSubmitWallet.create(account.secretKey, provider);
}

export function makeDependencies(account: Account, provider: EthersProvider, signer: EthersFastSubmitWallet) {
  return new ContractDependenciesEthers(provider, signer, account.publicKey);
}
