import { Augur, EmptyConnector } from "@augurproject/sdk";
import { makeGSNDependencies, makeSigner } from './blockchain';
import { createDbFromSeed, makeGanacheProvider, Seed } from './ganache';
import { TestEthersProvider } from './TestEthersProvider';
import { Account } from '../constants';
import { buildConfig } from '@augurproject/artifacts';

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
  const dependencies = await makeGSNDependencies(provider, signer, seed.addresses.AugurWalletRegistry, seed.addresses.EthExchange, seed.addresses.WETH9, seed.addresses.Cash, accounts[0].address);
  const config = buildConfig('local', { addresses: seed.addresses })

  return Augur.create(provider, dependencies, config, new EmptyConnector(), null, true);
}
