import * as _ from 'lodash';
import { BaseDocument } from './AbstractTable';
import { Augur } from '../../Augur';
import { BaseSyncableDB } from './BaseSyncableDB';
import { DB } from './DB';

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores event logs for non-user-specific events.
 */
export class SyncableDB extends BaseSyncableDB {
  protected eventName: string;

  constructor(
    augur: Augur,
    db: DB,
    networkId: number,
    eventName: string,
    dbName: string = eventName,
    indexes: string[] = []
  ) {
    super(augur, db, networkId, eventName, dbName);
    db.registerEventListener(this.eventName, this.addNewBlock);
  }
}
