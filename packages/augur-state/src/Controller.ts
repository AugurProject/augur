import { Augur } from "@augurproject/api";
import settings from "./settings.json";
import { PouchDBFactoryType } from "./db/AbstractDB";
import { DB } from "./db/DB";
import {BlockAndLogStreamerListener} from "./db/BlockAndLogStreamerListener";

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");

// Need this interface to access these items on the documents in a SyncableDB
interface SyncableMarketDataDoc extends PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> {
  extraInfo: string
  description: string
}

export class Controller<TBigNumber> {
  private dbController: DB<TBigNumber>;
  private FTS: FlexSearch;

  public constructor (
    private augur: Augur<TBigNumber>,
    private networkId: number,
    private blockstreamDelay: number,
    private defaultStartSyncBlockNumber: number,
    private trackedUsers: Array<string>,
    private pouchDBFactory: PouchDBFactoryType,
    private blockAndLogStreamerListener: BlockAndLogStreamerListener
) {
    this.FTS = FlexSearch.create({ doc: {
      id: "id",
      start: "start",
      end: "end",
      field: [
        "title",
        "description",
        "tags",
      ]}});
    }

  public async run(): Promise<void> {
    try {
      this.dbController = await DB.createAndInitializeDB(
        this.networkId,
        this.blockstreamDelay,
        this.defaultStartSyncBlockNumber,
        this.trackedUsers,
        this.augur.genericEventNames,
        this.augur.userSpecificEvents,
        this.pouchDBFactory,
        this.blockAndLogStreamerListener
      );
      await this.dbController.sync(
        this.augur,
        settings.chunkSize,
        settings.blockstreamDelay
      );

      const previousDocumentEntries = await this.dbController.getSyncableDatabase(this.dbController.getDatabaseName("MarketCreated")).allDocs();
      for (let row of previousDocumentEntries.rows) {
        if (row === undefined) {
          continue;
        }

        const doc  = row.doc as SyncableMarketDataDoc;

        if (doc) {
          const extraInfo = doc.extraInfo;
          const description = doc.description;

          if (extraInfo && description) {
            const info = JSON.parse(extraInfo);

            if (info && info.tags && info.longDescription) {
              this.FTS.add({
                id: row.id,
                Title: description,
                description: info.longDescription,
                tags: info.tags.toString(), // convert to comma separated so it is searchable
                start: new Date(),
                end: new Date()
              });
            }
          }
        }
      }

      // TODO begin server process
    } catch (err) {
      console.log(err);
    }
  }
}
