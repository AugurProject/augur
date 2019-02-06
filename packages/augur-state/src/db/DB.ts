import { SyncableDB } from './SyncableDB';
import { Augur } from 'augur-api';
import { SyncStatus } from './SyncStatus';
import { TrackedUsers } from './TrackedUsers';
import { MetaDB } from './MetaDB';
import { UserSyncableDB } from './UserSyncableDB';
const uploadBlockNumbers = require('../../../augur-artifacts/upload-block-numbers.json');

interface UserSpecificEvent {
  name: string;
  numAdditionalTopics: number;
  userTopicIndex: number;
}

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

    this.metaDatabase = new MetaDB("BlockNumberEvents");
  }

  /**
   * Called from SyncableDB constructor once SyncableDB is successfully created.
   * 
   * @param networkId Network to which the SyncableDB connects
   * @param eventName Generic event type on which the SyncableDB syncs
   * @param db dbController that utilizes the SyncableDB
   */
  public notifySyncableDBAdded(networkId: number, eventName: string, db: SyncableDB<TBigNumber>): void {
    this.syncableDatabases[`${networkId}-${eventName}`] = db;
  }

  /**
   * Called from UserSyncableDB constructor once UserSyncableDB is successfully created.
   * 
   * @param networkId Network to which the UserSyncableDB connects
   * @param userSpecificEventName User-specific event type on which the UserSyncableDB syncs
   * @param trackedUser User address for which to sync the user-specific event type
   * @param db dbController that utilizes the UserSyncableDB
   */
  public notifyUserSyncableDBAdded(networkId: number, userSpecificEventName: string, trackedUser: string, db: UserSyncableDB<TBigNumber>): void {
    this.userSyncableDatabases[`${networkId}-${userSpecificEventName}-${trackedUser}`] = db;
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
    let sequenceIds: { [eventName: string]: string } = {};

    // Sync generic event types
    for (let eventName of genericEventNames) {
      this.syncableDatabases[`${this.networkId}-${eventName}`].sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber);
      let updateSeq = await this.syncableDatabases[`${this.networkId}-${eventName}`].getUpdateSeq();
      if (typeof updateSeq !== "undefined") {
        sequenceIds[eventName] = updateSeq;
      }
    }

    // Sync user-specific event types
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let eventIndex in userSpecificEvents) {
        this.userSyncableDatabases[`${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`].sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber);
        let updateSeq = await this.userSyncableDatabases[`${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`].getUpdateSeq();
        if (typeof updateSeq !== "undefined") {
          sequenceIds[`${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`] = updateSeq;
        }
      }
    }

    // Initialize MetaDB to associate block numbers with SyncableDB/UserSyncableDB update_seqs
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(`${this.networkId}-${genericEventNames[0]}`, uploadBlockNumbers[this.networkId]);
    const document = {
      _id: highestSyncedBlockNumber + "-" + Math.round(+new Date()/1000),
      update_seqs: JSON.stringify(sequenceIds),
    };
    this.metaDatabase.addBlock(highestSyncedBlockNumber, document);
  }
}
