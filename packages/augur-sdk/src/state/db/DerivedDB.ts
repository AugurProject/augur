import * as _ from 'lodash';
import { AbstractDB, BaseDocument } from './AbstractDB';
import { SyncStatus } from './SyncStatus';
import { Log, ParsedLog } from '@augurproject/types';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { sleep } from '../utils/utils';
import { augurEmitter } from '../../events';

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

  constructor(
    db: DB,
    networkId: number,
    name: string,
    mergeEventNames: string[],
    idFields: string[]
  ) {
    super(networkId, db.getDatabaseName(name), db.pouchDBFactory);
    this.syncStatus = db.syncStatus;
    this.idFields = idFields;
    this.mergeEventNames = mergeEventNames;
    this.stateDB = db;
    this.name = name;
    this.db.createIndex({
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
      await this.handleMergeEvent(
        highestAvailableBlockNumber,
        (result.docs as unknown[]) as ParsedLog[],
        true
      );
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
    if (logs.length > 0) {
      const documents = _.map<ParsedLog, ParsedLog>(logs, this.processLog.bind(this));
      const documentsById = _.groupBy(documents, '_id');
      const documentsByIdByTopic = _.flatMap(documentsById, idDocuments => {
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
        return _.assign({}, ...mostRecentTopics);
      }) as any[];

      success = await this.bulkUpsertUnorderedDocuments(documentsByIdByTopic);
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
        augurEmitter.emit(`DerivedDB:updated:${this.name}`);
      }
    } else {
      throw new Error(`Unable to add new block`);
    }

    return blocknumber;
  };

  protected processLog(log: Log): BaseDocument {
    let _id = '';
    delete log['_id'];
    delete log['_rev'];
    for (const fieldName of this.idFields) {
      _id += _.get(log, fieldName);
    }
    if (log['addressData']) {
      log['kycToken'] = log['addressData'][0];
      log['orderCreator'] = log['addressData'][1];
      log['orderFiller'] = log['addressData'][2];
      delete log['addressData'];
    }
    if (log['uint256Data']) {
      log['price'] = log['uint256Data'][0];
      log['amount'] = log['uint256Data'][1];
      log['outcome'] = log['uint256Data'][2];
      log['tokenRefund'] = log['uint256Data'][3];
      log['sharesRefund'] = log['uint256Data'][4];
      log['fees'] = log['uint256Data'][5];
      log['amountFilled'] = log['uint256Data'][6];
      log['timestamp'] = log['uint256Data'][7];
      log['sharesEscrowed'] = log['uint256Data'][8];
      log['tokensEscrowed'] = log['uint256Data'][9];
      delete log['uint256Data'];
    }
    return Object.assign({ _id }, log);
  }
}
