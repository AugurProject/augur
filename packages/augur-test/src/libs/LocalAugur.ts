import * as path from "path";
import * as ganache from "ganache-core";
import { ethers } from "ethers";

import { Augur } from "@augurproject/sdk";
import { EthersProvider } from "@augurproject/ethersjs-provider";
import { DeployerConfiguration, EthersFastSubmitWallet } from "@augurproject/core";
import { ContractAddresses, Contracts as compilerOutput } from "@augurproject/artifacts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";

const memdown = require("memdown");

export interface Account {
  secretKey: string;
  publicKey: string;
  balance: number;
};

export type AccountList = Array<Account>;

const augurCorePath = path.join(__dirname, "../../../augur-core/");

export function makeDeployerConfiguration(writeArtifacts: boolean = true) {
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
    legacyRepAddress,
  );
}

export interface UsefulContractObjects {
  provider: EthersProvider;
  signer: EthersFastSubmitWallet;
  dependencies: ContractDependenciesEthers;
  addresses: ContractAddresses;
}

export async function deployContracts(accounts: AccountList, ignored: any): Promise<UsefulContractObjects> {
  const seed = require("../../seed.json");

  const ganacheProvider = await makeGanacheProvider(accounts);
  const provider = new EthersProvider(ganacheProvider, 5, 0, 40);
  const signer = await makeSigner(accounts[0], provider);
  const dependencies = makeDependencies(accounts[0], provider, signer);
  const addresses = seed.addresses;
  return {provider, signer, dependencies, addresses};
}

export async function makeGanacheProvider(accounts: AccountList): Promise<ethers.providers.Web3Provider> {
  const seed = require("../../seed.json");

  const db = memdown();
  await new Promise((resolve, reject) => {
    db.batch(seed.data, (err: Error) => {
      if (err) reject(err);
      resolve();
    });
  });

  return new ethers.providers.Web3Provider(ganache.provider({
    accounts,
    // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
    allowUnlimitedContractSize: true,
    db,
    gasLimit: 75000000000,
    debug: false,
    network_id: 123456,
    // vmErrorsOnRPCResponse: true,
  }));
}

export async function makeSigner(account: Account, provider: EthersProvider) {
  return await EthersFastSubmitWallet.create(account.secretKey, provider);
}

export function makeDependencies(account: Account, provider: EthersProvider, signer: EthersFastSubmitWallet) {
  return new ContractDependenciesEthers(provider, signer, account.publicKey);
}

export async function makeTestAugur(accounts: AccountList): Promise<Augur> {
  const {provider, dependencies, addresses} = await deployContracts(accounts, compilerOutput);
  return Augur.create(provider, dependencies, addresses);
}

export const ACCOUNTS: AccountList = [
  {
    secretKey: "0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913",
    publicKey: "0x8fFf40Efec989Fc938bBA8b19584dA08ead986eE",
    balance: 100000000000000000000,  // 100 ETH
  },
  {
    secretKey: "0xfae42052f82bed612a724fec3632f325f377120592c75bb78adfcceae6470c5a",
    publicKey: "0x913dA4198E6bE1D5f5E4a40D0667f70C0B5430Eb",
    balance: 100000000000000000000,  // 100 ETH
  },
];
