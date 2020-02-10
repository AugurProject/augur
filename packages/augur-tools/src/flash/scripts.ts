import { deployContracts } from '../libs/blockchain';
import { FlashSession, FlashArguments } from './flash';
import { createCannedMarkets } from './create-canned-markets-and-orders';
import { _1_ETH } from '../constants';
import {
  Contracts as compilerOutput,
  getAddressesForNetwork,
  NetworkId
} from '@augurproject/artifacts';
import {
  NetworkConfiguration,
  NETWORKS,
  ContractInterfaces,
} from '@augurproject/core';
import moment from 'moment';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { ethers } from 'ethers';
import { abiV1 } from '@augurproject/artifacts';
import {
  calculatePayoutNumeratorsArray,
  QUINTILLION,
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  stringTo32ByteHex,
  numTicksToTickSizeWithDisplayPrices,
  convertOnChainPriceToDisplayPrice,
  NativePlaceTradeDisplayParams,
} from '@augurproject/sdk';
import { fork } from './fork';
import { dispute } from './dispute';
import { MarketList, MarketOrderBook } from '@augurproject/sdk/build/state/getter/Markets';
import { generateTemplateValidations } from './generate-templates';
import { spawn } from 'child_process';
import { showTemplateByHash, validateMarketTemplate } from './template-utils';
import { cannedMarkets, singleOutcomeAsks, singleOutcomeBids } from './data/canned-markets';
import { ContractAPI } from '../libs/contract-api';
import { OrderBookShaper, OrderBookConfig } from './orderbook-shaper';
import { NumOutcomes } from '@augurproject/sdk/src/state/logs/types';
import { flattenZeroXOrders } from '@augurproject/sdk/build/state/getter/ZeroXOrdersGetters';
import { sleep } from '@augurproject/sdk/build/state/utils/utils';
import { promiseSpawn } from "./util";

export function addScripts(flash: FlashSession) {
  flash.addScript({
    name: 'connect',
    description: 'Connect to an Ethereum node.',
    options: [
      {
        name: 'account',
        abbr: 'a',
        description:
          'account address to connect with, if no address provided contract owner is used',
      },
      {
        name: 'network',
        abbr: 'n',
        description:
          'Which network to connect to. Defaults to "environment" aka local node.',
      },
      {
        name: 'useSdk',
        abbr: 'u',
        description: 'a few scripts need sdk, -u to wire up sdk',
        flag: true,
      },
      {
        name: 'useZeroX',
        abbr: 'z',
        description: 'use zeroX mesh client endpoint',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const network = (args.network as NETWORKS) || 'environment';
      const account = args.account as string;
      const useSdk = args.useSdk as boolean;
      const useZeroX = args.useZeroX as boolean;
      if (account) flash.account = account;
      this.network = NetworkConfiguration.create(network);
      flash.provider = this.makeProvider(this.network);
      const networkId = await this.getNetworkId(flash.provider);
      flash.contractAddresses = getAddressesForNetwork(networkId as NetworkId);
      await flash.ensureUser(this.network, useSdk, true, null, useZeroX, useZeroX);
    },
  });

  flash.addScript({
    name: 'deploy',
    description:
      'Upload contracts to blockchain and register them with the Augur contract.',
    options: [
      {
        name: 'write-artifacts',
        abbr: 'w',
        description: 'Overwrite addresses.json.',
        flag: true,
      },
      {
        name: 'time-controlled',
        abbr: 't',
        description:
          'Use the TimeControlled contract for testing environments. Set to "true" or "false".',
        flag: true,
      },
      {
        name: 'useSdk',
        abbr: 'u',
        description: 'a few scripts need sdk, -u to wire up sdk',
        flag: true,
      },
      {
        name: 'relayer-address',
        abbr: 'r',
        description: 'gnosis relayer address'
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const useSdk = args.useSdk as boolean;
      if (this.noProvider()) return;

      console.log('Deploying: ', args);

      const config = {
        writeArtifacts: args.writeArtifacts as boolean,
        useNormalTime: !(args.timeControlled as boolean),
      };

      const { addresses } = await deployContracts(
        this.provider,
        this.accounts[0],
        compilerOutput,
        config
      );
      flash.contractAddresses = addresses;

      if (useSdk) {
        await flash.ensureUser(this.network, useSdk);
      }

      const relayerAddressArg = args.relayerAddress as string;
      const relayerAddressConfig = this.network && this.network.gnosisRelayerAddress;
      const relayerAddress = relayerAddressArg || relayerAddressConfig;
      if (relayerAddress) {
        await this.call('faucet', {
          amount: '1000000',
          target: relayerAddress,
        })
      }
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
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const target = args.target as string;
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);

      await user.faucetOnce(atto);

      // If we have a target we transfer from current account to target.
      // Cannot directly faucet to target because:
      // 1) it might not have ETH, and
      // 2) specifying sender for contract calls only works if signer is available,
      //    which is typically only true of main account and its gnosis safe
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
        description: 'Quantity',
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
        description: 'Account to send funds (defaults to current user)',
        required: false
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const endPoint = 'ws://localhost:60557';
      const user = await this.ensureUser();

      const target = String(args.target);
      const amount = Number(args.amount);
      const token = String(args.token);
      const atto = new BigNumber(amount).times(_1_ETH);

      switch(token) {
        case 'REP':
          return user.augur.contracts.getReputationToken().transfer(target, atto);
        case 'ETH':
          return user.augur.sendETH(target, atto);
        default:
          return user.augur.contracts.cash.transfer(target, atto);
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
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);

      await user.repFaucet(atto);

      // if we have a target we transfer from current account to target.
      if(args.target) {
        await user.augur.contracts.reputationToken.transfer(String(args.target), atto);
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
        description: 'payout numerators of child unverse.',
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
      const user = await this.ensureUser();
      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);
      const payout = String(args.payoutNumerators)
        .split(',')
        .map(i => new BigNumber(i));
      console.log(payout);
      await user.migrateOutByPayoutNumerators(payout, atto);
    },
  });

  flash.addScript({
    name: 'gas-limit',
    async call(this: FlashSession): Promise<number | undefined> {
      if (this.noProvider()) return undefined;

      const block = await this.provider.getBlock('latest');
      const gasLimit = block.gasLimit.toNumber();
      this.log(`Gas limit: ${gasLimit}`);
      return gasLimit;
    },
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
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const yesno = args.yesno as boolean;
      const cat = args.categorical as boolean;
      const scalar = args.scalar as boolean;
      const title = args.title ? String(args.title) : null;
      if (yesno) {
        await this.call('create-reasonable-yes-no-market', {title});
      }
      if (cat) {
        await this.call('create-reasonable-categorical-market', {outcomes: 'first,second,third,fourth,fifth'});
      }
      if (scalar) {
        await this.call('create-reasonable-scalar-market', {title});
      }

      if (!yesno && !cat && !scalar) {
        await this.call('create-reasonable-yes-no-market', {title});
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
      const title = args.title ? String(args.title) : null;
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.market = await user.createReasonableYesNoMarket(title);
      this.log(`Created YesNo market "${this.market.address}".`);
      return this.market;
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
      const user = await this.ensureUser();
      const outcomes: string[] = (args.outcomes as string)
        .split(',')
        .map(formatBytes32String);
      const title = args.title ? String(args.title) : null;
      this.market = await user.createReasonableMarket(outcomes, title);
      this.log(`Created Categorical market "${this.market.address}".`);
      return this.market;
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
      const user = await this.ensureUser();
      const title = args.title ? String(args.title) : null;
      this.market = await user.createReasonableScalarMarket(title);
      this.log(`Created Scalar market "${this.market.address}".`);
      return this.market;
    },
  });

  flash.addScript({
    name: 'create-canned-markets',
    async call(this: FlashSession) {
      const user = await this.ensureUser();
      await user.repFaucet(QUINTILLION.multipliedBy(1000000));
      await user.faucetOnce(QUINTILLION.multipliedBy(1000000));
      await user.approve(QUINTILLION.multipliedBy(3000000));

      await this.call('init-warp-sync', {});
      await this.call('add-eth-exchange-liquidity', {
        ethAmount: '4',
        cashAmount: '600'
      });
      return createCannedMarkets(user);
    },
  });

  flash.addScript({
    name: 'create-canned-markets-with-orders',
    async call(this: FlashSession) {
      await this.ensureUser();
      const markets = await this.call('create-canned-markets', {});
      for(let i = 0; i < markets.length; i++) {
        const createdMarket = markets[i];
        const numTicks = await createdMarket.market.getNumTicks_();
        const numOutcomes = await createdMarket.market.getNumberOfOutcomes_();
        const marketId = createdMarket.market.address;
        const skipFaucetOrApproval = true;
        if(numOutcomes.gt(new BigNumber(3))) {
          await this.call('create-cat-zerox-orders', {marketId, numOutcomes: numOutcomes.toString(), skipFaucetOrApproval});
        } else {
          if (numTicks.eq(new BigNumber(100))) {
            await this.call('create-yesno-zerox-orders', {marketId, skipFaucetOrApproval});
          } else {
            try {
              const maxPrice = createdMarket.canned.maxPrice;
              const minPrice = createdMarket.canned.minPrice;
              await this.call('create-scalar-zerox-orders', {marketId, maxPrice, minPrice, numTicks: numTicks.toString(), skipFaucetOrApproval});
            } catch(e) {
              console.log('could not create orders for scalar market', e)
            }
          }
        }
      }
    },
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
      {
        name: 'network',
        abbr: 'n',
        description:
          'Which network to connect to. Defaults to "environment" aka local node.',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const market = String(args.marketId);
      const user = await this.ensureUser(this.network, true, true, null, true, true);
      const skipFaucetApproval = args.skipFaucetOrApproval as boolean;
      if (!skipFaucetApproval) {
        await user.faucetOnce(QUINTILLION.multipliedBy(1000000));
        await user.approve(QUINTILLION.multipliedBy(1000000));
      }
      const yesNoMarket = cannedMarkets.find(c => c.marketType === 'yesNo');
      const orderBook = yesNoMarket.orderBook;
      const timestamp = await this.call('get-timestamp', {});
      const tradeGroupId = String(Date.now());
      const oneHundredDays = new BigNumber(8640000);
      const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
      const orders = [];
      for (let a = 0; a < Object.keys(orderBook).length; a++) {
        const outcome = Number(Object.keys(orderBook)[a]) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
        const buySell = Object.values(orderBook)[a];

        const { buy, sell } = buySell;

        for (const { shares, price } of buy) {
          this.log(`creating buy order, ${shares} @ ${price}`);
          orders.push({
            direction: 0,
            market,
            numTicks: new BigNumber(100),
            numOutcomes: 3,
            outcome,
            tradeGroupId,
            fingerprint: formatBytes32String('11'),
            doNotCreateOrders: false,
            displayMinPrice: new BigNumber(0),
            displayMaxPrice: new BigNumber(1),
            displayAmount: new BigNumber(shares),
            displayPrice: new BigNumber(price),
            displayShares: new BigNumber(0),
            expirationTime,
          });
        }

        for (const { shares, price } of sell) {
          this.log(`creating sell order, ${shares} @ ${price}`);
          orders.push({
            direction: 1,
            market,
            numTicks: new BigNumber(100),
            numOutcomes: 3,
            outcome,
            tradeGroupId,
            fingerprint: formatBytes32String('11'),
            doNotCreateOrders: false,
            displayMinPrice: new BigNumber(0),
            displayMaxPrice: new BigNumber(1),
            displayAmount: new BigNumber(shares),
            displayPrice: new BigNumber(price),
            displayShares: new BigNumber(0),
            expirationTime,
          });
        }
      }
      await user.placeZeroXOrders(orders).catch(e => console.log(e));
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
        description: 'number of outcomes the market has',
      },
      {
        name: 'skipFaucetOrApproval',
        flag: true,
        description: 'do not faucet or approve, has already been done'
      },
      {
        name: 'network',
        abbr: 'n',
        description:
          'Which network to connect to. Defaults to "environment" aka local node.',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const market = String(args.marketId);
      const numOutcomes = Number(args.numOutcomes);
      const user = await this.ensureUser(this.network, true, true, null, true, true);
      const skipFaucetApproval = args.skipFaucetOrApproval as boolean;
      if (!skipFaucetApproval) {
        await user.faucetOnce(QUINTILLION.multipliedBy(1000000));
        await user.approve(QUINTILLION.multipliedBy(1000000));
      }

      const orderBook = {
        1: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        2: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        3: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        4: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        5: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        6: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        7: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
      };

      const timestamp = await this.call('get-timestamp', {});
      const tradeGroupId = String(Date.now());
      const oneHundredDays = new BigNumber(8640000);
      const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
      const orders = []
      for (let a = 0; a < numOutcomes; a++) {
        const outcome = Number(Object.keys(orderBook)[a]) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
        const buySell = Object.values(orderBook)[a];

        const { buy, sell } = buySell;

        for (const { shares, price } of buy) {
          this.log(`creating buy order, ${shares} @ ${price}`);
          orders.push({
            direction: 0,
            market,
            numTicks: new BigNumber(100),
            numOutcomes: 3,
            outcome,
            tradeGroupId,
            fingerprint: formatBytes32String('11'),
            doNotCreateOrders: false,
            displayMinPrice: new BigNumber(0),
            displayMaxPrice: new BigNumber(1),
            displayAmount: new BigNumber(shares),
            displayPrice: new BigNumber(price),
            displayShares: new BigNumber(0),
            expirationTime,
          });
        }

        for (const { shares, price } of sell) {
          this.log(`creating sell order, ${shares} @ ${price}`);
          orders.push({
            direction: 1,
            market,
            numTicks: new BigNumber(100),
            numOutcomes: 3,
            outcome,
            tradeGroupId,
            fingerprint: formatBytes32String('11'),
            doNotCreateOrders: false,
            displayMinPrice: new BigNumber(0),
            displayMaxPrice: new BigNumber(1),
            displayAmount: new BigNumber(shares),
            displayPrice: new BigNumber(price),
            displayShares: new BigNumber(0),
            expirationTime,
          });
        }
      }
      await user.placeZeroXOrders(orders).catch(e => console.log(e));
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
      {
        name: 'network',
        abbr: 'n',
        description:
          'Which network to connect to. Defaults to "environment" aka local node.',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const market = String(args.marketId);
      const user = await this.ensureUser(this.network, true, true, null, true, true);
      const skipFaucetApproval = args.skipFaucetOrApproval as boolean;
      if (!skipFaucetApproval) {
        await user.faucetOnce(QUINTILLION.multipliedBy(1000000));
        await user.approve(QUINTILLION.multipliedBy(1000000));
      }

      const timestamp = await this.call('get-timestamp', {});
      const tradeGroupId = String(Date.now());
      const oneHundredDays = new BigNumber(8640000);
      const onInvalid = args.onInvalid as boolean;
      const numTicks = new BigNumber(String(args.numTicks));
      const maxPrice = new BigNumber(String(args.maxPrice));
      const minPrice = new BigNumber(String(args.minPrice));
      const tickSize = numTicksToTickSizeWithDisplayPrices(numTicks, minPrice, maxPrice);
      const midPrice = maxPrice.minus((numTicks.dividedBy(2)).times(tickSize));

      const orderBook = {
        2: {
          buy: [
              { shares: '30', price: midPrice.plus(tickSize.times(3)) },
              { shares: '20', price: midPrice.plus(tickSize.times(2)) },
              { shares: '10', price: midPrice.plus(tickSize) },
          ],
          sell: [
              { shares: '10', price: midPrice.minus(tickSize) },
              { shares: '20', price: midPrice.minus(tickSize.times(2)) },
              { shares: '30', price: midPrice.minus(tickSize.times(3)) },
          ],
        },
      };
      const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
      const orders = [];
      for (let a = 0; a < Object.keys(orderBook).length; a++) {
        const outcome = !onInvalid ? Number(Object.keys(orderBook)[a]) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 : 0;
        const buySell = Object.values(orderBook)[a];

        const { buy, sell } = buySell;

        for (const { shares, price } of buy) {
          this.log(`creating buy order, ${shares} @ ${price}`);
          const order = {
            direction: 0 as 0 | 1,
            market,
            numTicks,
            numOutcomes: 3 as 3 | 4 | 5 | 6 | 7,
            outcome,
            tradeGroupId,
            fingerprint: formatBytes32String('11'),
            doNotCreateOrders: false,
            displayMinPrice: minPrice,
            displayMaxPrice: maxPrice,
            displayAmount: new BigNumber(shares),
            displayPrice: new BigNumber(price),
            displayShares: new BigNumber(0),
            expirationTime,
          };
          console.log(JSON.stringify(order));
          orders.push(order);
        }

        for (const { shares, price } of sell) {
          this.log(`creating sell order, ${shares} @ ${price}`);
          const order = {
            direction: 1 as 0 | 1,
            market,
            numTicks,
            numOutcomes: 3 as 3 | 4 | 5 | 6 | 7,
            outcome,
            tradeGroupId,
            fingerprint: formatBytes32String('11'),
            doNotCreateOrders: false,
            displayMinPrice: minPrice,
            displayMaxPrice: maxPrice,
            displayAmount: new BigNumber(shares),
            displayPrice: new BigNumber(price),
            displayShares: new BigNumber(0),
            expirationTime,
          };
          console.log(JSON.stringify(order));
          orders.push(order);
        }
      }
      await user.placeZeroXOrders(orders);
    },
  });

  flash.addScript({
    name: 'get-market-order-book',
    options: [
      {
        name: 'marketId',
        abbr: 'm',
        description: 'Show orders that have been placed on the book of this marketId'
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const user: ContractAPI = await this.ensureUser(this.network, true, true, null, true, true);
      await new Promise<void>(resolve => setTimeout(resolve, 90000));
      const result = await user.augur.getMarketOrderBook({ marketId: String(args.marketId)});
      this.log(JSON.stringify(result));
      return result;
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
      {
        name: 'userAccount',
        abbr: 'u',
        description: 'User account to create orders, if not provider contract owner is used'
      },
      {
        name: 'network',
        abbr: 'n',
        description:
          'Which network to connect to. Defaults to "environment" aka local node.',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const numMarkets = args.numMarkets ? Number(args.numMarkets) : 10;
      const userAccount = args.userAccount ? args.userAccount as string : null;
      const user: ContractAPI = await this.ensureUser(this.network, true, true, userAccount, true, true);
      const timestamp = await user.getTimestamp();
      const ids: string[] = [];
      for(let i = 0; i < numMarkets; i++) {
        const title = `YesNo market: ${timestamp} Number ${i} with orderbook mgr`;
        const market: ContractInterfaces.Market = await user.createReasonableYesNoMarket(title);
        ids.push(market.address);
      }
      const marketIds = ids.join(',');
      await this.call('simple-orderbook-shaper', {marketIds, userAccount});
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
        name: 'userAccount',
        abbr: 'u',
        description:
          'User account to create orders, if not provided then contract owner is used',
      },
      {
        name: 'network',
        abbr: 'n',
        description:
          'Which network to connect to. Defaults to "environment" aka local node.',
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
        description: 'number of added seconds to order will live, default is five minutes',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const marketIds = String(args.marketIds)
        .split(',')
        .map(id => id.trim());
      const address = args.userAccount ? (args.userAccount as string) : null;
      const interval = args.refreshInterval ? Number(args.refreshInterval) * 1000 : 15000;
      const orderSize = args.orderSize ? Number(args.orderSize) : null;
      const expiration = args.expiration ? new BigNumber(String(args.expiration)) : new BigNumber(300); // five minutes
      const user: ContractAPI = await this.ensureUser(this.network, true, true, address, true, true);
      console.log('waiting many seconds on purpose for client to sync');
      await new Promise<void>(resolve => setTimeout(resolve, 90000));

      const orderBooks = marketIds.map(m => new OrderBookShaper(m, orderSize, expiration));
      while (true) {
        const timestamp = await this.user.getTimestamp();
        for (let i = 0; i < orderBooks.length; i++) {
          const orderBook: OrderBookShaper = orderBooks[i];
          const marketId = orderBook.marketId;
          const marketBook: MarketOrderBook = await this.user.augur.getMarketOrderBook(
            { marketId }
          );
          const orders = orderBook.nextRun(marketBook, new BigNumber(timestamp));
          if (orders.length > 0) {
            this.log(`creating ${orders.length} orders for ${marketId}`);
            orders.map(order => console.log(`Creating ${order.displayAmount} at ${order.displayPrice} on outcome ${order.outcome}`));
            await user.placeZeroXOrders(orders).catch(this.log);
          }
        }
        await new Promise<void>(resolve => setTimeout(resolve, interval));
      }

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
        name: 'userAccount',
        abbr: 'u',
        description:
          'User account to create orders, if not provided then contract owner is used',
      },
      {
        name: 'network',
        abbr: 'n',
        description:
          'Which network to connect to. Defaults to "environment" aka local node.',
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
        description: 'number of added seconds to order will live, default is five minutes',
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
      const marketIds = String(args.marketIds)
        .split(',')
        .map(id => id.trim());
      const orderOutcomes: number[] = (args.outcomes ? String(args.outcomes) : "2,1")
        .split(',')
        .map(id => Number(id.trim()));
      const address = args.userAccount ? (args.userAccount as string) : null;
      const interval = args.delayBetweenBursts ? Number(args.delayBetweenBursts) * 1000 : 1000;
      const numOrderLimit = args.numOrderLimit ? Number(args.numOrderLimit) : 100;
      const burstRounds = args.burstRounds ? Number(args.burstRounds) : 10;
      const orderSize = args.orderSize ? Number(args.orderSize) : 10;
      const expiration = args.expiration ? new BigNumber(String(args.expiration)) : new BigNumber(300); // five minutes
      const user: ContractAPI = await this.ensureUser(this.network, true, true, address, true, true);
      console.log('waiting many seconds on purpose for client to sync');
      await new Promise<void>(resolve => setTimeout(resolve, 90000));
      const skipFaucetOrApproval = args.skipFaucetOrApproval as boolean;
      if (!skipFaucetOrApproval) {
        this.log('order-firehose, faucet and approval');
        await user.faucetOnce(QUINTILLION.multipliedBy(10000));
        await user.approve(QUINTILLION.multipliedBy(100000));
      }
      // create tight orderbook config
      let bids = {};
      let asks = {};
      for(let i = 1; i < 49; i++) { bids[((0.01 * i).toString().slice(0, 4))] = orderSize }
      for(let i = 50; i < 99; i++) { asks[((0.01 * i).toString().slice(0, 4))] = orderSize }
      let config: OrderBookConfig = {bids, asks};
      const shapers = marketIds.map(m => new OrderBookShaper(m, null, expiration, orderOutcomes, config));
      let i = 0;
      for(i; i < burstRounds; i++) {
        const timestamp = await this.user.getTimestamp();
        for (let i = 0; i < shapers.length; i++) {
          const shaper: OrderBookShaper = shapers[i];
          const marketId = shaper.marketId;
          const orders = shaper.nextRun({ marketId, orderBook: {} }, new BigNumber(timestamp));
          if (orders.length > 0) {
            let totalOrdersCreated = 0;
            while(totalOrdersCreated < numOrderLimit) {
              const ordersLeft = numOrderLimit - totalOrdersCreated;
              const grabAmount = Math.min(ordersLeft, orders.length);
              const createOrders = orders.splice(0, grabAmount);
              createOrders.map(order => console.log(`${order.market} Creating ${order.displayAmount} at ${order.displayPrice} on outcome ${order.outcome}`));
              await user.placeZeroXOrders(createOrders).catch(this.log);
              totalOrdersCreated = totalOrdersCreated + createOrders.length;
            }
          }
        }
        console.log(`pausing before next burst of ${numOrderLimit} orders, waiting ${interval} ms`);
        await new Promise<void>(resolve => setTimeout(resolve, interval));
      }

    },
  });

  flash.addScript({
    name: 'create-market-order',
    options: [
      {
        name: 'userAccount',
        abbr: 'u',
        description: 'user account to create the order',
      },
      {
        name: 'marketId',
        abbr: 'm',
        description:
          'ASSUMES: binary or categorical markets, market id to place the order',
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const address = args.userAccount as string;
      const isZeroX = args.zerox as boolean;
      const fillOrder = args.fillOrder as boolean;
      let user: ContractAPI = null;

      if (isZeroX) {
        user = await this.ensureUser(this.network, true, true, address, true, true);
      } else {
        user = await this.ensureUser(null, true, true, address);
      }
      const skipFaucetOrApproval = args.skipFaucetOrApproval as boolean;
      if (!skipFaucetOrApproval) {
        this.log('create-market-order, faucet and approval');
        await user.faucetOnce(QUINTILLION.multipliedBy(10000));
        await user.approve(QUINTILLION.multipliedBy(100000));
      }
      const orderType = String(args.orderType).toLowerCase();
      const type = orderType === 'bid' || orderType === 'buy' ? 0 : 1;

      const onChainShares = convertDisplayAmountToOnChainAmount(
        new BigNumber(String(args.amount)),
        new BigNumber(100)
      );
      const onChainPrice = convertDisplayPriceToOnChainPrice(
        new BigNumber(String(Number(args.price).toFixed(2))),
        new BigNumber(0),
        new BigNumber('0.01')
      );
      const nullOrderId = stringTo32ByteHex('');
      const tradeGroupId = stringTo32ByteHex('tradegroupId');
      let result = null;
      if (isZeroX) {
        const timestamp = await this.call('get-timestamp', {});
        const oneHundredDays = new BigNumber(8640000);
        const expirationTime = new BigNumber(timestamp).plus(oneHundredDays);
        const onChainPrice = convertDisplayPriceToOnChainPrice(
          new BigNumber(String(Number(args.price).toFixed(2))),
          new BigNumber(0),
          new BigNumber('0.01')
        );
        const price = convertOnChainPriceToDisplayPrice(
          onChainPrice,
          new BigNumber(0),
          new BigNumber('0.01')
        );
        const params = {
          direction: type as 0 | 1,
          market : String(args.marketId),
          numTicks: new BigNumber(100),
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
          this.log(e);
        }
      } else {
        fillOrder ?
        await user.takeBestOrder(
          String(args.marketId),
          new BigNumber(type),
          onChainShares,
          onChainPrice,
          new BigNumber(String(args.outcome)),
          tradeGroupId
        ) :
        await user.placeOrder(
          String(args.marketId),
          new BigNumber(type),
          onChainShares,
          onChainPrice,
          new BigNumber(String(args.outcome)),
          nullOrderId,
          nullOrderId,
          tradeGroupId
        );
      }
      this.log(`place order ${result}`);

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
        name: 'userAccount',
        abbr: 'u',
        description: 'user account to create the order',
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
      const skipFaucet = args.skipFaucet as boolean;
      const address = args.userAccount ? String(args.userAccount) : null;
      const marketId = args.market ? String(args.market) : null;
      const limit = args.limit ? Number(args.limit) : 86400000; // go for a really long time
      const orderType = args.orderType ? String(args.orderType) : 'bid';
      const outcome = args.outcome ? Number(args.outcome) : 2;
      const wait = Number(String(args.wait)) || 1;

      const user: ContractAPI = await this.ensureUser(this.network, true, true, address, true, true);

      if (!skipFaucet) {
        console.log('fauceting ...');
        const funds = new BigNumber(1e18).multipliedBy(1000000);
        await user.faucetOnce(funds);
        await user.approve(funds);
      }

      const markets = (await user.getMarkets()).markets;
      const market = marketId ? markets.find(m => m.id === marketId) : markets[0];

      const direction = orderType === 'bid' || orderType === 'buy' ? '0' : '1';
      const takeDirection = direction === '0' ? 1 : 0;
      let i = 0;
      for(i; i < limit; i++) {
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
        name: 'createMarkets',
        abbr: 'c',
        description:
          'create canned markets',
        flag: true,
      },
      {
        name: 'relayer-address',
        abbr: 'r',
        description: 'gnosis relayer address'
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      await this.call('deploy', {
        writeArtifacts: true,
        timeControlled: true,
        relayer_address: args.relayerAddress as string,
      });
      const createMarkets = args.createMarkets as boolean;
      if (createMarkets) {
        await this.call('create-canned-markets', {});
      }
    },
  });

  flash.addScript({
    name: 'normal-all',
    options: [
      {
        name: 'createMarkets',
        abbr: 'c',
        description:
          'create canned markets',
        flag: true,
      },
      {
        name: 'relayer-address',
        abbr: 'r',
        description: 'gnosis relayer address'
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      await this.call('deploy', {
        writeArtifacts: true,
        timeControlled: false,
        relayer_address: args.relayerAddress as string,
      });
      const createMarkets = args.createMarkets as boolean;
      if (createMarkets) {
        await this.call('create-canned-markets', {});
      }
    },
  });

  flash.addScript({
    name: 'all-logs',
    options: [
      {
        name: 'quiet',
        abbr: 'q',
        description:
          'Do not print anything (just returns). Only useful in interactive mode.',
        flag: true,
      },
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
      if (this.noProvider()) return [];
      const user = await this.ensureUser(null, false, false);
      const quiet = args.quiet as boolean;
      const v1 = args.v1 as boolean;
      const fromBlock = Number(args.from || 0);
      const toBlock =
        args.to === null || args.to === 'latest' ? 'latest' : Number(args.to);

      const logs = await this.provider.getLogs({
        address: user.augur.addresses.Augur,
        fromBlock,
        toBlock,
        topics: [],
      });

      const logsWithBlockNumber = logs.map(log => ({
        ...log,
        logIndex: log.logIndex || 0,
        transactionHash: log.transactionHash || '',
        transactionIndex: log.transactionIndex || 0,
        transactionLogIndex: log.transactionLogIndex || 0,
        blockNumber: log.blockNumber || 0,
        blockHash: log.blockHash || '0',
        removed: log.removed || false,
      }));

      let parsedLogs = user.augur.contractEvents.parseLogs(logsWithBlockNumber);

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

      if (!quiet) {
        this.log(JSON.stringify(parsedLogs, null, 2));
      }
      return parsedLogs;
    },
  });

  flash.addScript({
    name: 'whoami',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.log(`You are ${user.account.publicKey}\n`);
    },
  });

  flash.addScript({
    name: 'generate-templates',
    async call(this: FlashSession) {
      generateTemplateValidations().then(() => {
        this.log('Generated Templates to augur-artifacts\n');
      });
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
      const hash = String(args.hash);
      this.log(hash);
      const template = showTemplateByHash(hash);
      if (!template) this.log(`Template not found for hash ${hash}`);
      this.log(JSON.stringify(template, null, ' '));
      return template;
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
      }
    ],
    async call(this: FlashSession, args: FlashArguments) {
      let result = null;
      try {
        const title = String(args.title);
        const templateInfo = String(args.templateInfo);
        const outcomesString = String(args.outcomes);
        const resolutionRules = String(args.resolutionRules);
        const endTime = Number(args.endTime);
        result = validateMarketTemplate(title, templateInfo, outcomesString, resolutionRules, endTime);
        this.log(result);
      } catch (e) {
        this.log(e);
      }
      return result;
    },
  });

  flash.addScript({
    name: 'get-timestamp',
    async call(this: FlashSession) {
      if (this.noProvider()) return 0;
      const user = await this.contractOwner();

      const blocktime = await user.getTimestamp();
      const epoch = Number(blocktime.toString()) * 1000;

      this.log(`block: ${blocktime}`);
      this.log(`local: ${moment(epoch).toString()}`);
      this.log(
        `utc: ${moment(epoch)
          .utc()
          .toString()}\n`
      );
      return blocktime;
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
      const user = await this.contractOwner();

      const timestamp = args.timestamp as string;
      const format = (args.format as string) || undefined;

      let epoch = Number(timestamp);
      if (isNaN(epoch)) {
        epoch = moment(timestamp, format).valueOf();
      }

      await user.setTimestamp(new BigNumber(epoch));
      await this.call('get-timestamp', {});
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
      const user = await this.contractOwner();

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

      await this.call('get-timestamp', {});
      this.log(`changing timestamp to ${newTime.unix()}`);
      await user.setTimestamp(new BigNumber(newTime.unix()));
      await this.call('get-timestamp', {});
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
        name: 'outcome',
        abbr: 'o',
        description:
          'outcome of the market, non scalar markets 0,1,3,... for scalar markets use price',
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
        name: 'isInvalid',
        abbr: 'i',
        description:
          'isInvalid flag is used only for scalar markets (optional)',
        required: false,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const marketId = args.marketId as string;
      const outcome = Number(args.outcome);
      const extraStake = args.extraStake as string;
      const desc = args.description as string;
      const isInvalid = args.isInvalid as boolean;
      let preEmptiveStake = '0';
      if (extraStake) {
        preEmptiveStake = new BigNumber(extraStake)
          .multipliedBy(QUINTILLION)
          .toFixed();
      }
      if (!this.usingSdk) {
        this.log('This script needs sdk, make sure to connect with -u flag');
      }
      if (!this.sdkReady) this.log("SDK hasn't fully syncd, need to wait");

      const market: ContractInterfaces.Market = await user.getMarketContract(
        marketId
      );
      const marketInfos = await user.getMarketInfo(marketId);
      if (!marketInfos || marketInfos.length === 0) {
        return this.log(`Error: marketId: ${marketId} not found`);
      }
      const marketInfo = marketInfos[0];
      const payoutNumerators = calculatePayoutNumeratorsArray(
        marketInfo.maxPrice,
        marketInfo.minPrice,
        marketInfo.numTicks,
        marketInfo.numOutcomes,
        marketInfo.marketType,
        outcome,
        isInvalid
      );

      await user.doInitialReport(
        market,
        payoutNumerators,
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
        name: 'outcome',
        abbr: 'o',
        description:
          'outcome of the market, non scalar markets 0,1,3,... for scalar markets use price',
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
        name: 'isInvalid',
        abbr: 'i',
        description:
          'isInvalid flag is used only for scalar markets (optional)',
        required: false,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const marketId = args.marketId as string;
      const outcome = Number(args.outcome);
      const amount = args.amount as string;
      const desc = args.description as string;
      const isInvalid = args.isInvalid as boolean;
      if (amount === '0') return this.log('amount of REP is required');
      const stake = new BigNumber(amount).multipliedBy(QUINTILLION);

      if (!this.usingSdk) {
        return this.log(
          'This script needs sdk, make sure to connect with -u flag'
        );
      }
      if (!this.sdkReady) {
        return this.log("SDK hasn't fully syncd, need to wait");
      }

      const market: ContractInterfaces.Market = await user.getMarketContract(
        marketId
      );
      const marketInfos = await user.getMarketInfo(marketId);
      if (!marketInfos || marketInfos.length === 0) {
        return this.log(`Error: marketId: ${marketId} not found`);
      }
      const marketInfo = marketInfos[0];
      const payoutNumerators = calculatePayoutNumeratorsArray(
        marketInfo.maxPrice,
        marketInfo.minPrice,
        marketInfo.numTicks,
        marketInfo.numOutcomes,
        marketInfo.marketType,
        outcome,
        isInvalid
      );

      await user.contribute(market, payoutNumerators, stake, desc);
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
        name: 'outcome',
        abbr: 'o',
        description:
          'outcome of the market, non scalar markets 0,1,3,... for scalar markets use price',
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
        name: 'isInvalid',
        abbr: 'i',
        description:
          'isInvalid flag is used only for scalar markets (optional)',
        required: false,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const marketId = args.marketId as string;
      const outcome = Number(args.outcome);
      const amount = args.amount as string;
      const desc = args.description as string;
      const isInvalid = args.isInvalid as boolean;
      if (amount === '0') return this.log('amount of REP is required');
      const stake = new BigNumber(amount).multipliedBy(QUINTILLION);

      if (!this.usingSdk) {
        return this.log(
          'This script needs sdk, make sure to connect with -u flag'
        );
      }
      if (!this.sdkReady) {
        return this.log("SDK hasn't fully syncd, need to wait");
      }

      const market: ContractInterfaces.Market = await user.getMarketContract(
        marketId
      );
      const marketInfos = await user.getMarketInfo(marketId);
      if (!marketInfos || marketInfos.length === 0) {
        return this.log(`Error: marketId: ${marketId} not found`);
      }
      const marketInfo = marketInfos[0];
      const payoutNumerators = calculatePayoutNumeratorsArray(
        marketInfo.maxPrice,
        marketInfo.minPrice,
        marketInfo.numTicks,
        marketInfo.numOutcomes,
        marketInfo.marketType,
        outcome,
        isInvalid
      );

      await user.contributeToTentative(market, payoutNumerators, stake, desc);
    },
  });

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
      const user = await this.ensureUser();
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
      const user = await this.ensureUser(this.network, true);
      let marketId = (args.marketId as string) || null;

      if (marketId === null) {
        const market = await user.createReasonableYesNoMarket();
        marketId = market.address;
        this.log(`Created market ${marketId}`);
      }

      await sleep(2000);
      const marketInfo = (await this.api.route('getMarketsInfo', {
        marketIds: [marketId],
      }))[0];

      if (await fork(user, marketInfo)) {
        this.log('Fork successful!');
      } else {
        this.log('ERROR: forking failed.');
      }
    },
  });

  flash.addScript({
    name: 'dispute',
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
      const user = await this.ensureUser(this.network, true);
      const slow = args.slow as boolean;
      const rounds = args.rounds ? Number(args.rounds) : 0;

      let marketId = (args.marketId as string) || null;
      if (marketId === null) {
        const market = await user.createReasonableYesNoMarket();
        marketId = market.address;
        this.log(`Created market ${marketId}`);
      }

      await sleep(2000);
      const marketInfo = (await this.api.route('getMarketsInfo', {
        marketIds: [marketId],
      }))[0];

      await dispute(user, marketInfo, slow, rounds);
    },
  });

  flash.addScript({
    name: 'markets',
    async call(this: FlashSession): Promise<MarketList | null> {
      if (this.noProvider()) return null;
      const user = await this.ensureUser(this.network, true);

      const markets: MarketList = await this.api.route('getMarkets', {
        universe: user.augur.contracts.universe.address,
      });
      console.log(JSON.stringify(markets, null, 2));
      return markets;
    },
  });

  flash.addScript({
    name: 'network-id',
    async call(this: FlashSession): Promise<string> {
      if (this.noProvider()) return null;

      const networkId = await this.provider.getNetworkId();
      console.log(networkId);
      return networkId;
    },
  });

  flash.addScript({
    name: 'check-safe-registration',
    options: [
      {
        name: 'target',
        abbr: 't',
        description: 'address to check registry contract for the safe address.',
      },
    ],
    async call(
      this: FlashSession,
      args: FlashArguments
    ): Promise<void> {
      if (this.noProvider()) return null;
      const user = await this.ensureUser(this.network, false, false);

      const result = await user.augur.contracts.gnosisSafeRegistry.getSafe_(args['target'] as string);
      console.log(result);
  }});

  flash.addScript({
    name: 'get-safe-nonce',
    options: [
      {
        name: 'target',
        abbr: 't',
        description: 'address to check registry contract for the safe address.',
      },
    ],
    async call(
      this: FlashSession,
      args: FlashArguments
    ): Promise<void> {
      if (this.noProvider()) return null;
      const user = await this.ensureUser(this.network, false);
      const gnosisSafe = await user.augur.contracts.gnosisSafeFromAddress(args['target'] as string);

      console.log((await gnosisSafe.nonce_()).toString());
  }});

  flash.addScript({
    name: 'docker-all',
    options: [
      {
        name: 'dev',
        abbr: 'd',
        description: 'Deploy to node instead of using pop-docker image',
        flag: true,
      },
      {
        name: 'fake',
        abbr: 'f',
        description: 'Use fake time (TimeControlled) instead of real time',
        flag: true,
      },
      {
        name: 'attached-gnosis',
        abbr: 'a',
        description: 'Keep flash script running by not detaching gnosis relay',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const dev = args.dev as boolean;
      const fake = args.dev as boolean;
      const attachedGnosis = args.attachedGnosis as boolean;

      await promiseSpawn('docker', 'pull', 'augurproject/safe-relay-service_web:latest');
      await promiseSpawn('docker', 'pull', '0xorg/mesh:latest');

      this.log(`Deploy contracts: ${dev}`);
      this.log(`Use fake time: ${fake}`);

      let geth;
      if (dev) {
        // TODO figure out how must handle geth here. can it be promiseSpawn? any thing to await on?
        //      update: process spawns another process, which is unkillable. use non-detached version?
        geth = spawn('yarn', [
          'workspace',
          '@augurproject/tools',
          'docker:geth'
        ]);
        geth.on('error', (err) => {
          throw err;
        });

        const deployMethod = fake ? 'fake-all' : 'normal-all';
        this.route(deployMethod, { createMarkets: true });

      } else {
        const gethDocker = fake ? 'docker:geth:pop' : 'docker:geth:pop-normal-time';
        geth = spawn('yarn', [gethDocker]);
      }

      // TODO is this necessary?
      await promiseSpawn('yarn', 'build');

      const gnosisRelayArgs = [
        'workspace', '@augurproject/gnosis-relay-api', 'run-relay'
      ];
      if (!attachedGnosis) gnosisRelayArgs.push('-d');
      const gnosisRelay = spawn('yarn', gnosisRelayArgs);
    }
  });

  flash.addScript({
    name: '0x-docker',
    async call(this: FlashSession) {
      if (this.noProvider()) return null;

      const networkId = await this.provider.getNetworkId();
      // const ethNode = this.network.http;
      const ethNode = 'http://geth:8545';
      const addresses = getAddressesForNetwork(networkId as NetworkId);

      console.log(`Starting 0x mesh. chainId=${networkId} ethnode=${ethNode}`);

      const mesh = spawn('docker', [
        'run',
        '--rm',
        '--network', 'augur',
        '--name', '0x',
        '-p', '60557:60557', // rpc_port_number
        '-p', '60558:60558', // P2PTCPPort
        '-p', '60559:60559', // P2PWebSocketsPort
        '-e', `ETHEREUM_CHAIN_ID=${networkId}`,
        '-e', `ETHEREUM_RPC_URL=${ethNode}`,
        '-e', 'USE_BOOTSTRAP_LIST=false',
        '-e', 'BLOCK_POLLING_INTERVAL=1s',
        '-e', 'ETHEREUM_RPC_MAX_REQUESTS_PER_24_HR_UTC=169120', // needed when polling interval is 1s
        '-e', `CUSTOM_CONTRACT_ADDRESSES=${JSON.stringify(addresses)}`,
        '-e', `CUSTOM_ORDER_FILTER={"properties":{"makerAssetData":{"pattern":".*${addresses.ZeroXTrade.slice(2).toLowerCase()}.*"}}}`,
        '-e', 'VERBOSITY=4', // 5=debug 6=trace
        '-e', 'RPC_ADDR=0x:60557', // need to use "0x" network
        '0xorg/mesh:9.0.0',
      ]);

      mesh.on('error', console.error);
      mesh.on('exit', (code, signal) => {
        console.log(`Exiting 0x mesh with code=${code} and signal=${signal}`)
      });
      mesh.stdout.on('data', (data) => {
        console.log(data.toString());
      });
      mesh.stderr.on('data', (data) => {
        console.error(data.toString());
      });
    },
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
    async call(
      this: FlashSession,
      args: FlashArguments
    ): Promise<string> {
      const name = args.name as string;
      const removePrefix = args.removePrefix as boolean;
      const lower = args.lower as boolean;
      let address = this.contractAddresses[name];
      if (removePrefix) {
        address = address.slice(2);
      }
      if (lower) {
        address = address.toLowerCase();
      }
      console.log(address);
      return address;
    },
  });

  flash.addScript({
    name: 'get-all-contract-addresses',
    options: [
      {
        name: 'ugly',
        abbr: 'u',
        description: 'print the addresses json as a blob instead of nicely formatted',
        flag: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const ugly = args.ugly as boolean;
      if (this.noProvider()) return;

      if (ugly) {
        console.log(JSON.stringify(this.contractAddresses))
      } else {
        console.log(JSON.stringify(this.contractAddresses, null, 2))
      }
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

      const user = await this.ensureUser();

      await user.addEthExchangeLiquidity(attoCash, attoEth);
    },
  });

  flash.addScript({
    name: 'init-warp-sync',
    async call(this: FlashSession, args: FlashArguments) {
      const user = await this.ensureUser();

      await user.initWarpSync(user.augur.contracts.universe.address);
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
    async call(this: FlashSession, args: FlashArguments): Promise<BigNumber> {
      const target = args.target as string;
      const user = await this.ensureUser();
      const balance = await user.getEthBalance(target || this.account);
      this.log(balance.toFixed());
      return balance;
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
    async call(this: FlashSession, args: FlashArguments): Promise<BigNumber> {
      const target = args.target as string;
      const user = await this.ensureUser();
      const balance = await user.getCashBalance(target || this.account);
      this.log(balance.toFixed());
      return balance;
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
    async call(this: FlashSession, args: FlashArguments): Promise<BigNumber> {
      const target = args.target as string;
      const user = await this.ensureUser();
      const balance = await user.getRepBalance(target || this.account);
      this.log(balance.toFixed());
      return balance;
    },
  });
}
