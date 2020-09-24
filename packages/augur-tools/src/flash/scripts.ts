import { abiV1, buildConfig, refreshSDKConfig } from '@augurproject/artifacts';
import { ContractInterfaces } from '@augurproject/core';
import {
  ContractEvents,
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  convertOnChainPriceToDisplayPrice,
  createClient,
  createServer,
  NativePlaceTradeDisplayParams,
  QUINTILLION,
  stringTo32ByteHex,
} from '@augurproject/sdk';
import {
  MarketList,
  NumOutcomes,
  SubscriptionEventName,
} from '@augurproject/sdk-lite';
import { SingleThreadConnector } from '@augurproject/sdk/build/connector';
import { flattenZeroXOrders } from '@augurproject/sdk/build/state/getter/ZeroXOrdersGetters';
import {
  createApp,
  runHttpServer,
  runHttpsServer,
} from '@augurproject/sdk/build/state/HTTPEndpoint';
import {
  runWsServer,
  runWssServer,
} from '@augurproject/sdk/build/state/WebsocketEndpoint';
import { printConfig, sanitizeConfig } from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { spawn, spawnSync } from 'child_process';
import { ethers } from 'ethers';
import { formatBytes32String } from 'ethers/utils';
import * as CIDTool from 'cid-tool';

import * as fs from 'fs';
import * as IPFS from 'ipfs';
import moment from 'moment';
import * as path from 'path';
import {
  ACCOUNTS,
  ContractAPI,
  deployContracts,
  makeSigner,
  providerFromConfig,
  startGanacheServer,
} from '..';
import { _1_ETH, BASE_MNEMONIC } from '../constants';
import { runChaosMonkey } from './chaos-monkey';
import {
  createBadTemplatedMarkets,
  createCannedMarkets,
  createTemplatedBettingMarkets,
  createTemplatedMarkets,
} from './create-canned-markets-and-orders';
import {
  createCatZeroXOrders,
  createScalarZeroXOrders,
  createSingleCatZeroXOrder,
  createYesNoZeroXOrders,
} from './create-orders';
import { dispute } from './dispute';
import { FlashArguments, FlashSession } from './flash';
import { fork } from './fork';
import { generateTemplateValidations } from './generate-templates';
import { getMarketIds } from './get-market-ids';
import { orderFirehose } from './order-firehose';
import { simpleOrderbookShaper } from './orderbook-shaper';
import { perfSetup } from './perf-setup';
import {
  AccountCreator,
  createOrders,
  getAllMarkets,
  setupOrderBookShapers,
  setupOrders,
  setupPerfConfigAndZeroX,
  takeOrder,
  takeOrders,
} from './performance';
import { showTemplateByHash, validateMarketTemplate } from './template-utils';
import {
  formatAddress,
  getOrCreateMarket,
  sleep,
  waitForSigint,
  waitForSync,
} from './util';

const compilerOutput = require('@augurproject/artifacts/build/contracts.json');

const UNIVERSAL_RELAY_HUB_ADDRESS = '0xd216153c06e857cd7f72665e0af1d7d82172f494';

export function addScripts(flash: FlashSession) {
  flash.addScript({
    name: 'show-config',
    async call(this: FlashSession) {
      printConfig(this.config);
    }
  });

  flash.addScript({
    name: 'deploy',
    description:
      'Upload contracts to blockchain and register them with the Augur contract.',
    options: [
      {
        name: 'parallel',
        abbr: 'p',
        description: 'deploy contracts non-serially',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const serial = !Boolean(args.parallel);
      if (this.noProvider()) return;

      this.pushConfig({ deploy: { serial }});
      console.log('Deploying: ', sanitizeConfig(this.config).deploy);

      await deployContracts(
        this.network,
        this.provider,
        this.accounts[0],
        compilerOutput,
        this.config
      );
    },
  });

  flash.addScript({
    name: 'faucet',
    description: 'Mints Cash tokens for user.',
    options: [
      {
        name: 'amount',
        abbr: 'a',
        description: 'Quantity of Cash.',
        required: true,
      },
      {
        name: 'target',
        abbr: 't',
        description: 'Account to send funds (defaults to current user)',
        required: false
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);
      const user = await this.createUser(this.getAccount(), this.config);
      const target = args.target as string || user.account.address;

      await user.faucetCash(atto);

      // If we have a target we transfer from current account to target.
      // Cannot directly faucet to target because:
      // 1) it might not have ETH, and
      // 2) specifying sender for contract calls only works if signer is available,
      //    which is typically only true of main account or its wallet
      if (target) {
        await user.augur.contracts.cash.transfer(target, atto);
      }
    },
  });

  flash.addScript({
    name: 'transfer',
    description: 'Transfer tokens to account',
    options: [
      {
        name: 'amount',
        abbr: 'a',
        description: 'Quantity (unit is full token aka 1 = 1e18 wei)',
        required: true,
      },
      {
        name: 'token',
        abbr: 'k',
        description: 'REP, ETH, DAI',
        required: true,
      },
      {
        name: 'target',
        abbr: 't',
        description: 'Account to send tokens to',
        required: true
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);

      const target = args.target as string;
      const amount = Number(args.amount);
      const token = args.token as string;
      const atto = new BigNumber(amount).times(_1_ETH);

      switch(token) {
        case 'REP':
          await user.augur.contracts.getReputationToken().transfer(target, atto);
          break;
        case 'ETH':
          await user.augur.sendETH(target, atto);
          break;
        default:
          await user.augur.contracts.cash.transfer(target, atto);
      }
    },
  });

  flash.addScript({
    name: 'rep-faucet',
    description: 'Mints REP tokens for user.',
    options: [
      {
        name: 'amount',
        abbr: 'a',
        description: 'Quantity of REP.',
        required: true,
      },
      {
        name: 'target',
        abbr: 't',
        description: 'Account to send funds (defaults to current user)',
        required: false
      },
      {
        name: 'useLegacyRep',
        abbr: 'r',
        flag: true,
        description: 'faucet legacy rep',
        required: false
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const useLegacyRep = Boolean(args.useLegacyRep);
      const user = await this.createUser(this.getAccount(), this.config);
      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);
      const target = args.target as string

      await user.faucetRep(atto, useLegacyRep);

      // if we have a target we transfer from current account to target.
      if (target) {
        if (useLegacyRep) {
          await user.augur.contracts.legacyReputationToken.transfer(target, atto);
        } else {
          await user.augur.contracts.reputationToken.transfer(target, atto);
        }
      }
    },
  });

  flash.addScript({
    name: 'migrate-rep',
    description: 'migrate rep to universe.',
    options: [
      {
        name: 'payoutNumerators',
        abbr: 'p',
        description: 'payout numerators of child universe',
        required: true,
      },
      {
        name: 'amount',
        abbr: 'a',
        description: 'Quantity of REP.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);
      const payout = (args.payoutNumerators as string)
        .split(',')
        .map(i => new BigNumber(i));
      console.log(payout);
      await user.migrateOutByPayoutNumerators(payout, atto);
    },
  });

  flash.addScript({
    name: 'gas-limit',
    async call(this: FlashSession) {
      if (this.noProvider()) return;

      const block = await this.provider.getBlock('latest');
      const gasLimit = block.gasLimit.toNumber();
      console.log(`Gas limit: ${gasLimit}`);
    },
  });

  flash.addScript({
    name: 'gas-price',
    async call(this: FlashSession) {
      if (this.noProvider()) return;

      const price = await this.provider.getGasPrice();
      console.log(`Gas price: ${price.toString()}`);
    },
  });

  flash.addScript({
    name: 'latest-block',
    async call(this: FlashSession): Promise<void> {
      if (this.noProvider()) return undefined;

      const block = await this.provider.getBlock('latest');
      console.log(JSON.stringify(block, null, 2));
    }
  });

  flash.addScript({
    name: 'new-market',
    options: [
      {
        name: 'yesno',
        abbr: 'y',
        description: 'create yes no market, default if no options are added',
        flag: true,
      },
      {
        name: 'categorical',
        abbr: 'c',
        description: 'create categorical market',
        flag: true,
      },
      {
        name: 'scalar',
        abbr: 's',
        description: 'create scalar market',
        flag: true,
      },
      {
        name: 'title',
        abbr: 'd',
        description: 'market title',
      },
      {
        name: 'orders',
        abbr: 'z',
        flag: true,
        description: 'add orders to newly created market',
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const yesno = Boolean(args.yesno);
      const cat = Boolean(args.categorical);
      const scalar = Boolean(args.scalar);
      const orders = Boolean(args.orders);
      const title = args.title ? String(args.title) : undefined;
      if (orders) {
        this.pushConfig({
          zeroX: {
            rpc: { enabled: true },
            mesh: { enabled: false },
          },
        });
      }
      const user = await this.createUser(this.getAccount(), this.config);

      if (yesno || !(cat || scalar)) {
        const market = await user.createReasonableYesNoMarket(title);
        console.log(`Created YesNo market "${market.address}".`);
        if (orders) {
          await createYesNoZeroXOrders(user, market.address, true);
        }
      }
      if (cat) {
        const outcomes = ['first', 'second', 'third', 'fourth', 'fifth'].map(formatBytes32String);
        const market = await user.createReasonableMarket(outcomes, title);
        console.log(`Created Categorical market "${market.address}".`);
        if (orders) {
          await createCatZeroXOrders(user, market.address, true, 5);
        }
      }
      if (scalar) {
        const market = await user.createReasonableScalarMarket(title);
        console.log(`Created Scalar market "${market.address}".`);
        if (orders) {
          await createScalarZeroXOrders(user, market.address, true, false, new BigNumber(20000), new BigNumber(50), new BigNumber(250));
        }
      }
    }
  });

  flash.addScript({
    name: 'create-reasonable-yes-no-market',
    options: [
      {
        name: 'title',
        abbr: 'd',
        description: 'market title',
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const title = args.title as string || null;
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const market = await user.createReasonableYesNoMarket(title);
      console.log(`Created YesNo market "${market.address}".`);
    },
  });

  flash.addScript({
    name: 'create-reasonable-categorical-market',
    options: [
      {
        name: 'outcomes',
        abbr: 'o',
        description: 'Comma-separated.',
        required: true,
      },
      {
        name: 'title',
        abbr: 'd',
        description: 'market title',
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const outcomes: string[] = (args.outcomes as string)
        .split(',')
        .map(formatBytes32String);
      const title = args.title as string || null;
      const market = await user.createReasonableMarket(outcomes, title);
      console.log(`Created Categorical market "${market.address}".`);
    },
  });

  flash.addScript({
    name: 'create-reasonable-scalar-market',
    options: [
      {
        name: 'title',
        abbr: 'd',
        description: 'market title',
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const title = args.title as string || null;
      const market = await user.createReasonableScalarMarket(title);
      console.log(`Created Scalar market "${market.address}".`);
    },
  });

  flash.addScript({
    name: 'create-canned-markets',
    async call(this: FlashSession) {
      const user = await this.createUser(this.getAccount(), this.config);
      const million = QUINTILLION.multipliedBy(1e7);
      await user.faucetRepUpTo(million, million);
      await user.faucetCashUpTo(million, million);
      await user.approveIfNecessary();

      await user.initWarpSync(user.augur.contracts.universe.address);
      await user.addEthExchangeLiquidity(new BigNumber(600e18), new BigNumber(4e18));
      await user.addTokenExchangeLiquidity(new BigNumber(100e18), new BigNumber(10e18));
      await createCannedMarkets(user, false);
    },
  });

  flash.addScript({
    name: 'create-canned-template-markets',
    options: [
      {
        name: 'orders',
        abbr: 'o',
        flag: true,
        description: 'create orders on markets',
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const withOrders = args.orders ? Boolean(args.orders) : false;
      let user = await this.createUser(this.getAccount(), this.config);
      const million = QUINTILLION.multipliedBy(1e7);
      await user.faucetRepUpTo(million, million);
      await user.faucetCashUpTo(million, million);
      await user.approveIfNecessary();

      const markets = await createTemplatedMarkets(user, false);
      if (withOrders) {
        this.pushConfig({
          zeroX: {
            rpc: { enabled: true },
            mesh: { enabled: false },
          },
        });
        user = await this.createUser(this.getAccount(), this.config);
        for (let i = 0; i < markets.length; i++) {
          const createdMarket = markets[i];
          const numTicks = await createdMarket.market.getNumTicks_();
          const numOutcomes = await createdMarket.market.getNumberOfOutcomes_();
          const marketId = createdMarket.market.address;
          if (numOutcomes.gt(new BigNumber(3))) {
            await createCatZeroXOrders(user, marketId, true, numOutcomes.toNumber() - 1);
          } else {
            if (numTicks.eq(new BigNumber(1000))) {
              await createYesNoZeroXOrders(user, marketId, true);
            } else {
              try {
                const minPrice = new BigNumber(createdMarket.canned.minPrice);
                const maxPrice = new BigNumber(createdMarket.canned.maxPrice);

                await createScalarZeroXOrders(user, marketId, true, false, numTicks, minPrice, maxPrice);
              } catch (e) {
                console.warn('could not create orders for scalar market', e)
              }
            }
          }
        }
      }
    },
  });

  flash.addScript({
    name: 'create-canned-betting-markets',
    async call(this: FlashSession) {
      const user = await this.createUser(this.getAccount(), this.config);
      const million = QUINTILLION.multipliedBy(1e7);
      await user.faucetRepUpTo(million, million);
      await user.faucetCashUpTo(million, million);
      await user.approveIfNecessary();
      await createTemplatedBettingMarkets(user, false);
    },
  });

  flash.addScript({
    name: 'create-bad-template-markets',
    async call(this: FlashSession) {
      const user = await this.createUser(this.getAccount(), this.config);
      const million = QUINTILLION.multipliedBy(1e7);
      await user.faucetRepUpTo(million, million);
      await user.faucetCashUpTo(million, million);
      await user.approveIfNecessary();
      await createBadTemplatedMarkets(user, false);
    },
  });

  flash.addScript({
    name: 'create-canned-markets-with-orders',
    async call(this: FlashSession) {
      this.pushConfig({
        zeroX: {
          rpc: { enabled: true },
          mesh: { enabled: false },
        }
      });
      const user = await this.createUser(this.getAccount(), this.config);
      const million = QUINTILLION.multipliedBy(1e7);
      await user.faucetRepUpTo(million, million);
      await user.faucetCashUpTo(million, million);
      await user.approveIfNecessary();

      await user.initWarpSync(user.augur.contracts.universe.address);
      await user.addEthExchangeLiquidity(new BigNumber(600e18), new BigNumber(4e18));
      await user.addTokenExchangeLiquidity(new BigNumber(100e18), new BigNumber(10e18));
      const markets = await createCannedMarkets(user, false);
      for (let i = 0; i < markets.length; i++) {
        const createdMarket = markets[i];
        const numTicks = await createdMarket.market.getNumTicks_();
        const numOutcomes = await createdMarket.market.getNumberOfOutcomes_();
        const marketId = createdMarket.market.address;
        if (numOutcomes.gt(new BigNumber(3))) {
          await createCatZeroXOrders(user, marketId, true, numOutcomes.toNumber() - 1);
        } else {
          if (numTicks.eq(new BigNumber(1000))) {
            await createYesNoZeroXOrders(user, marketId, true);
          } else {
            try {
              const minPrice = new BigNumber(createdMarket.canned.minPrice);
              const maxPrice = new BigNumber(createdMarket.canned.maxPrice);

              await createScalarZeroXOrders(user, marketId, true, false, numTicks, minPrice, maxPrice);
            } catch (e) {
              console.warn('could not create orders for scalar market', e)
            }
          }
        }
      }
    },
  });

  flash.addScript({
    name: 'new-orders',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        required: true,
        description: 'market to create zeroX orders on',
      },
      {
        name: 'yesno',
        abbr: 'y',
        description: 'create yes no market, default if no options are added',
        flag: true,
      },
      {
        name: 'categorical',
        abbr: 'c',
        description: 'create categorical market',
        flag: true,
      },
      {
        name: 'scalar',
        abbr: 's',
        description: 'create scalar market',
        flag: true,
      },
      {
        name: 'numOutcomes',
        abbr: 'o',
        description: 'number of valid outcomes available in the market. max is 7',
      },
      {
        name: 'maxPrice',
        abbr: 'x',
        description: 'max price',
      },
      {
        name: 'minPrice',
        abbr: 'p',
        description: 'min price',
      },
      {
        name: 'numTicks',
        abbr: 't',
        description: 'market numTicks',
      },
      {
        name: 'onInvalid',
        flag: true,
        description: 'create zeroX orders on invalid outcome',
      },
      {
        name: 'skipFaucetOrApproval',
        flag: true,
        description: 'do not faucet or approve, has already been done'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const market = args.marketId as string;
      const yesno = Boolean(args.yesno);
      const cat = Boolean(args.categorical);
      const scalar = Boolean(args.scalar);
      const skipFaucetOrApproval = Boolean(args.skipFaucetOrApproval);
      this.pushConfig({
        zeroX: {
          rpc: { enabled: true },
          mesh: { enabled: false },
        },
      });
      const user = await this.createUser(this.getAccount(), this.config);
      if (yesno || !(cat && scalar)) {
        await createYesNoZeroXOrders(user, market, skipFaucetOrApproval);
      }
      if (cat) {
        const numOutcomes = Number(args.numOutcomes);
        if (numOutcomes === undefined) throw new Error(`numOutcomes is required for categorical market`);
        await createCatZeroXOrders(user, market, skipFaucetOrApproval, numOutcomes);
      }
      if (scalar) {
        const onInvalid = Boolean(args.onInvalid);
        const numTicks = new BigNumber(args.numTicks as string);
        const maxPrice = new BigNumber(args.maxPrice as string);
        const minPrice = new BigNumber(args.minPrice as string);
        if (numTicks === undefined || maxPrice === undefined || minPrice === undefined) throw new Error(`numTicks, maxPrice and minPrice are required for scalar market`);
        await createScalarZeroXOrders(user, market, skipFaucetOrApproval, onInvalid, numTicks, minPrice, maxPrice);
      }
    },
  });

  flash.addScript({
    name: 'new-offer',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        required: true,
        description: 'market to create zeroX orders on',
      },
      {
        name: 'outcome',
        abbr: 'o',
        description: '1 is default, outcomeId to add offer',
      },
      {
        name: 'numOutcomes',
        abbr: 'n',
        description: '3 id default, number of valid outcomes available in the market. max is 7',
      },
      {
        name: 'skipFaucetOrApproval',
        flag: true,
        description: 'do not faucet or approve, has already been done'
      },
      {
        name: 'price',
        abbr: 'p',
        description: 'add new offer at this price, 0.4 is default'
      },
      {
        name: 'shares',
        abbr: 's',
        description: 'number of shares on order 100 is default.'
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const market = String(args.marketId);
      const numOutcomes = Number(args.numOutcomes || 3);
      const price = String(args.price || '0.411');
      const shares = String(args.shares || '10');
      const outcome = Number(args.outcome || 1);
      const skipFaucetOrApproval = Boolean(args.skipFaucetOrApproval);
      const ask = 1;
      this.pushConfig({
        zeroX: {
          rpc: { enabled: true },
          mesh: { enabled: false },
        },
      });
      if (!market) throw new Error('marketId is required');
      const user = await this.createUser(this.getAccount(), this.config);
      await createSingleCatZeroXOrder(user, market, skipFaucetOrApproval, numOutcomes, ask, price, shares, outcome);
    }
  });

  flash.addScript({
    name: 'create-yesno-zerox-orders',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description: 'market to create zeroX orders on',
      },
      {
        name: 'skipFaucetOrApproval',
        flag: true,
        description: 'do not faucet or approve, has already been done'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const market = args.marketId as string;
      const skipFaucetOrApproval = Boolean(args.skipFaucetOrApproval);
      this.pushConfig({
        zeroX: {
          rpc: { enabled: true },
          mesh: { enabled: false },
        },
      });

      const user = await this.createUser(this.getAccount(), this.config);
      await createYesNoZeroXOrders(user, market, skipFaucetOrApproval);
    },
  });

  flash.addScript({
    name: 'create-cat-zerox-orders',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        required: true,
        description: 'market to create zeroX orders on',
      },
      {
        name: 'numOutcomes',
        abbr: 'o',
        required: true,
        description: 'number of valid outcomes available in the market. max is 7',
      },
      {
        name: 'skipFaucetOrApproval',
        flag: true,
        description: 'do not faucet or approve, has already been done'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      this.pushConfig({
        zeroX: {
          rpc: { enabled: true },
          mesh: { enabled: false },
        }
      });
      const market = args.marketId as string;
      const numOutcomes = Number(args.numOutcomes);
      const user = await this.createUser(this.getAccount(), this.config);
      const skipFaucetApproval = Boolean(args.skipFaucetOrApproval);
      await createCatZeroXOrders(user, market, skipFaucetApproval, numOutcomes);
    },
  });

  flash.addScript({
    name: 'create-scalar-zerox-orders',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        required: true,
        description: 'market to create zeroX orders on',
      },
      {
        name: 'maxPrice',
        abbr: 'x',
        required: true,
        description: 'max price',
      },
      {
        name: 'minPrice',
        abbr: 'p',
        required: true,
        description: 'min price',
      },
      {
        name: 'numTicks',
        abbr: 't',
        required: true,
        description: 'market numTicks',
      },
      {
        name: 'onInvalid',
        flag: true,
        description: 'create zeroX orders on invalid outcome',
      },
      {
        name: 'skipFaucetOrApproval',
        flag: true,
        description: 'do not faucet or approve, has already been done'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      this.pushConfig({
        zeroX: {
          rpc: { enabled: true },
          mesh: { enabled: false },
        }
      });
      const market = args.marketId as string;
      const user = await this.createUser(this.getAccount(), this.config);
      const skipFaucetApproval = Boolean(args.skipFaucetOrApproval);
      const onInvalid = Boolean(args.onInvalid);
      const numTicks = new BigNumber(args.numTicks as string);
      const maxPrice = new BigNumber(args.maxPrice as string);
      const minPrice = new BigNumber(args.minPrice as string);
      await createScalarZeroXOrders(user, market, skipFaucetApproval, onInvalid, numTicks, minPrice, maxPrice);
    },
  });

  flash.addScript({
    name: 'get-market-order-book',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description: 'Show orders that have been placed on the book of this marketInfo'
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const marketId = args.marketId as string;
      this.pushConfig({
        flash: { syncSDK: true },
        zeroX: {
          rpc: { enabled: true },
          mesh: { enabled: false },
        },
      });
      const user = await this.createUser(this.getAccount(), this.config);
      await sleep(90000); // wait for 0x orders
      await waitForSync(user);
      const result = await user.augur.getMarketOrderBook({ marketId });
      console.log(JSON.stringify(result), null, 2);
    }
  });

  flash.addScript({
    name: 'create-markets-orderbook-shaper',
    options: [
      {
        name: 'numMarkets',
        abbr: 'm',
        description: 'number of markets to create and have orderbook maintain, default is 10'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const numMarkets = Number(args.numMarkets) || 10;
      const user = await this.createUser(this.getAccount(), this.deriveConfig({
        flash: { syncSDK: true },
        zeroX: { rpc: { enabled: true }},
      }));
      await waitForSync(user);
      const timestamp = await user.getTimestamp();
      const ids: string[] = [];
      for (let i = 0; i < numMarkets; i++) {
        const title = `YesNo market: ${timestamp} Number ${i} with orderbook mgr`;
        const market: ContractInterfaces.Market = await user.createReasonableYesNoMarket(title);
        ids.push(market.address);
      }

      await simpleOrderbookShaper(user, await user.getMarketInfo(ids), 15000, null, new BigNumber(600));
    }
  });

  flash.addScript({
    name: 'simple-orderbook-shaper',
    options: [
      {
        name: 'marketIds',
        abbr: 'm',
        description:
          'Market ids separated by commas for multiple to create orders and maintain order book, ie 0x122,0x333,0x4444',
      },
      {
        name: 'refreshInterval',
        abbr: 'r',
        required: false,
        description: 'refresh interval in seconds, time to wait before checking market orderbook. default 15 seconds',
      },
      {
        name: 'orderSize',
        abbr: 's',
        required: false,
        description: 'quantity used when orders need to be created. default is one large chunk, possible values are 10, 100, ...',
      },
      {
        name: 'expiration',
        abbr: 'x',
        required: false,
        description: 'number of added seconds to order will live, default is ten minutes',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const marketIds = (args.marketIds as string)
        .split(',')
        .map(id => id.trim());
      const interval = args.refreshInterval ? Number(args.refreshInterval) * 1000 : 15000;
      const orderSize = Number(args.orderSize) || null;
      const expiration = args.expiration ? new BigNumber(String(args.expiration)) : new BigNumber(600);
      const user = await this.createUser(this.getAccount(), this.deriveConfig({
        flash: { syncSDK: true },
        zeroX: { rpc: { enabled: true }},
      }));
      await waitForSync(user);

      await simpleOrderbookShaper(user, await user.getMarketInfo(marketIds), interval, orderSize, expiration);
    },
  });

  flash.addScript({
    name: 'order-firehose',
    options: [
      {
        name: 'marketIds',
        abbr: 'm',
        description:
          'Market ids separated by commas for multiple to create orders and maintain order book, ie 0x122,0x333,0x4444',
      },
      {
        name: 'numOrderLimit',
        abbr: 'l',
        required: false,
        description: 'number of orders to create at a time, default is 100',
      },
      {
        name: 'delayBetweenBursts',
        abbr: 'd',
        required: false,
        description: 'seconds to wait between each order burst, default is 1 second',
      },
      {
        name: 'burstRounds',
        abbr: 'r',
        required: false,
        description: 'number of order burst rounds, default is 10',
      },
      {
        name: 'expiration',
        abbr: 'x',
        required: false,
        description: 'number of added seconds to order will live, default is ten minutes',
      },
      {
        name: 'orderSize',
        abbr: 's',
        required: false,
        description: 'quantity used on created order, default is 10',
      },
      {
        name: 'outcomes',
        abbr: 'o',
        required: false,
        description: 'outcomes to put orders on, default is 2,1',
      },
      {
        name: 'skipFaucetOrApproval',
        flag: true,
        description: 'do not faucet or approve, has already been done'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const marketIds = (args.marketIds as string)
        .split(',')
        .map(id => id.trim());
      const orderOutcomes: number[] = (args.outcomes as string || '2,1')
        .split(',')
        .map(id => Number(id.trim()));
      const delayBetweenBursts = args.delayBetweenBursts ? Number(args.delayBetweenBursts) : 1;
      const numOrderLimit = args.numOrderLimit ? Number(args.numOrderLimit) : 100;
      const burstRounds = args.burstRounds ? Number(args.burstRounds) : 10;
      const orderSize = args.orderSize ? Number(args.orderSize) : 10;
      const expiration = args.expiration ? new BigNumber(String(args.expiration)) : new BigNumber(600); // ten minutes
      const skipFaucetOrApproval = Boolean(args.skipFaucetOrApproval);
      const user = await this.createUser(this.getAccount(), this.deriveConfig({
        flash: { syncSDK: true },
        zeroX: { rpc: { enabled: true }},
      }));
      await waitForSync(user);

      await orderFirehose(
        await user.getMarketInfo(marketIds),
        orderOutcomes,
        delayBetweenBursts,
        numOrderLimit,
        burstRounds,
        orderSize,
        expiration,
        skipFaucetOrApproval,
        [user]);
    },
  });

  flash.addScript({
    name: 'create-market-order',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description:
          'ASSUMES: binary or categorical markets, market id to place the order',
        required: true,
      },
      {
        name: 'outcome',
        abbr: 'o',
        description: 'outcome to place the order',
      },
      {
        name: 'orderType',
        abbr: 't',
        description: 'order type of the order [bid], [ask]',
      },
      {
        name: 'amount',
        abbr: 'a',
        description: 'number of shares in the order',
      },
      {
        name: 'price',
        abbr: 'p',
        description: 'price of the order',
      },
      {
        name: 'fillOrder',
        abbr: 'f',
        flag: true,
        required: false,
        description: 'fill order'
      },
      {
        name: 'skipFaucetOrApproval',
        abbr: 'k',
        flag: true,
        description: 'do not faucet or approve, has already been done'
      },
      {
        name: 'doNotUseZeroX',
        flag: true,
        description: 'create on-chain order not 0x order'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const isZeroX = !Boolean(args.doNotUseZeroX);
      const skipFaucetOrApproval = Boolean(args.skipFaucetOrApproval);
      const orderType = (args.orderType as string).toLowerCase();
      const marketId = args.marketId as string;
      const fillOrder = Boolean(args.fillOrder);

      this.pushConfig({ zeroX: { rpc: { enabled: isZeroX }}});
      const user = await this.createUser(this.getAccount(), this.config);

      if (!skipFaucetOrApproval) {
        console.log('create-market-order, faucet and approval');
        await user.faucetCashUpTo(QUINTILLION.multipliedBy(10000));
        await user.approveIfNecessary();
      }

      const type = orderType === 'bid' || orderType === 'buy' ? 0 : 1;

      const onChainShares = convertDisplayAmountToOnChainAmount(
        new BigNumber(String(args.amount)),
        new BigNumber(1000)
      );
      const onChainPrice = convertDisplayPriceToOnChainPrice(
        new BigNumber(String(Number(args.price).toFixed(2))),
        new BigNumber(0),
        new BigNumber('0.001')
      );

      const nullOrderId = stringTo32ByteHex('');
      const tradeGroupId = stringTo32ByteHex('tradegroupId');
      let result = null;
      if (isZeroX) {
        const timestamp = await user.getTimestamp();
        const oneHundredDays = new BigNumber(8640000);
        const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
        const onChainPrice = convertDisplayPriceToOnChainPrice(
          new BigNumber(String(Number(args.price).toFixed(2))),
          new BigNumber(0),
          new BigNumber('0.001')
        );
        const price = convertOnChainPriceToDisplayPrice(
          onChainPrice,
          new BigNumber(0),
          new BigNumber('0.001')
        );
        const params = {
          direction: type as 0 | 1,
          market: marketId,
          numTicks: new BigNumber(1000),
          numOutcomes: 3 as NumOutcomes,
          outcome: Number(args.outcome) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
          tradeGroupId,
          fingerprint: formatBytes32String('11'),
          doNotCreateOrders: false,
          displayMinPrice: new BigNumber(0),
          displayMaxPrice: new BigNumber(1),
          displayAmount: new BigNumber(String(args.amount)),
          displayPrice: price,
          displayShares: new BigNumber(0),
          expirationTime,
        };

        try {
          result = fillOrder ? await user.augur.placeTrade(params) : await user.placeZeroXOrder(params)
        } catch(e) {
          console.log(e);
        }
      } else {
        fillOrder ?
        await user.takeBestOrder(
          marketId,
          new BigNumber(type),
          onChainShares,
          onChainPrice,
          new BigNumber(String(args.outcome)),
          tradeGroupId
        ) :
        await user.placeOrder(
          marketId,
          new BigNumber(type),
          onChainShares,
          onChainPrice,
          new BigNumber(String(args.outcome)),
          nullOrderId,
          nullOrderId,
          tradeGroupId
        );
      }
      console.log(`place order ${result}`);

    },
  });

  flash.addScript({
    name: 'take-orderbook-side',
    options: [
      {
        name: 'skipFaucet',
        abbr: 's',
        description: 'skip faucet&approve. use if re-running this script',
        flag: true,
      },
      {
        name: 'outcome',
        abbr: 'o',
        description: 'orderbook outcome to take, default is 2'
      },
      {
        name: 'market',
        abbr: 'm',
        description: 'market to trade, default is a random market',
      },
      {
        name: 'limit',
        abbr: 'l',
        description: 'limit of orders to take, 1...N orders can be take, default is keep taking forever',
      },
      {
        name: 'wait',
        abbr: 'w',
        description: 'how many seconds to wait between takes. default=1',
      },
      {
        name: 'orderType',
        abbr: 't',
        description: 'side of orderbook to take, bid or ask, bid is default',
      },
    ],
    async call(this: FlashSession, args :FlashArguments) {
      const skipFaucet = Boolean(args.skipFaucet);
      const marketId = args.market as string || null;
      const limit = Number(args.limit) || 86400000; // go for a really long time
      const orderType = args.orderType as string || 'bid';
      const outcome = Number(args.outcome) || 2;
      const wait = Number(args.wait as string) || 1;

      this.pushConfig({
        flash: { syncSDK: true },
        zeroX: {
          rpc: { enabled: true },
          mesh: { enabled: false },
        },
      });
      const user = await this.createUser(this.getAccount(), this.config);
      await sleep(90000); // wait for 0x orders to be available
      await waitForSync(user);

      if (!skipFaucet) {
        console.log('fauceting ...');
        const funds = new BigNumber(1e18).multipliedBy(1000000);
        await user.faucetCashUpTo(funds);
        await user.approveIfNecessary();
      }

      const markets = (await user.getMarkets()).markets;
      const market = marketId ? markets.find(m => m.id === marketId) : markets[0];
      if (typeof market === 'undefined') {
        console.log(`market found with address=${marketId}`);
        return;
      }

      const direction = orderType === 'bid' || orderType === 'buy' ? '0' : '1';
      const takeDirection = direction === '0' ? 1 : 0;
      for (let i = 0; i < limit; i++) {
        const orders = flattenZeroXOrders(await user.getOrders(market.id, direction, outcome));
        if (orders.length > 0) {
          const sortedOrders =
            direction === '0'
              ? orders.sort((a, b) =>
                  new BigNumber(b.price).minus(new BigNumber(a.price)).toNumber()
                )
              : orders.sort((a, b) =>
                  new BigNumber(a.price).minus(new BigNumber(b.price)).toNumber()
                );

          const order = sortedOrders[0];
          console.log('Take Order', order.amount, '@', order.price);
          const params: NativePlaceTradeDisplayParams = {
            market: market.id,
            direction: takeDirection as 0 | 1,
            outcome: Number(outcome) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
            numTicks: new BigNumber(market.numTicks),
            numOutcomes: market.numOutcomes,
            tradeGroupId: stringTo32ByteHex('tradegroupId'),
            fingerprint: stringTo32ByteHex('fingerprint'),
            doNotCreateOrders: true,
            displayAmount: new BigNumber(order.amount),
            displayPrice: new BigNumber(order.price),
            displayMaxPrice: new BigNumber(market.maxPrice),
            displayMinPrice: new BigNumber(market.minPrice),
            displayShares: new BigNumber(0),
          };
          await user.augur.placeTrade(params).catch(e => console.error(e));
        }
        await sleep(wait * 1000);
      }
    },
  });

  flash.addScript({
    name: 'fake-all',
    options: [
      {
        name: 'traders',
        abbr: 't',
        description: 'Number of accounts prefunded upon deploy. Funds come from deployer\'s wallet. Defaults to zero.',
      },
      {
        name: 'createMarkets',
        abbr: 'c',
        description:
          'create canned markets',
        flag: true,
      },
      {
        name: 'parallel',
        abbr: 'p',
        description: 'deploy contracts non-serially',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const serial = !Boolean(args.parallel);
      const createMarkets = Boolean(args.createMarkets);
      const traderCount = Number(args.traders || 0);

      this.pushConfig({ deploy: { serial, normalTime: false }});
      const { addresses } = await deployContracts(this.network, this.provider, this.getAccount(), compilerOutput, this.config);
      this.pushConfig({ addresses });

      if (createMarkets) {
        const user = await this.createUser(this.getAccount(), this.config);
        await createCannedMarkets(user);
      }

      const ethSource = await this.createUser(this.getAccount(), this.config);
      await perfSetup(ethSource, 0, traderCount, serial, this.config);
    },
  });

  flash.addScript({
    name: 'normal-all',
    options: [
      {
        name: 'traders',
        abbr: 't',
        description: 'Number of accounts prefunded upon deploy. Funds come from deployer\'s wallet. Defaults to zero.',
      },
      {
        name: 'createMarkets',
        abbr: 'c',
        description:
          'create canned markets',
        flag: true,
      },
      {
        name: 'parallel',
        abbr: 'p',
        description: 'deploy contracts non-serially',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const serial = !Boolean(args.parallel);
      const createMarkets = Boolean(args.createMarkets);
      const traderCount = Number(args.traders || 0);

      this.pushConfig({ deploy: { serial, normalTime: true }});
      const { addresses } = await deployContracts(this.network, this.provider, this.getAccount(), compilerOutput, this.config);
      this.pushConfig({ addresses });

      if (createMarkets) {
        const user = await this.createUser(this.getAccount(), this.config);
        await createCannedMarkets(user);
      }

      const ethSource = await this.createUser(this.getAccount(), this.config);
      await perfSetup(ethSource, 0, traderCount, serial, this.config);
    },
  });

  flash.addScript({
    name: 'all-logs',
    options: [
      {
        name: 'v1',
        description: 'Fetch logs from V1 contracts.',
        flag: true,
      },
      {
        name: 'from',
        abbr: 'f',
        description: 'First block from which to request logs.',
      },
      {
        name: 'to',
        abbr: 't',
        description: 'Final block from which to request logs.',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;

      const v1 = Boolean(args.v1);
      const fromBlock = Number(args.from || 0);
      const toBlock =
        args.to === null || args.to === 'latest' ? 'latest' : Number(args.to);

      const logs = await this.provider.getLogs({
        address: this.config.addresses.Augur,
        fromBlock,
        toBlock,
        topics: [],
      });

      const logsWithBlockNumber = logs.map(log => ({
        ...log,
        logIndex: log.logIndex || 0,
        transactionHash: log.transactionHash || '',
        transactionIndex: log.transactionIndex || 0,
        blockNumber: log.blockNumber || 0,
        blockHash: log.blockHash || '0',
        removed: log.removed || false,
      }));

      const contractEvents = new ContractEvents(
        this.provider,
        this.config.addresses.Augur,
        this.config.addresses.AugurTrading,
        this.config.addresses.ShareToken,
      );
      let parsedLogs = contractEvents.parseLogs(logsWithBlockNumber);

      // Logs from AugurV1 require additional calls to the blockchain.
      if (v1) {
        parsedLogs = await Promise.all(
          parsedLogs.map(async log => {
            if (log.name === 'OrderCreated') {
              const { shareToken } = log;
              const shareTokenContract = new ethers.Contract(
                shareToken,
                new ethers.utils.Interface(abiV1.ShareToken),
                this.provider
              );
              const market = await shareTokenContract.functions['getMarket']();
              const outcome = (await shareTokenContract.functions[
                'getOutcome'
              ]()).toNumber();

              return Object.assign({}, log, { market, outcome });
            } else {
              return log;
            }
          })
        );
      }

      console.log(JSON.stringify(parsedLogs, null, 2));
    },
  });

  flash.addScript({
    name: 'whoami',
    async call(this: FlashSession) {
      console.log(`You are ${this.getAccount().address}\n`);
    },
  });

  flash.addScript({
    name: 'generate-templates',
    async call(this: FlashSession) {
      await generateTemplateValidations();
      console.log('Generated Templates to augur-artifacts\n');
    },
  });

  flash.addScript({
    name: 'show-template',
    options: [
      {
        name: 'hash',
        description: 'Hash value of template to show',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const hash = args.hash as string;
      console.log(hash);
      const template = showTemplateByHash(hash);
      if (!template) console.log(`Template not found for hash ${hash}`);
      console.log(JSON.stringify(template, null, ' '));
    },
  });

  flash.addScript({
    name: 'validate-template',
    options: [
      {
        name: 'title',
        description: 'populated market title',
        required: true,
      },
      {
        name: 'templateInfo',
        description: 'string version of template information from market creation extraInfo, it will be parsed as object internally',
        required: true,
      },
      {
        name: 'outcomes',
        description: 'string array of outcomes if market is categorical',
        required: false,
      },
      {
        name: 'resolutionRules',
        description: 'resolution rules separated by \n ',
        required: true,
      },
      {
        name: 'endTime',
        description: 'market end time, also called event expiration',
        required: true,
      },
      {
        name: 'creationTime',
        description: 'market creation time, timestamp of the block market is created in',
        required: true,
      },
      {
        name: 'categories',
        description: 'market categories, they need to match templates categories',
        required: true,
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      let result = null;
      try {
        const title = args.title as string;
        const templateInfo = args.templateInfo as string;
        const outcomesString = args.outcomes as string;
        const resolutionRules = args.resolutionRules as string;
        const endTime = Number(args.endTime);
        const creationTime = Number(args.creationTime);
        const categories = args.categories as string;
        result = validateMarketTemplate(title, templateInfo, outcomesString, resolutionRules, endTime, creationTime, categories);
        console.log(result);
      } catch (e) {
        console.log(e);
      }
      return result;
    },
  });

  flash.addScript({
    name: 'get-timestamp',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);

      const currentBlock = await this.provider.getBlock('latest');
      const blocktime = await user.getTimestamp();

      const epoch = Number(blocktime.toString()) * 1000;
      console.log(`block number: ${currentBlock.number}`);
      console.log(`block timestamp: ${blocktime}`);
      console.log(`local: ${moment(epoch).toString()}`);
      console.log(
        `utc: ${moment(epoch)
          .utc()
          .toString()}\n`
      );
      return;
    },
  });

  flash.addScript({
    name: 'set-timestamp',
    options: [
      {
        name: 'timestamp',
        abbr: 't',
        description:
          "Uses Moment's parser but also accepts millisecond unix epoch time. See https://momentjs.com/docs/#/parsing/string/",
        required: true,
      },
      {
        name: 'format',
        abbr: 'f',
        description:
          'Lets you specify the format of --timestamp. See https://momentjs.com/docs/#/parsing/string-format/',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);

      const timestamp = args.timestamp as string;
      const format = (args.format as string) || undefined;

      let epoch = Number(timestamp);
      if (isNaN(epoch)) {
        epoch = moment(timestamp, format).valueOf();
      }

      await user.setTimestamp(new BigNumber(epoch));
      await user.printTimestamp();
    },
  });

  flash.addScript({
    name: 'push-timestamp',
    options: [
      {
        name: 'count',
        abbr: 'c',
        description:
          'Defaults to seconds. Use "y", "M", "w", "d", "h", or "m" for longer times. ex: "2w" is 2 weeks.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);

      const countString = args.count as string;
      let unit = countString[countString.length - 1];
      let count: string;
      if (['y', 'M', 'w', 'd', 'h', 'm', 's'].includes(unit.toString())) {
        count = countString.slice(0, countString.length - 1);
      } else {
        count = countString;
        unit = 's'; // no unit provided so default to seconds
      }
      const blocktime = Number(await user.getTimestamp()) * 1000;
      const newTime = moment(blocktime).add(count, unit as
        | 'y'
        | 'M'
        | 'w'
        | 'd'
        | 'h'
        | 'm'
        | 's');

      await user.printTimestamp();
      console.log(`changing timestamp to ${newTime.unix()}`);
      await user.setTimestamp(new BigNumber(newTime.unix()));
      await user.printTimestamp();
    },
  });

  flash.addScript({
    name: 'initial-report',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description: 'market to initially report on',
        required: true,
      },
      {
        name: 'extraStake',
        abbr: 's',
        description:
          'added pre-emptive REP stake on the outcome in 10**18 format not atto REP(optional)',
        required: false,
      },
      {
        name: 'description',
        abbr: 'd',
        description:
          'description to be added to contracts for initial report (optional)',
        required: false,
      },
      {
        name: 'payoutNumerators',
        abbr: 'p',
        description: 'payout numerators of child unverse.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const marketId = args.marketId as string;
      const extraStake = args.extraStake as string;
      const desc = args.description as string;
      let preEmptiveStake = '0';
      if (extraStake) {
        preEmptiveStake = new BigNumber(extraStake)
          .multipliedBy(QUINTILLION)
          .toFixed();
      }

      const market: ContractInterfaces.Market = await user.getMarketContract(
        marketId
      );

      const payout = (args.payoutNumerators as string)
      .split(',')
      .map(i => new BigNumber(i));

      await user.doInitialReport(
        market,
        payout,
        desc,
        preEmptiveStake
      );
    },
  });

  flash.addScript({
    name: 'dispute',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description: 'market to dispute',
        required: true,
      },
      {
        name: 'amount',
        abbr: 'a',
        description: 'amount of REP to dispute with, use display value',
        required: false,
      },
      {
        name: 'description',
        abbr: 'd',
        description:
          'description to be added to contracts for dispute (optional)',
        required: false,
      },
      {
        name: 'payoutNumerators',
        abbr: 'p',
        description: 'payout numerators of child unverse.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const payout = (args.payoutNumerators as string)
        .split(',')
        .map(i => new BigNumber(i));

      const marketId = args.marketId as string;
      const amount = args.amount as string;
      const desc = args.description as string;
      if (amount === '0') return console.log('amount of REP is required');
      const stake = new BigNumber(amount).multipliedBy(QUINTILLION);

      const market: ContractInterfaces.Market = await user.getMarketContract(
        marketId
      );

      await user.contribute(market, payout, stake, desc);
    },
  });

  flash.addScript({
    name: 'contribute-to-tentative-winning-outcome',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description:
          'market to contribute REP to its tentative winning outcome',
        required: true,
      },
      {
        name: 'amount',
        abbr: 'a',
        description: 'amount of REP to dispute with, use display value',
        required: true,
      },
      {
        name: 'description',
        abbr: 'd',
        description:
          'description to be added to contracts for contribution (optional)',
        required: false,
      },
      {
        name: 'payoutNumerators',
        abbr: 'p',
        description: 'payout numerators of child unverse.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const marketId = args.marketId as string;
      const amount = args.amount as string;
      const desc = args.description as string;

      if (amount === '0') return console.log('amount of REP is required');
      const stake = new BigNumber(amount).multipliedBy(QUINTILLION);

      const market: ContractInterfaces.Market = await user.getMarketContract(
        marketId
      );

      const payout = (args.payoutNumerators as string)
        .split(',')
        .map(i => new BigNumber(i));

      await user.contributeToTentative(market, payout, stake, desc);
    },
  });

  flash.addScript({
    name: 'buy-pt',
    options: [
      {
        name: 'amount',
        abbr: 'a',
        description: 'amount of REP to stake, defaults to 10',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const amount = args.amount ? String(args.amount) : "10";
      const user = await this.createUser(this.getAccount(), this.config);
      const attoAmount = new BigNumber(amount).times(_1_ETH);
      return user.simpleBuyParticipationTokens(attoAmount);
    }
  })

  flash.addScript({
    name: 'finalize',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description: 'market to finalize',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;

      const user = await this.createUser(this.getAccount(), this.config);
      const marketId = args.marketId as string;

      const market: ContractInterfaces.Market = await user.getMarketContract(
        marketId
      );
      await user.finalizeMarket(market);
    },
  });

  flash.addScript({
    name: 'fork',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description: 'yes/no market to fork. defaults to making one',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const marketId = await getOrCreateMarket(user, args.marketId, 'forking market');
      const market = await user.getMarketContract(marketId)

      if (await fork(user, market)) {
        console.log('Fork successful!');
      } else {
        console.log('ERROR: forking failed.');
      }
    },
  });

  flash.addScript({
    name: 'fork-status',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      console.log('Forking? ->', await user.isForking());
    },
  });

  flash.addScript({
    name: 'rep-supply',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      console.log('Total theoretical supply:', await user.augur.contracts.getReputationToken().getTotalTheoreticalSupply_());
    },
  });

  flash.addScript({
    name: 'universes',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.deriveConfig({flash:{syncSDK: true}}));
      await waitForSync(user);
      const universes = await (await (user.augur.connector as SingleThreadConnector).api.db).UniverseCreated.toArray();
      console.log('Universes:');
      universes.forEach((universe) => {
        console.log(`${universe.address} [payout hash=${universe.childUniverse}, parent=${universe.parentUniverse}]`)
      })
    },
  });

  flash.addScript({
    name: 'dispute-rounds',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description: 'yes/no market to dispute. defaults to making one',
      },
      {
        name: 'slow',
        abbr: 's',
        description: 'puts market into slow pacing mode immediately',
        flag: true,
      },
      {
        name: 'rounds',
        abbr: 'r',
        description: 'number of rounds to complete',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.config);
      const slow = Boolean(args.slow);
      const rounds = args.rounds ? Number(args.rounds) : 0;
      const marketId = await getOrCreateMarket(user, args.marketId);
      const market = await user.getMarketContract(marketId)

      await dispute(user, market, slow, rounds);
    },
  });

  flash.addScript({
    name: 'markets',
    options: [
      {
        name: 'just-ids',
        abbr: 'i',
        description: 'only show the market ids',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const justIds = Boolean(args.justIds);
      if (this.noProvider()) return;
      const user = await this.createUser(this.getAccount(), this.deriveConfig({ flash: { syncSDK: true }}));
      await waitForSync(user);
      const markets: MarketList = await user.getMarkets();

      if (justIds) {
        console.log(markets.markets.map((m) => m.id).join('\n'))
      } else {
        console.log(JSON.stringify(markets.markets, null, 2));
      }
    },
  });

  flash.addScript({
    name: 'network-id',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const networkId = await this.provider.getNetworkId();
      console.log(networkId);
    },
  });

  flash.addScript({
    name: 'docker-all',
    ignoreNetwork: true,
    options: [
      {
        name: 'dev',
        abbr: 'd',
        description: 'Deploy to node instead of using pop-docker image. With --do-not-run-geth, deploys to existing node',
        flag: true,
      },
      {
        name: 'fake',
        abbr: 'f',
        description: 'Use fake time (TimeControlled) instead of real time',
        flag: true,
      },
      {
        name: 'detach',
        abbr: 'D',
        description: 'Do not stop dockers after running command and do not wait for user input before exiting',
        flag: true,
      },
      {
        name: 'do-not-run-geth',
        abbr: 'G',
        description: 'Do not start up a geth node; with --dev will deploy and create markets on existing geth node, if it exists',
        flag: true,
      },
      {
        name: 'ganache',
        // G is already taken. Using lowercase.
        abbr: 'g',
        description: 'Use ganache instead of geth.',
        flag: true,
      },
      {
        name: 'do-not-create-markets',
        abbr: 'M',
        description: 'Do not create markets. Only applies when --dev is specified.',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const dev = Boolean(args.dev);
      const normalTime = !Boolean(args.fake);
      const detach = Boolean(args.detach);
      const createMarkets = !Boolean(args.doNotCreateMarkets);
      const runGanache = Boolean(args.ganache);
      const runGeth = !Boolean(args.doNotRunGeth) && !runGanache;

      spawnSync('docker', ['pull', '0xorg/mesh:latest']);

      console.log(`Deploy contracts: ${dev}`);
      console.log(`Use fake time: ${!normalTime}`);
      console.log(`Detach: ${detach}`);
      console.log(`Start geth node: ${runGeth}`);
      if (dev) console.log(`Create markets: ${createMarkets}`);

      let env;
      try {
        if (runGeth) {
          if (dev) {
            spawnSync('yarn', ['workspace', '@augurproject/tools', 'docker:geth:detached']);
          } else {
            const gethDocker = normalTime ? 'docker:geth:pop-normal-time' : 'docker:geth:pop';
            spawnSync('yarn', [gethDocker]);
          }
          console.log('Waiting for Geth to start up');
          await sleep(10000); // give geth some time to start
          await refreshSDKConfig(); // only grabs new local.json for non-dev
        } else if (runGanache) {
          await startGanacheServer(this.accounts);
        }

        this.config = buildConfig('local', { deploy: { normalTime }});
        this.provider = flash.makeProvider(this.config);

        if (dev) {
          console.log('Deploying contracts');
          await deployContracts(this.network, this.provider, this.getAccount(), compilerOutput, this.config);
          await refreshSDKConfig(); // need to grab local.json since it wasn't created/updated until deploy
          this.config = buildConfig('local');
          if (createMarkets) {
            const user = await this.createUser(this.getAccount(), this.config);
            await createCannedMarkets(user);
          }
        }

        console.log('Building');
        await spawnSync('yarn', ['build']); // so UI etc will have the correct addresses

        env = {
          ...process.env,
          ETHEREUM_RPC_HTTP: runGeth ? 'http://geth:8545' : this.config.ethereum.http,
          ETHEREUM_CHAIN_ID: this.config.networkId,
          CUSTOM_CONTRACT_ADDRESSES: JSON.stringify(this.config.addresses),
          ZEROX_CONTRACT_ADDRESS: formatAddress(this.config.addresses.ZeroXTrade, { lower: true, prefix: false }),
        };

        console.log('Running dockers. Type ctrl-c to quit:');
        await spawnSync('docker-compose', ['-f', 'docker-compose.yml', 'up', '-d'], {
          env,
          stdio: 'inherit'
        });

        if (detach) return;

        spawn('docker-compose', ['-f', 'docker-compose.yml', 'logs'], {env, stdio: 'inherit'});
        await waitForSigint();
      } catch (err) {
        console.log(`Error: ${err}`);
      } finally {
        if (!detach) {
          if (runGeth) {
            console.log('Stopping geth');
            await spawnSync('docker', ['kill', 'geth'], { stdio: 'inherit' });
          }
          console.log('Stopping dockers');
          await spawn('docker-compose', ['-f', 'docker-compose.yml', 'down'], {env, stdio: 'inherit'});
        }
      }
    }
  });

  flash.addScript({
    name: 'generate-wallet',
    options: [
      {
        name: 'keyfileOutputLocation',
        description: 'Generate a wallet if one does not exist in the current location.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const outputPath = path.resolve(`${args.keyfileOutputLocation}`);

      if(fs.existsSync(outputPath)) {
        console.log(`Keyfile already exists at path ${outputPath}. Nothing to do.`)
      } else {
        console.log('Creating wallet.');
        const wallet = ethers.Wallet.createRandom();

        fs.writeFileSync(outputPath, wallet.privateKey, 'utf8');

        console.log(`Generated wallet with address ${wallet.address} .\nPrivate key written to ${outputPath}\n`);
      }
    }
  });

  flash.addScript({
    name: 'ipfs-pin-ui',
    async call(this: FlashSession, args: FlashArguments) {
      const ipfs = await IPFS.create({});

      // Assume build exists.
      await ipfs.addFromFs('../augur-ui/build', { recursive: true });

      console.log('Running IPFS daemon. Type ctrl-c to quit:\n');
      await waitForSigint();
    }
  });

  flash.addScript({
    name: 'sdk-server',
    ignoreNetwork: true,
    options: [
      {
        name: 'warpSync',
        abbr: 'w',
        description: 'Generate a warp sync hash when the market end time elapses.',
        flag: true,
      },
      {
        name: 'autoReport',
        abbr: 'a',
        description: 'Report the generated warp sync hash to the market when end time elapses. Requires `--warpSync` option be specified',
        flag: true,
      },
      {
        name: 'showHashAndDie',
        abbr: 'd',
        description: 'Print out current warp sync hash and exit.',
        flag: true
      },
      {
        name: 'pinUI [path]',
        abbr: 'p',
        description: 'Pin IPFS hash of the ui. Requires -w flag to be set. Defaults to "../augur-ui/build"',
        flag: true
      },
      {
        name: 'pinReportingUI [path]',
        abbr: 'r',
        description: 'Pin IPFS hash of the reporting-only ui. Requires -w flag to be set. Defaults to "../augur-ui/reporting-only-build"',
        flag: true
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const autoReport = Boolean(args.autoReport);
      const showHashAndDie = Boolean(args.showHashAndDie);
      const useWarpSync = Boolean(args.warpSync);

      let pinUIPath: string;
      if (args.pinUI === true) pinUIPath = '../augur-ui/build';
      else if (args.pinUI !== undefined) pinUIPath = args.pinUI as string;

      let pinReportingUIPath: string;
      if (args.pinReportingUI === true) pinReportingUIPath = '../augur-ui/reporting-only-build';
      else if (args.pinReportingUI !== undefined) pinReportingUIPath = args.pinReportingUI as string;

      this.pushConfig({
        zeroX: {
          mesh: { enabled: false },
        },
        warpSync: {
          createCheckpoints: useWarpSync,
          autoReport,
        }
      });

      // Create a wallet, print out private key and display public key.
      let client;
      const connector = new SingleThreadConnector();

      if (!autoReport) {
        client = await createClient(this.config, connector, undefined, undefined, true);
      } else if (this.accounts === ACCOUNTS) {
        console.log('Creating wallet.');
        const wallet = ethers.Wallet.createRandom();

        const keyfilePath = path.resolve(`./${wallet.address}.key`);
        fs.writeFileSync(keyfilePath, wallet.privateKey, 'utf8');

        console.log(`Transfer ETH the ${wallet.address} to auto-report on warp market.\nPrivate key written to ${keyfilePath}\n`);

        client = await createClient(this.config, connector, wallet, undefined, true);
      } else {
        // User provided an account.
        const provider = await providerFromConfig(this.config);
        const signer = await makeSigner(this.accounts[0], provider);

        client = await createClient(this.config, connector, signer, undefined);
      }

      const { api, sync } = await createServer(this.config, client);
      connector.api = api;

      if (useWarpSync && (pinUIPath || pinReportingUIPath)) {
        const ipfs = await api.augur.warpController.ipfs;

        if (pinUIPath) {
          // Assume build exists.
          const result = await ipfs.addFromFs(pinUIPath, { recursive: true });
          const { hash } = result.pop();
          const base32Hash = CIDTool.base32(hash);
          console.log(`Pinning UI build at path ${pinUIPath} with CID1/base58 hash ${hash} (base32: ${base32Hash} )`);
        }
        if (pinReportingUIPath) {
          // Assume build exists.
          const result = await ipfs.addFromFs(pinReportingUIPath, { recursive: true });
          const { hash } = result.pop();
          const base32Hash = CIDTool.base32(hash);
          console.log(`Pinning Reporting UI build at path ${pinReportingUIPath} with CID1/base58 hash ${hash} (base32: ${base32Hash} )`);
        }
      }

      sync();

      api.augur.events.once(SubscriptionEventName.NewBlock, async () => {
        const { warpSyncHash } = await api.augur.warpSync.getLastWarpSyncData(api.augur.contracts.universe.address);
        const warpSyncHash32 = warpSyncHash ? CIDTool.base32(warpSyncHash) : null;
        console.log(`\n\nPrevious Warp Sync Hash: ${warpSyncHash} ( ${warpSyncHash32} )`);

        // TODO fix: currently shows null instead of the actual current warp sync hash
        //      would work if waiting for WarpSyncHashUpdated but that takes too long to trigger
        const { state, hash } = await api.augur.getWarpSyncStatus();
        const hash32 = hash ? CIDTool.base32(hash) : null;
        console.log(`\n\nCurrent Warp Sync State: ${state} Hash: ${hash} ( ${hash32} )`);

        if (showHashAndDie) {
          process.exit(0);
        }
      });

      api.augur.events.on(SubscriptionEventName.WarpSyncHashUpdated, async () =>  {
          const { state, hash } = await api.augur.getWarpSyncStatus();
          console.log(`\n\nUpdated Warp Sync Info:\nState:\t${state}\nHash:\t${hash}`)
        }
      );

      const app = createApp(api);

      const httpServer = this.config.server?.startHTTP && runHttpServer(app, this.config);
      const httpsServer = this.config.server?.startHTTPS && runHttpsServer(app, this.config);
      const wsServer = this.config.server?.startWS && runWsServer(api, app, this.config);
      const wssServer = this.config.server?.startWSS && runWssServer(api, app, this.config);

      console.log('Running SDK server. Type ctrl-c to quit:\n');
      await waitForSigint();
      httpServer.close();
      httpsServer.close();
      wsServer.close();
      wssServer.close();
    }
  });

  flash.addScript({
    name: 'get-contract-address',
    options: [
      {
        name: 'name',
        abbr: 'n',
        description: 'Name of contract',
        required: true,
      },
      {
        name: 'removePrefix',
        abbr: 'r',
        description: 'If specified will remove the 0x prefix',
        flag: true,
      },
      {
        name: 'lower',
        abbr: 'l',
        description: 'If specified will toLowerCase the result',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const name = args.name as string;
      const removePrefix = Boolean(args.removePrefix);
      const lower = Boolean(args.lower);
      const address = formatAddress(this.config.addresses[name], { lower, prefix: !removePrefix});
      console.log(address);
    },
  });

  flash.addScript({
    name: 'get-all-contract-addresses',
    options: [
      {
        name: 'ugly',
        abbr: 'u',
        description: 'print the contract addresses for this network as a blob instead of nicely formatted',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const ugly = Boolean(args.ugly);

      if (ugly) {
        console.log(JSON.stringify(this.config?.addresses))
      } else {
        console.log(JSON.stringify(this.config?.addresses, null, 2))
      }
    },
  });

  flash.addScript({
    name: 'liquidity', // easy to rem for working locally
    async call(this: FlashSession, args: FlashArguments) {
      const attoEth = new BigNumber(10).times(_1_ETH);
      const attoCash = new BigNumber(2000).times(_1_ETH);
      const attoRep = new BigNumber(1000).times(_1_ETH);
      const user = await this.createUser(this.getAccount(), this.config);
      await user.addEthExchangeLiquidity(attoCash, attoEth);
      await user.addTokenExchangeLiquidity(attoCash, attoRep);
    },
  });

  flash.addScript({
    name: 'add-eth-exchange-liquidity',
    options: [
      {
        name: 'ethAmount',
        abbr: 'e',
        description: 'amount of ETH to provide to the exchange',
        required: true,
      },
      {
        name: 'cashAmount',
        abbr: 'c',
        description: 'amount of DAI to provide to the exchange',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const attoEth = new BigNumber(Number(args.ethAmount)).times(_1_ETH);
      const attoCash = new BigNumber(Number(args.cashAmount)).times(_1_ETH);
      const user = await this.createUser(this.getAccount(), this.config);
      await user.addEthExchangeLiquidity(attoCash, attoEth);
    },
  });

  flash.addScript({
    name: 'eth-balance',
    options: [
      {
        name: 'target',
        abbr: 't',
        description: 'which account to check. defaults to current account',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const target = args.target as string;
      const user = await this.createUser(this.getAccount(), this.config);
      const balance = await user.getEthBalance(target || this.getAccount().address);
      console.log(balance.toFixed());
    },
  });

  flash.addScript({
    name: 'cash-balance',
    options: [
      {
        name: 'target',
        abbr: 't',
        description: 'which account to check. defaults to current account',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const target = args.target as string;
      const user = await this.createUser(this.getAccount(), this.config);
      const balance = await user.getCashBalance(target || this.getAccount().address);
      console.log(balance.toFixed());
    },
  });

  flash.addScript({
    name: 'rep-balance',
    options: [
      {
        name: 'target',
        abbr: 't',
        description: 'which account to check. defaults to current account',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const target = args.target as string;
      const user = await this.createUser(this.getAccount(), this.config);
      const balance = await user.getRepBalance(target || this.getAccount().address);
      console.log(balance.toFixed());
    },
  });

  flash.addScript({
    name: 'ping',
    ignoreNetwork: true,
    async call(this: FlashSession) {
      console.log('pong');
    },
  });

  flash.addScript({
    name: 'take-order',
    options: [
      {
        name: 'market',
        abbr: 'm',
        description: 'market address/id',
        required: true,
      },
      {
        name: 'direction',
        abbr: 'd',
        description: '0 = bid/long; 1 = ask/short',
        required: true,
      },
      {
        name: 'outcome',
        abbr: 'o',
        description: '0 = invalid; for yes/no markets: 1 = no, 2 = yes',
        required: true,
      },
      {
        name: 'wait-time-for-0x',
        abbr: 'w',
        description: 'how many milliseconds to wait for 0x orders to arrive. default=90000',
      },
    ],
    async call(this: FlashSession, args: FlashArguments): Promise<void> {
      const marketAddress = args.market as string;
      const direction = Number(args.direction);
      const outcome = Number(args.outcome);
      const waitTimeForZeroX = Number(args.waitTimeFor0x) || 90000;

      const user = await this.createUser(this.getAccount(), this.deriveConfig({
        flash: { syncSDK: true },
        zeroX: { rpc: { enabled: true }},
      }));
      await waitForSync(user);
      const marketInfo = (await user.getMarketInfo(marketAddress))[0];

      console.log('Waiting for 0x orders to arrive');
      await sleep(waitTimeForZeroX);

      await takeOrder(user, marketInfo, direction, outcome);
    }});

  flash.addScript({
    name: 'perf-setup',
    options: [
      {
        name: 'market-makers',
        abbr: 'm',
        description: 'how many market makers to create. each makes 10 markets. default zero'
      },
      {
        name: 'traders',
        abbr: 't',
        description: 'how many traders to create. default zero',
      },
      {
        name: 'serial',
        abbr: 's',
        description: 'make only one contract call at a time'
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const marketMakerCount = Number(args.marketMakers || 0);
      const traderCount = Number(args.traders || 0);
      const serial = Boolean(args.serial);

      if (!marketMakerCount && !traderCount) {
        throw Error('perf-setup requires market-makers or traders to be specified');
      }

      const ethSource = await this.createUser(this.getAccount(), this.config);
      await perfSetup(ethSource, marketMakerCount, traderCount, serial, this.config);
    }
  });

  flash.addScript({
    name: 'perf-make-orders',
    options: [
      {
        name: 'market-makers',
        abbr: 'm',
        description: 'how many market makers. uses standard account range. used to infer market list',
      },
      {
        name: 'traders',
        abbr: 't',
        description: 'how many perf traders. uses standard account range',
      },
      {
        name: 'zerox-batch-size',
        abbr: 'b',
        description: 'how many 0x orders to create at a time'
      },
      {
        name: 'expiration',
        abbr: 'e',
        description: 'how many seconds until orders expire. default is 1 hour'
      },
    ],
    async call(this: FlashSession, args: FlashArguments): Promise<void> {
      const makerCount = Number(args.marketMakers || 10);
      const traderCount = Number(args.traders || 200);
      const zeroxBatchSize = Number(args.zeroxBatchSize || 25);
      const expiration = new BigNumber(args.expiration as string || 60*60);
      const { config } = setupPerfConfigAndZeroX(this.config, true);
      const ethSource = await this.createUser(this.getAccount(), config);
      const accountCreator = new AccountCreator(BASE_MNEMONIC);
      const traderAccounts = accountCreator.traders(traderCount);
      const makerAccounts = accountCreator.marketMakers(makerCount);
      const traders = await ContractAPI.wrapUsers(traderAccounts, ethSource.provider, config);

      await waitForSync(ethSource);
      const markets = await getAllMarkets(ethSource, makerAccounts);
      const shapers = setupOrderBookShapers(markets, 10, expiration);
      const orders = await setupOrders(ethSource, shapers);

      await createOrders(traders, orders, zeroxBatchSize);
      console.log(`Created ${orders.length} orders`);
    }
  });

  flash.addScript({
    name: 'perf-take-orders',
    options: [
      {
        name: 'market-makers',
        abbr: 'm',
        description: 'how many market makers. uses standard account range. used to infer market list. defaults to 10 (100 markets)',
      },
      {
        name: 'traders',
        abbr: 't',
        description: 'how many perf traders. uses standard account range. defaults to 200',
      },
      {
        name: 'limit',
        abbr: 'l',
        description: 'maximum number of orders to take. defaults to 10^20',
      },
      {
        name: 'period',
        abbr: 'p',
        description: 'how often to take orders, in milliseconds. defaults to 1000',
      },
      {
        name: 'wait-time-for-0x',
        abbr: 'w',
        description: 'how many milliseconds to wait for 0x orders to arrive. default=90000',
      },
      {
        name: 'outcomes',
        abbr: 'o',
        description: 'outcomes that can be taken. JSON-encoded array of numbers 0-7 like "[1,2]"',
      },
    ],
    async call(this: FlashSession, args: FlashArguments): Promise<void> {
      const makerCount = Number(args.marketMakers || 10);
      const traderCount = Number(args.traders || 200);
      const limit = Number(args.limit || 1e20);
      const periodMS = Number(args.period || 1000);
      const waitTimeForZeroX = Number(args.waitTimeFor0x) || 90000;
      const outcomes = JSON.parse(args.outcomes as string || '[1,2]');

      const { config } = setupPerfConfigAndZeroX(this.config, true);
      const ethSource = await this.createUser(this.getAccount(), config);
      const accountCreator = new AccountCreator(BASE_MNEMONIC);
      const traderAccounts = accountCreator.traders(traderCount);
      const makerAccounts = accountCreator.marketMakers(makerCount);
      const connector = ethSource.augur.connector
      const traders = await ContractAPI.wrapUsers(traderAccounts, ethSource.provider, config, connector);

      await waitForSync(ethSource);
      console.log('Waiting for 0x orders to arrive');
      await sleep(waitTimeForZeroX);
      const markets = await getAllMarkets(ethSource, makerAccounts);
      await takeOrders(traders, markets, periodMS, limit, outcomes);
    }});

  flash.addScript({
    name: 'perf-accounts',
    ignoreNetwork: true,
    options: [
      {
        name: 'market-makers',
        abbr: 'm',
        description: 'how many market makers. uses standard account range. used to infer market list. defaults to 10 (100 markets)',
      },
      {
        name: 'traders',
        abbr: 't',
        description: 'how many perf traders. uses standard account range. defaults to 200',
      },
    ],
    async call(this: FlashSession, args: FlashArguments): Promise<void> {
      const makerCount = Number(args.marketMakers || 10);
      const traderCount = Number(args.traders || 200);
      const accountCreator = new AccountCreator(BASE_MNEMONIC);
      const makerAccounts = accountCreator.marketMakers(makerCount);
      const traderAccounts = accountCreator.traders(traderCount);

      console.log('Market Makers:');
      makerAccounts.forEach((maker) => {
        console.log(`${maker.privateKey} -> ${maker.address}`);
      })
      console.log();
      console.log('Traders:');
      traderAccounts.forEach((trader) => {
        console.log(`${trader.privateKey} -> ${trader.address}`);
      })
    }});
  flash.addScript({
    name: 'run-chaos-monkey',
    options: [
      {
        name: 'traders',
        abbr: 't',
        description: 'how many perf traders. uses standard account range. defaults to 200',
      },
    ],
    async call(this: FlashSession, args: FlashArguments): Promise<void> {
      const traderCount = Number(args.traders || 200);
      const { config } = setupPerfConfigAndZeroX(this.config, false);
      const ethSource = await this.createUser(this.getAccount(), config);

      ethSource.augur.connector.connect(config);

      // @TODO Add flag to prevent seeding funds for already funded accounts to speedup restarts.
      const users = await perfSetup(ethSource, 0, traderCount, true, this.config);
      runChaosMonkey(ethSource.augur, users);

      console.log('Running chaos monkey trade process. Type ctrl-c to quit:\n');
      await waitForSigint();
    }});

    flash.addScript({
      name: 'add-dai-rep-exchange-liquidity',
      options: [
        {
          name: 'reputationToken',
          abbr: 'r',
          description: 'amount of REP to provide to the exchange',
          required: true,
        },
        {
          name: 'cashAmount',
          abbr: 'c',
          description: 'amount of DAI to provide to the exchange',
          required: true,
        },
      ],
      async call(this: FlashSession, args: FlashArguments) {
        const attoRep = new BigNumber(Number(args.reputationToken)).times(_1_ETH);
        const attoCash = new BigNumber(Number(args.cashAmount)).times(_1_ETH);
        const user = await this.createUser(this.getAccount(), this.config);
        await user.addTokenExchangeLiquidity(attoCash, attoRep);
      },
    });

    flash.addScript({
      name: 'get-market-ids',
      options: [
        {
          name: 'num',
          abbr: 'n',
          description: 'number of ids to get',
        },
      ],
      async call(this: FlashSession, args: FlashArguments) {
        const num = Number(args.num || 100);
        const user = await this.createUser(this.getAccount(), this.config);
        const marketIds = await getMarketIds(user, num);
        console.log(`MARKET IDS: ${JSON.stringify(marketIds)}`);
      },
    });
}
