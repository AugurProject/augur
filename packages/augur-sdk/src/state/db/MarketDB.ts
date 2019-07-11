import * as _ from "lodash";
import { DerivedDB } from "./DerivedDB";
import { DB } from "./DB";
import { toAscii } from "../utils/utils";

// Need this interface to access these items on the documents
interface MarketDataDoc extends PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> {
  market: string;
  topic: string;
  extraInfo: string;
}

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");

/**
 * Market specific derived DB intended for filtering purposes
 */
export class MarketDB extends DerivedDB {
  private flexSearch?: FlexSearch;

  constructor(db: DB, networkId: number) {
    super(db, networkId, "Markets", ["MarketCreated", "MarketVolumeChanged", "MarketOIChanged"], ["market"]);
    // TODO Register callback after CurrentOrders is updated during blockstream. Use augurEmitter to subscribe to it and do post processing on the orderbook.

    this.flexSearch = new FlexSearch({
      doc: {
        id: "id",
        start: "start",
        end: "end",
        field: [
          "market",
          "topic",
          "description",
          "longDescription",
          "resolutionSource",
          "_scalarDenomination",
          "tags"
        ],
      },
    });
  }

  public async sync(highestAvailableBlockNumber: number): Promise<void> {
    await super.sync(highestAvailableBlockNumber);
    // TODO Do post processing on orderbook
    await this.syncFullTextSearch();
  }

  public fullTextSearch(query: string): Array<object> {
    if (this.flexSearch) {
      return this.flexSearch.search(query);
    }
    return [];
  }

  private async syncFullTextSearch(): Promise<void> {
    if (this.flexSearch) {
      const previousDocumentEntries = await this.db.allDocs({ include_docs: true });

      for (let row of previousDocumentEntries.rows) {
        if (row === undefined) {
          continue;
        }

        const doc = row.doc as MarketDataDoc;

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
}
