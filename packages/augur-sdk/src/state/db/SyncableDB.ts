import * as _ from 'lodash';
import { BaseDocument } from './AbstractTable';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { Log, ParsedLog } from '@augurproject/types';
import { SyncStatus } from './SyncStatus';
import { SubscriptionEventName } from '../../constants';
import { RollbackTable } from './RollbackTable';

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores event logs for non-user-specific events.
 */
export class SyncableDB extends RollbackTable {
  protected eventName: string;

  constructor(
    augur: Augur,
    db: DB,
    networkId: number,
    eventName: string,
    dbName: string = eventName,
    indexes: string[] = []
  ) {
    super(networkId, augur, dbName, db);
    this.eventName = eventName;

    db.notifySyncableDBAdded(this);
    db.registerEventListener(this.eventName, this.addNewBlock);

    this.rollingBack = false;
  }

  async sync(augur: Augur, chunkSize: number, blockStreamDelay: number, highestAvailableBlockNumber: number): Promise<void> {
    this.syncing = true;

    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(
      this.dbName
    );

    const goalBlock = highestAvailableBlockNumber - blockStreamDelay;
    while (highestSyncedBlockNumber < goalBlock) {
      const endBlockNumber = Math.min(
        highestSyncedBlockNumber + chunkSize,
        highestAvailableBlockNumber
      );
      const logs = await this.getLogs(
        augur,
        highestSyncedBlockNumber,
        endBlockNumber
      );
      highestSyncedBlockNumber = await this.addNewBlock(endBlockNumber, logs);
    }

    this.syncing = false;
    await this.syncStatus.updateSyncingToFalse(this.dbName);

    // TODO Make any other external calls as needed (such as pushing user's balance to UI)
  }


  private parseLogArrays(logs: ParsedLog[]): void {
    for (let i = 0; i < logs.length; i++) {
      logs[i].kycToken = logs[i].addressData[0];
      logs[i].orderCreator = logs[i].addressData[1];
      logs[i].orderFiller = logs[i].addressData[2];

      logs[i].price = logs[i].uint256Data[0];
      logs[i].amount = logs[i].uint256Data[1];
      logs[i].outcome = logs[i].uint256Data[2];
      logs[i].tokenRefund = logs[i].uint256Data[3];
      logs[i].sharesRefund = logs[i].uint256Data[4];
      logs[i].fees = logs[i].uint256Data[5];
      logs[i].amountFilled = logs[i].uint256Data[6];
      logs[i].timestamp = logs[i].uint256Data[7];
      logs[i].sharesEscrowed = logs[i].uint256Data[8];
      logs[i].tokensEscrowed = logs[i].uint256Data[9];

      delete logs[i].addressData;
      delete logs[i].uint256Data;
    }
  }


  addNewBlock = async (blocknumber: number, logs: ParsedLog[]): Promise<number> => {
    // don't do anything until rollback is complete. We'll sync back to this block later
    if (this.rollingBack) {
      return -1;
    }

    if (this.eventName === SubscriptionEventName.OrderEvent) {
      this.parseLogArrays(logs);
    }

    let documents;
    if (logs.length > 0) {
      // If this is a table which is keyed by fields (meaning we are doing updates to a value instead of pulling in a history of events) we only want the most recent document for any given id
      if (this.idFields.length > 0) {
        documents = _.values(
          _.mapValues(_.groupBy(logs, this.getIDValue.bind(this)), idDocuments => {
            return _.reduce(
              idDocuments,
              (val, doc) => {
                if (val.blockNumber < doc.blockNumber) {
                  val = doc;
                } else if (
                  val.blockNumber === doc.blockNumber &&
                  val.logIndex < doc.logIndex
                ) {
                  val = doc;
                }
                return val;
              },
              idDocuments[0]
            );
          })
        );
      }

      await this.bulkUpsertDocuments(documents);
    }
    if (documents && (documents as any[]).length) {
      _.each(documents, (document: any) => {
        this.augur.getAugurEventEmitter().emit(this.eventName, {
          eventName: this.eventName,
          ...document,
        });
      });
    }

    await this.syncStatus.setHighestSyncBlock(this.dbName, blocknumber, this.syncing);

    return blocknumber;
  };

  protected async getLogs(augur: Augur, startBlock: number, endBlock: number): Promise<ParsedLog[]> {
    return augur.events.getLogs(this.eventName, startBlock, endBlock);
  }

  getFullEventName(): string {
    return this.eventName;
  }
}
