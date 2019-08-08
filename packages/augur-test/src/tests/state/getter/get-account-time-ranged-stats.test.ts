import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  MarketInfo,
  SECONDS_IN_A_DAY,
} from '@augurproject/sdk/build/state/getter/Markets';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from "../../../libs";
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from "@augurproject/tools";
import { stringTo32ByteHex } from '../../../libs/Utils';
import { BigNumber } from 'bignumber.js';
const mock = makeDbMock();

const outcome0 = new BigNumber(0);
describe('State API :: get-account-time-ranged-stats :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses);

    db = mock.makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
  }, 120000);

  test('getAccountTimeRngedAStatsa', async () => {
    // Create markets with multiple users
    const universe = john.augur.contracts.universe;
    const johnYesNoMarket = await john.createReasonableYesNoMarket();
    const johnCategoricalMarket = await john.createReasonableMarket([
      stringTo32ByteHex('A'),
      stringTo32ByteHex('B'),
      stringTo32ByteHex('C'),
    ]);
    const johnScalarMarket = await john.createReasonableScalarMarket();

    await (await db).sync(john.augur, mock.constants.chunkSize, 0);

    const nonexistentAddress = '0x1111111111111111111111111111111111111111';

    const stats = await api.route('getAccountTimeRangedStats', {
      universe: universe.address,
      account: nonexistentAddress,
    });
    console.log("stats1", stats);
    expect(stats).toEqual({});
  }, 200000);
});
