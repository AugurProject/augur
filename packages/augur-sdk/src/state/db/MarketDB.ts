import * as _ from "lodash";
import { Augur } from "../../Augur";
import { DerivedDB } from "./DerivedDB";
import { DB } from "./DB";
import { Subscriptions } from "../../subscriptions";
import { augurEmitter } from "../../events";
import {
  CLAIM_GAS_COST,
  DEFAULT_GAS_PRICE_IN_GWEI,
  EULERS_NUMBER,
  INVALID_OUTCOME,
  MAX_TRADE_GAS_PERCENTAGE_DIVISOR,
  MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI,
  SECONDS_IN_YEAR,
  WORST_CASE_FILL,
} from "../../constants";
import { MarketData, MarketType, OrderType } from "../logs/types";
import { BigNumber } from "bignumber.js";
import { Orderbook } from "../../api/Liquidity";

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

interface MarketOrderbookData {
  _id: string;
  invalidFilter: boolean;
  liquidity: LiquidityResults;
}

interface LiquidityResults {
  [liquidity: number]: number;
}

/**
 * Market specific derived DB intended for filtering purposes
 */
export class MarketDB extends DerivedDB {
  protected augur: Augur;
  private readonly events = new Subscriptions(augurEmitter);
  private flexSearchIndex: Index<MarketFields>;
  readonly liquiditySpreads = [10, 15, 20, 100];

  constructor(db: DB, networkId: number, augur: Augur) {
    super(db, networkId, "Markets", ["MarketCreated", "MarketVolumeChanged", "MarketOIChanged"], ["market"]);

    this.augur = augur;

    this.events.subscribe('DerivedDB:updated:CurrentOrders', this.syncOrderBooks);
    this.flexSearchIndex = flexSearch.create(
      {
        doc: {
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

  async doSync(highestAvailableBlockNumber: number): Promise<void> {
    await super.doSync(highestAvailableBlockNumber);
    await this.syncOrderBooks(true);
    await this.syncFullTextSearch();
  }

  syncOrderBooks = async (syncing: boolean): Promise<void> => {
    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
    let success = true;
    const documents = [];
    const request = {
      selector: {
        blockNumber: { $gte: highestSyncedBlockNumber },
      },
    };

    const result = await this.stateDB.findInDerivedDB(this.stateDB.getDatabaseName("CurrentOrders"), request);

    if (result.docs.length < 1) return;

    const marketIds: string[] = _.uniq(_.map(result.docs, "market")) as string[];
    const highestBlockNumber: number = _.max(_.map(result.docs, "blockNumber")) as number;
    const marketsData = await this.stateDB.findMarkets({
      selector: {
        market: { $in: marketIds },
      },
    });

    const marketDataById = _.keyBy(marketsData, "market");

    const reportingFeeDivisor = await this.augur.contracts.universe.getReportingFeeDivisor_();
    // TODO Get ETH -> DAI price via uniswap when we integrate that as an oracle
    const ETHInAttoDAI = new BigNumber(200).multipliedBy(10**18);

    for (const marketId of marketIds) {
      documents.push(await this.getOrderbookData(this.augur, marketId, marketDataById[marketId], reportingFeeDivisor, ETHInAttoDAI));
    }

    success = await this.bulkUpsertUnorderedDocuments(documents);

    if (success) {
      if (!syncing) {
        await this.syncStatus.setHighestSyncBlock(this.dbName, highestBlockNumber, false);
      }
    } else {
      throw new Error(`Syncing market orderbook liquidity stats failed`);
    }
  }

  async getOrderbookData(augur: Augur, marketId: string, marketData: MarketData, reportingFeeDivisor: BigNumber, ETHInAttoDAI: BigNumber): Promise<MarketOrderbookData> {
    const numOutcomes = marketData.marketType === MarketType.Categorical ? marketData.outcomes.length + 1 : 3;
    const estimatedTradeGasCost = WORST_CASE_FILL[numOutcomes];
    const estimatedGasCost = ETHInAttoDAI.multipliedBy(DEFAULT_GAS_PRICE_IN_GWEI).div(10**9);
    const estimatedTradeGasCostInAttoDai = estimatedGasCost.multipliedBy(estimatedTradeGasCost);
    const estimatedClaimGasCostInAttoDai = estimatedGasCost.multipliedBy(CLAIM_GAS_COST);
    const marketFeeDivisor = new BigNumber(marketData.feeDivisor);
    const numTicks = new BigNumber(marketData.numTicks);

    const feeMultiplier = new BigNumber(1).minus(new BigNumber(1).div(reportingFeeDivisor)).minus(new BigNumber(1).div(marketFeeDivisor));

    const orderbook = await this.getOrderbook(marketData, numOutcomes, estimatedTradeGasCostInAttoDai);

    const invalidFilter = await this.recalcInvalidFilter(orderbook, marketData, feeMultiplier, estimatedTradeGasCostInAttoDai, estimatedClaimGasCostInAttoDai);

    const marketOrderbookData = {
      _id: marketId,
      invalidFilter,
      liquidity: {},
    };

    for (const spread of this.liquiditySpreads) {
      marketOrderbookData.liquidity[spread] = (await this.augur.liquidity.getLiquidityForSpread({
        orderbook,
        numTicks,
        marketType: marketData.marketType,
        reportingFeeDivisor,
        marketFeeDivisor,
        numOutcomes,
        spread,
      })).toFixed();
    }

    return marketOrderbookData;
  }

  async getOrderbook(marketData: MarketData, numOutcomes: number, estimatedTradeGasCostInAttoDai: BigNumber): Promise<Orderbook> {
    const currentOrdersResponse = await this.stateDB.findCurrentOrderLogs({
      selector : {
        amount: { $gt: '0x00' },
        eventType: { $ne: 1 },
      },
    });

    const currentOrdersByOutcome = _.groupBy(currentOrdersResponse, (order) => new BigNumber(order.outcome).toNumber());
    for (let outcome = 0; outcome < numOutcomes; outcome++) {
      if (currentOrdersByOutcome[outcome] === undefined) currentOrdersByOutcome[outcome] = [];
    }

    const outcomeBidAskOrders = _.map(currentOrdersByOutcome, (outcomeOrders) => {
      // Cut out orders where gas costs > 1% of the trade
      const sufficientlyLargeOrders = _.filter(outcomeOrders, (order) => {
        const maxGasCost = new BigNumber(order.amount).multipliedBy(marketData.numTicks).div(MAX_TRADE_GAS_PERCENTAGE_DIVISOR);
        return maxGasCost.gte(estimatedTradeGasCostInAttoDai);
      });

      const groupedByOrderType = _.groupBy(sufficientlyLargeOrders, "orderType");

      const bids = _.reverse(_.sortBy(groupedByOrderType[OrderType.Bid], "price"));
      const asks = _.sortBy(groupedByOrderType[OrderType.Ask], "price");

      return {
        bids,
        asks,
      };
    });
    return outcomeBidAskOrders;
  }

  // A Market is marked as True in the invalidFilter if the best bid for Invalid on the book would not be profitable to take were the market Valid
  async recalcInvalidFilter(orderbook: Orderbook, marketData: MarketData, feeMultiplier: BigNumber, estimatedTradeGasCostInAttoDai: BigNumber, estimatedClaimGasCostInAttoDai: BigNumber): Promise<boolean> {
    if (orderbook[INVALID_OUTCOME].bids.length < 1) return false;

    const bestBid = orderbook[INVALID_OUTCOME].bids[0];

    const bestBidAmount = new BigNumber(bestBid.amount);
    const bestBidPrice = new BigNumber(bestBid.price);
    const numTicks = new BigNumber(marketData.numTicks);

    let timeTillMarketFinalizesInSeconds = new BigNumber(marketData.endTime).minus((new Date).getTime()/1000);
    if (timeTillMarketFinalizesInSeconds.lt(0)) timeTillMarketFinalizesInSeconds = new BigNumber(0);
    const timeTillMarketFinalizesInYears = timeTillMarketFinalizesInSeconds.div(SECONDS_IN_YEAR);

    let validRevenue = bestBidAmount.multipliedBy(numTicks);
    validRevenue = validRevenue.multipliedBy(feeMultiplier);
    validRevenue = validRevenue.multipliedBy((EULERS_NUMBER ** timeTillMarketFinalizesInYears.multipliedBy(-.15).precision(14).toNumber()).toPrecision(14));
    validRevenue = validRevenue.minus(estimatedTradeGasCostInAttoDai).minus(estimatedClaimGasCostInAttoDai);

    const validCost = bestBidAmount.multipliedBy(numTicks.minus(bestBidPrice));

    const validProfit = validRevenue.minus(validCost);

    return validProfit.gt(MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI);
  }

  async search(query: string, options?: SearchOptions): Promise<Array<SearchResults<MarketFields>>> {
    return this.flexSearchIndex.search(query, options);
  }

  async where(whereObj: {[key: string]: string}): Promise<Array<SearchResults<MarketFields>>> {
    return this.flexSearchIndex.where(whereObj);
  }

  // TODO: This function is only made public as a hack until flexSearch is made into a separate module
  public async syncFullTextSearch(): Promise<void> {
    if (this.flexSearchIndex) {
      const previousDocumentEntries = await this.db.allDocs({ include_docs: true });

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
