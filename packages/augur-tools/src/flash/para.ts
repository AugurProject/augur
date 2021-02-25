import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import { ParaAugurDeployer } from '@augurproject/core/build/libraries/ParaAugurDeployer';
import { ParaContractDeployer } from '@augurproject/core/build/libraries/ParaContractDeployer';
import {makeDependencies, makeSigner, providerFromConfig} from '..';
import { FlashArguments, FlashSession } from './flash';
import {deployWethAMMContract} from '../libs/blockchain';
import { sanitizeConfig, ContractAddresses } from '@augurproject/utils';
import { updateConfig } from '@augurproject/artifacts';
import { ContractDeployer } from '@augurproject/core';
const compilerOutput = require('@augurproject/artifacts/build/contracts.json');


export function addParaScripts(flash: FlashSession) {
  flash.addScript({
    name: 'deploy-para-augur-factory',
    options: [],
    async call(this: FlashSession, args: FlashArguments) {
      const provider = await providerFromConfig(this.config);
      const signer = await makeSigner(this.accounts[0], provider);
      const dependencies = new ContractDependenciesEthers(
        provider,
        signer,
        signer.address
      );

      const deployer = new ParaContractDeployer(
        this.config,
        dependencies,
        provider,
        signer,
        compilerOutput,
      )
      await deployer.deploy(this.network);
    }
  });

  flash.addScript({
    name: 'deploy-para-augur',
    options: [
      {
        name: 'cash',
        abbr: 'c',
        description: 'address of ERC20 cash contract to point this para-augur at: THIS IS ONLY WETH RIGHT NOW',
        required: false,
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const cash = args.cash as string;

      const provider = await providerFromConfig(this.config);
      const signer = await makeSigner(this.accounts[0], provider);
      const dependencies = new ContractDependenciesEthers(
        provider,
        signer,
        signer.address
      );

      const deployer = new ParaAugurDeployer(
        this.config,
        dependencies,
        provider,
        signer,
        compilerOutput,
      )
      await deployer.deploy(this.network, cash);
    }
  });

  flash.addScript({
    name: 'deploy-WrappedShareTokenFactoryFactory',
    async call(this: FlashSession) {
      if (this.noProvider()) return;

      console.log('Deploying: ', sanitizeConfig(this.config).deploy);

      const signer = await makeSigner(this.accounts[0], this.provider);
      const dependencies = makeDependencies(this.accounts[0], this.provider, signer);

      const contractDeployer = new ContractDeployer(
        this.config,
        dependencies,
        this.provider.provider,
        signer,
        compilerOutput
      );

      const factory = await contractDeployer.uploadWrappedShareTokenFactoryFactory();
      const addresses: Partial<ContractAddresses> = {
        WrappedShareTokenFactoryFactory: factory
      }

      await updateConfig(this.network, {
        addresses
      });
    }
  });


}
