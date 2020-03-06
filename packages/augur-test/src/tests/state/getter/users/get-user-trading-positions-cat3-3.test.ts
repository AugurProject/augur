import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { stringTo32ByteHex } from '@augurproject/tools/build/libs/Utils';
import {
  _beforeAll,
  _beforeEach,
  A,
  B,
  C,
  INVALID,
  LONG,
  processTrades,
  SHORT,
  UTPTradeData,
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
        realizedPL: -0.06,
        frozenFunds: -2,
      },
      {
        direction: SHORT,
        outcome: B,
        quantity: 13,
        price: 0.2,
        position: 12,
        avgPrice: 0.1,
        realizedPL: 1.092,
        frozenFunds: 1.2,
      },
      {
        direction: SHORT,
        outcome: C,
        quantity: 3,
        price: 0.8,
        position: 2,
        avgPrice: 0.6,
        realizedPL: 0.54,
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

    await processTrades(
      john,
      mary,
      trades,
      market,
      john.augur.contracts.universe.address
    );
  });
});
