import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { ContractAPI} from '@augurproject/tools';
import { TestEthersProvider } from '../../../../libs/TestEthersProvider';
import {
  _beforeAll,
  _beforeEach,
  A,
  B,
  processTrades,
  SHORT,
  UTPTradeData,
  LONG,
  C
} from './common';
import { stringTo32ByteHex } from '../../../../libs/Utils';

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
        realizedPL: 1.59,
        frozenFunds: -0.6,
      },
    ];

    await processTrades(john, mary, db, api, trades, market, john.augur.contracts.universe.address);
  });
});
