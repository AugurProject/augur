import { AbstractDB, BaseDocument } from "./AbstractDB";
import { Augur } from "../../Augur";
import { Log, ParsedLog } from "@augurproject/types";
import { DB } from "./DB";
import { SyncStatus } from "./SyncStatus";
import { toAscii } from "../utils/utils";
import * as _ from "lodash";

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");

// Need this interface to access these items on the documents in a SyncableDB
interface SyncableMarketDataDoc extends PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> {
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
  protected eventName: string;
  protected contractName: string; // TODO Remove if unused
  private syncStatus: SyncStatus;
  private idFields: Array<string>;
  private flexSearch?: FlexSearch;

  constructor(
    db: DB,
    networkId: number,
    eventName: string,
    dbName: string = db.getDatabaseName(eventName),
    idFields: Array<string> = [],
    fullTextSearchOptions?: object
  ) {
    super(networkId, dbName, db.pouchDBFactory);
    this.eventName = eventName;
    this.syncStatus = db.syncStatus;
    this.idFields = idFields;
    // TODO Set other indexes as need be
    this.db.createIndex({
      index: {
        fields: ['blockNumber']
      }
    });
    db.notifySyncableDBAdded(this);
    db.registerEventListener(this.eventName, this.addNewBlock);

    if (fullTextSearchOptions) {
      this.flexSearch = new FlexSearch(fullTextSearchOptions);
    }
  }

  public async createIndex(indexOptions: PouchDB.Find.CreateIndexOptions): Promise<PouchDB.Find.CreateIndexResponse<{}>> {
    return this.db.createIndex(indexOptions);
  }

  public async getIndexes(): Promise<PouchDB.Find.GetIndexesResponse<{}>> {
    return this.db.getIndexes();
  }

  public async sync(augur: Augur, chunkSize: number, blockStreamDelay: number, highestAvailableBlockNumber: number): Promise<void> {
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
    const goalBlock = highestAvailableBlockNumber - blockStreamDelay;
    while (highestSyncedBlockNumber < goalBlock) {
      const endBlockNumber = Math.min(highestSyncedBlockNumber + chunkSize, highestAvailableBlockNumber);
      const logs = await this.getLogs(augur, highestSyncedBlockNumber, endBlockNumber);
      highestSyncedBlockNumber = await this.addNewBlock(endBlockNumber, logs);
    }

    this.syncFullTextSearch();

    // TODO Make any external calls as needed (such as pushing user's balance to UI)
  }

  private async syncFullTextSearch(): Promise<void> {
    if (this.flexSearch) {
      const previousDocumentEntries = await this.db.allDocs({include_docs: true});

      for (let row of previousDocumentEntries.rows) {
        if (row === undefined) {
          continue;
        }

        const doc = row.doc as SyncableMarketDataDoc;

        if (doc) {
          const market = doc.market ? doc.market : "";
          const topic = doc.topic ? toAscii(doc.topic) : ""; // convert hex to ascii so it is searchable

          let description = "";
          let longDescription = "";
          let resolutionSource = "";
          let _scalarDenomination = "";
          let tags = "";

          const extraInfo = doc.extraInfo;
          if (extraInfo) {
            let info;
            try {
              info = JSON.parse(extraInfo);
            } catch (err) {
              console.error("Cannot parse document json: " + extraInfo);
            }

            if (info) {
              description = info.description ? info.description : "";
              longDescription = info.longDescription ? info.longDescription : "";
              resolutionSource = info.resolutionSource ? info.resolutionSource : "";
              _scalarDenomination = info._scalarDenomination ? info._scalarDenomination : "";
              tags = info.tags ? info.tags.toString() : ""; // convert to comma separated so it is searchable
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

  public addNewBlock = async (blocknumber: number, logs: Array<ParsedLog>): Promise<number> => {
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);

    let success = true;
    let documents;
    if (logs.length > 0) {
      documents = _.map(logs, this.processLog.bind(this));
      // If this is a table which is keyed by fields (meaning we are doing updates to a value instead of pulling in a history of events) we only want the most recent document for any given id
      if (this.idFields.length > 0) {
        documents = _.values(_.mapValues(_.groupBy(documents, "_id"), (idDocuments) => {
          return _.reduce(idDocuments, (val, doc) => {
            if (val.blockNumber < doc.blockNumber) {
              val = doc;
            } else if (val.blockNumber === doc.blockNumber && val.logIndex < doc.logIndex) {
              val = doc;
            }
            return val;
          }, idDocuments[0]);
        }));
      }
      documents = _.sortBy(documents, "_id");
      success = await this.bulkUpsertDocuments(documents[0]._id, documents);
    }
    if (success) {
      await this.syncStatus.setHighestSyncBlock(this.dbName, blocknumber);
    } else {
      throw new Error(`Unable to add new block`);
    }

    return blocknumber;
  }

  public async rollback(blockNumber: number): Promise<void> {
    if (this.idFields.length > 0) {
      await this.revisionRollback(blockNumber);
    } else {
      await this.documentRollback(blockNumber);
    }
  }

  private async documentRollback(blockNumber: number): Promise<void> {
    // Remove each change from blockNumber onward
    try {
      let blocksToRemove = await this.db.find({
        selector: { blockNumber: { $gte: blockNumber } },
        fields: ['_id', 'blockNumber', '_rev'],
      });
      for (let doc of blocksToRemove.docs) {
        await this.db.remove(doc._id, doc._rev);
      }
      await this.syncStatus.setHighestSyncBlock(this.dbName, --blockNumber);
    } catch (err) {
      console.error(err);
    }
  }

  private async revisionRollback(blockNumber: number): Promise<void> {
    try {
      let blocksToRemove = await this.db.find({
        selector: { blockNumber: { $gte: blockNumber } },
        fields: ['_id'],
      });
      for (let doc of blocksToRemove.docs) {
        const revDocs = await this.db.get<Document>(doc._id, {
          open_revs: 'all',
          revs: true
        });
        // If a revision exists before this blockNumber make that the new record, otherwise simply delete the doc.
        const replacementDoc = _.maxBy(_.remove(revDocs, (doc) => { return doc.ok.blockNumber > blockNumber; }), "ok.blockNumber");
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

  protected async getLogs(augur: Augur, startBlock: number, endBlock: number): Promise<Array<ParsedLog>> {
    return augur.events.getLogs(this.eventName, startBlock, endBlock);
  }

  protected processLog(log: Log): BaseDocument {
    if (!log.blockNumber) throw new Error(`Corrupt log: ${JSON.stringify(log)}`);
    let _id = "";
    if (this.idFields.length > 0) {
      // need to preserve order of fields in id
      for (let fieldName of this.idFields) {
        _id += _.get(log, fieldName);
      }
    } else {
      _id = `${(log.blockNumber + 10000000000).toPrecision(21)}${log.logIndex}`;
    }
    return Object.assign(
      { _id },
      log
    );
  }

  public fullTextSearch(query: string): Array<object> {
    if (this.flexSearch) {
      return this.flexSearch.search(query);
    }
    return [];
  }
}
