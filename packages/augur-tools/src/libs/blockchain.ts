import * as path from 'path';
import { CompilerOutput } from 'solc';
import { BigNumber } from 'bignumber.js';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { DeployerConfigurationOverwrite, CreateDeployerConfiguration, EthersFastSubmitWallet } from '@augurproject/core';
import { ContractAddresses } from '@augurproject/artifacts';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { ContractDeployer, NETID_TO_NETWORK } from '@augurproject/core';

import { Account } from '../constants';
import { ContractDependenciesGSN } from 'contract-dependencies-gsn';

const augurCorePath = path.join(__dirname, '../../../augur-core/');
const root = path.join(augurCorePath, '../augur-artifacts/src');
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

export async function makeGSNDependencies(provider: EthersProvider, signer: EthersFastSubmitWallet, augurWalletRegistryAddress: string, ethExchangeAddress: string, gasPrice?: BigNumber, address?: string): Promise<ContractDependenciesGSN> {
  return await ContractDependenciesGSN.create(provider, signer, augurWalletRegistryAddress, ethExchangeAddress, gasPrice, address);
}
