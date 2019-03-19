import { EthersProvider } from "@augurproject/ethersjs-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { DeployerConfiguration, ContractDeployer } from "@augurproject/core";
import * as path from "path";
import * as ganache from "ganache-core";
import { CompilerConfiguration} from "@augurproject/core/source/libraries/CompilerConfiguration";
import { ContractCompiler } from "@augurproject/core/source/libraries/ContractCompiler";
import { EthersFastSubmitWallet } from "@augurproject/core/source/libraries/EthersFastSubmitWallet";
import { ethers } from "ethers";
import { CompilerOutput } from "solc";

export type AccountList = [{
      secretKey: string;
      publicKey: string;
      balance: number;
}];

const augurCorePath = path.join(__dirname, "../../augur-core/");

function makeCompilerConfiguration() {
  const contractSourceRoot = path.join(augurCorePath, "source/contracts/");
  const outputRoot = path.join(augurCorePath, "output/contracts/");
  const useFlattener = false;  // TODO make flattener bin specifiable so this can be true
  const enableSdb = false;  // causes solc errors if true
  return new CompilerConfiguration(contractSourceRoot, outputRoot, enableSdb, useFlattener);
}

function makeDeployerConfiguration() {
  const contractInputRoot = path.join(augurCorePath, "output/contracts");
  const artifactOutputRoot  = path.join(augurCorePath, "output/contracts");
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
  compiledContracts: CompilerOutput;
  addresses: any;
}
export async function compileAndDeployToGanache(accounts: AccountList): Promise<UsefulContractObjects> {
  const ganacheProvider = new ethers.providers.Web3Provider(ganache.provider({
    accounts,
    // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
    allowUnlimitedContractSize: true,
    gasLimit: 75000000000,
    debug: false,
    // vmErrorsOnRPCResponse: true,
  }));
  const provider = new EthersProvider(ganacheProvider, 5, 0, 40);
  const signer = await EthersFastSubmitWallet.create(accounts[0].secretKey, provider);
  const dependencies = new ContractDependenciesEthers(provider, signer, accounts[0].publicKey);

  const compilerConfiguration = makeCompilerConfiguration();
  const contractCompiler = new ContractCompiler(compilerConfiguration);
  const compiledContracts = await contractCompiler.compileContracts();

  const deployerConfiguration = makeDeployerConfiguration();
  const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, ganacheProvider, signer, compiledContracts);
  const addresses = await contractDeployer.deploy();

  return {provider, signer, dependencies, compiledContracts, addresses};
}

export async function makeTestAugur(accounts: AccountList): Promise<Augur<any>> {
  const {provider, dependencies, addresses} = await compileAndDeployToGanache(accounts);
  return Augur.create(provider, dependencies, addresses);
}

export const ACCOUNTS: AccountList = [
  {
    secretKey: "0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913",
    publicKey: "0x8fff40efec989fc938bba8b19584da08ead986ee",
    balance: 100000000000000000000,  // 100 ETH
  },
];
