import { deployContracts } from '../libs/blockchain';
import { FlashSession, FlashArguments } from './flash';
import { createCannedMarketsAndOrders } from './create-canned-markets-and-orders';
import { _1_ETH } from '../constants';
import {
  Contracts as compilerOutput,
  Addresses,
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
} from '@augurproject/sdk';
import { fork } from './fork';
import { dispute } from './dispute';
import { MarketList } from '@augurproject/sdk/build/state/getter/Markets';
import { generateTemplateValidations } from './generate-templates';
import { spawn } from 'child_process';
import { showTemplateByHash, validateMarketTemplate } from './template-utils';

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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const network = (args.network as NETWORKS) || 'environment';
      const account = args.account as string;
      const useSdk = args.useSdk as boolean;
      if (account) flash.account = account;
      this.network = NetworkConfiguration.create(network);
      flash.provider = this.makeProvider(this.network);
      const networkId = await this.getNetworkId(flash.provider);
      flash.contractAddresses = Addresses[networkId];
      await flash.ensureUser(this.network, useSdk);
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const useSdk = args.useSdk as boolean;
      if (this.noProvider()) return;

      const config = {
        writeArtifacts: args.write_artifacts as boolean,
        useNormalTime: true,
      };

      if (args.time_controlled) {
        config['useNormalTime'] = false;
      }

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
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);

      await user.faucet(atto);

      // if we have a target we transfer from current account to target.
      if(args.target) {
        await user.augur.contracts.cash.transfer(String(args.target), atto);
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
      const user = await this.ensureUser();

      const target = String(args.target);
      const amount = Number(args.amount);
      const token = String(args.token);
      const atto = new BigNumber(amount).times(_1_ETH);

      switch(token) {
        case 'REP':
          return await user.augur.contracts.getReputationToken().transfer(target, atto);
        case 'ETH':
          return await user.augur.sendETH(target, atto);
        default:
          return await user.augur.contracts.cash.transfer(target, atto);
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const yesno = args.yesno as boolean;
      const cat = args.categorical as boolean;
      const scalar = args.scalar as boolean;
      if (yesno)
        await this.call('create-reasonable-yes-no-market', {});
      if (cat)
        await this.call('create-reasonable-categorical-market', {outcomes: "first,second,third,fourth,fifth"});
      if (scalar)
        await this.call('create-reasonable-scalar-market', {});

      if (!yesno && !cat && !scalar)
        await this.call('create-reasonable-yes-no-market', {});
    }
  });

  flash.addScript({
    name: 'create-reasonable-yes-no-market',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.market = await user.createReasonableYesNoMarket();
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const outcomes: string[] = (args.outcomes as string)
        .split(',')
        .map(formatBytes32String);

      this.market = await user.createReasonableMarket(outcomes);
      this.log(`Created Categorical market "${this.market.address}".`);
      return this.market;
    },
  });

  flash.addScript({
    name: 'create-reasonable-scalar-market',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.market = await user.createReasonableScalarMarket();
      this.log(`Created Scalar market "${this.market.address}".`);
      return this.market;
    },
  });

  flash.addScript({
    name: 'create-canned-markets-and-orders',
    async call(this: FlashSession) {
      const user = await this.ensureUser();
      await user.repFaucet(new BigNumber(10).pow(18).multipliedBy(1000000));
      await user.faucet(new BigNumber(10).pow(18).multipliedBy(1000000));
      await user.approve(new BigNumber(10).pow(18).multipliedBy(1000000));
      return createCannedMarketsAndOrders(user);
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const address = args.userAccount as string;
      const user = await this.ensureUser(null, null, true, address);
      const type =
        String(args.orderType).toLowerCase() === 'bid' || 'buy' ? 0 : 1;
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
      const tradegroupId = stringTo32ByteHex('tradegroupId');
      const result = await user.placeOrder(
        String(args.marketId),
        new BigNumber(type),
        onChainShares,
        onChainPrice,
        new BigNumber(String(args.outcome)),
        nullOrderId,
        nullOrderId,
        tradegroupId
      );

      this.log(`place order ${result}`);
    },
  });

  flash.addScript({
    name: 'fill-market-orders',
    options: [
      {
        name: 'userAccount',
        abbr: 'u',
        description: 'user account to create the order',
      },
      {
        name: 'marketId',
        abbr: 'm',
        description: 'market id to place the order',
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const address = args.userAccount as string;
      const user = await this.ensureUser(null, null, true, address);
      const adjPrice = Number(args.price).toFixed(2);
      // switch bid/ask order type to take the order
      const type =
        String(args.orderType).toLowerCase() === 'bid' || 'buy' ? 1 : 0;
      const onChainShares = convertDisplayAmountToOnChainAmount(
        new BigNumber(String(args.amount)),
        new BigNumber(100)
      );
      const onChainPrice = convertDisplayPriceToOnChainPrice(
        new BigNumber(String(adjPrice)),
        new BigNumber(0),
        new BigNumber('0.01')
      );
      const tradegroupId = stringTo32ByteHex('tradegroupId');
      await user.takeBestOrder(
        String(args.marketId),
        new BigNumber(type),
        onChainShares,
        onChainPrice,
        new BigNumber(String(args.outcome)),
        tradegroupId
      );

      this.log(`take best order on outcome ${args.outcome} @ ${adjPrice}`);
    },
  });

  flash.addScript({
    name: 'fake-all',
    async call(this: FlashSession) {
      await this.call('deploy', {
        write_artifacts: true,
        time_controlled: true,
      });
      await this.call('create-canned-markets-and-orders', {});
    },
  });

  flash.addScript({
    name: 'normal-all',
    async call(this: FlashSession) {
      await this.call('deploy', {
        write_artifacts: true,
        time_controlled: false,
      });
      await this.call('create-canned-markets-and-orders', {});
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

      let parsedLogs = user.augur.events.parseLogs(logsWithBlockNumber);

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
      generateTemplateValidations();
      this.log('Generated Templates to augur-artifacts\n');
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
      try {
        const hash = String(args.hash);
        this.log(hash);
        const template = showTemplateByHash(hash);
        if (!template) this.log(`Template not found for hash ${hash}`);
        this.log(JSON.stringify(template, null, ' '));
      } catch (e) {
        this.log(e);
      }
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
      try {
        const title = String(args.title);
        const templateInfo = String(args.templateInfo);
        const outcomesString = String(args.outcomes);
        const resolutionRules = String(args.resolutionRules);
        const endTime = Number(args.endTime);
        this.log(validateMarketTemplate(title, templateInfo, outcomesString, resolutionRules, endTime));

      } catch (e) {
        this.log(e);
      }
    },
  });

  flash.addScript({
    name: 'get-timestamp',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
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

      await (await this.db).sync(user.augur, 100000, 0);
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

      await (await this.db).sync(user.augur, 100000, 0);
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

      await (await this.db).sync(user.augur, 100000, 0);
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
      const user = await this.ensureUser(this.network, false);

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
    name: '0x-docker',
    async call(this: FlashSession) {
      if (this.noProvider()) return null;

      const networkId = await this.provider.getNetworkId();
      // const ethNode = this.network.http;
      const ethNode = 'http://geth:8545';
      const addresses = Addresses[networkId];

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
        '-e', 'VERBOSITY=4', // 5=debug 6=trace
        '-e', 'RPC_ADDR=0x:60557', // need to use "0x" network
        // '0xorg/mesh:7.1.1-beta-0xv3',
        '0xorg/mesh:0xV3',
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
    ],
    async call(
      this: FlashSession,
      args: FlashArguments
    ): Promise<string> {
      const name = args.name as string;
      const address = this.contractAddresses[name];
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
}
