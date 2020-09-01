import { SubscriptionEventName } from '@augurproject/sdk-lite';
import { ParsedLog } from '@augurproject/types';
import * as _ from 'lodash';
import { Augur } from '../../Augur';
import { BaseDocument } from './AbstractTable';
import { DB } from './DB';
import { RollbackTable } from './RollbackTable';

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores event logs for non-user-specific events.
 */
export class BaseSyncableDB extends RollbackTable {
  protected eventName: string;

  constructor(
    augur: Augur,
    protected db: DB,
    networkId: number,
    eventName: string,
    dbName: string = eventName
  ) {
    super(networkId, augur, dbName, db);
    this.eventName = eventName;

    this.rollingBack = false;
    this.addNewBlock = this.addNewBlock.bind(this);
  }

  async delete() {
    this.db.unregisterEventListener(this.eventName, this.addNewBlock);
    return super.delete();
  }

  protected async saveDocuments(documents: BaseDocument[]): Promise<void> {
    return this.bulkAddDocuments(documents);
  }

  async addNewBlock(blocknumber: number, logs: ParsedLog[]): Promise<number> {
    // don't do anything until rollback is complete. We'll sync back to this block later
    if (this.rollingBack) {
      return -1;
    }

    let documents;
    if (logs.length > 0) {
      // If this is a table which is keyed by fields (meaning we are doing updates to a value instead of pulling in a history of events) we only want the most recent document for any given id
      if (this.idFields.length > 0) {
        documents = _.values(
          _.mapValues(
            _.groupBy(logs, this.getIDValue.bind(this)),
            idDocuments => {
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
            }
          )
        );
      }

      await this.saveDocuments(documents);
    }
    if (documents && (documents as any[]).length && !this.syncing) {
      this.augur.events.once(SubscriptionEventName.NewBlock, () => {
        _.each(documents, (document: any) => {
          this.augur.events.emit(this.eventName, {
            eventName: this.eventName, ...document
          });
        });
      });
    }

    await this.syncStatus.setHighestSyncBlock(
      this.dbName,
      blocknumber,
      this.syncing
    );

    return blocknumber;
  }

  async sync(highestAvailableBlockNumber: number): Promise<void> {
    // This is a no-op for generic dbs.
  }

  getFullEventName(): string {
    return this.eventName;
  }
}
