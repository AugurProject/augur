import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { ContractAPI, fork } from '@augurproject/tools';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import {
  _beforeAll,
  _beforeEach,
  CHUNK_SIZE,
  } from './common';


describe('State API :: Markets :: GetMarketsInfo', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
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
    db = state.db;
    api = state.api;
    john = state.john;
    mary = state.mary;
    bob = state.bob;
  });

  test(':getMarketsInfo disavowed in fork', async () => {
    const market = john.augur.contracts.marketFromAddress(markets['yesNoMarket1']);
    const otherMarket = john.augur.contracts.marketFromAddress(markets['yesNoMarket2']);

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    let infos = await api.route('getMarketsInfo', {marketIds: [market.address]});
    let info = infos[0];

    await fork(john, info);

    await otherMarket.disavowCrowdsourcers();

    await (await db).sync(john.augur, CHUNK_SIZE, 0);

    infos = await api.route('getMarketsInfo', {marketIds: [otherMarket.address]});
    expect(infos.length).toEqual(1);
    info = infos[0];

    expect(info).toHaveProperty('disavowed');
    expect(info['disavowed']).toEqual(1);
  });
});
