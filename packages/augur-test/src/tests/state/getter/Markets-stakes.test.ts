// This file exists to remove its test from the main test file, Markets.test.ts.
// This is necessary because this test messes with the contract state in a way that
// blocks another test (it forks).
// TODO: Use test-bleed-prevention to merge these test files.

import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from '../../../libs';
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from '@augurproject/tools';

import { fork } from '@augurproject/tools';

const mock = makeDbMock();

describe('State API :: Markets :: Stakes', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    db = mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
    await john.approveCentralAuthority();
  }, 120000);

  test(':getMarketsInfo disputeinfo.stakes outcome valid/invalid', async () => {
    const market = await john.createReasonableYesNoMarket();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    let infos = await api.route('getMarketsInfo', {
      marketIds: [market.address],
    });
    expect(infos.length).toEqual(1);
    let info = infos[0];

    await fork(john, info);

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);
    infos = await api.route('getMarketsInfo', {
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
  }, 180000);
});
