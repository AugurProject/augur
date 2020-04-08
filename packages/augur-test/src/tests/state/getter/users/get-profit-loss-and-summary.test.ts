import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { BigNumber } from 'bignumber.js';
import * as _ from 'lodash';
import {
  _beforeAll,
  _beforeEach,
  doTrade,
  LONG,
  SHORT,
  YES,
  MakerTakerTradeData,
  ONE,
} from './common';

const defaultPL = {
  unrealizedPL: 0,
  unrealizedPercent: 0,
  realizedPL: 0,
  realizedPercent: 0,
}
describe('State API :: Users :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;
  let baseProvider: TestEthersProvider;

  beforeAll(async () => {
    const state = await _beforeAll();
    baseProvider = state.baseProvider;
  });

  beforeEach(async () => {
    const state = await _beforeEach({ baseProvider });

    john = state.john;
    mary = state.mary;
    bob = state.bob;
  });

  test(':getProfitLoss & getProfitLossSummary 24 hour', async () => {
    const hour = 60 * 60;
    const day = 60 * 60 * 24;

    const startTime = await john.getTimestamp();
    const market2 = await john.createReasonableYesNoMarket('new market', true, 0);

    const makerTakerTradeDatas: MakerTakerTradeData[] = [
      {
        timestamp: startTime.toNumber(),
        trades: [{
          market: market2,
          maker: john,
          taker: mary,
          direction: LONG,
          outcome: YES,
          quantity: 10,
          price: 0.5,
        }],
        result: {
          [john.account.publicKey] : defaultPL,
          [mary.account.publicKey] : defaultPL,
          [bob.account.publicKey] : defaultPL,
        }
      },
      {
        timestamp: startTime.plus(hour * 1).toNumber(),
        trades: [{
          market: market2,
          maker: bob,
          taker: mary,
          direction: LONG,
          outcome: YES,
          quantity: 10,
          price: 0.25,
        }],
        result: {
          [john.account.publicKey] : {
            unrealizedPL: 2.5,
            unrealizedPercent: 0.5,
            realizedPL: 0,
            realizedPercent: 0,
          },
          [mary.account.publicKey] : {
            unrealizedPL: -2.5,
            unrealizedPercent: -0.3333,
            realizedPL: 0,
            realizedPercent: 0,
          },
          [bob.account.publicKey] : defaultPL,
        },
      },
      {
        timestamp: startTime.plus(hour * 2).toNumber(),
        trades: [{
          market: market2,
          maker: john,
          taker: mary,
          direction: SHORT,
          outcome: YES,
          quantity: 10,
          price: 0.75,
        }],
        result: {
          [john.account.publicKey] : {
          unrealizedPL: 0,
          unrealizedPercent: 0,
          realizedPL: -2.50075,
          realizedPercent: -0.5001,
        },
        [mary.account.publicKey] : {
          unrealizedPL: 3.75,
          unrealizedPercent: 1.0000,
          realizedPL: 3.74975,
          realizedPercent: 0.9999,
        },
        [bob.account.publicKey] : {
          unrealizedPL: -5,
          unrealizedPercent: -0.6667,
          realizedPL: 0,
          realizedPercent: 0,
        },
      }
    },
    {
      timestamp: startTime.plus(hour * 33).toNumber(),
      trades: [{
        market: market2,
        maker: bob,
        taker: mary,
        direction: SHORT,
        outcome: YES,
        quantity: 10,
        price: 0.5,
      }],
      result: {
        [john.account.publicKey] : {
        unrealizedPL: 0,
        unrealizedPercent: 0,
        realizedPL: -5.0015,
        realizedPercent: -1.0003,
      },
      [mary.account.publicKey] : {
        unrealizedPL: 0,
        unrealizedPercent: 0,
        realizedPL: 8.749,
        realizedPercent: 1.1665,
      },
      [bob.account.publicKey] : {
        unrealizedPL: 0,
        unrealizedPercent: 0,
        realizedPL: -2.5005,
        realizedPercent: -0.3334,
      },
    }
  },
    ];

    for (const makerTakerTradeData of makerTakerTradeDatas) {
      await john.setTimestamp(new BigNumber(makerTakerTradeData.timestamp));
      for (const trade of makerTakerTradeData.trades) {
        await doTrade(trade.maker, trade.taker, trade, trade.market);
      }
      await john.sync();

      for (const address of _.keys(makerTakerTradeData.result)) {

        const profitLossSummary = await john.api.route('getProfitLossSummary', {
          universe: john.augur.contracts.universe.address,
          account: address,
        });

        const plResult = makerTakerTradeData.result[address];
        const oneDayPLSummary = profitLossSummary[ONE];
        //console.log(address, JSON.stringify(oneDayPLSummary));
        //console.log('oneDayPLSummary.realized, trade.realizedPL', oneDayPLSummary.realized, plResult.realizedPL);
        await expect(Number.parseFloat(oneDayPLSummary.realized)).toEqual(plResult.realizedPL);

        //console.log('oneDayPLSummary.unrealized, trade.unrealizedPL', oneDayPLSummary.realized, plResult.unrealizedPL);
        await expect(Number.parseFloat(oneDayPLSummary.unrealized)).toEqual(plResult.unrealizedPL);

        //console.log('oneDayPLSummary.realizedPercent, trade.realizedPercent', oneDayPLSummary.realized, plResult.realizedPercent);
        await expect(Number.parseFloat(oneDayPLSummary.realizedPercent)).toEqual(plResult.realizedPercent);

        //console.log('oneDayPLSummary.unrealizedPercent, trade.unrealizedPercent', oneDayPLSummary.realized, plResult.unrealizedPercent);
        await expect(Number.parseFloat(oneDayPLSummary.unrealizedPercent)).toEqual(plResult.unrealizedPercent);
      }
    }
  });
});
