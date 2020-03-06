import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import {
  _beforeAll,
  _beforeEach,
  doTrade,
  LONG,
  PLTradeData,
  SHORT,
  YES,
} from './common';

describe('State API :: Users :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let baseProvider: TestEthersProvider;

  beforeAll(async () => {
    const state = await _beforeAll();
    baseProvider = state.baseProvider;
  });

  beforeEach(async () => {
    const state = await _beforeEach({ baseProvider });

    john = state.john;
    mary = state.mary;
  });

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
        realizedPL: 0.44,
        market: market2,
        timestamp: startTime.plus(32 * day).toNumber(),
        unrealizedPL: -1.5,
      },
    ];

    for (const trade of trades) {
      await john.setTimestamp(new BigNumber(trade.timestamp));
      await doTrade(john, mary, trade, trade.market);
    }

    await john.sync();

    const profitLoss = await john.api.route('getProfitLoss', {
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

    const profitLossSummary = await john.api.route('getProfitLossSummary', {
      universe: john.augur.contracts.universe.address,
      account: mary.account.publicKey,
    });

    const oneDayPLSummary = profitLossSummary['1'];
    const thirtyDayPLSummary = profitLossSummary['30'];

    await expect(Number.parseFloat(oneDayPLSummary.realized)).toEqual(
      trades[3].realizedPL
    );
    await expect(Number.parseFloat(oneDayPLSummary.unrealized)).toEqual(0.5);
    await expect(Number.parseFloat(oneDayPLSummary.frozenFunds)).toEqual(1.5);

    await expect(Number.parseFloat(thirtyDayPLSummary.realized)).toEqual(
      trades[3].realizedPL
    );
    await expect(Number.parseFloat(thirtyDayPLSummary.unrealized)).toEqual(0.5);
    await expect(Number.parseFloat(thirtyDayPLSummary.frozenFunds)).toEqual(
      9.5
    );
  });
});
