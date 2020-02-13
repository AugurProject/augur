import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { ContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';

import {
  _beforeAll,
  _beforeEach,
  A,
  B,
  C,
  LONG,
  processTrades,
  SHORT,
  UTPTradeData,
} from './common';

describe('State API :: Users :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
  let baseProvider: TestEthersProvider;

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
  });

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

    await processTrades(john, mary, db, api, trades, market, john.augur.contracts.universe.address);
  });
});
