import { DB } from '@augurproject/sdk/build/state/db/DB';

import { API } from '@augurproject/sdk/build/state/getter/API';
import { BulkSyncStrategy } from '@augurproject/sdk/build/state/sync/BulkSyncStrategy';
import { ContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import { makeDbMock } from '../../../../libs';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import {
  _beforeAll,
  _beforeEach,
  doTrade,
  LONG,
  PLTradeData,
  SHORT,
  YES,
} from './common';

const mock = makeDbMock();

describe('State API :: Users :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
  let baseProvider: TestEthersProvider;
  let bulkSyncStrategy: BulkSyncStrategy;

  beforeAll(async () => {
    const state = await _beforeAll();
    baseProvider = state.baseProvider;
  });

  beforeEach(async () => {
    const state = await _beforeEach({ baseProvider });
    db = state.db;
    api = state.api;
    john = state.john;
    mary = state.mary;

    bulkSyncStrategy = new BulkSyncStrategy(
      john.provider.getLogs,
      (await db).logFilters.buildFilter,
      (await db).logFilters.onLogsAdded,
      john.augur.contractEvents.parseLogs,
    );
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

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    const profitLoss = await api.route('getProfitLoss', {
      universe: john.augur.contracts.universe.address,
      account: mary.account.publicKey,
      startTime: startTime.toNumber(),
    });

    for (const trade of trades) {
      const plFrame = _.find(profitLoss, (pl) => {
        return new BigNumber(pl.timestamp).gte(trade.timestamp);
      });

      await expect(Number.parseFloat(plFrame.realized)).toEqual(trade.realizedPL);
      await expect(Number.parseFloat(plFrame.unrealized)).toEqual(trade.unrealizedPL);
    }

    const profitLossSummary = await api.route('getProfitLossSummary', {
      universe: john.augur.contracts.universe.address,
      account: mary.account.publicKey,
    });

    const oneDayPLSummary = profitLossSummary['1'];
    const thirtyDayPLSummary = profitLossSummary['30'];

    await expect(Number.parseFloat(oneDayPLSummary.realized)).toEqual(trades[3].realizedPL);
    await expect(Number.parseFloat(oneDayPLSummary.unrealized)).toEqual(0.5);
    await expect(Number.parseFloat(oneDayPLSummary.frozenFunds)).toEqual(1.5);

    await expect(Number.parseFloat(thirtyDayPLSummary.realized)).toEqual(trades[3].realizedPL);
    await expect(Number.parseFloat(thirtyDayPLSummary.unrealized)).toEqual(0.5);
    await expect(Number.parseFloat(thirtyDayPLSummary.frozenFunds)).toEqual(9.5);
  });
});
