import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers/build';
import { ParaAugurDeployer } from '@augurproject/core/build/libraries/ParaAugurDeployer';
import { ParaContractDeployer } from '@augurproject/core/build/libraries/ParaContractDeployer';
import { makeSigner, providerFromConfig } from '..';
import { FlashArguments, FlashSession } from './flash';

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

}
