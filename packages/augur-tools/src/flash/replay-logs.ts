import { Account, NULL_ADDRESS, _1_HUNDRED_ETH } from '../constants';
import { ContractAPI } from '..';
import { ParsedLog } from '@augurproject/types';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { ethers } from 'ethers';
import { SDKConfiguration } from '@augurproject/utils';

interface AddressMapping { [addr1: string]: string; }
interface IdMapping { [id1: string]: string; }
interface AccountMapping { [addr1: string]: Account; }

export class LogReplayer {
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
      case 'OrderEvent': return this.OrderEvent(log);
      default:
    }
  }

  async UniverseCreated(log: ParsedLog) {
    const { parentUniverse, childUniverse, payoutNumberators } = log;

    console.log(`Replaying UniverseCreated "${childUniverse}"`);

    if (parentUniverse === NULL_ADDRESS) { // Deployment already gave us a genesis universe so just record it.
      const user = await this.User(this.piggybank); // Piggybank is typically the Augur deployer, including genesis universe.
      this.universes[childUniverse] = user.augur.config.addresses.Universe;
    } else {
      // TODO No need to support forking yet. But when it is supported, remember
      //      that parentPayoutDistributionHash is part of the Universe contract.
    }
  }

  async MarketCreated(log: ParsedLog) {
    const {
      universe, extraInfo, market, marketCreator, designatedReporter, prices,
      marketType, numTicks, outcomes, timestamp, endTime, feeDivisor } = log;

    console.log(`Replaying MarketCreated "${market}"`);

    const feePerCashInAttoCash = new BigNumber(10).pow(16); // 1% fee
    const [ start, end ] = [ makeDate(timestamp), makeDate(endTime) ];
    const marketLength = end.getTime() - start.getTime();
    const adjustedEndTime = new BigNumber(Math.floor((Date.now() + marketLength) / 1000));

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
          extraInfo,
        });
        break;
      case 1: // CATEGORICAL
        result = await user.createCategoricalMarket({
          endTime: adjustedEndTime,
          feePerCashInAttoCash,
          affiliateFeeDivisor: feeDivisor,
          designatedReporter: reporter.address,
          outcomes,
          extraInfo});
        break;
      case 2: // SCALAR
        result = await user.createScalarMarket({
          endTime: adjustedEndTime,
          feePerCashInAttoCash,
          affiliateFeeDivisor: feeDivisor,
          designatedReporter: reporter.address,
          prices,
          numTicks,
          extraInfo});
        break;
      default: throw Error(`Unexpected market type "${marketType}`);
    }

    this.markets[market] = result.address;
  }

  async OrderEvent(log: ParsedLog) {
    const { universe, market, eventType, orderType, orderId, tradeGroupId, addressData, uint256Data } = log;

    // From packages/augur-core/source/contracts/Augur.sol:61
    const [ orderCreator, orderFiller ] = addressData;
    const [ price, amount, outcome, tokenRefund, sharesRefund, fees, amountFilled, timestamp, sharesEscrowed, tokensEscrowed ] = uint256Data;

    console.log(`Replaying OrderEvent "${orderId}"`);

    const betterOrderId = formatBytes32String('');
    const worseOrderId = formatBytes32String('');

    const orderCreatorUser = await this.Account(orderCreator).then((account) => this.User(account));

    switch(eventType) { // See packages/augur-core/source/contracts/Augur.sol:40
      case 0: // OrderEventType.Create
        this.orders[orderId] = await orderCreatorUser.placeOrder(
          this.markets[market],
          new BigNumber(orderType),
          new BigNumber(amount),
          new BigNumber(price),
          outcome,
          betterOrderId,
          worseOrderId,
          tradeGroupId);
        break;
      case 1: // OrderEventType.Cancel
        await orderCreatorUser.cancelOrder(this.orders[orderId]);
        break;
      case 2: // OrderEventType.Fill (later v2)
      case 3: // OrderEventType.Fill (earlier v2)
        const orderFillerUser = await this.Account(orderFiller).then((account) => this.User(account));
        await orderFillerUser.fillOrder(
          this.orders[orderId],
          new BigNumber(amountFilled),
          ethers.utils.parseBytes32String(tradeGroupId),
          new BigNumber(price).times(amountFilled).times(10) // not sure why this needs to be multiplied
        );
        break;
      default: throw Error(`Unexpected order event type "${eventType}"`);
    }
  }
}

function makeDate(fromChain: string): Date {
  const bn = new BigNumber(fromChain);
  const n = bn.toNumber() * 1000;
  return new Date(n);
}
