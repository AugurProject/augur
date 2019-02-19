import { TrackedUsers } from "./TrackedUsers";
import * as PouchDB from "pouchdb";
import { PouchDBFactoryType } from "./AbstractDB";
import { DB, UserSpecificEvent } from "./DB";
import { EthersProvider } from "ethers-provider";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";
import { Augur } from "augur-api";
const uploadBlockNumbers = require('augur-artifacts/upload-block-numbers.json');


export function makeMock() {
    const mockState = {
        willFailNext: false
    };

    class MockPouchDB extends PouchDB {
        allDocs<Model>(options?: any): Promise<any> {
            if (mockState.willFailNext) {
                mockState.willFailNext = false;
                throw Error("This was a failure")
            }
            if (options) {
                return super.allDocs(options);
            } else {
                return super.allDocs();
            }

        }
    }

    function makeFactory (): PouchDBFactoryType {
        return (dbName: string) => new MockPouchDB(`db/${dbName}`, { adapter: "memory" })
    }

    return {
        makeFactory,
        failNext: () => mockState.willFailNext = true
    }
}

const BLOCKSTREAM_DELAY = 10;
const CHUNK_SIZE = 100000;
const TEST_RINKEBY_URL = "https://eth-rinkeby.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM";
const TEST_NETWORK_ID = 4;
const TEST_ACCOUNT = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb";


test("sync failure", async () => {
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

    const provider = new EthersProvider(TEST_RINKEBY_URL);
    const contractDependencies = new ContractDependenciesEthers(provider, undefined, TEST_ACCOUNT);
    const augur = await Augur.create(provider, contractDependencies);

    // this.networkId,
    // this.blockstreamDelay,
    // this.defaultStartSyncBlockNumber,
    // this.trackedUsers,
    // genericEventNames,
    // userSpecificEvents,
    // this.pouchDBFactory
    const db = await DB.createAndInitializeDB(
      TEST_NETWORK_ID,
      BLOCKSTREAM_DELAY,
      defaultStartSyncBlockNumber,
      [TEST_ACCOUNT],
      genericEventNames,
      userSpecificEvents,
      mock.makeFactory()
    );

    await db.sync(augur, CHUNK_SIZE, BLOCKSTREAM_DELAY);

    const trackedUsers = new TrackedUsers(TEST_NETWORK_ID, mock.makeFactory());

    expect(await trackedUsers.setUserTracked("mock")).toMatchObject({
        ok: true,
        id: "mock",
        rev: expect.any(String)
    });
    // mock.failNext();
    await trackedUsers.getUsers();
    expect(await trackedUsers.getUsers()).toEqual(["mock"]);
});
