import * as fs from "async-file";
import { ethers } from "ethers";
import * as ganache from "ganache-core";
import {
  AccountList, ACCOUNTS,
  makeDependencies,
  makeDeployerConfiguration,
  makeSigner,
  UsefulContractObjects,
} from "../libs";
import { CompilerOutput } from "solc";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import {ContractDeployer} from "@augurproject/core";
import { Contracts as compilerOutput } from "@augurproject/artifacts";
import * as path from "path";
import crypto from "crypto";

const memdown = require("memdown");
const levelup = require("levelup");

export async function deployContracts(ganacheProvider: ethers.providers.Web3Provider,  accounts: AccountList, compiledContracts: CompilerOutput): Promise<UsefulContractObjects> {
  const provider = new EthersProvider(ganacheProvider, 5, 0, 40);
  const signer = await makeSigner(accounts[0], provider);
  const dependencies = makeDependencies(accounts[0], provider, signer);

  const deployerConfiguration = makeDeployerConfiguration(false);
  const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, ganacheProvider, signer, compiledContracts);
  const addresses = await contractDeployer.deploy();

  return {provider, signer, dependencies, addresses};
}

const db = memdown();
function makeGanacheProvider(accounts: AccountList): ethers.providers.Web3Provider {
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

export async function seedFileIsOutOfDate(filePath: string = DEFAULT_SEED_FILE): Promise<boolean> {
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

export async function createSeedFile(filePath: string = DEFAULT_SEED_FILE): Promise<void> {
  const ganacheProvider = makeGanacheProvider(ACCOUNTS);
  const { addresses } = await deployContracts(ganacheProvider, ACCOUNTS, compilerOutput);
  const contractsHash = hashContracts();

  const leveledDB = levelup(db);

  const payload: Array<LevelDBRow> = [];
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
