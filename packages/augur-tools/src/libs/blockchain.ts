import { CompilerOutput } from 'solc';
import { BigNumber } from 'bignumber.js';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { EthersFastSubmitWallet } from '@augurproject/core';
import { ContractAddresses } from '@augurproject/artifacts';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { ContractDeployer } from '@augurproject/core';
import { Account } from '../constants';
import { ContractDependenciesGSN } from 'contract-dependencies-gsn';
import { SDKConfiguration } from '@augurproject/artifacts';

export interface UsefulContractObjects {
  provider: EthersProvider;
  signer: EthersFastSubmitWallet;
  dependencies: ContractDependenciesEthers;
  addresses: ContractAddresses;
}

export async function deployContracts(
  env: string,
  provider: EthersProvider,
  account: Account,
  compiledContracts: CompilerOutput,
  config: SDKConfiguration,
  serial = true,
): Promise<UsefulContractObjects> {
  const signer = await makeSigner(account, provider);
  const dependencies = makeDependencies(account, provider, signer);

  const contractDeployer = new ContractDeployer(config, dependencies, provider.provider, signer, compiledContracts);
  const addresses = await contractDeployer.deploy(env, serial);

  return { provider, signer, dependencies, addresses };
}

export async function makeSigner(account: Account, provider: EthersProvider) {
  return EthersFastSubmitWallet.create(account.secretKey, provider);
}

export function makeDependencies(account: Account, provider: EthersProvider, signer: EthersFastSubmitWallet) {
  return new ContractDependenciesEthers(provider, signer, account.publicKey);
}

export async function makeGSNDependencies(provider: EthersProvider, signer: EthersFastSubmitWallet, augurWalletRegistryAddress: string, ethExchangeAddress: string, gasPrice?: BigNumber, address?: string): Promise<ContractDependenciesGSN> {
  return ContractDependenciesGSN.create(provider, signer, augurWalletRegistryAddress, ethExchangeAddress, gasPrice, address);
}
