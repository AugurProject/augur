import { ContractAPI, fork } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { _beforeAll, _beforeEach } from './common';

describe('State API :: Markets :: GetMarketsInfo', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: ContractAPI;

  let baseProvider: TestEthersProvider;
  let markets = {};

  beforeAll(async () => {
    const state = await _beforeAll();
    baseProvider = state.baseProvider;
    markets = state.markets;
  });

  beforeEach(async () => {
    const state = await _beforeEach({ baseProvider, markets });

    john = state.john;
    mary = state.mary;
    bob = state.bob;
  });

  test('disputeinfo.stakes outcome valid/invalid', async () => {
    const market = john.augur.contracts.marketFromAddress(
      markets['yesNoMarket1']
    );

    await john.sync();
    let infos = await john.api.route('getMarketsInfo', {
      marketIds: [market.address],
    });
    expect(infos.length).toEqual(1);
    let info = infos[0];

    await fork(john, info);

    await john.sync();
    infos = await john.api.route('getMarketsInfo', {
      marketIds: [market.address],
    });
    expect(infos.length).toEqual(1);
    info = infos[0];

    expect(info).toHaveProperty('disputeInfo');
    expect(info.disputeInfo).toHaveProperty('stakes');
    expect(info.disputeInfo.stakes).toMatchObject([
      {
        outcome: '1',
        isInvalidOutcome: false,
        isMalformedOutcome: false,
      },
      {
        outcome: '0', // this test was written to verify this specific value
        isInvalidOutcome: true,
        isMalformedOutcome: false,
      },
    ]);
  });
});
