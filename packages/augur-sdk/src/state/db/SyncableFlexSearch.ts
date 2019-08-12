import { Subscriptions } from "../../subscriptions";
import { augurEmitter } from "../../events";
import { SyncableDB } from "./SyncableDB";

// because flexsearch is a UMD type lib
const flexSearch = require('flexsearch');
import { Index, SearchOptions, SearchResults } from 'flexsearch';

export interface MarketFields {
  id: string;
  market: string;
  universe: string;
  marketCreator: string;
  category1: string;
  category2: string;
  category3: string;
  description: string;
  longDescription: string;
  resolutionSource: string;
  _scalarDenomination: string;
  start: Date;
  end: Date;
}

// Need this interface to access these items on the documents
interface MarketDataDoc extends PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> {
  market: string;
  universe: string;
  marketCreator: string;
  extraInfo: string;
}

export class SyncableFlexSearch {
  private syncableDB: SyncableDB;
  private flexSearchIndex: Index<MarketFields>;
  private readonly events = new Subscriptions(augurEmitter);
  constructor(syncableDB: SyncableDB) {
    this.events.subscribe('MarketCreated', this.sync);

    this.syncableDB = syncableDB;

    this.flexSearchIndex = flexSearch.create(
      {
        doc:
        {
          id: "id",
          start: "start",
          end: "end",
          field: [
              "market",
              "universe",
              "marketCreator",
              "category1",
              "category2",
              "category3",
              "description",
              "longDescription",
              "resolutionSource",
              "_scalarDenomination",
          ],
        },
      }
    );
  }

  async search(query: string, options?: SearchOptions): Promise<Array<SearchResults<MarketFields>>> {
    return this.flexSearchIndex.search(query, options);
  }

  async where(whereObj: {[key: string]: string}): Promise<Array<SearchResults<MarketFields>>> {
    return this.flexSearchIndex.where(whereObj);
  }

  async sync(): Promise<void> {
    if (this.flexSearchIndex) {
      const previousDocumentEntries = await this.syncableDB.allDocs();

      for (const row of previousDocumentEntries.rows) {
        if (row === undefined) {
          continue;
        }

        const doc = row.doc as MarketDataDoc;

        if (doc) {
          const market = doc.market ? doc.market : "";
          const universe = doc.universe ? doc.universe : "";
          const marketCreator = doc.marketCreator ? doc.marketCreator : "";
          let category1 = "";
          let category2 = "";
          let category3 = "";
          let description = "";
          let longDescription = "";
          let resolutionSource = "";
          let _scalarDenomination = "";

          const extraInfo = doc.extraInfo;
          if (extraInfo) {
            let info;
            try {
              info = JSON.parse(extraInfo);
            } catch (err) {
              console.error("Cannot parse document json: " + extraInfo);
            }

            if (info) {
              if (Array.isArray(info.categories)) {
                category1 = info.categories[0] ? info.categories[0] : "";
                category2 = info.categories[1] ? info.categories[1] : "";
                category3 = info.categories[2] ? info.categories[2] : "";
              }
              description = info.description ? info.description : "";
              longDescription = info.longDescription ? info.longDescription : "";
              resolutionSource = info.resolutionSource ? info.resolutionSource : "";
              _scalarDenomination = info._scalarDenomination ? info._scalarDenomination : "";
            }

            this.flexSearchIndex.add({
              id: row.id,
              market,
              universe,
              marketCreator,
              category1,
              category2,
              category3,
              description,
              longDescription,
              resolutionSource,
              _scalarDenomination,
              start: new Date(),
              end: new Date(),
            });
          }
        }
      }
    }
  }
}
