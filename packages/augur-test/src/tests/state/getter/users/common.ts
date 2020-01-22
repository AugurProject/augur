import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from '../../../../libs';
import { ACCOUNTS, ContractAPI, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import { stringTo32ByteHex } from '../../../../libs/Utils';
import { BigNumber } from 'bignumber.js';
import { TestEthersProvider } from '../../../../libs/TestEthersProvider';
import * as _ from 'lodash';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  numTicksToTickSize,
} from '@augurproject/sdk';
import { ContractInterfaces } from '@augurproject/core';

export interface TradeData {
  direction: number;
  outcome: number;
  quantity: number;
  price: number;
}

export interface UTPTradeData extends TradeData {
  position: number;
  avgPrice: number;
  realizedPL: number;
  frozenFunds: number;
}

export interface PLTradeData extends TradeData {
  market: ContractInterfaces.Market;
  timestamp: number;
  realizedPL: number;
  unrealizedPL: number;
}

export const CHUNK_SIZE = 100000;

export const ZERO_BYTES = stringTo32ByteHex('');

export const ZERO = 0;
export const ONE = 1;
export const TWO = 2;
export const THREE = 3;

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


export interface AllState {
  baseProvider: TestEthersProvider;
}

export interface SomeState {
  db: Promise<DB>;
  api: API;

  john: ContractAPI;
  mary: ContractAPI;
}

export async function _beforeAll(): Promise<AllState> {
  const seed = await loadSeedFile(defaultSeedPath);
  const baseProvider = await makeProvider(seed, ACCOUNTS);
  const addresses = baseProvider.getContractAddresses();

  const john = await ContractAPI.userWrapper(ACCOUNTS[0], baseProvider, addresses);
  const mary = await ContractAPI.userWrapper(ACCOUNTS[1], baseProvider, addresses);
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();

  return { baseProvider }
}

export async function _beforeEach(allState: AllState): Promise<SomeState> {
  const { baseProvider } = allState;

  const provider = await baseProvider.fork();
  const addresses = baseProvider.getContractAddresses();
  const john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses);
  const mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, addresses);
  const db = makeDbMock().makeDB(john.augur, ACCOUNTS);
  const api = new API(john.augur, db);

  return {
    db, api, john, mary
  }
}


export async function processTrades(
  user0: ContractAPI,
  user1: ContractAPI,
  db: Promise<DB>,
  api: API,
  tradeData: UTPTradeData[],
  market: ContractInterfaces.Market,
  universe: string,
  minPrice: BigNumber = DEFAULT_MIN_PRICE,
  maxPrice: BigNumber = DEFAULT_DISPLAY_RANGE
): Promise<void> {
  for (const trade of tradeData) {
    await doTrade(user0, user1, trade, market, minPrice, maxPrice);

    await (await db).sync(user0.augur, CHUNK_SIZE, 0);

    const { tradingPositions } = await api.route('getUserTradingPositions', {
      universe,
      account: user1.account.publicKey,
      marketId: market.address,
    });

    const tradingPosition = _.find(tradingPositions, position => {
      return position.outcome === trade.outcome;
    });

    await expect(tradingPosition.netPosition).toEqual(
      trade.position.toString()
    );
    await expect(tradingPosition.averagePrice).toEqual(
      trade.avgPrice.toString()
    );
    await expect(tradingPosition.realized).toEqual(
      trade.realizedPL.toString()
    );
    await expect(tradingPosition.frozenFunds).toEqual(
      trade.frozenFunds.toString()
    );
  }
}

export async function doTrade(
  maker: ContractAPI,
  taker: ContractAPI,
  trade: TradeData,
  market: ContractInterfaces.Market,
  minPrice: BigNumber = DEFAULT_MIN_PRICE,
  maxPrice: BigNumber = DEFAULT_DISPLAY_RANGE
): Promise<void> {
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
