import { ACCOUNTS, defaultSeedPath, loadSeed } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { makeProvider } from '../../libs';
import { ethers } from 'ethers';

let john: TestContractAPI;
let mary: TestContractAPI;

beforeAll(async () => {
  const seed = await loadSeed(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);
  const config = provider.getConfig();

  john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    config
  );
  mary = await TestContractAPI.userWrapper(
    ACCOUNTS[1],
    provider,
    config
  );
  await john.approve();
  await mary.approve();
});

test('market :: createYesNoMarket', async () => {
  const market = await john.createReasonableYesNoMarket();
  await expect(market).toBeDefined();
});

test('market :: createCategoricalMarket', async () => {
  const market = await john.createReasonableMarket([
    ethers.utils.formatBytes32String('yay'),
    ethers.utils.formatBytes32String('nay'),
    ethers.utils.formatBytes32String('bay'),
  ]);
  await expect(market).toBeDefined();
});

test('market :: createScalarMarket', async () => {
  const market = await john.createReasonableScalarMarket();
  await expect(market).toBeDefined();
});
