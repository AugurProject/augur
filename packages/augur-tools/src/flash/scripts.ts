import { deployContracts } from '../libs/blockchain';
import { FlashSession, FlashArguments } from './flash';
import { createCannedMarketsAndOrders } from './create-canned-markets-and-orders';
import { _1_ETH, NULL_ADDRESS } from '../constants';
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
} from '@augurproject/sdk';
import { ContractAPI } from '..';
import { EmptyConnector } from "@augurproject/sdk/build";

export function addScripts(flash: FlashSession) {
  flash.addScript({
    name: 'connect',
    description: 'Connect to an Ethereum node.',
    options: [
      {
        name: 'account',
        abbr: 'a',
        description: 'account address to connect with, if no address provided contract owner is used',
      },
      {
        name: 'network',
        abbr: 'n',
        description: 'Which network to connect to. Defaults to "environment" aka local node.',
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
        description: 'Overwrite addresses.json.',
        flag: true,
      },
      {
        name: 'time-controlled',
        description: 'Use the TimeControlled contract for testing environments. Set to "true" or "false".',
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;

      const config = {
        writeArtifacts: args.write_artifacts as boolean,
      };
      if (args.time_controlled === 'true') {
        config['useNormalTime'] = false;
      } else if (args.time_controlled === 'false') {
        config['useNormalTime'] = true;
      }

      const { addresses } = await deployContracts(this.provider, this.accounts[0], compilerOutput, config);
      flash.contractAddresses = addresses;
    },
  });

  flash.addScript({
    name: 'faucet',
    description: 'Mints Cash tokens for user.',
    options: [
      {
        name: 'amount',
        description: 'Quantity of Cash.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);

      await user.faucet(atto);
    },
  });

  flash.addScript({
    name: 'rep-faucet',
    description: 'Mints REP tokens for user.',
    options: [
      {
        name: 'amount',
        description: 'Quantity of REP.',
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const amount = Number(args.amount);
      const atto = new BigNumber(amount).times(_1_ETH);

      await user.repFaucet(atto);
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
    name: 'create-reasonable-yes-no-market',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.market = await user.createReasonableYesNoMarket();
      this.log(`Created market "${this.market.address}".`);
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
      this.log(`Created market "${this.market.address}".`);
      return this.market;
    },
  });

  flash.addScript({
    name: 'create-reasonable-scalar-market',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.market = await user.createReasonableScalarMarket();
      this.log(`Created market "${this.market.address}".`);
      return this.market;
    },
  });

  flash.addScript({
    name: 'create-canned-markets-and-orders',
    async call(this: FlashSession) {
      const user = await this.ensureUser();
      await user.faucet(new BigNumber(10).pow(18).multipliedBy(1000000));
      return createCannedMarketsAndOrders(user);
    },
  });

  flash.addScript({
    name: 'all-logs',
    options: [
      {
        name: 'quiet',
        abbr: 'q',
        description: 'Do not print anything (just returns). Only useful in interactive mode.',
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
      const toBlock = args.to === null || args.to === 'latest'
        ? 'latest'
        : Number(args.to);

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
        parsedLogs = await Promise.all(parsedLogs.map(async (log) => {
          if (log.name === 'OrderCreated') {
            const { shareToken } = log;
            const shareTokenContract = new ethers.Contract(
              shareToken,
              new ethers.utils.Interface(abiV1.ShareToken),
              this.provider);
            const market = await shareTokenContract.functions['getMarket']();
            const outcome = (await shareTokenContract.functions['getOutcome']()).toNumber();

            return Object.assign({}, log, { market, outcome });
          } else {
            return log;
          }
        }));
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
        description: "Uses Moment's parser but also accepts millisecond unix epoch time. See https://momentjs.com/docs/#/parsing/string/",
        required: true,
      },
      {
        name: 'format',
        abbr: 'f',
        description: 'Lets you specify the format of --timestamp. See https://momentjs.com/docs/#/parsing/string-format/',
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
        description: 'Defaults to seconds. Use "y", "M", "w", "d", "h", or "m" for longer times. ex: "2w" is 2 weeks.',
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const marketId = args.marketId as string;
      const outcome = Number(args.outcome);
      const extraStake = args.extraStake as string;
      const desc = args.description as string;
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
        outcome
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const marketId = args.marketId as string;
      const outcome = Number(args.outcome);
      const amount = args.amount as string;
      const desc = args.description as string;
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
        outcome
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();
      const marketId = args.marketId as string;
      const outcome = Number(args.outcome);
      const amount = args.amount as string;
      const desc = args.description as string;
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
        outcome
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
      const marketId = args.marketId as string;

      const MAX_DISPUTES = 20;
      const SOME_REP = new BigNumber(1e18).times(6e7);
      const payoutNumerators = [100, 0, 0].map((n) => new BigNumber(n));
      const conflictNumerators = [0, 100, 0].map((n) => new BigNumber(n));

      let market: ContractInterfaces.Market;
      if (marketId !== null) {
        market = user.augur.contracts.marketFromAddress(marketId);
      } else {
        market = await user.createReasonableYesNoMarket();
        this.log(`Created market ${market.address}`);
      }

      await user.repFaucet(SOME_REP);

      // Get past the market time, into when we can accept the initial report.
      await user.setTimestamp((await market.getEndTime_()).plus(1));

      // Do the initial report, creating the first dispute window.
      await user.doInitialReport(market, payoutNumerators, '', SOME_REP.div(2).toString());
      // First contribute (dispute) to overcome additional stake in initial report.
      await user.contribute(market, conflictNumerators, SOME_REP);

      for (let i = 0; i < MAX_DISPUTES; i++) {
        if ((await market.getForkingMarket_()) !== NULL_ADDRESS) {
          this.log('Successfully Forked');
          break;
        }

        const disputeWindow = user.augur.contracts.disputeWindowFromAddress(await market.getDisputeWindow_());
        // console.log(`fork attempt ${i} on ${disputeWindow.address}`);
        //
        // await user.setTimestamp((await disputeWindow.getStartTime_()).plus(1));

        if (i % 2 === 0) {
          console.log('contribute to conflict');
          await user.contribute(market, conflictNumerators, SOME_REP);
        } else {
          console.log('contribute to original');
          await user.contribute(market, payoutNumerators, SOME_REP);
        }

        const disputeWindowEndTime = await disputeWindow.getEndTime_();
        await user.setTimestamp(disputeWindowEndTime.plus(1));
      }
    },
  });
}
