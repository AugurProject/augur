import * as path from 'path';
import { CompilerOutput } from 'solc';
import { BigNumber } from 'bignumber.js';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { EthersFastSubmitWallet } from '@augurproject/core';
import { ContractAddresses } from '@augurproject/artifacts';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { ContractDependenciesGnosis } from 'contract-dependencies-gnosis';
import { IGnosisRelayAPI } from '@augurproject/gnosis-relay-api';
import { ContractDeployer } from '@augurproject/core';

import { Account } from '../constants';
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
  config: SDKConfiguration
): Promise<UsefulContractObjects> {
  const signer = await makeSigner(account, provider);
  const dependencies = makeDependencies(account, provider, signer);

  const contractDeployer = new ContractDeployer(config, dependencies, provider.provider, signer, compiledContracts);
  const addresses = await contractDeployer.deploy(env);

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
