import {
  ACCOUNTS,
  makeDbMock,
  deployContracts,
  ContractAPI,
} from "../../../libs";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import { API } from "@augurproject/sdk/build/state/getter/API";
import { DB } from "@augurproject/sdk/build/state/db/DB";
import { convertDisplayAmountToOnChainAmount, convertDisplayPriceToOnChainPrice, numTicksToTickSize } from "@augurproject/sdk";
import { ContractInterfaces } from "@augurproject/core";
import { BigNumber } from "bignumber.js";
import { stringTo32ByteHex } from "../../../libs/Utils";
import * as _ from "lodash";

const ZERO_BYTES = stringTo32ByteHex("");

const ZERO = 0;
const ONE = 1;
const TWO = 2;
const THREE = 3;

const BID = ZERO;
const LONG = ZERO;
const ASK = ONE;
const SHORT = ONE;
const YES = TWO;
const NO = ONE;

const DEFAULT_MIN_PRICE = new BigNumber(ZERO);
const DEFAULT_DISPLAY_RANGE = new BigNumber(ONE);

const INVALID = ZERO;
const A = ONE;
const B = TWO;
const C = THREE;

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

const mock = makeDbMock();

let db: Promise<DB>;
let api: API;
let john: ContractAPI;
let mary: ContractAPI;

beforeAll(async () => {
  const { provider, addresses } = await deployContracts(ACCOUNTS, compilerOutput);

  john = await ContractAPI.userWrapper(ACCOUNTS, 0, provider, addresses);
  mary = await ContractAPI.userWrapper(ACCOUNTS, 1, provider, addresses);
  db = mock.makeDB(john.augur, ACCOUNTS);
  api = new API(john.augur, db);
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();
}, 120000);

test("State API :: Users :: getProfitLoss & getProfitLossSummary ", async () => {
  const market1 = await john.createReasonableYesNoMarket();
  const market2 = await john.createReasonableYesNoMarket();

  const startTime = await john.getTimestamp();
  let timestamp = startTime;

  const day = 60 * 60 * 24;

  const trades: Array<PLTradeData> = [
    {
      "direction": LONG,
      "outcome": YES,
      "quantity": 10,
      "price": .5,
      "realizedPL": 0,
      "market": market1,
      "timestamp": startTime.toNumber(),
      "unrealizedPL": 0,
    }, {
      "direction": LONG,
      "outcome": YES,
      "quantity": 10,
      "price": .3,
      "realizedPL": 0,
      "market": market1,
      "timestamp": startTime.plus(day * 2).toNumber(),
      "unrealizedPL": -2,
    }, {
      "direction": LONG,
      "outcome": YES,
      "quantity": 10,
      "price": .3,
      "realizedPL": 0,
      "market": market2,
      "timestamp": startTime.plus(30 * day).toNumber(),
      "unrealizedPL": -2,
    }, {
      "direction": SHORT,
      "outcome": YES,
      "quantity": 5,
      "price": .4,
      "realizedPL": .5,
      "market": market2,
      "timestamp": startTime.plus(32 * day).toNumber(),
      "unrealizedPL": -1.5,
    }
  ];

  for (let trade of trades) {
    await john.setTimestamp(new BigNumber(trade.timestamp));
    await doTrade(trade, trade.market);
  }

  await (await db).sync(
    john.augur,
    mock.constants.chunkSize,
    0,
  );

  const profitLoss = await api.route("getProfitLoss", {
    universe: john.augur.contracts.universe.address,
    account: mary.account,
    startTime: startTime.toNumber(),
  });

  for (let trade of trades) {
    const plFrame = _.find(profitLoss, (pl) => {
      return new BigNumber(pl.timestamp).gte(trade.timestamp);
    });

    await expect(Number.parseFloat(plFrame.realized)).toEqual(trade.realizedPL);
    await expect(Number.parseFloat(plFrame.unrealized)).toEqual(trade.unrealizedPL);
  }

  const profitLossSummary = await api.route("getProfitLossSummary", {
    universe: john.augur.contracts.universe.address,
    account: mary.account,
  });

  const oneDayPLSummary = profitLossSummary["1"]
  const thirtyDayPLSummary = profitLossSummary["30"]

  await expect(Number.parseFloat(oneDayPLSummary.realized)).toEqual(0.5);
  await expect(Number.parseFloat(oneDayPLSummary.unrealized)).toEqual(0.5);
  await expect(Number.parseFloat(oneDayPLSummary.frozenFunds)).toEqual(1.5);

  await expect(Number.parseFloat(thirtyDayPLSummary.realized)).toEqual(0.5);
  await expect(Number.parseFloat(thirtyDayPLSummary.unrealized)).toEqual(0.5);
  await expect(Number.parseFloat(thirtyDayPLSummary.frozenFunds)).toEqual(9.5);

}, 60000);

test("State API :: Users :: getUserTradingPositions binary-1", async () => {
  const market = await john.createReasonableYesNoMarket();

  const trades: Array<UTPTradeData> = [
    {
      "direction": SHORT,
      "outcome": YES,
      "quantity": 10,
      "price": .65,
      "position": -10,
      "avgPrice": .65,
      "realizedPL": 0,
      "frozenFunds": 3.5
    }, {
      "direction": LONG,
      "outcome": YES,
      "quantity": 3,
      "price": .58,
      "position": -7,
      "avgPrice": .65,
      "realizedPL": .21,
      "frozenFunds": 2.45
    }, {
      "direction": SHORT,
      "outcome": YES,
      "quantity": 13,
      "price": .62,
      "position": -20,
      "avgPrice": .63,
      "realizedPL": .21,
      "frozenFunds": 7.39
    }, {
      "direction": LONG,
      "outcome": YES,
      "quantity": 10,
      "price": .5,
      "position": -10,
      "avgPrice": .63,
      "realizedPL": 1.51,
      "frozenFunds": 3.69
    }, {
      "direction": LONG,
      "outcome": YES,
      "quantity": 7,
      "price": .15,
      "position": -3,
      "avgPrice": .63,
      "realizedPL": 4.87,
      "frozenFunds": 1.1
    }
  ]

  await processTrades(trades, market, john.augur.contracts.universe.address);
}, 60000);

test("State API :: Users :: getUserTradingPositions cat3-1", async () => {
  const market = await john.createReasonableMarket([stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")]);

  const trades: Array<UTPTradeData> = [
    {
      "direction": LONG,
      "outcome": A,
      "quantity": 1,
      "price": .4,
      "position": 1,
      "avgPrice": .4,
      "realizedPL": 0,
      "frozenFunds": 0.4
    }, {
      "direction": SHORT,
      "outcome": B,
      "quantity": 2,
      "price": .2,
      "position": -2,
      "avgPrice": .2,
      "realizedPL": 0,
      "frozenFunds": 1.6
    }, {
      "direction": LONG,
      "outcome": C,
      "quantity": 1,
      "price": .3,
      "position": 1,
      "avgPrice": .3,
      "realizedPL": 0,
      "frozenFunds": .3
    }, {
      "direction": SHORT,
      "outcome": A,
      "quantity": 1,
      "price": .7,
      "position": 0,
      "avgPrice": 0,
      "realizedPL": .3,
      "frozenFunds": 0
    }
  ]

  await processTrades(trades, market, john.augur.contracts.universe.address);
}, 60000);

test("State API :: Users :: getUserTradingPositions cat3-2", async () => {
  const market = await john.createReasonableMarket([stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")]);

  const trades: Array<UTPTradeData> = [
    {
      "direction": SHORT,
      "outcome": A,
      "quantity": 5,
      "price": .4,
      "position": -5,
      "avgPrice": .4,
      "realizedPL": 0,
      "frozenFunds": 3
    }, {
      "direction": SHORT,
      "outcome": B,
      "quantity": 3,
      "price": .35,
      "position": -3,
      "avgPrice": .35,
      "realizedPL": 0,
      "frozenFunds": -1.05
    }, {
      "direction": SHORT,
      "outcome": C,
      "quantity": 10,
      "price": .3,
      "position": -10,
      "avgPrice": .3,
      "realizedPL": 0,
      "frozenFunds": 2
    }, {
      "direction": LONG,
      "outcome": C,
      "quantity": 8,
      "price": .1,
      "position": -2,
      "avgPrice": .3,
      "realizedPL": 1.6,
      "frozenFunds": -0.6
    }
  ]

  await processTrades(trades, market, john.augur.contracts.universe.address);
}, 60000);

test("State API :: Users :: getUserTradingPositions cat3-3", async () => {
  const market = await john.createReasonableMarket([stringTo32ByteHex("A"), stringTo32ByteHex("B"), stringTo32ByteHex("C")]);

  const trades: Array<UTPTradeData> = [
    {
      "direction": LONG,
      "outcome": INVALID,
      "quantity": 5,
      "price": .05,
      "position": 5,
      "avgPrice": .05,
      "realizedPL": 0,
      "frozenFunds": .25
    },
    {
      "direction": LONG,
      "outcome": A,
      "quantity": 10,
      "price": .15,
      "position": 10,
      "avgPrice": .15,
      "realizedPL": 0,
      "frozenFunds": 1.5
    }, {
      "direction": LONG,
      "outcome": B,
      "quantity": 25,
      "price": .1,
      "position": 25,
      "avgPrice": .1,
      "realizedPL": 0,
      "frozenFunds": 2.5
    }, {
      "direction": LONG,
      "outcome": C,
      "quantity": 5,
      "price": .6,
      "position": 5,
      "avgPrice": .6,
      "realizedPL": 0,
      "frozenFunds": -2
    }, {
      "direction": SHORT,
      "outcome": B,
      "quantity": 13,
      "price": .2,
      "position": 12,
      "avgPrice": .1,
      "realizedPL": 1.3,
      "frozenFunds": 1.2
    }, {
      "direction": SHORT,
      "outcome": C,
      "quantity": 3,
      "price": .8,
      "position": 2,
      "avgPrice": .6,
      "realizedPL": .6,
      "frozenFunds": -0.8
    }, {
      "direction": SHORT,
      "outcome": A,
      "quantity": 10,
      "price": .1,
      "position": 0,
      "avgPrice": 0,
      "realizedPL": -.5,
      "frozenFunds": 2
    }
  ]

  await processTrades(trades, market, john.augur.contracts.universe.address);
}, 60000);

test("State API :: Users :: getUserTradingPositions scalar", async () => {
  const market = await john.createReasonableScalarMarket();

  const trades: Array<UTPTradeData> = [
    {
      "direction": LONG,
      "outcome": YES,
      "quantity": 2,
      "price": 200,
      "position": 2,
      "avgPrice": 200,
      "realizedPL": 0,
      "frozenFunds": 300
    }, {
      "direction": LONG,
      "outcome": YES,
      "quantity": 3,
      "price": 180,
      "position": 5,
      "avgPrice": 188,
      "realizedPL": 0,
      "frozenFunds": 690
    }, {
      "direction": SHORT,
      "outcome": YES,
      "quantity": 4,
      "price": 202,
      "position": 1,
      "avgPrice": 188,
      "realizedPL": 56,
      "frozenFunds": 138
    }, {
      "direction": SHORT,
      "outcome": YES,
      "quantity": 11,
      "price": 205,
      "position": -10,
      "avgPrice": 205,
      "realizedPL": 73,
      "frozenFunds": 450
    }, {
      "direction": LONG,
      "outcome": YES,
      "quantity": 7,
      "price": 150,
      "position": -3,
      "avgPrice": 205,
      "realizedPL": 458,
      "frozenFunds": 135
    }
  ]

  await processTrades(trades, market, john.augur.contracts.universe.address, new BigNumber(50), new BigNumber(250));
}, 60000);

async function processTrades(tradeData: Array<UTPTradeData>, market: ContractInterfaces.Market, universe: string, minPrice: BigNumber = DEFAULT_MIN_PRICE, maxPrice: BigNumber = DEFAULT_DISPLAY_RANGE): Promise<void> {
  for (let trade of tradeData) {
    await doTrade(trade, market, minPrice, maxPrice);

    await (await db).sync(
      john.augur,
      mock.constants.chunkSize,
      0,
    );

    const { tradingPositions } = await api.route("getUserTradingPositions", {
      universe,
      account: mary.account,
      marketId: market.address,
    });

    const tradingPosition = _.find(tradingPositions, (position) => { return position.outcome == trade.outcome; });

    await expect(tradingPosition.netPosition).toEqual(trade.position.toString());
    await expect(tradingPosition.averagePrice).toEqual(trade.avgPrice.toString());
    await expect(tradingPosition.realized).toEqual(trade.realizedPL.toString());
    await expect(tradingPosition.frozenFunds).toEqual(trade.frozenFunds.toString());
  };
}

async function doTrade(trade: TradeData, market: ContractInterfaces.Market, minPrice: BigNumber = DEFAULT_MIN_PRICE, maxPrice: BigNumber = DEFAULT_DISPLAY_RANGE): Promise<void> {
  const numTicks = await market.getNumTicks_();
  const price = new BigNumber(trade.price);
  const tickSize = numTicksToTickSize(numTicks, minPrice.multipliedBy(10 ** 18), maxPrice.multipliedBy(10 ** 18));
  const quantity = convertDisplayAmountToOnChainAmount(new BigNumber(trade.quantity), tickSize);

  const onChainLongPrice = convertDisplayPriceToOnChainPrice(price, minPrice, tickSize);
  const onChainShortPrice = numTicks.minus(onChainLongPrice);
  const direction = trade.direction === SHORT ? BID : ASK;
  const longCost = quantity.multipliedBy(onChainLongPrice);
  const shortCost = quantity.multipliedBy(onChainShortPrice);
  const fillerCost = trade.direction === ASK ? longCost : shortCost;

  const orderID = await john.placeOrder(market.address, new BigNumber(direction), quantity, onChainLongPrice, new BigNumber(trade.outcome), ZERO_BYTES, ZERO_BYTES, ZERO_BYTES);

  await mary.fillOrder(orderID, fillerCost, quantity, "");
}
