import { TestContractAPI } from '@augurproject/tools';
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
        realizedPL: 0.1752,
        frozenFunds: 2.45,
      },
      {
        direction: SHORT,
        outcome: YES,
        quantity: 13,
        price: 0.62,
        position: -20,
        avgPrice: 0.63,
        realizedPL: 0.1752,
        frozenFunds: 7.39,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 10,
        price: 0.5,
        position: -10,
        avgPrice: 0.63,
        realizedPL: 1.3752,
        frozenFunds: 3.69,
      },
      {
        direction: LONG,
        outcome: YES,
        quantity: 7,
        price: 0.15,
        position: -3,
        avgPrice: 0.63,
        realizedPL: 4.7142,
        frozenFunds: 1.1,
      },
    ];

    await processTrades(
      john,
      mary,
      trades,
      market,
      john.augur.contracts.universe.address
    );
  });
});
