import * as ganache from "ganache-core";
import { ethers } from "ethers";
import memdown from "memdown";
import { MemDown } from "memdown";

import { Account } from "../constants";

export async function makeGanacheProvider(seedFilePath: string, accounts: Account[]): Promise<ethers.providers.Web3Provider> {
  const db = await setupGanacheDb(seedFilePath);
  return new ethers.providers.Web3Provider(ganache.provider(makeGanacheOpts(accounts, db)));
}

export async function makeGanacheServer(seedFilePath: string, accounts: Account[]): Promise<ganache.GanacheServer> {
  const db = await setupGanacheDb(seedFilePath);
  return ganache.server(makeGanacheOpts(accounts, db));
}

async function setupGanacheDb(seedFilePath: string): Promise<MemDown> {
  const seed = require(seedFilePath);

  const db = memdown("");

  await new Promise((resolve, reject) => {
    db.batch(seed.data, (err: Error) => {
      if (err) reject(err);
      resolve();
    });
  });

  return db;
}

function makeGanacheOpts(accounts: Account[], db: MemDown) {
  return {
    accounts,
    // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
    allowUnlimitedContractSize: true,
    db,
    gasLimit: 75000000000,
    debug: false,
    network_id: 123456,
    // vmErrorsOnRPCResponse: true,
  };
}

export function loadSeed(seedFilePath: string) {
  return require(seedFilePath);
}
