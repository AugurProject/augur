import { ACCOUNTS, defaultSeedPath, loadSeedFile } from '@augurproject/tools';
import { TestContractAPI } from '@augurproject/tools';
import { formatBytes32String } from 'ethers/utils';
import { makeProvider } from '../../libs';

let john: TestContractAPI;
let mary: TestContractAPI;

beforeAll(async () => {
  const seed = await loadSeedFile(defaultSeedPath);
  const provider = await makeProvider(seed, ACCOUNTS);

  john = await TestContractAPI.userWrapper(
    ACCOUNTS[0],
    provider,
    seed.addresses
  );
  mary = await TestContractAPI.userWrapper(
    ACCOUNTS[1],
    provider,
    seed.addresses
  );
  await john.approveCentralAuthority();
  await mary.approveCentralAuthority();
});

test('market :: createYesNoMarket', async () => {
  const market = await john.createReasonableYesNoMarket();
  await expect(market).toBeDefined();
});

test('market :: createCategoricalMarket', async () => {
  const market = await john.createReasonableMarket([
    formatBytes32String('yay'),
    formatBytes32String('nay'),
    formatBytes32String('bay'),
  ]);
  await expect(market).toBeDefined();
});

test('market :: createScalarMarket', async () => {
  const market = await john.createReasonableScalarMarket();
  await expect(market).toBeDefined();
});
