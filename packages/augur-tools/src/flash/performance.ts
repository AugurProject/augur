import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import { ZeroXPlaceTradeDisplayParams } from '@augurproject/sdk';
import { MarketInfo } from '@augurproject/sdk-lite';
import { flattenZeroXOrders } from '@augurproject/sdk/build/state/getter/ZeroXOrdersGetters';
import {
  mergeConfig,
  SDKConfiguration,
  validConfigOrDie,
} from '@augurproject/utils';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { ContractAPI } from '..';
import { Account } from '../constants';
import { HDWallet } from '../libs/blockchain';
import { stringTo32ByteHex } from '../libs/Utils';
import { createTightOrderBookConfig } from './order-firehose';
import { OrderBookShaper } from './orderbook-shaper';
import {
  cycle,
  flatten,
  mapPromises,
  randomSelect,
  ReadiedPromise,
  sleep,
  waitForFunding,
} from './util';

export const FINNEY = new BigNumber(1e16);

export async function setupUsers(accounts: Account[], ethSource: ContractAPI, funding: BigNumber, baseConfig: SDKConfiguration, serial=false) {
  return mapPromises(accounts.map((account) => () => setupUser(account, ethSource, funding, baseConfig)), serial);
}

export async function setupUser(account: Account, ethSource: ContractAPI, funding: BigNumber, baseConfig: SDKConfiguration): Promise<ContractAPI> {
  console.log(`Setting up account ${account.address}`);
  const { config } = setupPerfConfigAndZeroX(baseConfig);
  await ethSource.augur.sendETH(account.address, funding);
  const user = await ContractAPI.userWrapper(account, ethSource.provider, config);
  await waitForFunding(user)

  if (!config.flash?.skipApproval) {
    console.log(`Approving cash/etc transfers for ${account.address}`)
    await user.approveIfNecessary();
  }

  if (config.flash?.syncSDK) {
    throw Error('Not Implemented: Making HDWallet-derived users sync with the blockchain')
  }

  const lotsOfCoin = new BigNumber(1e30);
  await user.faucetCashUpTo(lotsOfCoin, lotsOfCoin);
  await user.faucetRepUpTo(lotsOfCoin, lotsOfCoin);

  return user
}

export function setupPerfConfigAndZeroX(config: SDKConfiguration, syncSDK = false) {
  config = validConfigOrDie(mergeConfig(config, {
    zeroX: { rpc: { enabled: true }, mesh: { enabled: false }},
    flash: { syncSDK },
  }));
  return { config };
}

export async function setupMarkets(makers: ContractAPI[], serial=false): Promise<Market[]> {
  return mapPromises(flatten(makers.map(setupMarketSet)), serial);
}

export function setupMarketSet(maker: ContractAPI): Array<ReadiedPromise<Market>> {
  return [
    () => maker.createReasonableYesNoMarket(`yes/no #1 from ${maker.account.address}`),
    () => maker.createReasonableYesNoMarket(`yes/no #2 from ${maker.account.address}`),
    () => maker.createReasonableYesNoMarket(`yes/no #3 from ${maker.account.address}`),
    () => maker.createReasonableYesNoMarket(`yes/no #4 from ${maker.account.address}`),
    () => maker.createReasonableScalarMarket(`scalar #1 from ${maker.account.address}`),
    () => maker.createReasonableScalarMarket(`scalar #2 from ${maker.account.address}`),
    () => maker.createReasonableScalarMarket(`scalar #3 from ${maker.account.address}`),
    () => maker.createReasonableScalarMarket(`scalar #4 from ${maker.account.address}`),
    () => maker.createReasonableMarket(['foo', 'bar', 'zeitgeist', 'mary', 'bob'].map(formatBytes32String), `cat #1 from ${maker.account.address}`),
    () => maker.createReasonableMarket(['torrent', 'rainstorm', 'shower', 'puddle-maker'].map(formatBytes32String), `cat #2 from ${maker.account.address}`),
  ]
}

export function setupOrderBookShapers(marketInfos: MarketInfo[], orderSize: number, expiration: BigNumber): OrderBookShaper[] {
  const orderBookConfig = createTightOrderBookConfig(orderSize);
  return marketInfos.map((market) => {
    return new OrderBookShaper(market, null, expiration, [2, 1], orderBookConfig);
  })
}

export async function setupOrders(anyUser: ContractAPI, shapers: OrderBookShaper[]): Promise<ZeroXPlaceTradeDisplayParams[]> {
  const timestamp = new BigNumber(await anyUser.getTimestamp());
  return flatten(shapers.map((shaper) => shaper.nextRun({}, timestamp)));
}

export async function createOrders(traders: ContractAPI[], orders: ZeroXPlaceTradeDisplayParams[], batchSize: number) {
  const traderGenerator = cycle(traders);
  const numOrders = orders.length;
  const numBatches = numOrders / batchSize; // intentionally a decimal if not divisible by BATCH_SIZE
  for (let i = 0; i < numBatches; i++) {
    console.log(`Generating batch ${i} / ${Math.floor(numBatches) + (numBatches % 0 ? 1 : 0)}`);
    const ordersInBatch = orders.slice(i * batchSize, (i + 1) * batchSize);
    await traderGenerator().placeZeroXOrders(ordersInBatch).catch(console.error);
  }
}

export async function takeOrder(
  trader: ContractAPI,
  market: MarketInfo,
  direction: number,
  outcome: number,
): Promise<boolean> {
  const orders = flattenZeroXOrders(await trader.getOrders(market.id, String(direction), outcome));
  if (orders.length === 0) {
    console.log('No order to take');
    return false;
  }

  const sortedOrders =
    direction === 0
      ? orders.sort((a, b) =>
        new BigNumber(b.price).minus(new BigNumber(a.price)).toNumber()
      )
      : orders.sort((a, b) =>
        new BigNumber(a.price).minus(new BigNumber(b.price)).toNumber()
      );

  const order = sortedOrders[0];
  direction = direction === 0 ? 1 : 0; // must be reversed
  try {
    const params = {
      market: market.id,
      direction: direction as 0 | 1,
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
    }
    const result = await trader.augur.placeTrade(params);
    if (result) {
      console.log(`Took order ${order.orderId} of market ${market.id} for ${trader.account.address}`);
    } else {
      console.log('Took no orders with these params:', params);
    }
    return result;
  } catch(error) {
    // TODO stop catching all errors?
    console.error(error);
    return false;
  }
}

export async function takeOrders(
  traders: ContractAPI[],
  markets: MarketInfo[],
  periodMS: number,
  limit: number,
  outcomes: number[],
  ): Promise<void> {
  for (let i = 0; i < limit; i++) {
    const trader = randomSelect(traders);
    const market = randomSelect(markets);
    const outcome = randomSelect(outcomes);
    const direction = randomSelect([0, 1]);

    await takeOrder(trader, market, direction, outcome);
    await sleep(periodMS);
  }
}

export async function getAllMarkets(user: ContractAPI, makerAccounts: Account[]): Promise<MarketInfo[]> {
  const marketInfos: MarketInfo[] = (await user.augur.getMarkets({
    universe: user.augur.contracts.universe.address,
    limit: 1e7 // very large number
  })).markets;
  const makerAddresses = makerAccounts.map((account) => account.address.toLowerCase());
  return marketInfos.filter((market) => makerAddresses.indexOf(market.author.toLowerCase()) !== -1);
}

export class AccountCreator {
  private hd: HDWallet;
  constructor(mnemonic: string) {
    this.hd = new HDWallet(mnemonic);
  }

  marketMakers(quantity: number): Account[] {
    return this.hd.generateAccounts(quantity, 0);
  }

  traders(quantity: number): Account[] {
    return this.hd.generateAccounts(quantity, 1e7);
  }
}
