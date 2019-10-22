import { DB } from '@augurproject/sdk/build/state/db/DB';
import { API } from '@augurproject/sdk/build/state/getter/API';
import { ContractAPI } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import {
  _beforeAll,
  _beforeEach,
  LONG,
  processTrades,
  SHORT,
  UTPTradeData,
  YES,
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
        realizedPL: 52.16,
        frozenFunds: 138,
      },
      {
        direction: SHORT,
        outcome: YES,
        quantity: 11,
        price: 205,
        position: -10,
        avgPrice: 205,
        realizedPL: 68.26,
        frozenFunds: 450,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 7,
        price: 150,
        position: -3,
        avgPrice: 205,
        realizedPL: 439.26,
        frozenFunds: 135,
      },
    ];

    await processTrades(
      john, mary, db, api,
      trades,
      market,
      john.augur.contracts.universe.address,
      new BigNumber(50),
      new BigNumber(250)
    );
  });
});
