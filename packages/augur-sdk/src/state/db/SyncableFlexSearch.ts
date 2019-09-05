import { BigNumber } from 'bignumber.js';
import { MarketCreated } from "../../event-handlers";

// because flexsearch is a UMD type lib
const flexSearch = require('flexsearch');
import { Index, SearchOptions, Cursor } from 'flexsearch';
import { BaseDocument } from "./AbstractDB";

// @TODO remove and replace with flexsearch type once they release
// @BODY See: https://github.com/nextapps-de/flexsearch/blob/master/index.d.ts#L49
interface SearchResults<T> {
  page?: Cursor;
  next?: Cursor;
  result: T[];
}

export interface MarketCreatedDoc extends MarketCreated, BaseDocument {}

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

  async search(query: string, options?: SearchOptions): Promise<MarketFields[]> {
    return this.flexSearchIndex.search(query, options) as unknown as Promise<MarketFields[]>;
  }

  async where(whereObj: {[key: string]: string}): Promise<MarketFields[]> {
    return this.flexSearchIndex.where(whereObj) as unknown as Promise<MarketFields[]>;
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
            // Normalize categories
            category1 = (info.categories[0] ? info.categories[0] : "").toUpperCase();
            category2 = (info.categories[1] ? info.categories[1] : "").toUpperCase();
            category3 = (info.categories[2] ? info.categories[2] : "").toUpperCase();
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
      });
    }
  }

  async removeMarketCreatedDocs(marketCreatedDocs: BaseDocument[]) {
    for (const marketCreatedDoc of marketCreatedDocs) {
      if (marketCreatedDoc._id) {
        // tslint:disable-next-line:ban
        await this.flexSearchIndex.remove(parseInt(marketCreatedDoc._id, 10));
      }
    }
  }
}
