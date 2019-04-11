import {SyncableDB} from "./SyncableDB";
import {Augur, ParsedLog} from "@augurproject/api";
import {DB} from "./DB";

/**
 * Stores event logs for user-specific events.
 */
export class UserSyncableDB<TBigNumber> extends SyncableDB<TBigNumber> {
  public readonly user: string;
  private additionalTopics: Array<string | Array<string>>;

  constructor(dbController: DB<TBigNumber>, networkId: number, eventName: string, user: string, numAdditionalTopics: number, userTopicIndex: number) {
    super(dbController, networkId, eventName, dbController.getDatabaseName(eventName, user));
    this.user = user;
    const bytes32User = `0x000000000000000000000000${this.user.substr(2)}`;
    this.additionalTopics = [];
    this.additionalTopics.fill("", numAdditionalTopics);
    this.additionalTopics[userTopicIndex] = bytes32User;
  }

  protected async getLogs(augur: Augur<TBigNumber>, startBlock: number, endBlock: number): Promise<Array<ParsedLog>> {
    return await augur.events.getLogs(this.eventName, startBlock, endBlock, this.additionalTopics);
  }
}
