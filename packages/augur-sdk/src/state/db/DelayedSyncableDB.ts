import * as _ from 'lodash';
import { BaseDocument } from './AbstractTable';
import { Augur } from '../../Augur';
import { BaseSyncableDB } from './BaseSyncableDB';
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

    augur.events.once(SubscriptionEventName.BulkSyncComplete, this.onBulkSyncComplete.bind(this));
  }

  protected async bulkUpsertDocuments(documents: BaseDocument[]): Promise<void> {
    for (let document of documents) {
      const documentID = this.getIDValue(document);
      await this.upsertDocument(documentID, document);
    }
  }

  async onBulkSyncComplete({highestAvailableBlockNumber}) {
    console.log('onBulkSyncComplete-checkpoint-1');

    await this.sync(highestAvailableBlockNumber);
    this.db.registerEventListener(this.eventName, this.addNewBlock.bind(this));
  }

  async sync(highestAvailableBlockNumber: number): Promise<void> {
    this.syncing = true;

    const result = await this.table.toArray();
    this.bulkUpsertDocuments(result);

    this.syncing = false;
  }


}
