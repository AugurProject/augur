import { TrackedUsers } from "./TrackedUsers";
import { DB, UserSpecificEvent } from "./DB";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import { makeMock } from "../utils/MakeMock";
import { EthersProvider, Web3AsyncSendable } from "ethers-provider";

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

beforeEach(async () => {
    mock.cancelFail();
    await mock.wipeDB()
});

let augur: Augur<any>;
beforeAll(async () => {
    augur = await Augur.create(ethersProvider, contractDependencies);
});


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
