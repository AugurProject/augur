import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { ContractDeployer, DeployerConfiguration } from "@augurproject/core";
import * as path from "path";
import * as ganache from "ganache-core";
import { EthersFastSubmitWallet } from "@augurproject/core/source/libraries/EthersFastSubmitWallet";
import { ethers } from "ethers";
import { CompilerOutput } from "solc";
import { ContractAddresses, Contracts as compilerOutput } from "@augurproject/artifacts";

const memdown = require("memdown");

export type Account = {
  secretKey: string;
  publicKey: string;
  balance: number;
};

export type AccountList = Array<Account>;

const augurCorePath = path.join(__dirname, "../../augur-core/");

function makeDeployerConfiguration() {
  const contractInputRoot = path.join(augurCorePath, "../augur-artifacts/src");
  const artifactOutputRoot  = path.join(augurCorePath, "../augur-artifacts/src");
  const createGenesisUniverse = true;
  const useNormalTime = false;
  const isProduction = false;
  const augurAddress = "0xabc";
  const legacyRepAddress = "0xdef";
  return new DeployerConfiguration(contractInputRoot, artifactOutputRoot, augurAddress, createGenesisUniverse, isProduction, useNormalTime, legacyRepAddress);
}

interface UsefulContractObjects {
  provider: EthersProvider;
  signer: EthersFastSubmitWallet;
  dependencies: ContractDependenciesEthers;
  addresses: ContractAddresses;
}

export async function deployContracts(accounts: AccountList, compiledContracts: CompilerOutput): Promise<UsefulContractObjects> {
  const ganacheProvider = new ethers.providers.Web3Provider(ganache.provider({
    accounts,
    // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
    allowUnlimitedContractSize: true,
    db: memdown(),
    gasLimit: 75000000000,
    debug: false,
    // vmErrorsOnRPCResponse: true,
  }));
  const provider = new EthersProvider(ganacheProvider, 5, 0, 40);
  const signer = await EthersFastSubmitWallet.create(accounts[0].secretKey, provider);
  const dependencies = new ContractDependenciesEthers(provider, signer, accounts[0].publicKey);

  const deployerConfiguration = makeDeployerConfiguration();
  const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, ganacheProvider, signer, compiledContracts);
  const addresses = await contractDeployer.deploy();

  return {provider, signer, dependencies, addresses};
}

export async function makeTestAugur(accounts: AccountList): Promise<Augur<ethers.utils.BigNumber>> {
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
