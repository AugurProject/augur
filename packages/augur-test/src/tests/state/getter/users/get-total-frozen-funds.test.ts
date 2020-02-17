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
  YES,
} from './common';
import { UserTotalOnChainFrozenFunds } from '@augurproject/sdk/src/state/getter/Users';
import { convertAttoValueToDisplayValue } from '@augurproject/sdk/src';

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

  test(':getTotalOnChainFrozenFunds ', async () => {
    const initialFrozenFunds: UserTotalOnChainFrozenFunds = await api.route('getTotalOnChainFrozenFunds', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });
    await expect(initialFrozenFunds.totalFrozenFunds).toEqual('0');

    const market1 = await john.createReasonableYesNoMarket();
    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());;

    const marketCreatedFrozenFunds: UserTotalOnChainFrozenFunds = await api.route('getTotalOnChainFrozenFunds', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });

    await expect(marketCreatedFrozenFunds.totalFrozenFunds).toEqual("10");

    const market2 = await john.createReasonableYesNoMarket();
    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());;

    const marketCreatedFrozenFunds2: UserTotalOnChainFrozenFunds = await api.route('getTotalOnChainFrozenFunds', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });

    await expect(marketCreatedFrozenFunds2.totalFrozenFunds).toEqual("20");

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
    ];

    for (const trade of trades) {
      await john.setTimestamp(new BigNumber(trade.timestamp));
      await doTrade(john, mary, trade, trade.market);
    }

    await bulkSyncStrategy.start(0, await john.provider.getBlockNumber());

    const { frozenFundsTotal } = await api.route('getUserTradingPositions', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });

    const afterTradesFrozenFunds: UserTotalOnChainFrozenFunds = await api.route('getTotalOnChainFrozenFunds', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });

    const total = new BigNumber(marketCreatedFrozenFunds2.totalFrozenFunds).plus(new BigNumber(frozenFundsTotal)).toFixed();
    await expect(afterTradesFrozenFunds.totalFrozenFunds).toEqual(total);
  });
});
