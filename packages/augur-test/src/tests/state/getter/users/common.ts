import { ContractInterfaces } from '@augurproject/core';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  numTicksToTickSize,
} from '@augurproject/sdk';
import {
  ACCOUNTS,
  ContractAPI,
  defaultSeedPath,
  loadSeed,
} from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import { makeProvider } from '../../../../libs';
import { Market } from '@augurproject/core/build/libraries/ContractInterfaces';
import { formatBytes32String } from 'ethers/utils';
import { repeat } from '@augurproject/utils';

export interface TradeData {
  direction: number;
  outcome: number;
  quantity: number;
  price: number;
  // scalar market
  minPrice?: number
  maxPrice?: number;
}

export interface UTPTradeData extends TradeData {
  position: number;
  avgPrice: number;
  realizedPL: number;
  frozenFunds: number;
}

export interface PLTradeData extends TradeData {
  market?: ContractInterfaces.Market;
  timestamp?: number;
  realizedPL: number;
  unrealizedPL: number;
  unrealizedPercent: number;
  realizedPercent: number;
}

export interface PLResultData {
  realizedPL: number;
  unrealizedPL: number;
  unrealizedPercent: number;
  realizedPercent: number;
}

export interface MakerTakerTrade extends TradeData {
  market: ContractInterfaces.Market,
  maker: TestContractAPI,
  taker: TestContractAPI,
}
export interface MakerTakerTradeData {
  timestamp: number;
  trades: MakerTakerTrade[],
  result: {
    [address: string]: PLResultData,
  }
}

export const CHUNK_SIZE = 100000;

export const ZERO_BYTES = stringTo32ByteHex('');

export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const THREE = 3;
export const THIRTY = 30;

export const BID = ZERO;
export const LONG = ZERO;
export const ASK = ONE;
export const SHORT = ONE;
export const YES = TWO;
export const NO = ONE;

export const DEFAULT_MIN_PRICE = new BigNumber(ZERO);
export const DEFAULT_DISPLAY_RANGE = new BigNumber(ONE);

export const INVALID = ZERO;
export const A = ONE;
export const B = TWO;
export const C = THREE;

const HOUR = 60 * 60;
const DAY = HOUR * 24;

export interface AllState {
  baseProvider: TestEthersProvider;
}

export interface SomeState {
  john: TestContractAPI;
  mary: TestContractAPI;
  bob: TestContractAPI;
  jasmine: TestContractAPI;
}

export async function _beforeAll(): Promise<AllState> {
  const seed = await loadSeed(defaultSeedPath);
  const baseProvider = await makeProvider(seed, ACCOUNTS);
  return { baseProvider };
}

export async function _beforeEach(allState: AllState): Promise<SomeState> {
  const { baseProvider } = allState;

  const provider = await baseProvider.fork();
  const config = baseProvider.getConfig({gsn: {enabled: true}});
  const john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    config
  );
  const mary = await TestContractAPI.userWrapper(
    ACCOUNTS[1],
    provider,
    config
  );
  const bob = await TestContractAPI.userWrapper(
    ACCOUNTS[2],
    provider,
    config
  );
  const jasmine = await TestContractAPI.userWrapper(
    ACCOUNTS[3],
    provider,
    config
  );

  await john.approve();
  await mary.approve();
  await bob.approve();
  await jasmine.approve();

  return {
    john,
    mary,
    bob,
    jasmine,
  };
}

export async function processTrades(
  user0,
  user1,
  tradeData: UTPTradeData[],
  market: ContractInterfaces.Market,
  universe: string,
  minPrice: BigNumber = DEFAULT_MIN_PRICE,
  maxPrice: BigNumber = DEFAULT_DISPLAY_RANGE
): Promise<void> {
  for (const trade of tradeData) {
    await doTradeTakerView(user0, user1, trade, market, minPrice, maxPrice);

    await user0.sync();
    await user1.sync();

    const { tradingPositions } = await user0.api.route(
      'getUserTradingPositions',
      {
        universe,
        account: user1.account.address,
        marketId: market.address,
      }
    );

    const tradingPosition = _.find(tradingPositions, position => {
      return position.outcome === trade.outcome;
    });

    await expect(tradingPosition.netPosition).toEqual(
      trade.position.toString()
    );
    await expect(tradingPosition.averagePrice).toEqual(
      trade.avgPrice.toString()
    );
    await expect(tradingPosition.realized).toEqual(trade.realizedPL.toString());
    await expect(tradingPosition.frozenFunds).toEqual(
      trade.frozenFunds.toString()
    );
  }
}

// In `trade`, direction is from the taker's perspective.
export async function doTradeTakerView(
  maker: ContractAPI,
  taker: ContractAPI,
  trade: TradeData,
  market: ContractInterfaces.Market,
  minPrice: BigNumber = DEFAULT_MIN_PRICE,
  maxPrice: BigNumber = DEFAULT_DISPLAY_RANGE
): Promise<void> {
  minPrice = typeof trade.minPrice !== 'undefined' ? new BigNumber(trade.minPrice) : minPrice;
  maxPrice = typeof trade.maxPrice !== 'undefined' ? new BigNumber(trade.maxPrice) : maxPrice;

  const numTicks = await market.getNumTicks_();
  const price = new BigNumber(trade.price);
  const tickSize = numTicksToTickSize(
    numTicks,
    minPrice.multipliedBy(10 ** 18),
    maxPrice.multipliedBy(10 ** 18)
  );
  const quantity = convertDisplayAmountToOnChainAmount(
    new BigNumber(trade.quantity),
    tickSize
  );

  const onChainLongPrice = convertDisplayPriceToOnChainPrice(
    price,
    minPrice,
    tickSize
  );
  const onChainShortPrice = numTicks.minus(onChainLongPrice);
  const direction = trade.direction === SHORT ? BID : ASK;
  const longCost = quantity.multipliedBy(onChainLongPrice);
  const shortCost = quantity.multipliedBy(onChainShortPrice);
  const fillerCost = trade.direction === ASK ? shortCost : longCost;

  const orderID = await maker.placeOrder(
    market.address,
    new BigNumber(direction),
    quantity,
    onChainLongPrice,
    new BigNumber(trade.outcome),
    ZERO_BYTES,
    ZERO_BYTES,
    ZERO_BYTES
  );

  await taker.fillOrder(orderID, quantity, '', fillerCost);
}


export async function trade(user: TestContractAPI, timeDelta: number, trades: MakerTakerTrade[]): Promise<void> {
  if (timeDelta) await user.advanceTimestamp(timeDelta);

  for (const trade_ of trades) {
    const tradeData = makerTakerTradeToTradeData(trade_);
    await doTradeTakerView(trade_.maker, trade_.taker, tradeData, trade_.market);
  }
}

export async function verifyPL(user: TestContractAPI, result: {[address: string]: PLResultData}) {
  await user.sync();
  for (const address of _.keys(result)) {
    const plResult = result[address];
    const profitLossSummary = await user.api.route('getProfitLossSummary', {
      universe: user.augur.contracts.universe.address,
      account: address
    });

    const oneDayPLSummary = profitLossSummary[ONE]; // one is one day?
    await expect(Number.parseFloat(oneDayPLSummary.realized)).toEqual(plResult.realizedPL);
    await expect(Number.parseFloat(oneDayPLSummary.unrealized)).toEqual(plResult.unrealizedPL);
    await expect(Number.parseFloat(oneDayPLSummary.realizedPercent)).toEqual(plResult.realizedPercent);
    await expect(Number.parseFloat(oneDayPLSummary.unrealizedPercent)).toEqual(plResult.unrealizedPercent);
  }
}

export function makerTakerTradeToTradeData(trade: MakerTakerTrade): TradeData {
  const { direction, outcome, quantity, price, minPrice, maxPrice } = trade;
  return { direction, outcome, quantity, price, minPrice, maxPrice };
}

// Verifies users' balances less any fees.
export async function verifyCash(user: TestContractAPI, market: Market, balances: Balances, feeAdjustment=true): Promise<Balances> {
  const marketFeeDivisor = (await market.getMarketCreatorSettlementFeeDivisor_()).toNumber();
  const reportingFeeDivisor = (await user.augur.contracts.universe.getOrCacheReportingFeeDivisor_()).toNumber();
  const actualBalances: Balances = {};
  for (const address in balances) {
    const balance = balances[address];
    const reportingFee = reportingFeeDivisor ? balance / reportingFeeDivisor: 0;
    const marketFee = marketFeeDivisor ? balance / marketFeeDivisor : 0;
    const expectedBalance =feeAdjustment ? balance - reportingFee - marketFee : balance;
    const actualBalance = (await user.getCashBalance(address)).toNumber();
    expect(actualBalance).toEqual(expectedBalance);
    actualBalances[address] = actualBalance;
  }
  return actualBalances;
}
export interface Balances {[address: string]: number};

export async function createCategoricalMarket (
  user: TestContractAPI,
  { timeDelta = DAY,
    marketFee = 0,
    affiliateFee = 25,
    designatedReporter,
    categories = ['test', 'fake', 'Categorical'],
    description = 'test market',
    outcomes = ['outcome1', 'outcome2', 'outcome3'],
    formatOutcomes = true,
    faucet = true,
  }: {
    timeDelta?: number, marketFee?: number, affiliateFee?: number, designatedReporter?: string,
    categories?: string[], description?: string, outcomes?: string[], formatOutcomes?: boolean, faucet?: boolean
  } = {}): Promise<Market> {
  return user.createCategoricalMarket({
    endTime: (await user.getTimestamp()).plus(timeDelta),
    feePerCashInAttoCash: new BigNumber(marketFee),
    affiliateFeeDivisor: new BigNumber(affiliateFee),
    designatedReporter: designatedReporter || user.account.address,
    extraInfo: JSON.stringify({
      categories,
      description,
    }),
    outcomes: formatOutcomes ? outcomes.map(formatBytes32String) : outcomes,
  }, faucet);
}

export async function createScalarMarket (
  user: TestContractAPI,
  { timeDelta = DAY,
    marketFee = 0,
    affiliateFee = 25,
    designatedReporter,
    prices = [0, 100],
    numTicks = 100,
    categories = ['test', 'fake', 'Categorical'],
    description = 'test market',
    faucet = true,
  }: {
    timeDelta?: number, marketFee?: number, affiliateFee?: number, designatedReporter?: string,
    categories?: string[], description?: string, prices?: Array<number|BigNumber>, numTicks?: number, faucet?: boolean
  } = {}): Promise<Market> {
  return user.createScalarMarket({
    endTime: (await user.getTimestamp()).plus(timeDelta),
    feePerCashInAttoCash: new BigNumber(marketFee),
    affiliateFeeDivisor: new BigNumber(affiliateFee),
    designatedReporter: designatedReporter || user.account.address,
    prices: prices.map((p) => new BigNumber(p)),
    numTicks: new BigNumber(numTicks),
    extraInfo: JSON.stringify({
      categories,
      description,
    }),
  }, faucet);
}

export async function finalize(user: TestContractAPI, market: Market): Promise<void> {
  await user.advanceTimestamp(DAY * 2);
  await market.finalize();
  await user.advanceTimestamp(1);
}

export async function report(user: TestContractAPI, market: Market, outcome: number) {
  const endTime = await market.getEndTime_();
  await user.setTimestamp(endTime.plus(1));

  const numTicks = await market.getNumTicks_();
  const numOutcomes = (await market.getNumberOfOutcomes_()).toNumber();
  const zero = new BigNumber(0);
  const outcomeList = repeat(zero, numOutcomes);
  outcomeList[outcome] = numTicks;
  await user.doInitialReport(market, outcomeList);
}

export async function reportScalar(user: TestContractAPI, market: Market, outcome: number|'invalid') {
  const endTime = await market.getEndTime_();
  await user.setTimestamp(endTime.plus(1));

  const numTicks = await market.getNumTicks_();
  const other = numTicks.minus(outcome);
  const zero = new BigNumber(0);
  const outcomeList = outcome === 'invalid' ? [numTicks, zero, zero] : [zero, new BigNumber(outcome), other];
  await user.doInitialReport(market, outcomeList);
}

export async function claimProceeds(market: Market, users: TestContractAPI[]) {
  for (const user of users) {
    await user.claimTradingProceeds(market);
  }
}

