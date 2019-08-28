import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import { ContractInterfaces } from '@augurproject/core';
import {
  convertDisplayAmountToOnChainAmount,
  convertDisplayPriceToOnChainPrice,
  numTicksToTickSize,
} from '@augurproject/sdk';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { ContractAPI, loadSeedFile, ACCOUNTS, defaultSeedPath } from '@augurproject/tools';
import { makeDbMock, makeProvider } from '../../../libs';
import { stringTo32ByteHex } from '../../../libs/Utils';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk';

const ZERO_BYTES = stringTo32ByteHex('');

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

describe('State API :: Users :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses);
    db = mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
  }, 120000);

  test(':getAccountTimeRangedStats', async () => {
    // Create markets with multiple users
    const universe = john.augur.contracts.universe;
    const johnYesNoMarket = await john.createReasonableYesNoMarket();
    const johnCategoricalMarket = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const johnScalarMarket = await john.createReasonableScalarMarket();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Place orders
    const bid = new BigNumber(0);
    const outcome0 = new BigNumber(0);
    const outcome1 = new BigNumber(1);
    const outcome2 = new BigNumber(2);
    const numShares = new BigNumber(10).pow(12);
    const price = new BigNumber(22);
    await john.placeOrder(
      johnYesNoMarket.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnYesNoMarket.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnYesNoMarket.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Fill orders
    await mary.faucet(new BigNumber(1e18)); // faucet enough cash for the various fill orders
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket.address, outcome2),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket.address, outcome2),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Cancel an order
    await john.cancelOrder(
      await john.getBestOrderId(bid, johnScalarMarket.address, outcome2)
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Purchase & sell complete sets
    let numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(johnYesNoMarket, numberOfCompleteSets);
    await john.sellCompleteSets(johnYesNoMarket, numberOfCompleteSets);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Move time to open reporting
    let newTime = (await johnYesNoMarket.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    // Submit initial report
    const noPayoutSet = [
      new BigNumber(0),
      new BigNumber(100),
      new BigNumber(0),
    ];
    const yesPayoutSet = [
      new BigNumber(0),
      new BigNumber(0),
      new BigNumber(100),
    ];
    // implicitly creates dispute window
    await john.doInitialReport(johnYesNoMarket, noPayoutSet);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Move time to dispute window start time
    let disputeWindowAddress = await johnYesNoMarket.getDisputeWindow_();
    let disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    await john.setTimestamp(newTime);

    // Purchase participation tokens
    await john.buyParticipationTokens(disputeWindow.address, new BigNumber(1));

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        const market = await mary.getMarketContract(johnYesNoMarket.address);
        await mary.contribute(
          market,
          yesPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket,
          yesPayoutSet
        );
        await mary.contribute(market, yesPayoutSet, remainingToFill);
      } else {
        await john.contribute(
          johnYesNoMarket,
          noPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket,
          noPayoutSet
        );
        await john.contribute(johnYesNoMarket, noPayoutSet, remainingToFill);
      }
    }

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Move time forward by 2 weeks
    newTime = newTime.plus(SECONDS_IN_A_DAY.times(14));
    await john.setTimestamp(newTime);

    // Finalize markets & redeem crowdsourcer funds
    await johnYesNoMarket.finalize();

    // Transfer cash to dispute window (so participation tokens can be redeemed -- normally this would come from fees)
    await john.augur.contracts.cash.transfer(
      disputeWindow.address,
      new BigNumber(1)
    );

    // Redeem participation tokens
    await john.redeemParticipationTokens(disputeWindow.address, john.account.publicKey);

    // Claim initial reporter
    let initialReporter = await john.getInitialReporter(johnYesNoMarket);
    await initialReporter.redeem(john.account.publicKey);

    // Claim winning crowdsourcers
    let winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket
    );
    await winningReportingParticipant.redeem(john.account.publicKey);

    // Claim trading proceeds
    await john.augur.contracts.claimTradingProceeds.claimTradingProceeds(
      johnYesNoMarket.address,
      john.account.publicKey,
      '0x0000000000000000000000000000000000000000'
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Test non-existent universe address
    const nonexistentAddress = '0x1111111111111111111111111111111111111111';
    let errorMessage = '';
    try {
      await api.route('getAccountTimeRangedStats', {
        universe: nonexistentAddress,
        account: nonexistentAddress,
        startTime: 1234,
        endTime: 45678,
      });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual(
      'Unknown universe: 0x1111111111111111111111111111111111111111'
    );

    await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: nonexistentAddress,
    });

    // Test endTime and startTime
    try {
      await api.route('getAccountTimeRangedStats', {
        universe: universe.address,
        account: ACCOUNTS[0].publicKey,
        startTime: 123456,
        endTime: 12,
      });
    } catch (error) {
      errorMessage = error.message;
    }
    expect(errorMessage).toEqual('startTime must be less than or equal to endTime');

    let stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
      startTime: 0,
      endTime: newTime.minus(1).toNumber(),
    });
    expect(stats).toMatchObject({});

    stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
      startTime: newTime.plus(1).toNumber(),
      endTime: newTime.plus(100).toNumber(),
    });
    expect(stats).toMatchObject({});

    stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
    });
    // console.log("stats2", stats);
    expect(stats).toMatchObject({
      marketsCreated: 3,
      marketsTraded: 3,
      numberOfTrades: 3,
      positions: 9,
      redeemedPositions: 2,
      successfulDisputes: 1,
    });

    // Create markets with multiple users again
    const johnYesNoMarket2 = await john.createReasonableYesNoMarket();
    const johnCategoricalMarket2 = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const johnScalarMarket2 = await john.createReasonableScalarMarket();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Place orders
    await john.placeOrder(
      johnYesNoMarket2.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnYesNoMarket2.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnYesNoMarket2.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket2.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket2.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnCategoricalMarket2.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket2.address,
      bid,
      numShares,
      price,
      outcome0,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket2.address,
      bid,
      numShares,
      price,
      outcome1,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );
    await john.placeOrder(
      johnScalarMarket2.address,
      bid,
      numShares,
      price,
      outcome2,
      stringTo32ByteHex(''),
      stringTo32ByteHex(''),
      stringTo32ByteHex('42')
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Fill orders
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnYesNoMarket2.address, outcome2),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnCategoricalMarket2.address, outcome2),
      numShares.div(10).times(3),
      '43'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome0),
      numShares.div(10).times(2),
      '42'
    );
    await mary.fillOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome1),
      numShares.div(10).times(3),
      '43'
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Re-test startTime and endTime with order filler account
    stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[1].publicKey,
      startTime: 0,
      endTime: newTime.minus(1).toNumber(),
    });
    expect(stats).toMatchObject({});

    stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[1].publicKey,
      startTime: 0,
      endTime: newTime.toNumber(),
    });
    expect(stats).toMatchObject({
      positions: 16,
      numberOfTrades: 3,
      marketsCreated: 0,
      marketsTraded: 6,
      successfulDisputes: 0,
      redeemedPositions: 0,
    });

    stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[1].publicKey,
      startTime: newTime.plus(1).toNumber(),
      endTime: newTime.plus(100).toNumber(),
    });
    expect(stats).toMatchObject({});

    // Cancel an order
    await john.cancelOrder(
      await john.getBestOrderId(bid, johnScalarMarket2.address, outcome2)
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Purchase & sell complete sets
    numberOfCompleteSets = new BigNumber(1);
    await john.buyCompleteSets(johnYesNoMarket2, numberOfCompleteSets);
    await john.sellCompleteSets(johnYesNoMarket2, numberOfCompleteSets);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Move time to open reporting
    newTime = (await johnYesNoMarket2.getEndTime_()).plus(
      SECONDS_IN_A_DAY.times(7)
    );
    await john.setTimestamp(newTime);

    await john.doInitialReport(johnYesNoMarket2, noPayoutSet);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Move time to dispute window start time
    disputeWindowAddress = await johnYesNoMarket2.getDisputeWindow_();
    disputeWindow = await john.augur.contracts.disputeWindowFromAddress(
      disputeWindowAddress
    );
    newTime = new BigNumber(await disputeWindow.getStartTime_()).plus(1);
    await john.setTimestamp(newTime);

    // Purchase participation tokens
    await john.buyParticipationTokens(disputeWindow.address, new BigNumber(1));

    // Dispute 2 times
    for (let disputeRound = 1; disputeRound <= 3; disputeRound++) {
      if (disputeRound % 2 !== 0) {
        const market = await mary.getMarketContract(johnYesNoMarket2.address);
        await mary.contribute(
          market,
          yesPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket2,
          yesPayoutSet
        );
        await mary.contribute(market, yesPayoutSet, remainingToFill);
      } else {
        await john.contribute(
          johnYesNoMarket2,
          noPayoutSet,
          new BigNumber(25000)
        );
        const remainingToFill = await john.getRemainingToFill(
          johnYesNoMarket2,
          noPayoutSet
        );
        await john.contribute(johnYesNoMarket2, noPayoutSet, remainingToFill);
      }
    }

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    // Move time forward by 2 weeks
    newTime = newTime.plus(SECONDS_IN_A_DAY.times(14));
    await john.setTimestamp(newTime);

    // Finalize markets & redeem crowdsourcer funds
    await johnYesNoMarket2.finalize();

    // Transfer cash to dispute window (so participation tokens can be redeemed -- normally this would come from fees)
    await john.augur.contracts.cash.transfer(
      disputeWindow.address,
      new BigNumber(1)
    );

    // Redeem participation tokens
    await john.redeemParticipationTokens(disputeWindow.address, john.account.publicKey);

    // Claim initial reporter
    initialReporter = await john.getInitialReporter(johnYesNoMarket2);
    await initialReporter.redeem(john.account.publicKey);

    // Claim winning crowdsourcers
    winningReportingParticipant = await john.getWinningReportingParticipant(
      johnYesNoMarket2
    );
    await winningReportingParticipant.redeem(john.account.publicKey);

    // Claim trading proceeds
    await john.augur.contracts.claimTradingProceeds.claimTradingProceeds(
      johnYesNoMarket2.address,
      john.account.publicKey,
      '0x0000000000000000000000000000000000000000'
    );

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: ACCOUNTS[0].publicKey,
    });
    // console.log("stats3", stats);
    expect(stats).toMatchObject({
      marketsCreated: 6,
      marketsTraded: 6,
      numberOfTrades: 3,
      positions: 18,
      redeemedPositions: 4,
      successfulDisputes: 2,
    });
  }, 200000);

  test(':getProfitLoss & getProfitLossSummary ', async () => {
    const market1 = await john.createReasonableYesNoMarket();
    const market2 = await john.createReasonableYesNoMarket();

    const startTime = await john.getTimestamp();

    const day = 60 * 60 * 24;

    const trades: PLTradeData[] = [
      {
        direction: LONG,
        outcome: YES,
        quantity: 10,
        price: 0.5,
        realizedPL: 0,
        market: market1,
        timestamp: startTime.toNumber(),
        unrealizedPL: 0,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 10,
        price: 0.3,
        realizedPL: 0,
        market: market1,
        timestamp: startTime.plus(day * 2).toNumber(),
        unrealizedPL: -2,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 10,
        price: 0.3,
        realizedPL: 0,
        market: market2,
        timestamp: startTime.plus(30 * day).toNumber(),
        unrealizedPL: -2,
      },
      {
        direction: SHORT,
        outcome: YES,
        quantity: 5,
        price: 0.4,
        realizedPL: 0.5,
        market: market2,
        timestamp: startTime.plus(32 * day).toNumber(),
        unrealizedPL: -1.5,
      },
    ];

    for (const trade of trades) {
      await john.setTimestamp(new BigNumber(trade.timestamp));
      await doTrade(trade, trade.market);
    }

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    const profitLoss = await api.route('getProfitLoss', {
      universe: john.augur.contracts.universe.address,
      account: mary.account.publicKey,
      startTime: startTime.toNumber(),
    });

    for (const trade of trades) {
      const plFrame = _.find(profitLoss, pl => {
        return new BigNumber(pl.timestamp).gte(trade.timestamp);
      });

      await expect(Number.parseFloat(plFrame.realized)).toEqual(
        trade.realizedPL
      );
      await expect(Number.parseFloat(plFrame.unrealized)).toEqual(
        trade.unrealizedPL
      );
    }

    const profitLossSummary = await api.route('getProfitLossSummary', {
      universe: john.augur.contracts.universe.address,
      account: mary.account.publicKey,
    });

    const oneDayPLSummary = profitLossSummary['1'];
    const thirtyDayPLSummary = profitLossSummary['30'];

    await expect(Number.parseFloat(oneDayPLSummary.realized)).toEqual(0.5);
    await expect(Number.parseFloat(oneDayPLSummary.unrealized)).toEqual(0.5);
    await expect(Number.parseFloat(oneDayPLSummary.frozenFunds)).toEqual(1.5);

    await expect(Number.parseFloat(thirtyDayPLSummary.realized)).toEqual(0.5);
    await expect(Number.parseFloat(thirtyDayPLSummary.unrealized)).toEqual(0.5);
    await expect(Number.parseFloat(thirtyDayPLSummary.frozenFunds)).toEqual(
      9.5
    );

  }, 120000);

  test(':getUserTradingPositions binary-1', async () => {
    const market = await john.createReasonableYesNoMarket();

    const trades: UTPTradeData[] = [
      {
        direction: SHORT,
        outcome: YES,
        quantity: 10,
        price: 0.65,
        position: -10,
        avgPrice: 0.65,
        realizedPL: 0,
        frozenFunds: 3.5,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 3,
        price: 0.58,
        position: -7,
        avgPrice: 0.65,
        realizedPL: 0.21,
        frozenFunds: 2.45,
      },
      {
        direction: SHORT,
        outcome: YES,
        quantity: 13,
        price: 0.62,
        position: -20,
        avgPrice: 0.63,
        realizedPL: 0.21,
        frozenFunds: 7.39,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 10,
        price: 0.5,
        position: -10,
        avgPrice: 0.63,
        realizedPL: 1.51,
        frozenFunds: 3.69,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 7,
        price: 0.15,
        position: -3,
        avgPrice: 0.63,
        realizedPL: 4.87,
        frozenFunds: 1.1,
      },
    ];

    await processTrades(trades, market, john.augur.contracts.universe.address);
  }, 120000);

  test(':getUserTradingPositions cat3-1', async () => {
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);

    const trades: UTPTradeData[] = [
      {
        direction: LONG,
        outcome: A,
        quantity: 1,
        price: 0.4,
        position: 1,
        avgPrice: 0.4,
        realizedPL: 0,
        frozenFunds: 0.4,
      },
      {
        direction: SHORT,
        outcome: B,
        quantity: 2,
        price: 0.2,
        position: -2,
        avgPrice: 0.2,
        realizedPL: 0,
        frozenFunds: 1.6,
      },
      {
        direction: LONG,
        outcome: C,
        quantity: 1,
        price: 0.3,
        position: 1,
        avgPrice: 0.3,
        realizedPL: 0,
        frozenFunds: 0.3,
      },
      {
        direction: SHORT,
        outcome: A,
        quantity: 1,
        price: 0.7,
        position: 0,
        avgPrice: 0,
        realizedPL: 0.3,
        frozenFunds: 0,
      },
    ];

    await processTrades(trades, market, john.augur.contracts.universe.address);
  }, 120000);

  test(':getUserTradingPositions cat3-2', async () => {
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);

    const trades: UTPTradeData[] = [
      {
        direction: SHORT,
        outcome: A,
        quantity: 5,
        price: 0.4,
        position: -5,
        avgPrice: 0.4,
        realizedPL: 0,
        frozenFunds: 3,
      },
      {
        direction: SHORT,
        outcome: B,
        quantity: 3,
        price: 0.35,
        position: -3,
        avgPrice: 0.35,
        realizedPL: 0,
        frozenFunds: -1.05,
      },
      {
        direction: SHORT,
        outcome: C,
        quantity: 10,
        price: 0.3,
        position: -10,
        avgPrice: 0.3,
        realizedPL: 0,
        frozenFunds: 2,
      },
      {
        direction: LONG,
        outcome: C,
        quantity: 8,
        price: 0.1,
        position: -2,
        avgPrice: 0.3,
        realizedPL: 1.6,
        frozenFunds: -0.6,
      },
    ];

    await processTrades(trades, market, john.augur.contracts.universe.address);
  }, 120000);

  test(':getUserTradingPositions cat3-3', async () => {
    const market = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);

    const trades: UTPTradeData[] = [
      {
        direction: LONG,
        outcome: INVALID,
        quantity: 5,
        price: 0.05,
        position: 5,
        avgPrice: 0.05,
        realizedPL: 0,
        frozenFunds: 0.25,
      },
      {
        direction: LONG,
        outcome: A,
        quantity: 10,
        price: 0.15,
        position: 10,
        avgPrice: 0.15,
        realizedPL: 0,
        frozenFunds: 1.5,
      },
      {
        direction: LONG,
        outcome: B,
        quantity: 25,
        price: 0.1,
        position: 25,
        avgPrice: 0.1,
        realizedPL: 0,
        frozenFunds: 2.5,
      },
      {
        direction: LONG,
        outcome: C,
        quantity: 5,
        price: 0.6,
        position: 5,
        avgPrice: 0.6,
        realizedPL: 0,
        frozenFunds: -2,
      },
      {
        direction: SHORT,
        outcome: B,
        quantity: 13,
        price: 0.2,
        position: 12,
        avgPrice: 0.1,
        realizedPL: 1.3,
        frozenFunds: 1.2,
      },
      {
        direction: SHORT,
        outcome: C,
        quantity: 3,
        price: 0.8,
        position: 2,
        avgPrice: 0.6,
        realizedPL: 0.6,
        frozenFunds: -0.8,
      },
      {
        direction: SHORT,
        outcome: A,
        quantity: 10,
        price: 0.1,
        position: 0,
        avgPrice: 0,
        realizedPL: -0.5,
        frozenFunds: 2,
      },
    ];

    await processTrades(trades, market, john.augur.contracts.universe.address);
  }, 120000);

  test(':getUserTradingPositions scalar', async () => {
    const market = await john.createReasonableScalarMarket();

    const trades: UTPTradeData[] = [
      {
        direction: LONG,
        outcome: YES,
        quantity: 2,
        price: 200,
        position: 2,
        avgPrice: 200,
        realizedPL: 0,
        frozenFunds: 300,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 3,
        price: 180,
        position: 5,
        avgPrice: 188,
        realizedPL: 0,
        frozenFunds: 690,
      },
      {
        direction: SHORT,
        outcome: YES,
        quantity: 4,
        price: 202,
        position: 1,
        avgPrice: 188,
        realizedPL: 56,
        frozenFunds: 138,
      },
      {
        direction: SHORT,
        outcome: YES,
        quantity: 11,
        price: 205,
        position: -10,
        avgPrice: 205,
        realizedPL: 73,
        frozenFunds: 450,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 7,
        price: 150,
        position: -3,
        avgPrice: 205,
        realizedPL: 458,
        frozenFunds: 135,
      },
    ];

    await processTrades(
      trades,
      market,
      john.augur.contracts.universe.address,
      new BigNumber(50),
      new BigNumber(250)
    );
  }, 120000);

  async function processTrades(
    tradeData: UTPTradeData[],
    market: ContractInterfaces.Market,
    universe: string,
    minPrice: BigNumber = DEFAULT_MIN_PRICE,
    maxPrice: BigNumber = DEFAULT_DISPLAY_RANGE
  ): Promise<void> {
    for (const trade of tradeData) {
      await doTrade(trade, market, minPrice, maxPrice);

      await (await db).sync(john.augur, mock.constants.chunkSize, 0);

      const { tradingPositions } = await api.route('getUserTradingPositions', {
        universe,
        account: mary.account.publicKey,
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

  async function doTrade(
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

    const orderID = await john.placeOrder(
      market.address,
      new BigNumber(direction),
      quantity,
      onChainLongPrice,
      new BigNumber(trade.outcome),
      ZERO_BYTES,
      ZERO_BYTES,
      ZERO_BYTES
    );

    await mary.fillOrder(orderID, quantity, '', fillerCost);
  }
});
