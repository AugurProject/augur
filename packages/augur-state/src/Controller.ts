import { Augur } from "@augurproject/api";
import settings from "./settings.json";
import { PouchDBFactoryType } from "./db/AbstractDB";
import { DB, UserSpecificEvent } from "./db/DB";
import {BlockAndLogStreamerListener} from "./db/BlockAndLogStreamerListener";

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

  public constructor (
    private augur: Augur<TBigNumber>,
    private networkId: number,
    private blockstreamDelay: number,
    private defaultStartSyncBlockNumber: number,
    private trackedUsers: Array<string>,
    private pouchDBFactory: PouchDBFactoryType,
    private blockAndLogStreamerListener: BlockAndLogStreamerListener
  ) {
  }

  public async run(): Promise<void> {
    try {
      this.dbController = await DB.createAndInitializeDB(
        this.networkId, 
        this.blockstreamDelay, 
        this.defaultStartSyncBlockNumber, 
        this.trackedUsers, 
        genericEventNames, 
        userSpecificEvents, 
        this.pouchDBFactory,
        this.blockAndLogStreamerListener
      );
      await this.dbController.sync(
        this.augur, 
        settings.chunkSize, 
        settings.blockstreamDelay
      );

      // TODO begin server process
    } catch (err) {
      console.log(err);
    }
  }
}
