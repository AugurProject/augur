import { CompilerOutput } from 'solc';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { EthersFastSubmitWallet } from '@augurproject/core';
import { ContractAddresses } from '@augurproject/artifacts';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
import { ContractDeployer } from '@augurproject/core';
import { HDNode } from 'ethers/utils';
import { Wallet } from 'ethers';

import { Account } from '../constants';
import { ContractDependenciesGSN } from 'contract-dependencies-gsn';
import { SDKConfiguration } from '@augurproject/artifacts';

export interface UsefulContractObjects {
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

  return { signer, dependencies, addresses };
}

export async function makeSigner(account: Account, provider: EthersProvider) {
  return EthersFastSubmitWallet.create(account.privateKey, provider);
}

export function makeDependencies(account: Account, provider: EthersProvider, signer: EthersFastSubmitWallet) {
  return new ContractDependenciesEthers(provider, signer, account.address);
}

export async function makeGSNDependencies(provider: EthersProvider, signer: EthersFastSubmitWallet, augurWalletRegistryAddress: string, ethExchangeAddress: string, wethAddress: string, cashAddress: string, address?: string): Promise<ContractDependenciesGSN> {
  return ContractDependenciesGSN.create(provider, signer, augurWalletRegistryAddress, ethExchangeAddress, wethAddress, cashAddress, address);
}

export class HDWallet {
  readonly node: HDNode.HDNode;
  constructor(readonly mnemonic: string) {
    this.node = HDNode.fromMnemonic(mnemonic);
  }

  generateAccounts(quantity: number, from = 0): Account[] {
    return Array.from(new Array(quantity).keys()).map((i) => {
      const hdAccount = this.node.derivePath(`m/${i+from}`)
      return { initialBalance: 0, address: hdAccount.address, privateKey: hdAccount.privateKey };
    })
  }

  static randomMnemonic(): string {
    return Wallet.createRandom().mnemonic
  }
}
