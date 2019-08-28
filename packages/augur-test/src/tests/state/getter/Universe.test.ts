import { API } from '@augurproject/sdk/build/state/getter/API';
import {
  DisputeWindow,
} from '@augurproject/sdk/build/state/getter/Universe';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from '../../../libs';
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk/build/constants';

const mock = makeDbMock();

describe('State API :: Universe :: ', () => {
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

  test('getDisputeWindow', async () => {
    const universe = john.augur.contracts.universe;
    const endTime = (await john.getTimestamp()).plus(SECONDS_IN_A_DAY);
    const lowFeePerCashInAttoCash = new BigNumber(10).pow(18).div(20); // 5% creator fee
    const affiliateFeeDivisor = new BigNumber(0);
    const designatedReporter = john.account.publicKey;

    const actualDB = await db;
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);

    let disputeWindow: DisputeWindow = await api.route('getDisputeWindow', {
      universe: universe.address,
    });

    // Default dispute window until someone creates the current dispute window.
    expect(disputeWindow).toEqual({
      address: '',
      startTime: 0,
      endTime: 0,
      purchased: '0',
      fees: '0',
    });

    // Create market, which also creates dispute windows.
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

    // Move timestamp to open reporting phase
    await john.setTimestamp(endTime.plus(1).plus(SECONDS_IN_A_DAY.times(7)));
    const now = await john.getTimestamp();

    // Create and get dispute window for the time you just set.
    const disputeWindowFromContract = john.augur.contracts.disputeWindowFromAddress(await john.getOrCreateCurrentDisputeWindow());

    // Dispute window exists!
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    disputeWindow = await api.route('getDisputeWindow', {
      universe: universe.address,
    });
    expect(disputeWindow.address).toEqual(disputeWindowFromContract.address);
    expect(Number(disputeWindow.startTime)).toBeLessThanOrEqual(now.toNumber());
    expect(Number(disputeWindow.endTime)).toBeGreaterThan(now.toNumber());
    expect(disputeWindow.purchased).toEqual('0');
    expect(disputeWindow.fees).toEqual('0');

    // Participation tokens!
    const participationTokensBought = new BigNumber(1);
    await john.buyParticipationTokens(disputeWindow.address, participationTokensBought);
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    disputeWindow = await api.route('getDisputeWindow', {
      universe: universe.address,
    });
    expect(disputeWindow.address).toEqual(disputeWindowFromContract.address);
    expect(Number(disputeWindow.startTime)).toBeLessThanOrEqual(now.toNumber());
    expect(Number(disputeWindow.endTime)).toBeGreaterThan(now.toNumber());
    expect(disputeWindow.purchased).toEqual(participationTokensBought.toString());
    expect(disputeWindow.fees).toEqual('0');

    // Generate fees.
    const feesSent = new BigNumber(3004);
    await john.faucet(feesSent);
    await john.augur.contracts.cash.transfer(disputeWindow.address, feesSent);
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    disputeWindow = await api.route('getDisputeWindow', {
      universe: universe.address,
    });
    expect(disputeWindow.address).toEqual(disputeWindowFromContract.address);
    expect(Number(disputeWindow.startTime)).toBeLessThanOrEqual(now.toNumber());
    expect(Number(disputeWindow.endTime)).toBeGreaterThan(now.toNumber());
    expect(disputeWindow.purchased).toEqual(participationTokensBought.toString());
    expect(disputeWindow.fees).toEqual(feesSent.toString());
  }, 120000);
});
