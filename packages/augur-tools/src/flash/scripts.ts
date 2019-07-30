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
import { calculatePayoutNumeratorsArray, QUINTILLION } from '@augurproject/sdk';

export function addScripts(flash: FlashSession) {
  flash.addScript({
    name: 'connect',
    description: 'Connect to an Ethereum node.',
    options: [
      {
        name: 'account',
        description: `account address to connect with`,
      },
      {
        name: 'network',
        description: `Which network to connect to. Defaults to "environment" aka local node.`,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      const network = (args.network as NETWORKS) || 'environment';
      const account = args.account as string;
      if (account) flash.account = account;
      const networkConfiguration = NetworkConfiguration.create(network);
      flash.provider = this.makeProvider(networkConfiguration);
      const networkId = await this.getNetworkId(flash.provider);
      flash.contractAddresses = Addresses[networkId];
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
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const writeArtifacts = args.write_artifacts as boolean;
      const { addresses } = await deployContracts(
        this.provider,
        this.accounts,
        compilerOutput,
        writeArtifacts
      );
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
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const logs = await this.provider.getLogs({
        address: user.augur.addresses.Augur,
        fromBlock: 0, // TODO programmatically figure out which block number augur was uploaded to
        toBlock: 'latest',
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

      const parsedLogs = user.augur.events.parseLogs(logsWithBlockNumber);
      parsedLogs.forEach(log => this.log(JSON.stringify(log, null, 2)));
    },
  });

  flash.addScript({
    name: 'whoami',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      this.log(`You are ${user.account.publicKey}`);
    },
  });

  flash.addScript({
    name: 'get-timestamp',
    async call(this: FlashSession) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const blocktime = await user.getTimestamp();
      const epoch = new BigNumber(blocktime.toString()).multipliedBy(1000);

      this.log(`block: ${blocktime}`);
      this.log(`local: ${moment(epoch).toString()}`);
      this.log(`utc: ${moment(epoch).utc().toString()}`);
    },
  });

  flash.addScript({
    name: 'set-timestamp',
    options: [
      {
        name: 'timestamp',
        description: `Uses Moment's parser but also accepts millisecond unix epoch time. See https://momentjs.com/docs/#/parsing/string/`,
        required: true,
      },
      {
        name: 'format',
        description: `Lets you specify the format of --timestamp. See https://momentjs.com/docs/#/parsing/string-format/`,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const timestamp = args.timestamp as string;
      const format = (args.format as string) || undefined;

      let epoch = Number(timestamp);
      if (isNaN(epoch)) {
        epoch = moment(timestamp, format).valueOf();
      }

      await user.setTimestamp(new BigNumber(epoch));
      await this.call("get-timestamp", {});
    },
  });

  flash.addScript({
    name: 'push-timestamp',
    options: [
      {
        name: 'count',
        description: `Defaults to seconds. Use "y", "M", "w", "d", "h", or "m" for longer times. ex: "2w" is 2 weeks.`,
        required: true,
      },
    ],
    async call(this: FlashSession, args: FlashArguments) {
      if (this.noProvider()) return;
      const user = await this.ensureUser();

      const countString = args.count as string;
      let unit = countString[countString.length - 1];
      let count: string;
      if (['y', 'M', 'w', 'd', 'h', 'm', 's'].includes(unit)) {
        count = countString.slice(0, countString.length - 1);
      } else {
        count = countString;
        unit = 's'; // no unit provided so default to seconds
      }

      const newTime = moment().add(count, unit as
        | 'y'
        | 'M'
        | 'w'
        | 'd'
        | 'h'
        | 'm'
        | 's');

      await this.call("get-timestamp", {});
      this.log(`changing timestamp to ${newTime.unix()}`);
      await user.setTimestamp(new BigNumber(newTime.unix()));
      await this.call("get-timestamp", {});
    },
  });

  flash.addScript({
    name: 'initial-report',
    options: [
      {
        name: 'marketId',
        description: 'market to initially report on',
        required: true,
      },
      {
        name: 'outcome',
        description:
          'outcome of the market, non scalar markets 0,1,3,... for scalar markets use price',
        required: true,
      },
      {
        name: 'extraStake',
        description: 'added pre-emptive REP stake on the outcome in 10**18 format not atto REP(optional)',
        required: false,
      },
      {
        name: 'description',
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
      let preEmptiveStake = "0";
      if (extraStake) {
        preEmptiveStake = new BigNumber(extraStake).dividedBy(QUINTILLION).toFixed();
      }
      const market: ContractInterfaces.Market = await user.getMarketContract(marketId);
      const marketInfos = await user.getMarketInfo(marketId);
      if (!marketInfos || marketInfos.length === 0) {
        return this.log(`Error: marketId: ${marketId} not found`)
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
      await user.doInitialReport(market, payoutNumerators, desc, preEmptiveStake);
    },
  });
}
