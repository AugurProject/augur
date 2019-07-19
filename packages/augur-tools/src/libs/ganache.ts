import * as ganache from "ganache-core";
import { ethers } from "ethers";
import memdown from "memdown";
import { MemDown } from "memdown";
import { Contracts as compilerOutput, ContractAddresses } from "@augurproject/artifacts";
import { Account } from "../constants";
import crypto from "crypto";
import { EthersProvider } from "@augurproject/ethersjs-provider";
const levelup = require("levelup");
import * as path from "path";
import * as fs from "async-file";

export interface Seed {
  addresses: ContractAddresses;
  contractsHash: string;
  data: LevelDBRow[];
}

export async function makeGanacheProvider(db: MemDown, accounts: Account[]): Promise<ethers.providers.Web3Provider> {
  return new ethers.providers.Web3Provider(ganache.provider(makeGanacheOpts(accounts, db)));
}

export async function makeGanacheServer(db: MemDown, accounts: Account[]): Promise<ganache.GanacheServer> {
  return ganache.server(makeGanacheOpts(accounts, db));
}

export function createDb(): MemDown {
  return memdown("");
}

export async function createDbFromSeed(seed: Seed): Promise<MemDown> {
  const db = createDb();

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
    // vmErrorsOnRPCResponse: false,
  };
}

function hashContracts(): string {
  const md5 = crypto.createHash("md5");
  md5.update(JSON.stringify(compilerOutput));
  return md5.digest("hex");
}

interface LevelDBRow {
  key: string;
  value: string;
  type: "put";
}

export async function createSeed(provider: EthersProvider, db: MemDown, addresses: ContractAddresses): Promise<Seed> {
  const contractsHash = hashContracts();

  const leveledDB = levelup(db);

  const payload: LevelDBRow[] = [];

  await new Promise((resolve, reject) => {
    leveledDB.createReadStream({
      keyAsBuffer: false,
      valueAsBuffer: false,
    }).on("data", (data: LevelDBRow) => {
      payload.push({
        type: "put",
        ...data,
      });
    }).on("error", (err: Error) => {
      console.log("Oh my!", err);
      reject(err);
    }).on("close", () => {
      console.log("Stream closed");
    }).on("end", () => {
      console.log("Stream ended");
      resolve();
    });
  });

  return {
    addresses,
    contractsHash,
    data: payload,
  };
}

export async function writeSeedFile(seed: Seed, filePath: string): Promise<void> {
  await fs.writeFile(path.resolve(filePath), JSON.stringify(seed));
}

export async function loadSeedFile(seedFilePath: string): Promise<Seed> {
  return JSON.parse(await fs.readFile(seedFilePath));
}
