import { ACCOUNTS, defaultSeedPath, loadSeed } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import {
  createDbFromSeed,
  makeGanacheProvider,
} from '@augurproject/tools/build';
import { TestEthersProvider } from '@augurproject/tools/build/libs/TestEthersProvider';
import uuid = require('uuid');

describe('Syncing', () => {
  test('should blow away existing state on new deploy', async () => {
    const seed = await loadSeed(defaultSeedPath, 'doubleDeploy');
    const dbPrefix = uuid.v4();

    const metadata = seed.metadata;

    // We need to share a db here.
    const db = await createDbFromSeed(seed);
    const oldDeployProvider = new TestEthersProvider(
      await makeGanacheProvider(db, ACCOUNTS),
      db,
      ACCOUNTS,
      seed.addresses
    );

    const newDeployProvider = new TestEthersProvider(
      await makeGanacheProvider(db, ACCOUNTS),
      db,
      ACCOUNTS,
      metadata.addresses
    );

    const oldJohn = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      oldDeployProvider,
      oldDeployProvider.getConfig(),
      undefined,
      dbPrefix
    );

    await oldJohn.sync(metadata.blockNumberBeforeDeploy);

    await expect(oldJohn.db.UniverseCreated.toArray()).resolves.toHaveLength(1);
    await expect(oldJohn.db.MarketCreated.toArray()).resolves.toHaveLength(6); // includes warp sync market

    const newJohn = await TestContractAPI.userWrapper(
      ACCOUNTS[0],
      newDeployProvider,
      newDeployProvider.getConfig(),
      undefined,
      dbPrefix
    );

    await newJohn.sync();

    console.log(
      'oldJohn.augur.contracts.universe.address',
      JSON.stringify(oldJohn.augur.contracts.universe.address)
    );

    console.log(
      'newJohn.augur.contracts.universe.address',
      JSON.stringify(newJohn.augur.contracts.universe.address)
    );

    console.log(
      'newJohn.db.UniverseCreated.toArray()',
      JSON.stringify(await newJohn.db.UniverseCreated.toArray())
    );

    await expect(newJohn.db.UniverseCreated.toArray()).resolves.toHaveLength(1);
    await expect(newJohn.db.MarketCreated.toArray()).resolves.toHaveLength(1); // includes warp sync market
  });
});
