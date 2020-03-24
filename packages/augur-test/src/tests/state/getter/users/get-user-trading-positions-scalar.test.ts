import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
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
        realizedPL: 54.0608,
        frozenFunds: 138,
      },
      {
        direction: SHORT,
        outcome: YES,
        quantity: 11,
        price: 205,
        position: -10,
        avgPrice: 205,
        realizedPL: 70.6063,
        frozenFunds: 450,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 7,
        price: 150,
        position: -3,
        avgPrice: 205,
        realizedPL: 448.5363,
        frozenFunds: 135,
      },
    ];

    await processTrades(
      john,
      mary,
      trades,
      market,
      john.augur.contracts.universe.address,
      new BigNumber(50),
      new BigNumber(250)
    );
  });
});
