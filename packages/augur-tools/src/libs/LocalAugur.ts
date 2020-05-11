import { buildConfig } from '@augurproject/artifacts';
import { Augur, createClient, EmptyConnector } from '@augurproject/sdk';
import { Account } from '../constants';
import { makeSigner } from './blockchain';
import { createDbFromSeed, makeGanacheProvider, Seed } from './ganache';
import { TestEthersProvider } from './TestEthersProvider';

export async function makeProviderWithDB(
  seed: Seed,
  accounts: Account[]
): Promise<[any, TestEthersProvider]> {
  const db = await createDbFromSeed(seed);
  return [
    db,
    new TestEthersProvider(
      await makeGanacheProvider(db, accounts),
      db,
      accounts,
      seed.addresses
    ),
  ];
}

export async function makeProvider(
  seed: Seed,
  accounts: Account[]
): Promise<TestEthersProvider> {
  const db = await createDbFromSeed(seed);
  return new TestEthersProvider(
    await makeGanacheProvider(db, accounts),
    db,
    accounts,
    seed.addresses
  );
}

export async function makeTestAugur(
  seed: Seed,
  accounts: Account[]
): Promise<Augur> {
  const provider = await makeProvider(seed, accounts);
  const signer = await makeSigner(accounts[0], provider);

  const config = buildConfig('local', { addresses: seed.addresses });

  return createClient(config, new EmptyConnector(), signer, provider, true);
}
