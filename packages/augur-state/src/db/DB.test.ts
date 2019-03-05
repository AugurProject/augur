import { TrackedUsers } from "./TrackedUsers";
import { DB, UserSpecificEvent } from "./DB";
import { EthersWeb3Provider } from "@augurproject/ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import { makeMock } from "../utils/MakeMock";
import { EthersProvider, Web3AsyncSendable } from "ethers-provider";
import { DeployerConfiguration, ContractDeployer } from "@augurproject/core";
import * as path from 'path';

import * as ganache from "ganache-core";
import { CompilerConfiguration} from "@augurproject/core/source/libraries/CompilerConfiguration";
import { ContractCompiler } from "@augurproject/core/source/libraries/ContractCompiler";
import { EthersFastSubmitWallet } from "@augurproject/core/source/libraries/EthersFastSubmitWallet";

const mock = makeMock();
const TEST_NETWORK_ID = 4;
const defaultStartSyncBlockNumber = uploadBlockNumbers[TEST_NETWORK_ID];
const genericEventNames: Array<string> = [
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
const userSpecificEvents: Array<UserSpecificEvent> = [
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
const web3AsyncSendable = new Web3AsyncSendable(settings.ethNodeURLs[4], 5, 0, 40);
const ethersProvider = new EthersProvider(web3AsyncSendable);
const contractDependencies = new ContractDependenciesEthers(ethersProvider, undefined, settings.testAccounts[0]);

const ACCOUNTS = [
    {
        secretKey: "0xa429eeb001c683cf3d8faf4b26d82dbf973fb45b04daad26e1363efd2fd43913",
        publicKey: "0x8fff40efec989fc938bba8b19584da08ead986ee",
        balance: 100000000000000000000,  // 100 ETH
    },
];

beforeEach(async () => {
    mock.cancelFail();
    await mock.wipeDB()
});

let augur: Augur<any>;
beforeAll(async () => {
    // const provider = new EthersProvider(`https://127.0.0.1:${PORT}`);
    // const provider = ganache.provider({ port: PORT });
    // const contractDependencies = new ContractDependenciesEthers(provider, undefined, ACCOUNTS[0].publicKey);
    // augur = await Augur.create(provider, contractDependencies);
});

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
    const legacyRepAddress = "0x1985365e9f78359a9B6AD760e32412f4a445E862";
    return new DeployerConfiguration(contractInputRoot, artifactOutputRoot, augurAddress, createGenesisUniverse, isProduction, useNormalTime, legacyRepAddress);
}

test("xxx-robert", async () => {
    const provider = new EthersWeb3Provider(ganache.provider({
        accounts: ACCOUNTS,
        // TODO: For some reason, our contracts here are too large even though production ones aren't. Flattening maybe?
        allowUnlimitedContractSize: true,
        gasLimit: 75000000000,
        // vmErrorsOnRPCResponse: true,
    }));
    const signer = await EthersFastSubmitWallet.create(ACCOUNTS[0].secretKey, provider);
    const dependencies = new ContractDependenciesEthers(provider, signer, ACCOUNTS[0].publicKey);

    const compilerConfiguration = makeCompilerConfiguration();
    const contractCompiler = new ContractCompiler(compilerConfiguration);
    const compiledContracts = await contractCompiler.compileContracts();

    const deployerConfiguration = makeDeployerConfiguration();
    const contractDeployer = new ContractDeployer(deployerConfiguration, dependencies, provider, signer, compiledContracts);
    await contractDeployer.deploy();

    const a = await Augur.create(provider, dependencies);
    console.log(a);
}, 60000);


test("database failure during trackedUsers.getUsers() call", async () => {
        const db = await DB.createAndInitializeDB(
        TEST_NETWORK_ID,
        settings.blockstreamDelay,
        defaultStartSyncBlockNumber,
        [settings.testAccounts[0]],
        genericEventNames,
        userSpecificEvents,
        mock.makeFactory()
        );

        await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);

        const trackedUsers = new TrackedUsers(TEST_NETWORK_ID, mock.makeFactory());

        expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
            ok: true,
            id: "mock",
            rev: expect.any(String)
        });
        mock.failNext();
        await expect(trackedUsers.getUsers()).rejects.toThrow();
    }, 60000);


    test("database failure during sync, followed by another sync", async () => {
        const db = await DB.createAndInitializeDB(
        TEST_NETWORK_ID,
        settings.blockstreamDelay,
        defaultStartSyncBlockNumber,
        [settings.testAccounts[0]],
        genericEventNames,
        userSpecificEvents,
        mock.makeFactory()
        );

        console.log("Sync with a database failure.");
        mock.failForever();
        await expect(db.sync(augur, settings.chunkSize, settings.blockstreamDelay)).rejects.toThrow();
        mock.cancelFail();

        console.log("Sync successfully.");
        await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);
    },
    120000
);


test("syncing: succeed then fail then succeed again", async () => {
        const db = await DB.createAndInitializeDB(
        TEST_NETWORK_ID,
        settings.blockstreamDelay,
        defaultStartSyncBlockNumber,
        [settings.testAccounts[0]],
        genericEventNames,
        userSpecificEvents,
        mock.makeFactory()
        );

        console.log("Sync successfully.");
        await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);

        console.log("Sync with a database failure.");
        mock.failForever();
        await expect(db.sync(augur, settings.chunkSize, settings.blockstreamDelay)).rejects.toThrow();
        mock.cancelFail();

        console.log("Sync successfully.");
        await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);
    },
    120000
);
