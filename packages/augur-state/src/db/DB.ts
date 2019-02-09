import { SyncableDB } from './SyncableDB';
import { Augur } from 'augur-api';
import { SyncStatus } from './SyncStatus';
import { TrackedUsers } from './TrackedUsers';
import { MetaDB } from './MetaDB';
import { UserSyncableDB } from './UserSyncableDB';
const uploadBlockNumbers = require('augur-artifacts/upload-block-numbers.json');

interface UserSpecificEvent {
  name: string;
  numAdditionalTopics: number;
  userTopicIndex: number;
}

interface SequenceIds { 
  [eventName: string]: string 
}

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

export class DB<TBigNumber> {
  private networkId: number;
  private trackedUsers: TrackedUsers;
  private syncableDatabases: { [eventName: string]: SyncableDB<TBigNumber> } = {};
  private userSyncableDatabases: { [userEventName: string]: UserSyncableDB<TBigNumber> } = {};
  private metaDatabase: MetaDB<TBigNumber>;
  public syncStatus: SyncStatus;

  public constructor () {}

  /**
   * Creates and returns a new dbController.
   * 
   * @param networkId Network on which to sync events
   * @param trackedUsers Array of user addresses for which to sync user-specific events
   */
  public static async createAndInitializeDB<TBigNumber>(networkId: number, trackedUsers: Array<string>): Promise<DB<TBigNumber>> {
    const dbController = new DB<TBigNumber>();
    await dbController.initializeDB(networkId, trackedUsers);
    return dbController;
  }

  /**
   * Creates databases to be used for syncing.
   * 
   * @param networkId Network on which to sync events
   * @param trackedUsers Array of user addresses for which to sync user-specific events
   */
  public async initializeDB(networkId: number, trackedUsers: Array<string>): Promise<void> {
    this.networkId = networkId;
    this.syncStatus = new SyncStatus();
    this.trackedUsers = new TrackedUsers();

    // Create SyncableDBs for generic event types
    for (let eventName of genericEventNames) {
      new SyncableDB<TBigNumber>(this, networkId, eventName);
    }

    // Create UserSyncableDBs for user-specific event types
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of trackedUsers) {
      await this.trackedUsers.setUserTracked(trackedUser);
      for (let eventIndex in userSpecificEvents) {
        new UserSyncableDB<TBigNumber>(this, networkId, userSpecificEvents[eventIndex].name, trackedUser, userSpecificEvents[eventIndex].numAdditionalTopics, userSpecificEvents[eventIndex].userTopicIndex);
      }
    }

    // TODO Initialize full-text DB

    this.metaDatabase = new MetaDB(networkId + "-BlockNumberEvents");
  }

  /**
   * Called from SyncableDB constructor once SyncableDB is successfully created.
   * 
   * @param eventName Generic event type on which the SyncableDB syncs
   * @param db dbController that utilizes the SyncableDB
   */
  public notifySyncableDBAdded(eventName: string, db: SyncableDB<TBigNumber>): void {
    this.syncableDatabases[`${this.networkId}-${eventName}`] = db;
  }

  /**
   * Called from UserSyncableDB constructor once UserSyncableDB is successfully created.
   * 
   * @param userSpecificEventName User-specific event type on which the UserSyncableDB syncs
   * @param trackedUser User address for which to sync the user-specific event type
   * @param db dbController that utilizes the UserSyncableDB
   */
  public notifyUserSyncableDBAdded(userSpecificEventName: string, trackedUser: string, db: UserSyncableDB<TBigNumber>): void {
    this.userSyncableDatabases[`${this.networkId}-${userSpecificEventName}-${trackedUser}`] = db;
  }

  /**
   * Syncs generic events and user-specific events with blockchain and updates MetaDB info.
   * 
   * @param augur Augur object with which to sync
   * @param chunkSize Number of blocks to retrieve at a time when syncing logs
   * @param blockstreamDelay Number of blocks by which blockstream is behind the blockchain
   * @param uploadBlockNumber Block number at which Augur contracts were originally uploaded to the blockchain
   */
  public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockstreamDelay: number, uploadBlockNumber: number): Promise<void> {
    // Update MetaDB to associate block numbers with SyncableDB/UserSyncableDB update_seqs
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(`${this.networkId}-${genericEventNames[0]}`, uploadBlockNumbers[this.networkId]);
    let newDocument;
    let sequenceIds = await this.getAllSequenceIds();
    // TODO Check if sequenceIds matches the sequence IDs in MetaDB and update MetaDB accordingly, since MetaDB could be behind or ahead

    // Sync generic event types & user-specific event types
    let dbSyncPromises = [];
    for (let eventName of genericEventNames) {
      dbSyncPromises.push(this.syncableDatabases[`${this.networkId}-${eventName}`].sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber));
      // TODO Set indexes
    }
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let eventIndex in userSpecificEvents) {
        dbSyncPromises.push(this.userSyncableDatabases[`${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`].sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber));
        // TODO Set indexes
      }
    }
    await Promise.all(dbSyncPromises);

    // Get new sequence IDs
    sequenceIds = {};
    for (let eventName of genericEventNames) {
      let updateSeq = await this.syncableDatabases[`${this.networkId}-${eventName}`].getUpdateSeq();
      if (typeof updateSeq !== "undefined") {
        sequenceIds[`${this.networkId}-${eventName}`] = updateSeq;
      }
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let eventIndex in userSpecificEvents) {
        let updateSeq = await this.userSyncableDatabases[`${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`].getUpdateSeq();
        if (typeof updateSeq !== "undefined") {
          sequenceIds[`${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`] = updateSeq;
        }
      }
    }

    // Update MetaDB to associate block numbers with SyncableDB/UserSyncableDB update_seqs
    highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(`${this.networkId}-${genericEventNames[0]}`, uploadBlockNumbers[this.networkId]);
    newDocument = {
      _id: highestSyncedBlockNumber + "-" + Math.floor(Date.now() / 1000),
      blockNumber: highestSyncedBlockNumber,
      sequenceIds: JSON.stringify(sequenceIds),
    };
    await this.metaDatabase.addBlock(highestSyncedBlockNumber, newDocument);


    
    // TODO Move these lines for testing rollback to a unit test
    // Add new block to DisputeCrowdsourcerCompleted
    // console.log("SEQUENCE IDS: ", sequenceIds);
    console.log("\n\nHighest synced block number: ", highestSyncedBlockNumber);
    let newBlockNumber = highestSyncedBlockNumber + 1;
    console.log("Adding new block number: ", newBlockNumber);
    await this.simulateAddingBlock(newBlockNumber, sequenceIds);
    newBlockNumber++;
    console.log("Adding new block number: " + newBlockNumber + "\n\n");
    await this.simulateAddingBlock(newBlockNumber, sequenceIds);

    // Find new block
    let queryObj = {
      selector: {universe: '0x11149d40d255fCeaC54A3ee3899807B0539bad60'},
      fields: ['_id', 'universe'],
      sort: ['_id']
    };
    let result = await this.syncableDatabases[this.networkId + "-DisputeCrowdsourcerCompleted"].find(queryObj);
    console.log("Before rollback RESULT: ", result);

    await this.rollback(highestSyncedBlockNumber + 1);

    // New block should be gone
    result = await this.syncableDatabases[this.networkId + "-DisputeCrowdsourcerCompleted"].find(queryObj);
    console.log("After rollback RESULT: ", result);
  }

  public async getAllSequenceIds(): Promise<SequenceIds> {
    let sequenceIds: { [eventName: string]: string } = {};
    for (let eventName of genericEventNames) {
      let updateSeq = await this.syncableDatabases[`${this.networkId}-${eventName}`].getUpdateSeq();
      if (typeof updateSeq !== "undefined") {
        sequenceIds[`${this.networkId}-${eventName}`] = updateSeq;
      } else {
        console.log(`ERROR: Unabled to get sequence ID for ${this.networkId}-${eventName}`);
      }
    }

    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let eventIndex in userSpecificEvents) {
        let updateSeq = await this.userSyncableDatabases[`${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`].getUpdateSeq();
        // TODO Set indexes
        if (typeof updateSeq !== "undefined") {
          sequenceIds[`${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`] = updateSeq;
        }
      }
    }

    return sequenceIds;
  }

  // TODO Remove once rollback unit tests are done
  public async simulateAddingBlock(newBlockNumber: number, sequenceIds: { [eventName: string]: string }): Promise<void> {
    const logs = [
      {
        "universe":"0x02149d40d255fCeaC54A3ee3899807B0539bad60",
        "market":"0xC0ffe3F654d442589BAb472937F094970339d214",
        "disputeCrowdsourcer":"0x65d4f86927D1f10eFa2Fb884e4DEe0aB86137caD",
        "blockNumber":newBlockNumber,
        "blockHash":"0x8132a0cdb4226b3bbb5bcf8429ec0883859255751be2c321c58b488395188040",
        "transactionIndex":8,
        "removed":false,
        "transactionHash":"0xf750ebb0d039c623385f8227f7a6cbe49f5efbc5485ac0e38b5a7b0e389726d8",
        "logIndex":1,
      },
    ];
    if (await this.syncableDatabases[this.networkId + "-DisputeCrowdsourcerCompleted"].simulateAddingNewBlock(newBlockNumber, logs)) {
      let newSequenceIds = sequenceIds;
      const newSequenceId = await this.syncableDatabases[this.networkId + "-DisputeCrowdsourcerCompleted"].getUpdateSeq();
      if (typeof newSequenceId !== "undefined") {
        newSequenceIds[this.networkId + "-DisputeCrowdsourcerCompleted"] = newSequenceId;
      }
      
      // Update MetaDB
      const newTimestamp = Math.floor(Date.now() / 1000) + 1;
      const newDocument = {
        _id: newBlockNumber + "-" + Math.round(newTimestamp/1000),
        blockNumber: newBlockNumber,
        sequenceIds: JSON.stringify(sequenceIds),
      };
      await this.metaDatabase.addBlock(newBlockNumber, newDocument);
    }
  }

  // TODO Add check to see if any rollbacks failed
  public async rollback (blockNumber: number) {
    console.log("Rolling back block number " + blockNumber + "\n\n");

    let previousBlockSequenceIds = await this.metaDatabase.getBlockSequenceIds(blockNumber);

    let dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & UserSyncableDBs
    for (let eventName of genericEventNames) {
      let dbName = `${this.networkId}-${eventName}`;
      let previousSequenceId = JSON.parse(previousBlockSequenceIds.docs[0].sequenceIds)[dbName];
      let dbInfo = await this.syncableDatabases[dbName].getInfo();
      if (dbInfo.update_seq > previousSequenceId) {
        dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(previousSequenceId));
      }
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let eventIndex in userSpecificEvents) {
        let dbName = `${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`;
        let previousSequenceId = JSON.parse(previousBlockSequenceIds.docs[0].sequenceIds)[dbName];
        let dbInfo = await this.userSyncableDatabases[dbName].getInfo();
        if (dbInfo.update_seq > previousSequenceId) {
          dbRollbackPromises.push(this.userSyncableDatabases[dbName].rollback(previousSequenceId));
        }
      }
    }
    await Promise.all(dbRollbackPromises);

    // TODO Perform rollback on full-text DB

    // Update MetaDB
    this.metaDatabase.rollback(blockNumber);
  }
}
