import * as _ from 'lodash';
import { AbstractDB, BaseDocument } from './AbstractDB';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { Log, ParsedLog } from '@augurproject/types';
import { SubscriptionEventName } from '../../constants';
import { SyncStatus } from './SyncStatus';
import { augurEmitter } from '../../events';
import { toAscii } from '../utils/utils';

// because flexsearch is a UMD type lib
import FlexSearch = require('flexsearch');

// Need this interface to access these items on the documents in a SyncableDB
interface SyncableMarketDataDoc
  extends PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> {
  market: string;
  topic: string;
  extraInfo: string;
}

export interface Document extends BaseDocument {
  blockNumber: number;
}

/**
 * Stores event logs for non-user-specific events.
 */
export class SyncableDB extends AbstractDB {
  protected contractName: string; // TODO Remove if unused
  private syncStatus: SyncStatus;
  private flexSearch?: FlexSearch;

  constructor(
    protected augur: Augur,
    db: DB,
    networkId: number,
    protected eventName: string,
    dbName: string = db.getDatabaseName(eventName),
    private idFields: string[] = [],
    protected additionalTopics: Array<Array<string | string[]>> = [],
    fullTextSearchOptions?: object
  ) {
    super(networkId, dbName, db.pouchDBFactory);
    this.augur = augur;
    this.eventName = eventName;
    this.syncStatus = db.syncStatus;
    this.idFields = idFields;
    // TODO Set other indexes as need be
    this.db.createIndex({
      index: {
        fields: ['blockNumber'],
      },
    });
    db.notifySyncableDBAdded(this);
    db.registerEventListener(
      this.eventName,
      this.addNewBlock,
      this.additionalTopics
    );

    if (fullTextSearchOptions) {
      this.flexSearch = new FlexSearch(fullTextSearchOptions);
    }
  }

  async createIndex(
    indexOptions: PouchDB.Find.CreateIndexOptions
  ): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
    return this.db.createIndex(indexOptions);
  }

  async getIndexes(): Promise<PouchDB.Find.GetIndexesResponse<{}>> {
    return this.db.getIndexes();
  }

  async sync(
    augur: Augur,
    chunkSize: number,
    blockStreamDelay: number,
    highestAvailableBlockNumber: number
  ): Promise<void> {
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

    this.syncFullTextSearch();

    // TODO Make any external calls as needed (such as pushing user's balance to UI)
  }

  private async syncFullTextSearch(): Promise<void> {
    if (this.flexSearch) {
      const previousDocumentEntries = await this.db.allDocs({
        include_docs: true,
      });

      for (const row of previousDocumentEntries.rows) {
        if (row === undefined) {
          continue;
        }

        const doc = row.doc as SyncableMarketDataDoc;

        if (doc) {
          const market = doc.market ? doc.market : '';
          const topic = doc.topic ? toAscii(doc.topic) : ''; // convert hex to ascii so it is searchable

          let description = '';
          let longDescription = '';
          let resolutionSource = '';
          let _scalarDenomination = '';
          let tags = '';

          const extraInfo = doc.extraInfo;
          if (extraInfo) {
            let info;
            try {
              info = JSON.parse(extraInfo);
            } catch (err) {
              console.error('Cannot parse document json: ' + extraInfo);
            }

            if (info) {
              description = info.description ? info.description : '';
              longDescription = info.longDescription
                ? info.longDescription
                : '';
              resolutionSource = info.resolutionSource
                ? info.resolutionSource
                : '';
              _scalarDenomination = info._scalarDenomination
                ? info._scalarDenomination
                : '';
              tags = info.tags ? info.tags.toString() : ''; // convert to comma separated so it is searchable
            }

            this.flexSearch.add({
              id: row.id,
              market,
              topic,
              description,
              longDescription,
              resolutionSource,
              _scalarDenomination,
              tags,
              start: new Date(),
              end: new Date(),
            });
          }
        }
      }
    }
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

  addNewBlock = async (
    blocknumber: number,
    logs: ParsedLog[]
  ): Promise<number> => {
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(
      this.dbName
    );

    if (this.eventName === 'OrderEvent') {
      this.parseLogArrays(logs);
    }

    let success = true;
    let documents;
    if (logs.length > 0) {
      documents = _.map(logs, this.processLog.bind(this));
      // If this is a table which is keyed by fields (meaning we are doing updates to a value instead of pulling in a history of events) we only want the most recent document for any given id
      if (this.idFields.length > 0) {
        documents = _.values(
          _.mapValues(_.groupBy(documents, '_id'), idDocuments => {
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
      documents = _.sortBy(documents, '_id');

      success = await this.bulkUpsertDocuments(documents[0]._id, documents);
    }
    if (success) {
      if (documents && (documents as any[]).length) {
        _.each(documents, (document: any) => {
          augurEmitter.emit(this.eventName, {
            eventName: this.eventName,
            ...document,
          });
        });
      }

      await this.syncStatus.setHighestSyncBlock(this.dbName, blocknumber);
    } else {
      throw new Error(`Unable to add new block`);
    }

    await this.notifyNewBlockEvent(blocknumber);

    return blocknumber;
  };

  notifyNewBlockEvent = async (blockNumber: number): Promise<void> => {
    if (blockNumber > (await this.syncStatus.getHighestSyncBlock())) {
      const highestAvailableBlockNumber = await this.augur.provider.getBlockNumber();
      const blocksBehindCurrent = highestAvailableBlockNumber - blockNumber;
      const percentBehindCurrent = (
        (blocksBehindCurrent / highestAvailableBlockNumber) *
        100
      ).toFixed(4);

      augurEmitter.emit(SubscriptionEventName.NewBlock, {
        eventName: SubscriptionEventName.NewBlock,
        highestAvailableBlockNumber,
        lastSyncedBlockNumber: blockNumber,
        blocksBehindCurrent,
        percentBehindCurrent,
      });
    }
  };

  async rollback(blockNumber: number): Promise<void> {
    if (this.idFields.length > 0) {
      await this.revisionRollback(blockNumber);
    } else {
      await this.documentRollback(blockNumber);
    }
  }

  private async documentRollback(blockNumber: number): Promise<void> {
    // Remove each change from blockNumber onward
    try {
      const blocksToRemove = await this.db.find({
        selector: { blockNumber: { $gte: blockNumber } },
        fields: ['_id', 'blockNumber', '_rev'],
      });
      for (const doc of blocksToRemove.docs) {
        await this.db.remove(doc._id, doc._rev);
      }
      await this.syncStatus.setHighestSyncBlock(this.dbName, --blockNumber);
    } catch (err) {
      console.error(err);
    }
  }

  private async revisionRollback(blockNumber: number): Promise<void> {
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
      await this.syncStatus.setHighestSyncBlock(this.dbName, --blockNumber);
    } catch (err) {
      console.error(err);
    }
  }

  protected async getLogs(
    augur: Augur,
    startBlock: number,
    endBlock: number
  ): Promise<ParsedLog[]> {
    return augur.events.getLogs(this.eventName, startBlock, endBlock);
  }

  protected processLog(log: Log): BaseDocument {
    if (!log.blockNumber)
      throw new Error(`Corrupt log: ${JSON.stringify(log)}`);
    let _id = '';
    // TODO: This works in bulk sync currently because we process logs chronologically. When we switch to reverse chrono for bulk sync we'll need to add more logic
    if (this.idFields.length > 0) {
      // need to preserve order of fields in id
      for (const fieldName of this.idFields) {
        _id += _.get(log, fieldName);
      }
    } else {
      _id = `${(log.blockNumber + 10000000000).toPrecision(21)}${log.logIndex}`;
    }
    return Object.assign({ _id }, log);
  }

  fullTextSearch(query: string): object[] {
    if (this.flexSearch) {
      return this.flexSearch.search(query);
    }
    return [];
  }

  getFullEventName(): string {
    return this.eventName;
  }
}
