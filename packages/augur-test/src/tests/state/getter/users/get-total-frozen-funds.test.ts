import { DB } from '@augurproject/sdk/build/state/db/DB';

import { API } from '@augurproject/sdk/build/state/getter/API';
import { TestContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
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

  test(':getTotalOnChainFrozenFunds ', async () => {
    const initialFrozenFunds: UserTotalOnChainFrozenFunds = await john.api.route('getTotalOnChainFrozenFunds', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });
    await expect(initialFrozenFunds.totalFrozenFunds).toEqual('0');

    const market1 = await john.createReasonableYesNoMarket();
    await john.sync();

    const marketCreatedFrozenFunds: UserTotalOnChainFrozenFunds = await john.api.route('getTotalOnChainFrozenFunds', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });

    await expect(marketCreatedFrozenFunds.totalFrozenFunds).toEqual("10");

    const market2 = await john.createReasonableYesNoMarket();
    await john.sync();

    const marketCreatedFrozenFunds2: UserTotalOnChainFrozenFunds = await john.api.route('getTotalOnChainFrozenFunds', {
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

    await john.sync();

    const { frozenFundsTotal } = await john.api.route('getUserTradingPositions', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });

    const afterTradesFrozenFunds: UserTotalOnChainFrozenFunds = await john.api.route('getTotalOnChainFrozenFunds', {
      universe: john.augur.contracts.universe.address,
      account: john.account.publicKey,
    });

    const total = new BigNumber(marketCreatedFrozenFunds2.totalFrozenFunds).plus(new BigNumber(frozenFundsTotal)).toFixed();
    await expect(afterTradesFrozenFunds.totalFrozenFunds).toEqual(total);
  });
});
