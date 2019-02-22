import { TrackedUsers } from "./TrackedUsers";
import { DB, UserSpecificEvent } from "./DB";
import { EthersProvider } from "ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "@augurproject/api";
import { uploadBlockNumbers } from "@augurproject/artifacts";
import settings from "@augurproject/state/src/settings.json";
import * as _ from "lodash";


export function makeMock() {
    const mockState = {
        dbNames: [] as string[],
        failCountdown: -1,  // default state never fails
        alwaysFail: false,
    };

    function fail() {
        mockState.failCountdown--;
        return mockState.alwaysFail || mockState.failCountdown === 0;
    }

    class MockPouchDB extends PouchDB {
        allDocs<Model>(options?: any): Promise<any> {
            if (fail()) {
                throw Error("This was an intentional, mocked failure of allDocs");
            }
            if (options) {
                return super.allDocs(options);
            } else {
                return super.allDocs();
            }
        }

        get<Model>(docId: any, options?: any): Promise<any> {
            if (fail()) {
                throw Error("This was an intentional, mocked failure of get");
            }
            if (options) {
                return super.get(docId, options);
            } else {
                return super.get(docId);
            }
        }

        put<Model>(doc: any, options?: any): Promise<any> {
            if (fail()) {
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
        return (dbName: string) => {
            const fullDbName = `db/${dbName}`;
            mockState.dbNames.push(fullDbName);
            return new MockPouchDB(fullDbName, { adapter: "memory" })
        }
    }

    async function wipeDB(): Promise<void> {
        await Promise.all(_.map(mockState.dbNames, dbName => {
            const db = new PouchDB(dbName, { adapter: "memory" });
            return db.destroy();
        }));

        mockState.dbNames = [];
    }

    return {
        makeFactory,
        wipeDB,
        failNext: () => mockState.failCountdown = 1,
        failInN: (n: number) => mockState.failCountdown = n,
        failForever: () => mockState.alwaysFail = true,
        cancelFail: () => {
            mockState.failCountdown = -1;
            mockState.alwaysFail = false;
        },
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
    mock.cancelFail();
    await mock.wipeDB()
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
}, 60000);


test.skip("syncing: succeed then fail then succeed again", async () => {
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
}, 60000);
