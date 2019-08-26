import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  DisputeInfo,
  SECONDS_IN_A_DAY,
} from '@augurproject/sdk/build/state/getter/Markets';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from '../../../libs';
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';

const mock = makeDbMock();

describe('State API :: Universe :: ', () => {
  let db: DB;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;

  beforeAll(async () => {
    console.log('CLOCKWORK', 0);
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses);
    db = await mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, Promise.resolve(db));
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
    console.log('CLOCKWORK', 1);
  }, 120000);

  test('getDisputeWindow', async () => {
    console.log('CLOCKWORK', 2);
    const universe = john.augur.contracts.universe;
    const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
    const affiliateFeeDivisor = new BigNumber(0); // TODO bigger for to test fees
    const designatedReporter = john.account.publicKey;
    console.log('CLOCKWORK', 3);

    await john.createYesNoMarket({
      endTime,
      feePerCashInAttoCash: lowFeePerCashInAttoCash,
      affiliateFeeDivisor,
      designatedReporter,
      extraInfo: JSON.stringify({
        categories: ['yesNo', 'getDisputeWindow test'],
        description: 'market for dispute window test',
        longDescription: 'looooong',
        resolutionSource: 'http://www.blah.com',
        backupSource: 'http://www.blah2.com',
      }),
    });
    console.log('CLOCKWORK', 4);

    await db.sync(john.augur, mock.constants.chunkSize, 0);
    console.log('CLOCKWORK', 5);

    // Move timestamp to designated reporting phase
    await john.setTimestamp(endTime);
    console.log('CLOCKWORK', 6);

    await db.sync(john.augur, mock.constants.chunkSize, 0);
    console.log('CLOCKWORK', 7);

    const disputeWindow: DisputeInfo = await api.route('getDisputeWindow', {
      universe: universe.address,
    });

    console.log('CLOCKWORK', 100);

    expect(disputeWindow).toMatchObject({
      address: '0x0',
      startTime: 14,
      endTime: 19,
      purchased: new BigNumber(20),
      fees: new BigNumber(21),
    });
  }, 120000);
});
