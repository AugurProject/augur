import { ContractDeployer } from '@augurproject/core';
import { sanitizeConfig } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import {makeDependencies, makeSigner, NULL_ADDRESS} from '..';
import { FlashArguments, FlashSession } from './flash';

import { AMM } from '@augurproject/sdk-lite';
import { updateConfig } from '@augurproject/artifacts';

const compilerOutput = require('@augurproject/artifacts/build/contracts.json');

export function addAMMScripts(flash: FlashSession) {
  flash.addScript({
    name: 'deploy-amm-factory',
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

      const factory = await contractDeployer.uploadAMMContracts();

      await updateConfig(this.network, {
        addresses: { AMMFactory: factory }
      });
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
      const factory = new AMM(user.signer, this.config.addresses.AMMFactory);
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
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
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
      const user = await this.createUser(this.getAccount(), this.config);
      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = args.cash ? new BigNumber(args.cash as string) : new BigNumber(0);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);
      const recipient = args.recipient as string || user.account.address;

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.calculateExchangeAddress(market, paraShareToken, fee);

      await factory.doAddLiquidity(
        recipient,
        NULL_ADDRESS,
        false,
        market,
        paraShareToken,
        fee,
        cash,
        yesPercent,
        noPercent
      );
      const lpTokens = await factory.liquidityTokenBalance(amm, user.account.address);

      console.log(`AMM Exchange ${amm}; received ${lpTokens.toString()} LP tokens`);
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
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
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

      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const recipient = args.recipient as string || user.account.address;

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.calculateExchangeAddress(market, paraShareToken, fee);

      const originalLpTokens = await factory.liquidityTokenBalance(amm, user.account.address);
      await factory.doAddLiquidity(recipient, null, true, market, paraShareToken, fee, cash);
      const currentLpTokens = await factory.liquidityTokenBalance(amm, user.account.address);
      const gainedLpTokens = currentLpTokens.minus(originalLpTokens);

      console.log(`LP Tokens acquired: ${gainedLpTokens}`);
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
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
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

      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);
      const recipient = args.target as string || user.account.address;

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.calculateExchangeAddress(market, paraShareToken, fee);

      const originalLpTokens = await factory.liquidityTokenBalance(amm, user.account.address);
      await factory.doAddLiquidity(recipient, null, true, market, paraShareToken, fee, cash, yesPercent, noPercent);
      const currentLpTokens = await factory.liquidityTokenBalance(amm, user.account.address);
      const gainedLpTokens = currentLpTokens.minus(originalLpTokens);

      console.log(`LP Tokens acquired: ${gainedLpTokens}`);
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
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
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

      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);
      const recipient = args.target as string || user.account.address;

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(user.signer, this.config.addresses.AMMFactory);
      const lpTokens = await factory.getAddLiquidity(recipient, null, false, market, paraShareToken, fee, cash, yesPercent, noPercent);

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
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
      },
      {
        name: 'cash',
        abbr: 'c',
        description: 'How much cash you want to use to buy shares.',
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
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const yes = Boolean(args.yes);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.calculateExchangeAddress(market.address, paraShareToken, fee);

      const shares = await factory.getEnterPosition(amm, cash, yes, true);

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
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
      },
      {
        name: 'cash',
        abbr: 'c',
        description: 'How much cash you want to use to buy shares.',
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
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const yes = Boolean(args.yes);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.calculateExchangeAddress(market.address, paraShareToken, fee);

      const shares = await factory.getEnterPosition(amm, cash, yes, true);
      await factory.doEnterPosition(amm, cash, yes, shares);

      console.log(`You paid ${cash.toFixed()} cash for ${shares.toFixed()} ${yes ? 'yes' : 'no'} shares`);
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
      {
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
      },
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
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(user.signer, this.config.addresses.AMMFactory);
      const amm = await factory.calculateExchangeAddress(market.address, paraShareToken, fee);

      const lpTokens = await factory.exchangeLiquidity(amm);

      console.log(`Total LP tokens for ${amm}: ${lpTokens.toString()}`);
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
      {
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(this.provider, this.config.addresses.AMMFactory);
      const amm = await factory.exchangeAddress(market.address, paraShareToken, fee);
      console.log(`AMM address: ${amm}`);
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
      {
        name: 'fee',
        abbr: 'f',
        description: 'AMM fee, out of 1000. Default=3',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.createUser(this.getAccount(), this.config);

      const market = user.augur.contracts.marketFromAddress(args.market as string);
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const factory = new AMM(this.provider, this.config.addresses.AMMFactory);

      const maybeAddress = await factory.exchangeAddress(market.address, paraShareToken, fee);
      if (maybeAddress !== NULL_ADDRESS) {
        console.log(`AMM ${maybeAddress} exists`);
      } else {
        const ammAddress = await factory.calculateExchangeAddress(market.address, paraShareToken, fee);
        console.log(`AMM ${ammAddress} exists`);
      }


    }
  });

  flash.addScript({
    name: 'deploy-weth-amm',
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

      const ammFactory = this.config.addresses.AMMFactory;
      const weth = this.config.addresses.WETH9;
      const wethParaShareToken = this.config.paraDeploys[weth].addresses.ShareToken
      const wethAmm = await contractDeployer.uploadWethAMMContract(ammFactory, wethParaShareToken);
      console.log(`Deployed Weth AMM to: ${wethAmm}`);

      await updateConfig(this.network, {
        addresses: { WethWrapperForAMMExchange: wethAmm }
      });
    }
  });

}
