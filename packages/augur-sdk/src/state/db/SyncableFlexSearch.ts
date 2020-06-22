import { MarketData } from '@augurproject/sdk-lite';
import Dexie from 'dexie';
import { Index, SearchOptions, SearchResults } from 'flexsearch';

// because flexsearch is a UMD type lib
const flexSearch = require('flexsearch');

export interface MarketFields {
  market: string;
  universe: string;
  category1: string;
  category2: string;
  category3: string;
  content: string;
}
export class SyncableFlexSearch {
  private flexSearchIndex: Index<MarketFields>;
  constructor() {
    this.flexSearchIndex = flexSearch.create({
      async: true,
      cache: true,
      worker: false, // TODO: Check impact on performance before enabling worker option in FlexSearch
      profile: 'match',
      doc: {
        id: 'market',
        field: {
          market: {
            encode: 'icase',
          },
          universe: {
            encode: 'icase',
          },
          category1: {
            profile: 'fast',
          },
          category2: {
            profile: 'fast',
          },
          category3: {
            profile: 'fast',
          },
          content: {
            encode: 'extra',
            tokenize: 'reverse',
            threshold: 7,
          },
        },
      },
    });
  }

  async search(
    query: string,
    options?: SearchOptions
  ): Promise<Array<SearchResults<MarketFields>>> {
    return this.flexSearchIndex.search({ query, ...options });
  }

  async where(whereObj: {
    [key: string]: string;
  }): Promise<Array<SearchResults<MarketFields>>> {
    return this.flexSearchIndex.where(whereObj);
  }

  async addMarketCreatedDocs(marketCreatedDocs: MarketData[]) {
    for (const marketCreatedDoc of marketCreatedDocs) {
      let category1 = '';
      let category2 = '';
      let category3 = '';
      let description = '';
      let longDescription = '';
      let _scalarDenomination = '';
      let outcomes = '';

      // Handle extraInfo
      const info = marketCreatedDoc.extraInfo;

      if (info) {
        if (Array.isArray(info.categories)) {
          category1 = info.categories[0]
            ? info.categories[0].toString().toLowerCase()
            : '';
          category2 = info.categories[1]
            ? info.categories[1].toString().toLowerCase()
            : '';
          category3 = info.categories[2]
            ? info.categories[2].toString().toLowerCase()
            : '';
        }
        description = info.description ? info.description : '';
        longDescription = info.longDescription ? info.longDescription : '';
        _scalarDenomination = info._scalarDenomination
          ? info._scalarDenomination
          : '';
      }
      if (marketCreatedDoc.outcomes) {
        outcomes = marketCreatedDoc.outcomes.join(' ');
      }
      const content = [
        outcomes,
        description,
        longDescription,
        _scalarDenomination,
        marketCreatedDoc.marketCreator,
      ].join(' ');
      await this.flexSearchIndex.add({
        market: marketCreatedDoc.market,
        universe: marketCreatedDoc.universe,
        category1,
        category2,
        category3,
        content,
      });
    }
  }

  async removeMarketCreatedDocs(marketCreatedDocs: Dexie.Collection<any, any>) {
    await marketCreatedDocs.each(async marketCreatedDoc => {
      if (marketCreatedDoc.market) {
        await this.flexSearchIndex.remove(marketCreatedDoc.market);
      }
    });
  }
}
