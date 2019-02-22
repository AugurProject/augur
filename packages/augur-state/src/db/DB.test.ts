import { TrackedUsers } from "./TrackedUsers";
import { DB, UserSpecificEvent } from "./DB";
import { makeMock } from "../utils/MakeMock";
import { EthersProvider } from "ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";

const TEST_NETWORK_ID = 4;

test("database failure during trackedUsers.getUsers() call", async () => {
    const mock = makeMock();

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

    const provider = new EthersProvider(settings.ethNodeURLs[TEST_NETWORK_ID]);
    const contractDependencies = new ContractDependenciesEthers(provider, undefined, settings.testAccounts[0]);
    const augur = await Augur.create(provider, contractDependencies);

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
    expect(trackedUsers.getUsers()).rejects.toThrow();
}, 60000);
