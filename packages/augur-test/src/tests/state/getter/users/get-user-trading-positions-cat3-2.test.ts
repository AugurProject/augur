import { TestContractAPI } from '@augurproject/tools';
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
        realizedPL: 1.59495,
        frozenFunds: -0.6,
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
