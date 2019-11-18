import * as _ from 'lodash';
import { Augur } from '../../Augur';
import { AbstractDB, BaseDocument } from './AbstractDB';
import { SyncStatus } from './SyncStatus';
import { Log, ParsedLog } from '@augurproject/types';
import { DB } from './DB';
import { sleep } from '../utils/utils';

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores derived data from multiple logs and post-log processing
 */
export class DerivedDB extends AbstractDB {
  protected syncStatus: SyncStatus;
  protected stateDB: DB;
  private idFields: string[];
  private mergeEventNames: string[];
  private name: string;
  private updatingHighestSyncBlock = false;
  protected requiresOrder: boolean = false;
  // For preventing race conditions between log-processing events and other
  // events like controller:new:block, with the assumption that log processing
  // should happen first.
  protected locks: {[name: string]: boolean} = {};
  protected readonly HANDLE_MERGE_EVENT_LOCK = 'handleMergeEvent';

  protected augur;

  constructor(
    db: DB,
    networkId: number,
    name: string,
    mergeEventNames: string[],
    idFields: string[],
    augur: Augur
  ) {
    super(networkId, db.getDatabaseName(name), db.pouchDBFactory);
    this.augur = augur;
    this.syncStatus = db.syncStatus;
    this.idFields = idFields;
    this.mergeEventNames = mergeEventNames;
    this.stateDB = db;
    this.name = name;
    this.createIndex({
      index: {
        fields: idFields,
      },
    });

    db.registerEventListener(mergeEventNames, this.handleMergeEvent);

    db.notifyDerivedDBAdded(this);
  }

  async sync(highestAvailableBlockNumber: number): Promise<void> {
    await this.doSync(highestAvailableBlockNumber);
    await this.syncStatus.setHighestSyncBlock(
      this.dbName,
      highestAvailableBlockNumber,
      true
    );
  }

  // For all mergable event types get any new documents we haven't pulled in and pull them in
  async doSync(highestAvailableBlockNumber: number): Promise<void> {
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(
      this.dbName
    );
    for (const eventName of this.mergeEventNames) {
      const request = {
        selector: {
          blockNumber: { $gte: highestSyncedBlockNumber },
        },
      };
      const result = await this.stateDB.findInSyncableDB(
        this.stateDB.getDatabaseName(eventName),
        request
      );
      if (result.docs) {
        await this.handleMergeEvent(
          highestAvailableBlockNumber,
          (result.docs as unknown[]) as ParsedLog[],
          true
        );
      }
    }

    await this.syncStatus.updateSyncingToFalse(this.dbName);
  }

  async rollback(blockNumber: number): Promise<void> {
    try {
      const blocksToRemove = await this.db.find({
        selector: { blockNumber: { $gte: blockNumber } },
        fields: ['_id'],
      });
      for (const doc of blocksToRemove.docs) {
        const revDocs = await this.db.get<Document>(doc._id, {
          open_revs: 'all',
          revs: true,
        });
        // If a revision exists before this blockNumber make that the new record, otherwise simply delete the doc.
        const replacementDoc = _.maxBy(
          _.remove(revDocs, doc => doc.ok.blockNumber > blockNumber),
          'ok.blockNumber'
        );
        if (replacementDoc) {
          await this.db.put(replacementDoc.ok);
        } else {
          await this.db.remove(doc._id, doc._rev);
        }
      }
      await this.syncStatus.setHighestSyncBlock(
        this.dbName,
        --blockNumber,
        false
      );
    } catch (err) {
      console.error(err);
    }
  }

  // For a group of documents/logs for a particular event type get the latest per id and update the DB documents for the corresponding ids
  handleMergeEvent = async (
    blocknumber: number,
    logs: ParsedLog[],
    syncing = false
  ): Promise<number> => {
    let success = true;
    let documentsByIdByTopic = null;
    if (logs.length > 0) {
      this.lock(this.HANDLE_MERGE_EVENT_LOCK);
      const documents = _.map<ParsedLog, ParsedLog>(logs, this.processLog.bind(this));
      const documentsById = _.groupBy(documents, '_id');
      documentsByIdByTopic = _.flatMap(documentsById, idDocuments => {
        const mostRecentTopics = _.flatMap(_.groupBy(idDocuments, 'topic'), documents => {
          return _.reduce(
            documents,
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
            documents[0]
          );
        });
        const processedDocs = _.map(mostRecentTopics, this.processDoc.bind(this));
        return _.assign({}, ...processedDocs);
      }) as any[];

      // NOTE: "!syncing" is because during bulk sync we can rely on the order of events provided as they are handled in sequence
      if (this.requiresOrder && !syncing) documentsByIdByTopic = _.sortBy(documentsByIdByTopic, ['blockNumber', 'logIndex']);
      success = await this.bulkUpsertUnorderedDocuments(documentsByIdByTopic);
      this.clearLocks();
    }

    if (success) {
      if (!syncing) {
        // The mutex behavior here is needed since a derived DB may be responding to multiple updates in parallel
        while (this.updatingHighestSyncBlock) {
          await sleep(10);
        }
        this.updatingHighestSyncBlock = true;
        await this.syncStatus.setHighestSyncBlock(
          this.dbName,
          blocknumber,
          syncing
        );
        this.updatingHighestSyncBlock = false;
        this.augur.getAugurEventEmitter().emit(`DerivedDB:updated:${this.name}`, { data: documentsByIdByTopic });
      }
    } else {
      throw new Error(`Unable to add new block`);
    }

    return blocknumber;
  };

  // Processes a log entry such that it can be classified and filtered appropriately for the Database
  protected processLog(log: Log): BaseDocument {
    let _id = '';
    delete log['_id'];
    delete log['_rev'];
    for (const fieldName of this.idFields) {
      _id += _.get(log, fieldName);
    }
    return Object.assign({ _id }, log);
  }

  // No-op by default. Can be overriden to provide custom document processing before being upserted into the DB.
  protected processDoc(log: ParsedLog): ParsedLog {
    return log;
  }

  protected lock(name: string) {
    this.locks[name] = true;
  }

  protected async waitOnLock(lock: string, maxTimeMS: number, periodMS: number): Promise<void> {
    for (let i = 0; i < (maxTimeMS / periodMS); i++) {
      if (!this.locks[lock]) {
        return;
      }
      await sleep(periodMS);
    }
    throw Error(`timeout: lock ${lock} on ${this.name} DB did not release after ${maxTimeMS}ms`);
  }

  protected clearLocks() {
    this.locks = {};
  }
}
