import * as fs from "async-file";
import { ethers } from "ethers";
import * as ganache from "ganache-core";
import { Account, deployContracts } from "../libs/ganache";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import * as path from "path";
import crypto from "crypto";
import { EthersProvider } from "@augurproject/ethersjs-provider/build";

const memdown = require("memdown");
const levelup = require("levelup");


const db = memdown();
function makeGanacheProvider(accounts: Account[]): ethers.providers.Web3Provider {
  return new ethers.providers.Web3Provider(ganache.provider({
    accounts,
    // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
    allowUnlimitedContractSize: true,
    db,
    network_id: 123456,
    gasLimit: 75000000000,
    debug: false,
    // vmErrorsOnRPCResponse: true,
  }));
}

const DEFAULT_SEED_FILE = "./seed.json";

function hashContracts(): string {
  const md5 = crypto.createHash("md5");
  md5.update(JSON.stringify(compilerOutput));
  return md5.digest("hex");
}

export async function seedFileIsOutOfDate(filePath = DEFAULT_SEED_FILE): Promise<boolean> {
  const exists = await fs.exists(filePath);
  if (!exists) {
    return true;
  }

  const contractsHash = hashContracts();
  const seed = require(filePath);
  return contractsHash !== seed.contractsHash;
}

interface LevelDBRow {
  key: string;
  value: string;
  type: "put";
}

export async function createSeedFile(filePath: string = DEFAULT_SEED_FILE, accounts: Account[]): Promise<void> {
  const ganacheProvider = makeGanacheProvider(accounts);
  const provider = new EthersProvider(ganacheProvider, 5, 0, 40);
  const { addresses } = await deployContracts(provider, accounts, compilerOutput);
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

  const resolvedPath = path.resolve(filePath);

  await fs.writeFile(resolvedPath, JSON.stringify({
    addresses,
    contractsHash,
    data: payload,
  }));

  console.log(`Seed file written to: ${resolvedPath}`);
}
