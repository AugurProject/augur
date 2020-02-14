import * as path from 'path';
import { CompilerOutput } from 'solc';
import { BigNumber } from 'bignumber.js';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { DeployerConfigurationOverwrite, CreateDeployerConfiguration, EthersFastSubmitWallet } from '@augurproject/core';
import { ContractAddresses } from '@augurproject/artifacts';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { IGnosisRelayAPI } from '@augurproject/gnosis-relay-api';
import { ContractDeployer, NETID_TO_NETWORK } from '@augurproject/core';

import { Account } from '../constants';

const augurCorePath = path.join(__dirname, '../../../augur-core/');
const root = path.join(augurCorePath, '../augur-artifacts/src');
const flashDeployerConfigurationDefaults: DeployerConfigurationOverwrite = {
  contractInputPath: path.join(root, 'contracts.json'),
  environmentsConfigOutputPath: path.join(root, 'environments.json'),
};

export interface UsefulContractObjects {
  provider: EthersProvider;
  signer: EthersFastSubmitWallet;
  dependencies: ContractDependenciesEthers;
  addresses: ContractAddresses;
}

export async function deployContracts(provider: EthersProvider,  account: Account, compiledContracts: CompilerOutput, config: DeployerConfigurationOverwrite): Promise<UsefulContractObjects> {
  config = Object.assign({}, flashDeployerConfigurationDefaults, config);
  const networkId = await provider.getNetworkId();
  const network = NETID_TO_NETWORK[networkId] || 'environment';
  const deployerConfiguration = CreateDeployerConfiguration(network, config);

  const signer = await makeSigner(account, provider);
  const dependencies = makeDependencies(account, provider, signer);

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

export function makeGnosisDependencies(provider: EthersProvider, gnosisRelay: IGnosisRelayAPI, signer: EthersFastSubmitWallet, gasToken?: string, gasPrice?: BigNumber, safeAddress?: string, address?: string) {
  return new ContractDependenciesGnosis(provider, gnosisRelay, signer, gasToken, gasPrice, safeAddress, address);
}
