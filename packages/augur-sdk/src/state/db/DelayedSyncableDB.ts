import { SubscriptionEventName } from '@augurproject/sdk-lite';
import * as _ from 'lodash';
import { Augur } from '../../Augur';
import { BaseDocument } from './AbstractTable';
import { BaseSyncableDB } from './BaseSyncableDB';
import { DB } from './DB';

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores most recent event logs by primary key.
 */
export class DelayedSyncableDB extends BaseSyncableDB {
  constructor(
    augur: Augur,
    db: DB,
    networkId: number,
    eventName: string,
    dbName: string = eventName,
    indexes: string[] = []
  ) {
    super(augur, db, networkId, eventName, dbName);

    augur.events.once(
      SubscriptionEventName.BulkSyncComplete,
      this.onBulkSyncComplete.bind(this)
    );
  }

  protected async saveDocuments(documents: BaseDocument[]): Promise<void> {
    if (this.syncing) return this.bulkPutDocuments(documents);
    return super.bulkUpsertDocuments(documents);
  }

  async onBulkSyncComplete() {
    this.db.registerEventListener(this.eventName, this.addNewBlock.bind(this));
  }

  async sync(highestAvailableBlockNumber: number): Promise<void> {
    this.syncing = true;

    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(
      this.dbName
    );

    const result: Document = await this.db.dexieDB[this.eventName]
      .where('blockNumber')
      .aboveOrEqual(highestSyncedBlockNumber)
      .toArray();
    const documentsById = _.groupBy(result, this.getIDValue.bind(this));
    const documents = _.flatMap(documentsById, documents => {
      return documents.reduce((val, doc) => {
        if (
          val.blockNumber < doc.blockNumber ||
          (val.blockNumber === doc.blockNumber && val.logIndex < doc.logIndex)
        ) {
          return doc;
        }
        return val;
      }, documents[0]);
    });

    await this.saveDocuments(documents);

    this.syncing = false;
  }
}
