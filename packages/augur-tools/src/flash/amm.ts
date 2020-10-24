import { ContractDeployer } from '@augurproject/core';
import { sanitizeConfig } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { makeDependencies, makeSigner } from '..';
import { FlashArguments, FlashSession } from './flash';

import {
  AMMFactory,
} from '@augurproject/sdk-lite';

const compilerOutput = require('@augurproject/artifacts/build/contracts.json');

export function addAMMScripts(flash: FlashSession) {
  flash.addScript({
    name: 'deploy-amm-factory',
    options: [],
    async call(this: FlashSession, args: FlashArguments) {
      const serial = !Boolean(args.parallel);
      if (this.noProvider()) return;

      this.pushConfig({ deploy: { serial }});
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

      await contractDeployer.uploadAMMContracts();
    }
  });

  flash.addScript({
    name: 'amm-approve-factory',
    options: [
      {
        name: 'amount',
        abbr: 'a',
        description: 'How many atto to approve for. Defaults to 1e48 (1e18 atto = 1 ETH, so that\'s a lot)',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);
      const amount = new BigNumber(args.amount as string || 1e48);

      // TODO support more than just weth
      const weth = user.augur.contracts.weth;
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);
      await weth.approve(factory.contract.address, amount);

      console.log(`Approved ${factory.contract.address} for ${amount.toFixed()} of ${weth.address}`);
    }
  });

  flash.addScript({
    name: 'make-amm-market',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market.',
        required: true,
      },
      {
        name: 'cash',
        abbr: 'c',
        description: 'How much cash to add as initial liquidity. Denominated in atto cash (like wei).',
      },
      {
        name: 'ratio',
        abbr: 'r',
        description: 'Percentage of YES shares for initial liquidity. [0,100]. Defaults to 50.',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const market = args.market as string;
      const cash = args.cash ? new BigNumber(args.cash as string) : new BigNumber(0);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const user = await this.createUser(this.getAccount(), this.config);
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);

      const { amm, lpTokens } = await factory.addAMM(market, paraShareToken, cash, yesPercent, noPercent);
      console.log(`AMM Exchange ${amm.address}; received ${lpTokens.toString()} LP tokens`);
    }
  });

  flash.addScript({
    name: 'amm-add-liquidity',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
      {
        name: 'cash',
        abbr: 'c',
        description: 'How much cash to add as liquidity. Denominated in atto (like wei but for any collateral type).',
        required: true,
      },
      {
        name: 'recipient',
        abbr: 'r',
        description: 'Which address to send LP tokens to. Defaults to you.'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const cash = new BigNumber(args.cash as string);
      const recipient = args.recipient as string || user.account.address;

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.getAMMExchange(market.address, paraShareToken);

      const lpTokens = await amm.addLiquidity(recipient, cash);

      console.log(`LP Tokens acquired: ${lpTokens}`);
    }
  });

  flash.addScript({
    name: 'amm-add-initial-liquidity',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
      {
        name: 'cash',
        abbr: 'c',
        description: 'How much cash to add as liquidity. Denominated in atto (like wei but for any collateral type).',
        required: true,
      },
      {
        name: 'ratio',
        abbr: 'r',
        description: 'Percentage of YES shares for initial liquidity. [0,100]. Defaults to 50.',
      },
      {
        name: 'target',
        abbr: 't',
        description: 'Which address to send LP tokens to. Defaults to you.'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const cash = new BigNumber(args.cash as string);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);
      const recipient = args.target as string || user.account.address;

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.getAMMExchange(market.address, paraShareToken);

      const lpTokens = await amm.addInitialLiquidity(recipient, cash, yesPercent, noPercent);

      console.log(`LP Tokens acquired: ${lpTokens}`);
    }
  });

  flash.addScript({
    name: 'amm-calc-initial-liquidity',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
      {
        name: 'cash',
        abbr: 'c',
        description: 'How much cash to add.',
        required: true,
      },
      {
        name: 'ratio',
        abbr: 'r',
        description: 'Percentage of YES shares for initial liquidity. [0,100]. Defaults to 50.',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const cash = new BigNumber(args.cash as string);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);
      const recipient = args.target as string || user.account.address;

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.getAMMExchange(market.address, paraShareToken);

      const lpTokens = await amm.rateAddInitialLiquidity(recipient, cash, yesPercent, noPercent);

      console.log(`LP Tokens you would acquire: ${lpTokens}`);
    }
  });

  flash.addScript({
    name: 'amm-calc-enter-position',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
      {
        name: 'shares',
        abbr: 's',
        description: 'How many atto shares you want.',
        required: true,
      },
      {
        name: 'yes',
        abbr: 'y',
        description: 'Specify if you want to buy Yes shares. Else, you get No shares.',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const shares = new BigNumber(args.shares as string);
      const yes = Boolean(args.yes);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.getAMMExchange(market.address, paraShareToken);

      const cash = await amm.enterPosition(shares, yes, true);

      console.log(`Cash needed to get "${shares.toFixed()}" shares: ${cash.toFixed()}`);
    }
  });

  flash.addScript({
    name: 'amm-enter-position',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
      {
        name: 'shares',
        abbr: 's',
        description: 'How many atto shares you want.',
        required: true,
      },
      {
        name: 'yes',
        abbr: 'y',
        description: 'Specify if you want to buy Yes shares. Else, you get No shares.',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const shares = new BigNumber(args.shares as string);
      const yes = Boolean(args.yes);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.getAMMExchange(market.address, paraShareToken);

      const cash = await amm.enterPosition(shares, yes);

      console.log(`You paid ${cash.toFixed()} cash for ${shares.toFixed()} ${yes ? 'yes' : 'no'} shares`);
    }
  });

  flash.addScript({
    name: 'amm-price',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);
      const market = user.augur.contracts.marketFromAddress(args.market as string);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.getAMMExchange(market.address, paraShareToken);

      const price = await amm.price()
      console.log(`AMM Price: ${price.toString()}`)
    }
  });

  flash.addScript({
    name: 'amm-total-liquidity',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);
      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.getAMMExchange(market.address, paraShareToken);

      const lpTokens = await amm.totalSupply()

      console.log(`Total LP tokens for ${amm.address}: ${lpTokens.toString()}`);
    }
  });

  flash.addScript({
    name: 'amm-address',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(this.provider, this.config.addresses.AMMFactory);
      const amm = await factory.getAMMExchange(market.address, paraShareToken);
      console.log(`AMM address: ${amm.contract.address}`);
    }
  });

  flash.addScript({
    name: 'amm-exists',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'Address of Market. Used to calculate AMM address.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMMFactory(this.provider, this.config.addresses.AMMFactory);

      const exists = await factory.ammExists(market.address, paraShareToken);
      const ammAddress = await factory.ammAddress(market.address, paraShareToken);
      console.log(`AMM ${ammAddress} ${exists? 'exists' : 'does not exist'}`);
    }
  });
}
