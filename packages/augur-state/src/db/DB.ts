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
  private syncableDatabases: { [eventName: string]: SyncableDB<TBigNumber> } = {};
  private userSyncableDatabases: { [userEventName: string]: UserSyncableDB<TBigNumber> } = {};
  private metaDatabase: MetaDB<TBigNumber>;
  public syncStatus: SyncStatus;
  public trackedUsers: TrackedUsers;

  public constructor () {}

  public static async createAndInitializeDB<TBigNumber>(networkId: number, trackedUsers: Array<string>): Promise<DB<TBigNumber>> {
    const dbController = new DB<TBigNumber>();
    await dbController.initializeDB(networkId, trackedUsers);
    return dbController;
  }

  public async initializeDB(networkId: number, trackedUsers: Array<string>): Promise<void> {
    this.syncStatus = new SyncStatus();
    this.trackedUsers = new TrackedUsers();

    let sequenceIds: { [eventName: string]: string } = {};

    // Sync generic event types
    for (let eventName of genericEventNames) {
      this.notifySyncableDBAdded(networkId, eventName, new SyncableDB<TBigNumber>(this, networkId, eventName));
      let updateSeq = await this.syncableDatabases[`${networkId}-${eventName}`].getUpdateSeq();
      if (typeof updateSeq !== "undefined") {
        sequenceIds[eventName + ""] = updateSeq;
      }
    }

    // Sync user-specific event types
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of trackedUsers) {
      await this.trackedUsers.setUserTracked(trackedUser);
      for (let i in userSpecificEvents) {
        this.notifyUserSyncableDBAdded(networkId, userSpecificEvents[i].name, trackedUser, new UserSyncableDB<TBigNumber>(this, networkId, userSpecificEvents[i].name, trackedUser, userSpecificEvents[i].numAdditionalTopics, userSpecificEvents[i].userTopicIndex));
        let updateSeq = await this.userSyncableDatabases[`${networkId}-${userSpecificEvents[i].name}-${trackedUser}`].getUpdateSeq();
        if (typeof updateSeq !== "undefined") {
          sequenceIds[`${networkId}-${userSpecificEvents[i].name}-${trackedUser}`] = updateSeq;
        }
      }
    }

    // Initialize MetaDB
    this.metaDatabase = new MetaDB("BlockNumberEvents");
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(`${networkId}-${genericEventNames[0]}`, uploadBlockNumbers[networkId]);
    const document = {
      _id: highestSyncedBlockNumber + "-" + Math.round(+new Date()/1000),
      update_seqs: JSON.stringify(sequenceIds),
    };
    this.metaDatabase.addBlock(highestSyncedBlockNumber, document);
  }

  public notifySyncableDBAdded(networkId: number, eventName: string, db: SyncableDB<TBigNumber>): void {
    this.syncableDatabases[`${networkId}-${eventName}`] = db;
  }

  public notifyUserSyncableDBAdded(networkId: number, userSpecificEventName: string, trackedUser: string, db: UserSyncableDB<TBigNumber>): void {
    this.userSyncableDatabases[`${networkId}-${userSpecificEventName}-${trackedUser}`] = db;
  }

  public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockstreamDelay: number, uploadBlockNumber: number): Promise<void> {
    for (let eventName in this.syncableDatabases) {
      this.syncableDatabases[eventName].sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber);
    }
    // TODO Update blockNumberEvents tables
  }

  public addNewBlock(blockNumber: number) {
    // TODO
  }

  public rollback(blockNumber: number) {
    // TODO
  }
}