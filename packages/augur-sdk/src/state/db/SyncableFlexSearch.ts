import { MarketData } from '../logs/types';

// because flexsearch is a UMD type lib
const flexSearch = require('flexsearch');
import { Index, SearchOptions, SearchResults } from 'flexsearch';
import Dexie from 'dexie';

export interface MarketFields {
  market: string;
  universe: string;
  marketCreator: string;
  category1: string;
  category2: string;
  category3: string;
  description: string;
  longDescription: string;
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
          id: "market",
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

  async addMarketCreatedDocs(marketCreatedDocs: MarketData[]) {
    for (const marketCreatedDoc of marketCreatedDocs) {
      let category1 = "";
      let category2 = "";
      let category3 = "";
      let description = "";
      let longDescription = "";
      let _scalarDenomination = "";

      // Handle extraInfo
      const info = marketCreatedDoc.extraInfo;

      if (info) {
        if (Array.isArray(info.categories)) {
          category1 = info.categories[0] ? info.categories[0].toString().toLowerCase() : "";
          category2 = info.categories[1] ? info.categories[1].toString().toLowerCase() : "";
          category3 = info.categories[2] ? info.categories[2].toString().toLowerCase() : "";
        }
        description = info.description ? info.description : "";
        longDescription = info.longDescription ? info.longDescription : "";
        _scalarDenomination = info._scalarDenomination ? info._scalarDenomination : "";
      }

      await this.flexSearchIndex.add({
        market: marketCreatedDoc.market,
        universe: marketCreatedDoc.universe,
        marketCreator: marketCreatedDoc.marketCreator,
        category1,
        category2,
        category3,
        description,
        longDescription,
        _scalarDenomination,
        start: new Date(),
        end: new Date(),
      });
    }
  }

  async removeMarketCreatedDocs(marketCreatedDocs: Dexie.Collection<any, any>) {
    await marketCreatedDocs.each(async (marketCreatedDoc) => {
      if (marketCreatedDoc.market) {
        await this.flexSearchIndex.remove(marketCreatedDoc.market);
      }
    });
  }
}
