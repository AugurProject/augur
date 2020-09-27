import { UniverseDetails } from '@augurproject/sdk/build/state/getter/Universe';
import {
  ACCOUNTS,
  defaultSeedPath,
  fork,
  loadSeed,
} from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import {
  getPayoutNumerators,
  makeValidScalarOutcome,
} from '@augurproject/tools/build/flash/fork';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import { NULL_ADDRESS } from '@augurproject/tools/build/libs/Utils';
import { BigNumber } from 'bignumber.js';
import { formatBytes32String } from 'ethers/utils';
import { makeProvider } from '../../../libs';
import { SDKConfiguration } from '@augurproject/utils';
import { MarketInfo } from "@augurproject/sdk-lite";

describe('State API :: Universe :: ', () => {
  let john: TestContractAPI;
  let mary: TestContractAPI;
  let bob: TestContractAPI;

  let baseProvider: TestEthersProvider;
  let config: SDKConfiguration;

  beforeAll(async () => {
    const seed = await loadSeed(defaultSeedPath);
    baseProvider = await makeProvider(seed, ACCOUNTS);
    config = baseProvider.getConfig();

    john = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      baseProvider,
      config
    );
    mary = await TestContractAPI.userWrapper(
      ACCOUNTS[1],
      baseProvider,
      config
    );
    bob = await TestContractAPI.userWrapper(
      ACCOUNTS[2],
      baseProvider,
      config
    );
    await john.approve();
    await mary.approve();
    await bob.approve();
  });

  beforeEach(async () => {
    const provider = await baseProvider.fork();
    john = await TestContractAPI.userWrapper(ACCOUNTS[0], provider, config);
    mary = await TestContractAPI.userWrapper(ACCOUNTS[1], provider, config);
    bob = await TestContractAPI.userWrapper(ACCOUNTS[2], provider, config);
  });

  // TODO Fix the 0x error occurring when multiple fork getter tests run in one file.
  test('getForkMigrationTotals : YesNo', async () => {
    const universe = john.augur.contracts.universe;

    await john.sync();
    let migrationTotals = await john.api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({});

    const market = await john.createReasonableYesNoMarket();
    await john.sync();
    const marketInfo: MarketInfo = (await john.api.route('getMarketsInfo', {
      marketIds: [market.address],
    }))[0];

    await fork(john, market);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(
      repTokenAddress,
      john.augur.config.networkId
    );

    const invalidNumerators = getPayoutNumerators(marketInfo, 0);
    const noNumerators = getPayoutNumerators(marketInfo, 1);

    await john.faucetRep(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(invalidNumerators);
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));

    await john.faucetRep(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(noNumerators);
    await repToken.migrateOutByPayout(noNumerators, new BigNumber(1e21));

    await john.sync();
    migrationTotals = await john.api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toMatchObject({
      marketId: market.address,
      outcomes: [
        {
          outcomeName: 'Invalid',
          outcome: '0',
          amount: '1000000000000000000000',
          payoutNumerators: ['1000', '0', '0'],
        },
        {
          outcomeName: 'No',
          outcome: '1',
          amount: '1000000000000000000000',
          payoutNumerators: ['0', '1000', '0'],
        },
      ],
    });
  });

  test('getForkMigrationTotals : Categorical', async () => {
    const universe = john.augur.contracts.universe;

    await john.sync();
    let migrationTotals = await john.api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({});

    const market = await john.createReasonableMarket(
      ['foo', 'bar', 'happiness', 'smile'].map(formatBytes32String)
    );
    await john.sync();
    const marketInfo = (await john.api.route('getMarketsInfo', {
      marketIds: [market.address],
    }))[0];

    await fork(john, market);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(
      repTokenAddress,
      john.augur.config.networkId
    );

    const invalidNumerators = getPayoutNumerators(marketInfo, 0);
    const fooNumerators = getPayoutNumerators(marketInfo, 1);

    await john.faucetRep(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(invalidNumerators);
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));

    await john.faucetRep(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(fooNumerators);
    await repToken.migrateOutByPayout(fooNumerators, new BigNumber(1e21));

    await john.sync();
    migrationTotals = await john.api.route('getForkMigrationTotals', {
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
          payoutNumerators: ['1000', '0', '0', '0', '0'],
        },
        {
          outcomeName: 'foo',
          outcome: '1',
          amount: '1000000000000000000000',
          payoutNumerators: ['0', '1000', '0', '0', '0'],
        },
      ],
    });
  });

  test('getForkMigrationTotals : Scalar', async () => {
    const universe = john.augur.contracts.universe;

    await john.sync();
    let migrationTotals = await john.api.route('getForkMigrationTotals', {
      universe: universe.address,
    });

    expect(migrationTotals).toEqual({});

    const market = await john.createReasonableScalarMarket();
    await john.sync();
    const marketInfo = (await john.api.route('getMarketsInfo', {
      marketIds: [market.address],
    }))[0];

    const invalidNumerators = getPayoutNumerators(marketInfo, 'invalid');
    const fooOutcome = makeValidScalarOutcome(marketInfo);
    const fooNumerators = getPayoutNumerators(marketInfo, fooOutcome);

    await fork(john, market);

    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(
      repTokenAddress,
      john.augur.config.networkId
    );

    await john.faucetRep(new BigNumber(1e21));

    await john.augur.contracts.universe.createChildUniverse(invalidNumerators);
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1e21));
    await john.faucetRep(new BigNumber(1e21));
    await john.augur.contracts.universe.createChildUniverse(fooNumerators);
    await repToken.migrateOutByPayout(fooNumerators, new BigNumber(1e21));
    await john.sync();
    migrationTotals = await john.api.route('getForkMigrationTotals', {
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
          payoutNumerators: ['20000', '0', '0'],
        },
        {
          outcomeName: '116000000000000000000',
          outcome: '116000000000000000000',
          amount: '1000000000000000000000',
          payoutNumerators: ['0', '13400', '6600'],
        },
      ],
    });
  });

  test('getUniverseChildren : Genesis', async () => {
    const genesisUniverse = john.augur.contracts.universe;

    const legacyRep = new BigNumber(11000000).multipliedBy(10 ** 18);
    let johnRep = await john.augur.contracts.reputationToken.balanceOf_(john.account.address);
    let maryRep = new BigNumber(0);
    const bobRep = new BigNumber(0);
    let totalRep = await john.augur.contracts.reputationToken.totalSupply_();

    await john.faucetRep(new BigNumber(91));
    johnRep = johnRep.plus(91);
    await mary.faucetRep(new BigNumber(19));
    maryRep = maryRep.plus(19);
    totalRep = totalRep.plus(91).plus(19);

    // Verify from John's perspective.

    console.log("Verify from John's perspective.");
    await john.sync();
    let universeChildren: UniverseDetails = await john.api.route(
      'getUniverseChildren',
      {
        universe: genesisUniverse.address,
        account: john.account.address,
      }
    );

    expect(universeChildren).toMatchObject({
      id: genesisUniverse.address,
      parentUniverseId: NULL_ADDRESS,
      outcomeName: 'Genesis',
      usersRep: johnRep.toFixed(),
      totalRepSupply: totalRep.toFixed(),
      totalOpenInterest: '0',
      numberOfMarkets: 1, // includes warp sync market
      children: [],
    });
    expect(universeChildren.creationTimestamp).toBeGreaterThan(0);

    // Verify from Bob's perspective.
    // Tests case where there aren't any TokenBalanceChanged logs.

    console.log("Verify from Bob's perspective.");
    await john.sync();
    universeChildren = await john.api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: bob.account.address,
    });

    expect(universeChildren).toMatchObject({
      id: genesisUniverse.address,
      parentUniverseId: NULL_ADDRESS,
      outcomeName: 'Genesis',
      usersRep: bobRep.toFixed(), // aka zero
      totalRepSupply: totalRep.toFixed(),
      totalOpenInterest: '0',
      numberOfMarkets: 1, // includes warp sync market
      children: [],
    });
    expect(universeChildren.creationTimestamp).toBeGreaterThan(0);

    // Create a market to see how that affects numberOfMarkets.

    console.log('Create a market to see how that affects numberOfMarkets.');
    const repBond = await genesisUniverse.getOrCacheMarketRepBond_();
    const market = await john.createReasonableScalarMarket();
    johnRep = johnRep.minus(repBond);

    await john.sync();

    universeChildren = await john.api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: john.account.address,
    });
    expect(universeChildren).toMatchObject({
      id: genesisUniverse.address,
      parentUniverseId: NULL_ADDRESS,
      outcomeName: 'Genesis',
      usersRep: johnRep.toFixed(),
      totalRepSupply: totalRep.toFixed(),
      totalOpenInterest: '0',
      numberOfMarkets: 2, // includes warp sync market
      children: [],
    });
    expect(universeChildren.creationTimestamp).toBeGreaterThan(0);

    // Fork to see how that affects the children.

    console.log('Fork to see how that affects the children.');
    const marketInfo = (await john.api.route('getMarketsInfo', {
      marketIds: [market.address],
    }))[0];
    await fork(john, market);
    const repTokenAddress = await john.augur.contracts.universe.getReputationToken_();
    const repToken = john.augur.contracts.reputationTokenFromAddress(
      repTokenAddress,
      john.augur.config.networkId
    );
    // The fork script faucets a lot of REP then uses up a difficult-to-predict amount.
    johnRep = await repToken.balanceOf_(john.account.address);
    totalRep = await repToken.totalSupply_();

    const invalidNumerators = getPayoutNumerators(marketInfo, 'invalid');
    const childUniverseRep = johnRep;
    // Call twice because there's a bug when the first migration meets the goal.
    await john.augur.contracts.universe.createChildUniverse(invalidNumerators);
    await repToken.migrateOutByPayout(invalidNumerators, new BigNumber(1));
    await repToken.migrateOutByPayout(
      invalidNumerators,
      childUniverseRep.minus(1)
    );
    johnRep = johnRep.minus(childUniverseRep);
    totalRep = totalRep.minus(childUniverseRep);

    await john.sync();
    universeChildren = await john.api.route('getUniverseChildren', {
      universe: genesisUniverse.address,
      account: john.account.address,
    });

    expect(universeChildren).toMatchObject({
      id: genesisUniverse.address,
      outcomeName: 'Genesis',
      usersRep: '0', // all all migrated out
      totalRepSupply: totalRep.toFixed(),
      totalOpenInterest: '0',
      numberOfMarkets: 2, // includes warp sync market
      parentUniverseId: NULL_ADDRESS,
      children: [
        {
          parentUniverseId: genesisUniverse.address,
          outcomeName: 'Invalid',
          usersRep: childUniverseRep.toFixed(),
          totalRepSupply: childUniverseRep.toFixed(),
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
