import { Account, NULL_ADDRESS, _1_HUNDRED_ETH } from '../constants';
import { ContractAPI } from '..';
import { ParsedLog } from '@augurproject/types';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { ethers } from 'ethers';
import { inOneMonths, today } from './time';
import { SDKConfiguration } from "@augurproject/utils";

interface AddressMapping { [addr1: string]: string; }
interface IdMapping { [id1: string]: string; }
interface AccountMapping { [addr1: string]: Account; }

export class LogReplayerV1 {
  accounts: AccountMapping = {};
  universes: AddressMapping = {};
  markets: AddressMapping = {};
  orders: IdMapping = {};

  piggybank: Account;
  availableAccounts: Account[];

  constructor(
    initialAccounts: Account[],
    private provider: EthersProvider,
    private config: SDKConfiguration
  ) {
    if (initialAccounts.length < 1) {
      throw Error("LogReplayer's initial accounts list must contain at least one account");
    }
    this.piggybank = initialAccounts[0];
    this.availableAccounts = initialAccounts.slice(1);

    this.universes[NULL_ADDRESS] = NULL_ADDRESS;
  }

  async User(account: Account): Promise<ContractAPI> {
    const user = await ContractAPI.userWrapper(account, this.provider, this.config);
    await user.approveIfNecessary();
    return user;
  }

  async Account(address: string): Promise<Account> {
    if (typeof this.accounts[address] === 'undefined') {
      if (this.availableAccounts.length > 0) {
        this.accounts[address] = this.availableAccounts.pop();
      } else { // Create and fund new account.
        const wallet = ethers.Wallet.createRandom();
        this.accounts[address] = {
          privateKey: wallet.privateKey,
          address: wallet.address,
          initialBalance: _1_HUNDRED_ETH,
        };

        const piggybankWallet = new ethers.Wallet(this.piggybank.privateKey, this.provider);
        await piggybankWallet.sendTransaction({
          to: wallet.address,
          value: `0x${new BigNumber(_1_HUNDRED_ETH).toString(16)}`,
        });
      }
    }

    return this.accounts[address];
  }

  async Replay(logs: ParsedLog[]) {
    for (const log of logs) {
      await this.ReplayLog(log);
    }
  }

  async ReplayLog(log: ParsedLog) {
    switch(log.name) {
      case 'UniverseCreated': return this.UniverseCreated(log);
      case 'MarketCreated': return this.MarketCreated(log);
      case 'OrderCreated': return this.OrderCreated(log);
      default:
    }
  }

  async UniverseCreated(log: ParsedLog) {
    const { parentUniverse, childUniverse, payoutNumberators } = log;

    console.log(`Replaying UniverseCreated "${childUniverse}"`);

    if (parentUniverse === NULL_ADDRESS) { // Deployment already gave us a genesis universe so just record it.
      const user = await this.User(this.piggybank); // Treating piggybank as the Augur deployer since typically it is.
      this.universes[childUniverse] = user.augur.config.addresses.Universe;
    } else {
      // TODO No need to support forking yet. But when it is supported, remember
      //      that parentPayoutDistributionHash is part of the Universe contract.
    }
  }

  async MarketCreated(log: ParsedLog) {
    const {
      universe, extraInfo, market, marketCreator, designatedReporter,
      prices, marketType, numTicks, outcomes, topic } = log;

    console.log(`Replaying MarketCreated "${market}"`);

    const timestamp = `${today.getTime() / 1000}`;
    const endTime = `${inOneMonths.getTime() / 1000}`;
    const feeDivisor = new BigNumber(0);

    const feePerCashInAttoCash = new BigNumber(10).pow(16); // 1% fee
    const [ start, end ] = [ makeDate(timestamp), makeDate(endTime) ];
    const marketLength = end.getTime() - start.getTime();
    const adjustedEndTime = new BigNumber(Math.floor((Date.now() + marketLength) / 1000));

    let adjustedExtraInfo = JSON.parse(extraInfo);
    adjustedExtraInfo.categories = extraInfo.categories || [];
    adjustedExtraInfo.categories.push(topic);
    adjustedExtraInfo.categories.push('from v1');
    adjustedExtraInfo.categories.push('flash');
    adjustedExtraInfo = JSON.stringify(adjustedExtraInfo);

    const user = await this.Account(marketCreator).then((account) => this.User(account));
    const reporter = await this.Account(designatedReporter);

    let result;
    switch(marketType) {
      case 0: // YES_NO
        result = await user.createYesNoMarket({
          endTime: adjustedEndTime,
          feePerCashInAttoCash,
          affiliateFeeDivisor: feeDivisor,
          designatedReporter: reporter.address,
          extraInfo: adjustedExtraInfo,
        });
        break;
      case 1: // CATEGORICAL
        result = await user.createCategoricalMarket({
          endTime: adjustedEndTime,
          feePerCashInAttoCash,
          affiliateFeeDivisor: feeDivisor,
          designatedReporter: reporter.address,
          outcomes,
          extraInfo: adjustedExtraInfo,
        });
        break;
      case 2: // SCALAR
        result = await user.createScalarMarket({
          endTime: adjustedEndTime,
          feePerCashInAttoCash,
          affiliateFeeDivisor: feeDivisor,
          designatedReporter: reporter.address,
          prices,
          numTicks,
          extraInfo: adjustedExtraInfo,
        });
        break;
      default: throw Error(`Unexpected market type "${marketType}`);
    }

    this.markets[market] = result.address;
  }

  async OrderCreated(log: ParsedLog) {
    const {
      name, orderType, amount, price, creator, moneyEscrowed, sharesEscrowed,
      tradeGroupId, orderId, universe, shareToken, market, outcome } = log;

    console.log(`Replaying OrderCreated "${orderId}"`);

    const betterOrderId = formatBytes32String('');
    const worseOrderId = formatBytes32String('');

    const orderCreatorUser = await this.Account(creator).then((account) => this.User(account));

    this.orders[orderId] = await orderCreatorUser.placeOrder(
      this.markets[market],
      new BigNumber(orderType),
      new BigNumber(amount),
      new BigNumber(price),
      outcome,
      betterOrderId,
      worseOrderId,
      tradeGroupId
    );
  }
}

function makeDate(fromChain: string): Date {
  const bn = new BigNumber(fromChain);
  const n = bn.toNumber() * 1000;
  return new Date(n);
}
