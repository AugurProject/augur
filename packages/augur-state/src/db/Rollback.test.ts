import { DB, UserSpecificEvent } from '../db/DB';
import { Augur } from 'augur-api';
import { EthersProvider } from 'ethers-provider';
import { ContractDependenciesEthers } from 'contract-dependencies-ethers';
const uploadBlockNumbers = require('../upload-block-numbers.json');

const BLOCKSTREAM_DELAY = 10;
const TEST_RINKEBY_URL = "https://eth-rinkeby.alchemyapi.io/jsonrpc/Kd37_uEmJGwU6pYq6jrXaJXXi8u9IoOM";
const TEST_NETWORK_ID = 4;
const TEST_ACCOUNT = "0x913da4198e6be1d5f5e4a40d0667f70c0b5430eb";

// TODO Get these from GenericContractInterfaces (and do not include any that are unneeded)
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
    "TokensBurned",
    "TokensMinted",
    "UniverseCreated",
    "UniverseForked",
];
  
  // TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
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



beforeEach(async () => {
    // TODO Import wipeDb function and wipe all DBs
});

/**
 * Adds 2 new blocks to DisputeCrowdsourcerCompleted DB and performs a rollback.
 * Queries before & after rollback to ensure blocks are removed successfully.
 * Also checks MetaDB to make sure blocks/sequence IDs were removed correctly 
 * and checks DBs to make sure highest sync block is correct.
 */
test("sync databases", async () => {
    const provider = new EthersProvider(TEST_RINKEBY_URL);
    const contractDependencies = new ContractDependenciesEthers(provider, undefined, TEST_ACCOUNT);
    const augur = await Augur.create(provider, contractDependencies);
    const trackedUsers = [TEST_ACCOUNT];

    const dbController = await DB.createAndInitializeDB(TEST_NETWORK_ID, BLOCKSTREAM_DELAY, uploadBlockNumbers[TEST_NETWORK_ID], trackedUsers, genericEventNames, userSpecificEvents);
    await dbController.sync(augur, 100000, 5);

    const dbName = TEST_NETWORK_ID + "-DisputeCrowdsourcerCompleted";
    const universe = "0x11149d40d255fCeaC54A3ee3899807B0539bad60";

    let highestSyncedBlockNumber = await dbController.syncStatus.getHighestSyncBlock(dbName);
    // console.log("\n\nHighest synced block number: ", highestSyncedBlockNumber);

    let blockLogs = [
        {
          "universe": universe,
          "market": "0xC0ffe3F654d442589BAb472937F094970339d214",
          "disputeCrowdsourcer": "0x65d4f86927D1f10eFa2Fb884e4DEe0aB86137caD",
          "blockHash": "0x8132a0cdb4226b3bbb5bcf8429ec0883859255751be2c321c58b488395188040",
          "blockNumber": highestSyncedBlockNumber + 1,
          "transactionIndex": 8,
          "removed": false,
          "transactionHash": "0xf750ebb0d039c623385f8227f7a6cbe49f5efbc5485ac0e38b5a7b0e389726d8",
          "logIndex": 1,
        },
    ];

    // console.log("Adding new block: ", blockLogs);
    await dbController.addNewBlock(dbName, blockLogs);
    highestSyncedBlockNumber = await dbController.syncStatus.getHighestSyncBlock(dbName);
    // console.log("Highest synced block number: ", highestSyncedBlockNumber);

    blockLogs[0].blockNumber = highestSyncedBlockNumber + 1;
    // console.log("Adding new block: " + newBlockNumber);
    await dbController.addNewBlock(dbName, blockLogs);
    highestSyncedBlockNumber = await dbController.syncStatus.getHighestSyncBlock(dbName);
    // console.log("Highest synced block number: ", highestSyncedBlockNumber);

    let queryObj: any = {
    selector: { universe: '0x11149d40d255fCeaC54A3ee3899807B0539bad60' },
    fields: ['_id', 'universe'],
    sort: ['_id']
    };
    let result = await dbController.findInSyncableDB(dbName, queryObj);
    console.log("\n\n" + TEST_NETWORK_ID + "-DisputeCrowdsourcerCompleted event logs before rollback:", result);

    await dbController.rollback(highestSyncedBlockNumber - 1);

    result = await dbController.findInSyncableDB(dbName, queryObj);
    console.log("\n\n" + TEST_NETWORK_ID + "-DisputeCrowdsourcerCompleted event logs after rollback:", result);

    queryObj = {
    selector: { blockNumber: { $gte: (highestSyncedBlockNumber - 1) } },
    fields: ['_id', 'blockNumber'],
    sort: ['_id']
    };
    result = await dbController.findInMetaDB(queryObj);
    console.log("\n\nMetaDB block numbers greater than " + (highestSyncedBlockNumber - 2) + " after rollback:", result);

    console.log("Highest sync block for " + TEST_NETWORK_ID + "-DisputeCrowdsourcerCreated:", await dbController.syncStatus.getHighestSyncBlock(TEST_NETWORK_ID + "-DisputeCrowdsourcerCreated"));
    console.log("Highest sync block for " + TEST_NETWORK_ID + "-DisputeCrowdsourcerCompleted:", await dbController.syncStatus.getHighestSyncBlock(TEST_NETWORK_ID + "-DisputeCrowdsourcerCompleted"));
    console.log("Highest sync block for " + TEST_NETWORK_ID + "-BlockNumbersSequenceIds:", await dbController.syncStatus.getHighestSyncBlock(TEST_NETWORK_ID + "-BlockNumbersSequenceIds"));
});
