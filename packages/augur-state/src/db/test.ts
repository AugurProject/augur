import { EthersWeb3Provider } from "@augurproject/ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import { DeployerConfiguration, ContractDeployer } from "@augurproject/core";
import * as path from 'path';
import * as ganache from "ganache-core";
import { CompilerConfiguration} from "@augurproject/core/source/libraries/CompilerConfiguration";
import { ContractCompiler } from "@augurproject/core/source/libraries/ContractCompiler";
import { EthersFastSubmitWallet } from "@augurproject/core/source/libraries/EthersFastSubmitWallet";
import { ContractAddresses, NetworkId } from "@augurproject/artifacts";
import { UserSpecificEvent } from "./DB";


// TODO Get these from GenericContractInterfaces (and do not include any that are unneeded)
export const genericEventNames: Array<string> = [
    "DisputeCrowdsourcerCompleted",
    "DisputeCrowdsourcerCreated",
    "DisputeWindowCreated",
    "MarketCreated",
    "MarketFinalized",
    "MarketMigrated",
    "MarketParticipantsDisavowed",
    "ReportingParticipantDisavowed",
    "TimestampSet",
    "UniverseCreated",
    "UniverseForked",
];

// TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
export const userSpecificEvents: Array<UserSpecificEvent> = [
    {
        "name": "CompleteSetsPurchased",
        "numAdditionalTopics": 3,
        "userTopicIndex": 2,
    },
    {
        "name": "CompleteSetsSold",
        "numAdditionalTopics": 3,
        "userTopicIndex": 2,
    },
    {
        "name": "DisputeCrowdsourcerContribution",
        "numAdditionalTopics": 3,
        "userTopicIndex": 1,
    },
    {
        "name": "DisputeCrowdsourcerRedeemed",
        "numAdditionalTopics": 3,
        "userTopicIndex": 1,
    },
    {
        "name": "InitialReporterRedeemed",
        "numAdditionalTopics": 3,
        "userTopicIndex": 1,
    },
    {
        "name": "InitialReportSubmitted",
        "numAdditionalTopics": 3,
        "userTopicIndex": 1,
    },
    {
        "name": "InitialReporterTransferred",
        "numAdditionalTopics": 2,
        "userTopicIndex": 2,
    },
    {
        "name": "MarketMailboxTransferred",
        "numAdditionalTopics": 3,
        "userTopicIndex": 2,
    },
    {
        "name": "MarketTransferred",
        "numAdditionalTopics": 2,
        "userTopicIndex": 1,
    },
    {
        "name": "OrderCanceled",
        "numAdditionalTopics": 3,
        "userTopicIndex": 2,
    },
    {
        "name": "OrderCreated",
        "numAdditionalTopics": 3,
        "userTopicIndex": 0,
    },
    {
        "name": "OrderFilled",
        "numAdditionalTopics": 2,
        "userTopicIndex": 1,
    },
    {
        "name": "TokensTransferred",
        "numAdditionalTopics": 3,
        "userTopicIndex": 2,
    },
    {
        "name": "TradingProceedsClaimed",
        "numAdditionalTopics": 3,
        "userTopicIndex": 2,
    },
];

export type AccountList = [{
      secretKey: string;
      publicKey: string;
      balance: number;
}];

export async function makeTestAugur(accounts: AccountList): Promise<Augur<any>> {
    const provider = new EthersWeb3Provider(ganache.provider({
        accounts,
        // TODO: For some reason, our contracts here are too large even though production ones aren't. Is it from debugging or lack of flattening?
        allowUnlimitedContractSize: true,
        gasLimit: 75000000000,
        // vmErrorsOnRPCResponse: true,
    }));
    const signer = await EthersFastSubmitWallet.create(accounts[0].secretKey, provider);
    const dependencies = new ContractDependenciesEthers(provider, signer, accounts[0].publicKey);

    const compilerConfiguration = makeCompilerConfiguration();
    const contractCompiler = new ContractCompiler(compilerConfiguration);
    const compiledContracts = await contractCompiler.compileContracts();

    const deployerConfiguration = makeDeployerConfiguration();
    const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, provider, signer, compiledContracts);
    const addresses = await contractDeployer.deploy();

    return Augur.create(provider, dependencies, addresses);
}

function makeCompilerConfiguration() {
    const augurCorePath = path.join(__dirname, "../../../augur-core/");
    const contractSourceRoot = path.join(augurCorePath, "source/contracts/");
    const outputRoot = path.join(augurCorePath, "output/contracts/");
    const useFlattener = false;
    const enableSdb = true;
    return new CompilerConfiguration(contractSourceRoot, outputRoot, enableSdb, useFlattener);
}

function makeDeployerConfiguration() {
    const augurCorePath = path.join(__dirname, "../../../augur-core/");
    const contractInputRoot = path.join(augurCorePath, "output/contracts");
    const artifactOutputRoot  = path.join(augurCorePath, "output/contracts");
    const createGenesisUniverse = true;
    const useNormalTime = false;
    const isProduction = false;
    const augurAddress = "0xabc";
    const legacyRepAddress = "0xdef";
    return new DeployerConfiguration(contractInputRoot, artifactOutputRoot, augurAddress, createGenesisUniverse, isProduction, useNormalTime, legacyRepAddress);
}
