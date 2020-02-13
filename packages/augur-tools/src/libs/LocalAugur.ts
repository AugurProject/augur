import { Augur, EmptyConnector } from "@augurproject/sdk";
import { makeGnosisDependencies, makeSigner } from './blockchain';
import { createDbFromSeed, makeGanacheProvider, Seed } from './ganache';
import { TestEthersProvider } from './TestEthersProvider';
import { Account } from '../constants';

export async function makeProviderWithDB(seed: Seed, accounts: Account[]): Promise<[any, TestEthersProvider]> {
  const db = await createDbFromSeed(seed);
  return [
    db,
    new TestEthersProvider(await makeGanacheProvider(db, accounts), db, accounts, seed.addresses)
  ];
}

export async function makeProvider(seed: Seed, accounts: Account[]): Promise<TestEthersProvider> {
  const db = await createDbFromSeed(seed);
  return new TestEthersProvider(await makeGanacheProvider(db, accounts), db, accounts, seed.addresses);
}

export async function makeTestAugur(seed: Seed, accounts: Account[]): Promise<Augur> {
  const provider = await makeProvider(seed, accounts);
  const signer = await makeSigner(accounts[0], provider);
  const dependencies = makeGnosisDependencies(provider, undefined, signer, undefined, undefined, undefined, accounts[0].publicKey);

  return Augur.create(provider, dependencies, seed.addresses, new EmptyConnector(), null, true);
}
