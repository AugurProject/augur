import { MarketCreated } from '../../event-handlers';

// because flexsearch is a UMD type lib
const flexSearch = require('flexsearch');
import { Index, SearchOptions, SearchResults } from 'flexsearch';

export interface MarketCreatedDoc extends MarketCreated {
   _id: string;
   _rev?: string;
}

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
  backupSource: string;
  _scalarDenomination: string;
  start: Date;
  end: Date;
}
export class SyncableFlexSearch {
  private flexSearchIndex: Index<MarketFields>;
  constructor() {
    this.flexSearchIndex = flexSearch.create(
      {
        async: true,
        cache: true,
        worker: false, // TODO: Check impact on performance before enabling worker option in FlexSearch
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
            "backupSource",
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

  async addMarketCreatedDocs(marketCreatedDocs: MarketCreatedDoc[]) {
    for (const marketCreatedDoc of marketCreatedDocs) {
      let category1 = "";
      let category2 = "";
      let category3 = "";
      let description = "";
      let longDescription = "";
      let resolutionSource = "";
      let backupSource = "";
      let _scalarDenomination = "";

      // Parse extraInfo string
      const extraInfo = marketCreatedDoc.extraInfo;
      if (extraInfo) {
        let info;
        try {
          info = JSON.parse(extraInfo);
        } catch (err) {
          console.error("Cannot parse document json: " + extraInfo);
        }

        if (info) {
          if (Array.isArray(info.categories)) {
            category1 = info.categories[0] ? info.categories[0].toString().toLowerCase() : "";
            category2 = info.categories[1] ? info.categories[1].toString().toLowerCase() : "";
            category3 = info.categories[2] ? info.categories[2].toString().toLowerCase() : "";
          }
          description = info.description ? info.description : "";
          longDescription = info.longDescription ? info.longDescription : "";
          resolutionSource = info.resolutionSource ? info.resolutionSource : "";
          backupSource = info.backupSource ? info.backupSource : "";
          _scalarDenomination = info._scalarDenomination ? info._scalarDenomination : "";
        }
      }

      await this.flexSearchIndex.add({
        id: marketCreatedDoc._id,
        market: marketCreatedDoc.market,
        universe: marketCreatedDoc.universe,
        marketCreator: marketCreatedDoc.marketCreator,
        category1,
        category2,
        category3,
        description,
        longDescription,
        resolutionSource,
        backupSource,
        _scalarDenomination,
        start: new Date(),
        end: new Date(),
      });
    }
  }

  async removeMarketCreatedDocs(marketCreatedDocs: any[]) {
    for (const marketCreatedDoc of marketCreatedDocs) {
      if (marketCreatedDoc._id) {
        await this.flexSearchIndex.remove(marketCreatedDoc._id);
      }
    }
  }
}
