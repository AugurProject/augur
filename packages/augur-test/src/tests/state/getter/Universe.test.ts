import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from '../../../libs';
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { SECONDS_IN_A_DAY } from '@augurproject/sdk/build/constants';
import { fork } from '@augurproject/tools';
import { formatBytes32String } from 'ethers/utils';
import { DisputeWindow, UniverseDetails } from '@augurproject/sdk/build/state/getter/Universe';
import { getPayoutNumerators, makeValidScalarOutcome } from '@augurproject/tools/build/flash/fork';
import { NULL_ADDRESS } from '../../../libs/Utils';

const mock = makeDbMock();

describe('State API :: Universe :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
  let bob: ContractAPI;

  // Normally these calls are in beforeAll but these tests affect the same state,
  // on-chain and in-middleware, so both need to be rebuilt between each test.
  beforeEach(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    const provider = await makeProvider(seed, ACCOUNTS);

    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, seed.addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, seed.addresses);
    bob = await ContractAPI.userWrapper(ACCOUNTS[2], provider, seed.addresses);

    db = mock.makeDB(john.augur, ACCOUNTS);

    api = new API(john.augur, db);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
    await bob.approveCentralAuthority();
  }, 120000);

  test.skip('getDisputeWindow', async () => {
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

  // TODO Fix the 0x error occurring when multiuple fork getter tests run in one file.
  test.skip('getForkMigrationTotals : YesNo', async () => {
    const universe = john.augur.contracts.universe;

    const actualDB = await db;

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    let migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({});

    const market = await john.createReasonableYesNoMarket();
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    const marketInfo = (await api.route('getMarketsInfo', {marketIds: [market.address]}))[0];

    await fork(john, marketInfo);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(repTokenAddress, john.augur.networkId);

    const invalidNumerators = getPayoutNumerators(marketInfo, 0);
    const noNumerators = getPayoutNumerators(marketInfo, 1);

    await john.repFaucet(new BigNumber(1e21));
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));

    await john.repFaucet(new BigNumber(1e21));
    await repToken.migrateOutByPayout(noNumerators, new BigNumber(1e21));

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toMatchObject({
      marketId: market.address,
      outcomes: [
        {
          outcomeName: 'Invalid',
          outcome: '0',
          amount: '60000000349680582682291668',
          isMalformed: false,
          payoutNumerators: [
            '100',
            '0',
            '0',
          ],
        },
        {
          outcomeName: 'No',
          outcome: '1',
          amount: '60000000349680582682291668',
          isMalformed: false,
          payoutNumerators: [
            '0',
            '100',
            '0',
          ],
        },
      ],
    });

  }, 200000);

  test.skip('getForkMigrationTotals : Categorical', async () => {
    const universe = john.augur.contracts.universe;

    const actualDB = await db;

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    let migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({});

    const market = await john.createReasonableMarket(
      ['foo', 'bar', 'happiness', 'smile'].map(formatBytes32String)
    );
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    const marketInfo = (await api.route('getMarketsInfo', {marketIds: [market.address]}))[0];

    await fork(john, marketInfo);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(repTokenAddress, john.augur.networkId);

    const invalidNumerators = getPayoutNumerators(marketInfo, 0);
    const fooNumerators = getPayoutNumerators(marketInfo, 1);

    await john.repFaucet(new BigNumber(1e21));
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));

    await john.repFaucet(new BigNumber(1e21));
    await repToken.migrateOutByPayout(fooNumerators, new BigNumber(1e21));

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({
      marketId: market.address,
      outcomes: [
        {
          outcomeName: 'foo'.padEnd(32, '\0'),
          outcome: '0',
          amount: '60000000349680582682291668',
          isMalformed: false,
          payoutNumerators: [
            '100',
            '0',
            '0',
            '0',
            '0',
          ],
        },
        {
          outcomeName: 'bar'.padEnd(32, '\0'),
          outcome: '1',
          amount: '60000000349680582682291668',
          isMalformed: false,
          payoutNumerators: [
            '0',
            '100',
            '0',
            '0',
            '0',
          ],
        },
      ],
    });

  }, 200000);

  test.skip('getForkMigrationTotals : Scalar', async () => {
    const universe = john.augur.contracts.universe;

    const actualDB = await db;

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    let migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({});

    const market = await john.createReasonableScalarMarket();
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    const marketInfo = (await api.route('getMarketsInfo', {marketIds: [market.address]}))[0];

    const invalidNumerators = getPayoutNumerators(marketInfo, 'invalid');
    const fooOutcome = makeValidScalarOutcome(marketInfo);
    const fooNumerators = getPayoutNumerators(marketInfo, fooOutcome);

    await fork(john, marketInfo);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(repTokenAddress, john.augur.networkId);

    await john.repFaucet(new BigNumber(1e21));

    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));
    await john.repFaucet(new BigNumber(1e21));
    await repToken.migrateOutByPayout(fooNumerators, new BigNumber(1e21));
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toMatchObject({
      marketId: market.address,
      outcomes: [
        {
          outcomeName: '250000000000000000000',
          outcome:     '50000000000000000000',
          amount: '60000000349680582682291668',
          isMalformed: false,
          isInvalid: true,
          payoutNumerators: [
            '20000',
            '0',
            '0',
          ],
        },
        {
          outcomeName: '250000000000000000000',
          outcome:     '184000000000000000000',
          amount: '60000000349680582682291668',
          isMalformed: false,
          isInvalid: false,
          payoutNumerators: [
            '0',
            '13400',
            '6600',
          ],
        },
      ],
    });
  }, 200000);

  test('getUniverseChildren : Genesis', async () => {
    const genesisUniverse = john.augur.contracts.universe;
    const actualDB = await db;

    let johnRep = new BigNumber(1); // we faucet 1 attoREP for john during deployment
    let maryRep = new BigNumber(0);
    const bobRep = new BigNumber(0);
    let totalRep = johnRep.plus(maryRep).plus(bobRep);

    await john.repFaucet(new BigNumber(91));
    johnRep = johnRep.plus(91);
    await mary.repFaucet(new BigNumber(19));
    maryRep = maryRep.plus(19);
    totalRep = totalRep.plus(91).plus(19);

    // Verify from John's perspective.

    console.log("Verify from John's perspective.");
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    let universeChildren: UniverseDetails = await api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: john.account.publicKey,
    });

    expect(universeChildren).toMatchObject({
      address: genesisUniverse.address,
      outcomeName: 'Genesis',
      usersRep: johnRep.toString(),
      totalRepSupply: totalRep.toString(),
      totalOpenInterest: '0',
      numberOfMarkets: 0,
      children: [],
    });
    expect(universeChildren.creationTimestamp).toBeGreaterThan(0);

    // Verify from Bob's perspective.
    // Tests case where there aren't any TokenBalanceChanged logs.

    console.log("Verify from Bob's perspective.");
    await actualDB.sync(bob.augur, mock.constants.chunkSize, 0);
    universeChildren = await api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: bob.account.publicKey,
    });

    expect(universeChildren).toMatchObject({
      address: genesisUniverse.address,
      outcomeName: 'Genesis',
      usersRep: bobRep.toString(), // aka zero
      totalRepSupply: totalRep.toString(),
      totalOpenInterest: '0',
      numberOfMarkets: 0,
      children: [],
    });
    expect(universeChildren.creationTimestamp).toBeGreaterThan(0);

    // Create a market to see how that affects numberOfMarkets.

    console.log('Create a market to see how that affects numberOfMarkets.');
    const repBond = await genesisUniverse.getOrCacheMarketRepBond_();
    const market = await john.createReasonableScalarMarket();
    totalRep = totalRep.plus(repBond); // not added to john because he put it in the market
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    universeChildren = await api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: john.account.publicKey,
    });
    expect(universeChildren).toMatchObject({
      address: genesisUniverse.address,
      outcomeName: 'Genesis',
      usersRep: johnRep.toString(),
      totalRepSupply: totalRep.toString(),
      totalOpenInterest: '0',
      numberOfMarkets: 1,
      children: [],
    });
    expect(universeChildren.creationTimestamp).toBeGreaterThan(0);

    // Fork to see how that affects the children.

    console.log('Fork to see how that affects the children.');
    const marketInfo = (await api.route('getMarketsInfo', {marketIds: [market.address]}))[0];
    await fork(john, marketInfo);
    const SOME_REP = new BigNumber(1e18).times(6e7); // from fork()
    johnRep = johnRep.plus(SOME_REP);
    totalRep = totalRep.plus(SOME_REP);

    const invalidNumerators = getPayoutNumerators(marketInfo, 'invalid');
    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(repTokenAddress, john.augur.networkId);
    // Create child universe
    const childUniverseRep = new BigNumber(1e21);
    await repToken.migrateOutByPayout(invalidNumerators, childUniverseRep);
    johnRep = johnRep.minus(childUniverseRep);
    totalRep = totalRep.minus(childUniverseRep);

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    universeChildren = await api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: john.account.publicKey,
    });

    expect(universeChildren).toMatchObject({
      address: genesisUniverse.address,
      outcomeName: 'Genesis',
      totalRepSupply: totalRep.toString(),
      totalOpenInterest: '0',
      numberOfMarkets: 1,
      children: [
        {
          outcomeName: 'Invalid',
          usersRep: childUniverseRep.toString(),
          totalRepSupply: childUniverseRep.toString(),
          totalOpenInterest: '0',
          numberOfMarkets: 0,
          children: [],
        },
      ],
    });
    expect(universeChildren.creationTimestamp).toBeGreaterThan(0);
    expect(universeChildren.children[0].creationTimestamp).toBeGreaterThan(0);
    expect(universeChildren.children[0].address).not.toEqual(NULL_ADDRESS);
    // John's REP is hard to calculate because contributing during a fork has caps
    // that we're exceeding, so it rounds down to the cap.
    expect(Number(universeChildren.usersRep)).toBeGreaterThan(0);
    expect(Number(universeChildren.usersRep)).toBeLessThan(totalRep.toNumber());
  });

});
