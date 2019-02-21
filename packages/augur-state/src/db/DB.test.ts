import { TrackedUsers } from "./TrackedUsers";
import PouchDB from "pouchdb";
import { PouchDBFactoryType } from "./AbstractDB";
import { DB, UserSpecificEvent } from "./DB";
import { EthersProvider } from "ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";


export function makeMock() {
    const mockState = {
        failCountdown: -1  // default state never fails
    };

    class MockPouchDB extends PouchDB {
        allDocs<Model>(options?: any): Promise<any> {
            mockState.failCountdown--;
            if (mockState.failCountdown === 0) {
                throw Error("This was an intentional, mocked failure of allDocs");
            }
            if (options) {
                return super.allDocs(options);
            } else {
                return super.allDocs();
            }
        }

        get<Model>(docId: any, options?: any): Promise<any> {
            mockState.failCountdown--;
            if (mockState.failCountdown === 0) {
                throw Error("This was an intentional, mocked failure of get");
            }
            if (options) {
                return super.get(docId, options);
            } else {
                return super.get(docId);
            }
        }

        put<Model>(doc: any, options?: any): Promise<any> {
            mockState.failCountdown--;
            if (mockState.failCountdown === 0) {
                throw Error("This was an intentional, mocked failure of put");
            }
            if (options) {
                return super.put(doc, options);
            } else {
                return super.put(doc);
            }
        }
    }

    function makeFactory (): PouchDBFactoryType {
        return (dbName: string) => new MockPouchDB(`db/${dbName}`, { adapter: "memory" })
    }

    async function wipeDB(DbClass: new (networkId: number, dbArgs: object) => TrackedUsers) {
        const dbInstance = new DbClass(TEST_NETWORK_ID, makeFactory());
        await dbInstance["db"].destroy();
    }

    return {
        makeFactory,
        wipeDB,
        failNext: () => mockState.failCountdown = 1,
        failInN: (n: number) => mockState.failCountdown = n,
        cancelFail: () => mockState.failCountdown = -1
    }
}

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
const provider = new EthersProvider(settings.ethNodeURLs[TEST_NETWORK_ID]);
const contractDependencies = new ContractDependenciesEthers(provider, undefined, settings.testAccounts[0]);


beforeEach(async () => {
    await mock.wipeDB(TrackedUsers)
});

let augur: Augur<any>;
beforeAll(async () => {
    augur = await Augur.create(provider, contractDependencies);
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
    expect(trackedUsers.getUsers()).rejects.toThrow();
}, 60000);


test.only("database failure during sync, followed by another sync", async () => {
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
    mock.failInN(1);  // for some reason, 748 is how many mock-wrapped db calls sync makes
    expect(db.sync(augur, settings.chunkSize, settings.blockstreamDelay)).rejects.toThrow();
    mock.cancelFail(); // should be unnecessary

    console.log("Sync successfully.");
    await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);
}, 60000);


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
    mock.failInN(1);  // for some reason, 748 is how many mock-wrapped db calls sync makes
    expect(db.sync(augur, settings.chunkSize, settings.blockstreamDelay)).rejects.toThrow();
    mock.cancelFail(); // should be unnecessary

    console.log("Sync successfully.");
    await db.sync(augur, settings.chunkSize, settings.blockstreamDelay);
}, 60000);


// TODO remove
// FSS = FFF
// FS = FF
// SFS = SFS
// SSFS = SSFS
// SS = SS
// SFS = SFS
