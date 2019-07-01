import * as path from "path";
import * as ganache from "ganache-core";
import { ethers } from "ethers";

import { EthersProvider } from "@augurproject/ethersjs-provider";
import { DeployerConfiguration, EthersFastSubmitWallet } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";

import memdown from "memdown";
import { MemDown } from "memdown";

export interface Account {
  secretKey: string;
  publicKey: string;
  balance: number;
}

const augurCorePath = path.join(__dirname, "../../../augur-core/");

export function makeDeployerConfiguration(writeArtifacts = true) {
  const contractInputRoot = path.join(augurCorePath, "../augur-artifacts/src");
  const artifactOutputRoot = writeArtifacts ? path.join(augurCorePath, "../augur-artifacts/src") : null;
  const createGenesisUniverse = true;
  const useNormalTime = false;
  const isProduction = false;
  const augurAddress = "0xabc";
  const legacyRepAddress = "0xdef";
  return new DeployerConfiguration(
    contractInputRoot,
    artifactOutputRoot,
    augurAddress,
    createGenesisUniverse,
    isProduction,
    useNormalTime,
    legacyRepAddress
  );
}

export interface UsefulContractObjects {
  provider: EthersProvider;
  signer: EthersFastSubmitWallet;
  dependencies: ContractDependenciesEthers;
  addresses: ContractAddresses;
}

export async function deployContracts(provider: EthersProvider, seedFilePath: string, accounts: Account[]): Promise<UsefulContractObjects> {
  const seed = require(seedFilePath);

  const signer = await makeSigner(accounts[0], provider);
  const dependencies = makeDependencies(accounts[0], provider, signer);
  const addresses = seed.addresses;
  return {provider, signer, dependencies, addresses};
}

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

export async function makeSigner(account: Account, provider: EthersProvider) {
  return EthersFastSubmitWallet.create(account.secretKey, provider);
}

export function makeDependencies(account: Account, provider: EthersProvider, signer: EthersFastSubmitWallet) {
  return new ContractDependenciesEthers(provider, signer, account.publicKey);
}
