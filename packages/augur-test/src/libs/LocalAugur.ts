import { Augur } from "@augurproject/sdk";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Account, makeGanacheProvider, makeSigner, makeDependencies, createDbFromSeed, Seed } from "@augurproject/tools";

export async function makeProvider(seed: Seed, accounts: Account[]): Promise<EthersProvider> {
  const db = await createDbFromSeed(seed);
  return new EthersProvider(await makeGanacheProvider(db, accounts), 5, 0, 40);
}

export async function makeTestAugur(seed: Seed, accounts: Account[]): Promise<Augur> {
  const provider = await makeProvider(seed, accounts);
  const signer = await makeSigner(accounts[0], provider);
  const dependencies = makeDependencies(accounts[0], provider, signer);

  return Augur.create(provider, dependencies, seed.addresses);
}
