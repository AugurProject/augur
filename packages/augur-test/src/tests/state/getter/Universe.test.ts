import { API } from '@augurproject/sdk/build/state/getter/API';
import { DB } from '@augurproject/sdk/build/state/db/DB';
import { makeDbMock, makeProvider } from '../../../libs';
import { ContractAPI, ACCOUNTS, loadSeedFile, defaultSeedPath } from '@augurproject/tools';
import { BigNumber } from 'bignumber.js';
import { fork } from '@augurproject/tools';
import { formatBytes32String } from 'ethers/utils';
import { UniverseDetails } from '@augurproject/sdk/build/state/getter/Universe';
import { getPayoutNumerators, makeValidScalarOutcome } from '@augurproject/tools/build/flash/fork';
import { NULL_ADDRESS } from '../../../libs/Utils';
import { TestEthersProvider } from '../../../libs/TestEthersProvider';

const mock = makeDbMock();

describe('State API :: Universe :: ', () => {
  let db: Promise<DB>;
  let api: API;
  let john: ContractAPI;
  let mary: ContractAPI;
  let bob: ContractAPI;

  let baseProvider: TestEthersProvider;

  beforeAll(async () => {
    const seed = await loadSeedFile(defaultSeedPath);
    baseProvider = await makeProvider(seed, ACCOUNTS);
    const addresses = baseProvider.getContractAddresses();

    john = await ContractAPI.userWrapper(ACCOUNTS[0], baseProvider, addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], baseProvider, addresses);
    bob = await ContractAPI.userWrapper(ACCOUNTS[2], baseProvider, addresses);
    await john.approveCentralAuthority();
    await mary.approveCentralAuthority();
    await bob.approveCentralAuthority();
  });

  beforeEach(async () => {
    const provider = await baseProvider.fork();
    const addresses = baseProvider.getContractAddresses();
    john = await ContractAPI.userWrapper(ACCOUNTS[0], provider, addresses);
    mary = await ContractAPI.userWrapper(ACCOUNTS[1], provider, addresses);
    bob = await ContractAPI.userWrapper(ACCOUNTS[2], provider, addresses);
    db = makeDbMock().makeDB(john.augur, ACCOUNTS);
    api = new API(john.augur, db);
  });

  // TODO Fix the 0x error occurring when multiple fork getter tests run in one file.
  test('getForkMigrationTotals : YesNo', async () => {
    const universe = john.augur.contracts.universe;

    const actualDB = await db;

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    let migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({});

    const market = await john.createReasonableYesNoMarket();
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    const marketInfo = (await api.route('getMarketsInfo',
      { marketIds: [market.address] }))[0];

    await fork(john, marketInfo);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(
      repTokenAddress, john.augur.networkId);

    const invalidNumerators = getPayoutNumerators(marketInfo, 0);
    const noNumerators = getPayoutNumerators(marketInfo, 1);

    await john.repFaucet(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(invalidNumerators);
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));

    await john.repFaucet(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(noNumerators);
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
          amount: '1000000000000000000000',
          payoutNumerators: [
            '100',
            '0',
            '0',
          ],
        },
        {
          outcomeName: 'No',
          outcome: '1',
          amount: '1000000000000000000000',
          payoutNumerators: [
            '0',
            '100',
            '0',
          ],
        },
      ],
    });

  });

  test('getForkMigrationTotals : Categorical', async () => {
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
    const marketInfo = (await api.route('getMarketsInfo',
      { marketIds: [market.address] }))[0];

    await fork(john, marketInfo);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(
      repTokenAddress, john.augur.networkId);

    const invalidNumerators = getPayoutNumerators(marketInfo, 0);
    const fooNumerators = getPayoutNumerators(marketInfo, 1);

    await john.repFaucet(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(invalidNumerators);
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));

    await john.repFaucet(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(fooNumerators);
    await repToken.migrateOutByPayout(fooNumerators, new BigNumber(1e21));

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({
      marketId: market.address,
      outcomes: [
        {
          outcomeName: 'Invalid',
          outcome: '0',
          isInvalid: true,
          amount: '1000000000000000000000',
          payoutNumerators: [
            '100',
            '0',
            '0',
            '0',
            '0',
          ],
        },
        {
          outcomeName: 'foo'.padEnd(32, '\0'),
          outcome: '1',
          amount: '1000000000000000000000',
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

  });

  test('getForkMigrationTotals : Scalar', async () => {
    const universe = john.augur.contracts.universe;

    const actualDB = await db;

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    let migrationTotals = await api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({});

    const market = await john.createReasonableScalarMarket();
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    const marketInfo = (await api.route('getMarketsInfo',
      { marketIds: [market.address] }))[0];

    const invalidNumerators = getPayoutNumerators(marketInfo, 'invalid');
    const fooOutcome = makeValidScalarOutcome(marketInfo);
    const fooNumerators = getPayoutNumerators(marketInfo, fooOutcome);

    await fork(john, marketInfo);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(
      repTokenAddress, john.augur.networkId);

    await john.repFaucet(new BigNumber(1e21));

    await john.augur.contracts.universe.createChildUniverse(invalidNumerators);
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));
    await john.repFaucet(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(fooNumerators);
    await repToken.migrateOutByPayout(fooNumerators, new BigNumber(1e21));
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
          amount: '1000000000000000000000',
          isInvalid: true,
          payoutNumerators: [
            '20000',
            '0',
            '0',
          ],
        },
        {
          outcomeName: '116000000000000000000',
          outcome: '116000000000000000000',
          amount: '1000000000000000000000',
          payoutNumerators: [
            '0',
            '13400',
            '6600',
          ],
        },
      ],
    });
  });

  test('getUniverseChildren : Genesis', async () => {
    const genesisUniverse = john.augur.contracts.universe;
    const actualDB = await db;

    const legacyRep = new BigNumber(11000000).multipliedBy(10**18);
    let johnRep = legacyRep; // we faucet 11 million attoREP for john during deployment
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
      id: genesisUniverse.address,
      parentUniverseId: NULL_ADDRESS,
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
      id: genesisUniverse.address,
      parentUniverseId: NULL_ADDRESS,
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
    totalRep = totalRep.plus(repBond).plus(10**18); // not added to john because he put it in the market
    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    universeChildren = await api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: john.account.publicKey,
    });
    expect(universeChildren).toMatchObject({
      id: genesisUniverse.address,
      parentUniverseId: NULL_ADDRESS,
      outcomeName: 'Genesis',
      usersRep: "1.1000000999999957094809856e+25",
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
    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(repTokenAddress, john.augur.networkId);
    // The fork script faucets a lot of REP then uses up a difficult-to-predict amount.
    johnRep = await repToken.balanceOf_(john.account.publicKey);
    totalRep = await repToken.totalSupply_();

    const invalidNumerators = getPayoutNumerators(marketInfo, 'invalid');
    const childUniverseRep = johnRep;
    // Call twice because there's a bug when the first migration meets the goal.
    await john.augur.contracts.universe.createChildUniverse(invalidNumerators);
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1));
    await repToken.migrateOutByPayout(invalidNumerators, childUniverseRep.minus(1));
    johnRep = johnRep.minus(childUniverseRep);
    totalRep = totalRep.minus(childUniverseRep);

    await actualDB.sync(john.augur, mock.constants.chunkSize, 0);
    universeChildren = await api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: john.account.publicKey,
    });

    expect(universeChildren).toMatchObject({
      id: genesisUniverse.address,
      outcomeName: 'Genesis',
      usersRep: '0', // all all migrated out
      totalRepSupply: totalRep.toString(),
      totalOpenInterest: '0',
      numberOfMarkets: 1,
      parentUniverseId: NULL_ADDRESS,
      children: [
        {
          parentUniverseId: genesisUniverse.address,
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
    expect(universeChildren.children[0].id).not.toEqual(NULL_ADDRESS);
  });

});
