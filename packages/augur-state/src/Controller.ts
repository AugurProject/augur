import { DB, UserSpecificEvent } from './db/DB';
import { Augur } from 'augur-api';

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



export class Controller<TBigNumber> {
  private dbController: DB<TBigNumber>;
  private augur: Augur<TBigNumber>;
  private networkId: number;
  private blockstreamDelay: number;
  private defaultStartSyncBlockNumber: number;
  private trackedUsers: Array<string>;

  public constructor (augur: Augur<TBigNumber>, networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, trackedUsers: Array<string>) {
    this.augur = augur;
    this.networkId = networkId;
    this.blockstreamDelay = blockstreamDelay;
    this.defaultStartSyncBlockNumber = defaultStartSyncBlockNumber;
    this.trackedUsers = trackedUsers;
  }

  public async run(): Promise<void> {
    try {
      this.dbController = await DB.createAndInitializeDB(this.networkId, this.blockstreamDelay, this.defaultStartSyncBlockNumber, this.trackedUsers, genericEventNames, userSpecificEvents);
      await this.dbController.sync(this.augur, 100000, 5);

      // TODO Move this function into separate test
      await this.testRollback();

      // TODO begin server process
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Adds 2 new blocks to DisputeCrowdsourcerCompleted DB and performs a rollback.
   * Queries before & after rollback to ensure blocks are removed successfully.
   * Also checks MetaDB to make sure blocks/sequence IDs were removed correctly 
   * and checks DBs to make sure highest sync block is correct.
   */
  public async testRollback() {
    const dbName = this.networkId + "-DisputeCrowdsourcerCompleted";
    const universe = "0x11149d40d255fCeaC54A3ee3899807B0539bad60";

    try {
      let highestSyncedBlockNumber = await this.dbController.syncStatus.getHighestSyncBlock(dbName);
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
      await this.dbController.addNewBlock(dbName, blockLogs);
      highestSyncedBlockNumber = await this.dbController.syncStatus.getHighestSyncBlock(dbName);
      // console.log("Highest synced block number: ", highestSyncedBlockNumber);

      blockLogs[0].blockNumber = highestSyncedBlockNumber + 1;
      // console.log("Adding new block: " + newBlockNumber);
      await this.dbController.addNewBlock(dbName, blockLogs);
      highestSyncedBlockNumber = await this.dbController.syncStatus.getHighestSyncBlock(dbName);
      // console.log("Highest synced block number: ", highestSyncedBlockNumber);

      let queryObj: any = {
        selector: { universe: '0x11149d40d255fCeaC54A3ee3899807B0539bad60' },
        fields: ['_id', 'universe'],
        sort: ['_id']
      };
      let result = await this.dbController.findInSyncableDB(dbName, queryObj);
      console.log("\n\n" + this.networkId + "-DisputeCrowdsourcerCompleted event logs before rollback:", result);

      await this.dbController.rollback(highestSyncedBlockNumber - 1);

      result = await this.dbController.findInSyncableDB(dbName, queryObj);
      console.log("\n\n" + this.networkId + "-DisputeCrowdsourcerCompleted event logs after rollback:", result);

      queryObj = {
        selector: { blockNumber: { $gte: (highestSyncedBlockNumber - 1) } },
        fields: ['_id', 'blockNumber'],
        sort: ['_id']
      };
      result = await this.dbController.findInMetaDB(queryObj);
      console.log("\n\nMetaDB block numbers greater than " + (highestSyncedBlockNumber - 2) + " after rollback:", result);

      console.log("Highest sync block for " + this.networkId + "-DisputeCrowdsourcerCreated:", await this.dbController.syncStatus.getHighestSyncBlock(this.networkId + "-DisputeCrowdsourcerCreated"));
      console.log("Highest sync block for " + this.networkId + "-DisputeCrowdsourcerCompleted:", await this.dbController.syncStatus.getHighestSyncBlock(this.networkId + "-DisputeCrowdsourcerCompleted"));
      console.log("Highest sync block for " + this.networkId + "-BlockNumbersSequenceIds:", await this.dbController.syncStatus.getHighestSyncBlock(this.networkId + "-BlockNumbersSequenceIds"));
    } catch (err) {
      console.log(err);
    }
  }
}
