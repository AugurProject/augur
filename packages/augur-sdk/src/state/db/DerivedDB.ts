import { SubscriptionEventName } from '@augurproject/sdk-lite';
import { ParsedLog } from '@augurproject/types';
import * as _ from 'lodash';
import Dexie from "dexie";
import { Augur } from '../../Augur';
import { BaseDocument } from './AbstractTable';
import { DB } from './DB';
import { RollbackTable } from './RollbackTable';

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores derived data from multiple logs and post-log processing
 */
export class DerivedDB extends RollbackTable {
  protected stateDB: DB;
  private mergeEventNames: string[];
  private name: string;
  protected requiresOrder: boolean = false;
  protected augur: Augur;

  constructor(
    db: DB,
    networkId: number,
    name: string,
    mergeEventNames: string[],
    augur: Augur
  ) {
    super(networkId, augur, name, db);
    this.mergeEventNames = mergeEventNames;
    this.stateDB = db;
    this.name = name;

    augur.events.once(
      SubscriptionEventName.BulkSyncComplete,
      this.onBulkSyncComplete.bind(this)
    );

    // Binding here because we need to use call the parent method.
    this.handleMergeEvent = this.handleMergeEvent.bind(this);
  }

  async delete() {
    this.stateDB.unregisterEventListener(
      this.mergeEventNames,
      this.handleMergeEvent
    );
  }

  async onBulkSyncComplete() {
    this.stateDB.registerEventListener(
      this.mergeEventNames,
      this.handleMergeEvent
    );
  }

  async sync(highestAvailableBlockNumber: number): Promise<void> {
    this.syncing = true;
    await this.doSync(highestAvailableBlockNumber);
    await this.syncStatus.setHighestSyncBlock(
      this.dbName,
      highestAvailableBlockNumber,
      true
    );
    this.syncing = false;
  }

  // For all mergable event types get any new documents we haven't pulled in and pull them in
  async doSync(highestAvailableBlockNumber: number): Promise<void> {
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(
      this.dbName
    );
    const documentById = {};
    for (const eventName of this.mergeEventNames) {
      const result = await this.getEvents(highestSyncedBlockNumber, eventName);
      if (result.length > 0) {
        const resultsById = _.groupBy(result, this.getIDValue.bind(this));
        _.forEach(resultsById, (documents, documentId) => {
          const latestDoc = documents.reduce((val, doc) => {
            if (
              val.blockNumber < doc.blockNumber ||
              (val.blockNumber === doc.blockNumber &&
                val.logIndex < doc.logIndex)
            ) {
              return doc;
            }
            return val;
          }, documents[0]);
          const processedDoc = this.processDoc(latestDoc as ParsedLog);
          const existingDoc = documentById[documentId];
          if (existingDoc) {
            documentById[documentId] = Object.assign(existingDoc, processedDoc);
          } else {
            documentById[documentId] = processedDoc;
          }
        });
      }
    }

    await this.saveDocuments(_.values(documentById));

    await this.syncStatus.setHighestSyncBlock(
      this.dbName,
      highestAvailableBlockNumber,
      true
    );

    await this.syncStatus.updateSyncingToFalse(this.dbName);
  }

  async getEvents(
    highestSyncedBlockNumber: number,
    eventName: string
  ): Promise<BaseDocument[]> {
    return await this.stateDB.dexieDB[eventName]
      .where('blockNumber')
      .aboveOrEqual(highestSyncedBlockNumber)
      .toArray();
  }

  // For a group of documents/logs for a particular event type get the latest per id and update the DB documents for the corresponding ids
  async handleMergeEvent(
    blocknumber: number,
    logs: ParsedLog[],
    syncing = false
  ): Promise<number> {
    let documentsByIdByTopic = null;
    if (logs.length > 0) {
      const documentsById = _.groupBy(logs, this.getIDValue.bind(this));
      documentsByIdByTopic = _.flatMap(documentsById, idDocuments => {
        const mostRecentTopics = _.flatMap(
          _.groupBy(idDocuments, 'topics[0]'),
          documents => {
            return documents.reduce((val, doc) => {
              if (
                val.blockNumber < doc.blockNumber ||
                (val.blockNumber === doc.blockNumber &&
                  val.logIndex < doc.logIndex)
              ) {
                return doc;
              }
              return val;
            }, documents[0]);
          }
        );

        return _.map(mostRecentTopics, this.processDoc.bind(this));
      });

      await this.saveDocuments(documentsByIdByTopic);
    }

    await this.syncStatus.setHighestSyncBlock(
      this.dbName,
      blocknumber,
      syncing
    );
    if (logs.length > 0 && !this.syncing) {
      this.augur.events.once(SubscriptionEventName.NewBlock, () => {
        this.augur.events.emit(`DerivedDB:updated:${this.name}`, { data: documentsByIdByTopic });
      });
    }

    return blocknumber;
  }

  // No-op by default. Can be overriden to provide custom document processing before being upserted into the DB.
  protected processDoc(log: ParsedLog): ParsedLog {
    return log;
  }

  async reset() {
    await this.syncStatus.setHighestSyncBlock(this.dbName, 0, false);
    await this.stateDB.dexieDB[this.dbName].clear();
  }
}
