import { CompilerOutput } from 'solc';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { EthersFastSubmitWallet, SideChainDeployer } from '@augurproject/core';
import { ContractAddresses } from '@augurproject/utils';
import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import { ContractDeployer } from '@augurproject/core';
import { HDNode } from '@ethersproject/hdnode';
import { Wallet } from 'ethers';

import { Account } from '../constants';
import { SDKConfiguration, SideChainDeploy, ParaDeploy } from '@augurproject/utils';
import {ParaContractDeployer} from '@augurproject/core/build/libraries/ParaContractDeployer';
import {ParaAugurDeployer} from '@augurproject/core/build/libraries/ParaAugurDeployer';


export interface UsefulContractObjects {
  addresses: ContractAddresses;
  uploadBlockNumber: number;
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

  const contractDeployer = new ContractDeployer(
    config,
    dependencies,
    provider.provider,
    signer,
    compiledContracts
  );

  const uploadBlockNumber = await contractDeployer.getBlockNumber();
  const addresses = await contractDeployer.deploy(env);

  return { addresses, uploadBlockNumber };
}

export async function deployParaContracts(
  env: string,
  provider: EthersProvider,
  account: Account,
  compiledContracts: CompilerOutput,
  config: SDKConfiguration
): Promise<SDKConfiguration> {
  const signer = await makeSigner(account, provider);
  const dependencies = makeDependencies(account, provider, signer);

  const deployer = new ParaContractDeployer(
    config,
    dependencies,
    provider,
    signer,
    compiledContracts,
  )
  return deployer.deploy(env);
}

export async function deployPara(
  env: string,
  provider: EthersProvider,
  account: Account,
  compiledContracts: CompilerOutput,
  config: SDKConfiguration,
  cashAddress: string
): Promise<ParaDeploy> {
  const signer = await makeSigner(account, provider);
  const dependencies = makeDependencies(account, provider, signer);

  const deployer = new ParaAugurDeployer(
    config,
    dependencies,
    provider,
    signer,
    compiledContracts,
  )
  return deployer.deploy(env, cashAddress);
}

export async function deploySideChainContracts(
  env: string,
  provider: EthersProvider,
  account: Account,
  compiledContracts: CompilerOutput,
  config: SDKConfiguration
): Promise<SideChainDeploy> {
  const signer = await makeSigner(account, provider);
  const dependencies = makeDependencies(account, provider, signer);
  const deployer = new SideChainDeployer(
    config,
    dependencies,
    provider,
    signer,
    compiledContracts
  );
  return deployer.deploy(env);
}

export async function makeSigner(account: Account, provider: EthersProvider) {
  return EthersFastSubmitWallet.create(account.privateKey, provider);
}

export function makeDependencies(
  account: Account,
  provider: EthersProvider,
  signer: EthersFastSubmitWallet
) {
  return new ContractDependenciesEthers(provider, signer, account.address);
}

export class HDWallet {
  readonly node: HDNode;
  constructor(readonly mnemonic: string) {
    this.node = HDNode.fromMnemonic(mnemonic);
  }

  generateAccounts(quantity: number, from = 0): Account[] {
    return Array.from(new Array(quantity).keys()).map(i => {
      const hdAccount = this.node.derivePath(`m/${i + from}`);
      return {
        initialBalance: 0,
        address: hdAccount.address,
        privateKey: hdAccount.privateKey,
      };
    });
  }

  static randomMnemonic(): string {
    return Wallet.createRandom().mnemonic.phrase;
  }
}
