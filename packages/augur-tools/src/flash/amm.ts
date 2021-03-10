import { ContractDeployer } from '@augurproject/core';
import { sanitizeConfig } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { makeDependencies, makeSigner, NULL_ADDRESS } from '..';
import { FlashArguments, FlashSession } from './flash';

import { AMM, SignerOrProvider } from '@augurproject/sdk-lite';
import { updateConfig } from '@augurproject/artifacts';
import {ContractAddresses, SDKConfiguration} from '@augurproject/utils';
import {deployWethAMMContract} from '../libs/blockchain';

const compilerOutput = require('@augurproject/artifacts/build/contracts.json');

export function addAMMScripts(flash: FlashSession) {
  flash.addScript({
    name: 'deploy-amm-factory',
    options: [
      {
        name: 'skipETHWrapper',
        abbr: 'E',
        description: 'Do NOT deploy the eth wrapper.',
        flag: true
      },
      {
        name: 'skipShareWrapper',
        abbr: 'S',
        description: 'Do NOT deploy the share token wrapper.',
        flag: true
      },
      {
        name: 'skipBFactory',
        abbr: 'B',
        description: 'Do NOT deploy the balancer factory.',
        flag: true
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const deployETHWrapper = !Boolean(args.skipETHWrapper);
      const deployShareWrapper = !Boolean(args.skipShareWrapper);
      const deployBFactory = !Boolean(args.skipShareWrapper);
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

      const bFactory = deployBFactory
        ? await contractDeployer.uploadBFactory()
        : this.config.addresses.BFactory
      if (!bFactory) return console.error('Must deploy BFactory: omit -skipBFactory (-B).');

      const shareWrapper = deployShareWrapper
        ? await contractDeployer.uploadWrappedShareTokenFactory()
        : this.config.addresses.WrappedShareTokenFactory
      if (!shareWrapper) return console.error('Must deploy WrappedShareTokenFactory: omit -skipShareWrapper (-S).');

      const factory = await contractDeployer.uploadAMMContracts(bFactory, shareWrapper);
      const addresses: Partial<ContractAddresses> = {
        AMMFactory: factory,
        BFactory: bFactory,
        WrappedShareTokenFactory: shareWrapper
      }

      if (deployETHWrapper) {
        const wrapper = await deployWethAMMContract(this.provider, this.accounts[0], compilerOutput, this.config);
        console.log(`Deployed Weth AMM to: ${wrapper}`);
        addresses.WethWrapperForAMMExchange = wrapper;
      }

      await updateConfig(this.network, {
        addresses
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
      await weth.approve(this.config.addresses.AMMFactory, amount);

      console.log(`Approved ${this.config.addresses.AMMFactory} for ${amount.toFixed()} of ${weth.address}`);
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
      {
        name: 'symbol',
        abbr: 's',
        description: 'The symbol root to use for the erc20 token names.'
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const account = this.getAccount().address;
      const market = args.market as string;
      const symbol = args.symbol as string || 'unknown';
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = args.cash ? new BigNumber(args.cash as string) : new BigNumber(0);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);
      const recipient = args.recipient as string || account;

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);
      const address = await amm.calculateExchangeAddress(market, paraShareToken, fee);

      await amm.doAddLiquidity(
        recipient,
        NULL_ADDRESS,
        false,
        market,
        paraShareToken,
        fee,
        cash,
        yesPercent,
        noPercent,
        symbol
      );
      const lpTokens = await amm.liquidityTokenBalance(market, paraShareToken, fee, account);

      console.log(`AMM Exchange ${address}; received ${lpTokens.toString()} LP tokens`);
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
      {
        name: 'symbol',
        abbr: 's',
        description: 'The symbol root to use for the erc20 token names.'
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const account = this.getAccount().address;

      const market = args.market as string;
      const symbol = args.symbol as string || 'unknown';
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const recipient = args.recipient as string || account;

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);

      const originalLpTokens = await amm.liquidityTokenBalance(market, paraShareToken, fee, account);
      await amm.doAddLiquidity(recipient, null, true, market, paraShareToken, fee, cash, new BigNumber(50), new BigNumber(50), symbol);
      const currentLpTokens = await amm.liquidityTokenBalance(market, paraShareToken, fee, account);
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
      {
        name: 'symbol',
        abbr: 's',
        description: 'The symbol root to use for the erc20 token names.'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const account = this.getAccount().address;

      const market = args.market as string;
      const symbol = args.symbol as string || 'unknown';
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);
      const recipient = args.target as string || account;

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);

      const originalLpTokens = await amm.liquidityTokenBalance(market, paraShareToken, fee, account);
      await amm.doAddLiquidity(recipient, null, true, market, paraShareToken, fee, cash, yesPercent, noPercent, symbol);
      const currentLpTokens = await amm.liquidityTokenBalance(market, paraShareToken, fee, account);
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
      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const yesPercent = args.ratio ? new BigNumber(args.ratio as string) : new BigNumber(50);
      const recipient = args.target as string || this.getAccount().address;

      if (yesPercent.lt(0) || yesPercent.gt(100)) throw Error(`make-amm-market --ratio must be between 0 and 100 (inclusive), not ${args.ratio as string}`);
      const noPercent = new BigNumber(100).minus(yesPercent);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);
      const ZERO = new BigNumber(0);
      const { lpTokens } = await amm.getAddLiquidity(ZERO, ZERO, ZERO, cash, yesPercent, noPercent);

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
      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const yes = Boolean(args.yes);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);
      const shares = await amm.getEnterPosition(market, paraShareToken, fee, cash, yes, true);

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
      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const cash = new BigNumber(args.cash as string);
      const yes = Boolean(args.yes);

      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);

      const shares = await amm.getEnterPosition(market, paraShareToken, fee, cash, yes, true);
      await amm.doEnterPosition(market, paraShareToken, fee, cash, yes, shares);

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
      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);

      const address = await amm.calculateExchangeAddress(market, paraShareToken, fee);
      const lpTokens = await amm.supplyOfLiquidityTokens(market, paraShareToken, fee);

      console.log(`Total LP tokens for ${address}: ${lpTokens.toString()}`);
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
        description: 'AMM fee, out of 1000. Default=0',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(0) : new BigNumber(args.fee as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);
      const address = await amm.exchangeAddress(market, paraShareToken, fee);
      console.log(`AMM address: ${address}`);
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
      const market = args.market as string;
      const fee = typeof args.fee === 'undefined' ? new BigNumber(3) : new BigNumber(args.fee as string);
      const paraShareToken = this.config.paraDeploys[this.config.paraDeploy].addresses.ShareToken;
      const amm = ammMiddleware(this.provider, this.config);

      const maybeAddress = await amm.exchangeAddress(market, paraShareToken, fee);
      if (maybeAddress !== NULL_ADDRESS) {
        console.log(`AMM ${maybeAddress} exists`);
      } else {
        const ammAddress = await amm.calculateExchangeAddress(market, paraShareToken, fee);
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

      const address = await deployWethAMMContract(this.provider, this.accounts[0], compilerOutput, this.config);
      console.log(`Deployed Weth AMM to: ${address}`);

      await updateConfig(this.network, {
        addresses: { WethWrapperForAMMExchange: address }
      });
    }
  });

}


function ammMiddleware(signerOrProvider: SignerOrProvider, config: SDKConfiguration) {
  const factory = config.addresses.AMMFactory;
  const wrapper = config.addresses.WethWrapperForAMMExchange;
  const wethParaShareTokenAddress = config?.paraDeploys[config.addresses.WETH9]?.addresses.ShareToken;
  return new AMM(signerOrProvider, wethParaShareTokenAddress, factory, wrapper);
}
