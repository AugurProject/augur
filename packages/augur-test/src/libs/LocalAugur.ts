import { Augur } from "@augurproject/sdk";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { Account, deployContracts, makeGanacheProvider } from "@augurproject/tools";

import * as path from "path";

export const seedPath = path.join(__dirname, "../../../augur-tools/src/flash/seed.json");

export async function makeProvider(accounts: Account[]): Promise<EthersProvider> {
  return new EthersProvider(await makeGanacheProvider(seedPath, accounts), 5, 0, 40);
}

export async function makeTestAugur(accounts: Account[]): Promise<Augur> {
  const provider = await makeProvider(accounts);

  const { dependencies, addresses } = await deployContracts(provider, seedPath, accounts);
  return Augur.create(provider, dependencies, addresses);
}
