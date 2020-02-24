import { fork } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { _beforeAll, _beforeEach } from './common';

describe('State API :: Markets :: GetMarketsInfo', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;

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

  test(':getMarketsInfo disavowed in fork', async () => {
    const market = john.augur.contracts.marketFromAddress(
      markets['yesNoMarket1']
    );
    const otherMarket = john.augur.contracts.marketFromAddress(
      markets['yesNoMarket2']
    );

    await john.sync();

    let infos = await john.api.route('getMarketsInfo', {
      marketIds: [market.address],
    });
    let info = infos[0];

    await fork(john, info);

    await otherMarket.disavowCrowdsourcers();

    await john.sync();

    infos = await john.api.route('getMarketsInfo', {
      marketIds: [otherMarket.address],
    });
    expect(infos.length).toEqual(1);
    info = infos[0];

    expect(info).toHaveProperty('disavowed');
    expect(info['disavowed']).toEqual(1);
  });
});
