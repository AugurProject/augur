import * as _ from "lodash";
import { Augur } from "../../Augur";
import { DerivedDB } from "./DerivedDB";
import { DB } from "./DB";
import { Subscriptions } from '../../subscriptions';
import { augurEmitter } from '../../events';
import { toAscii } from "../utils/utils";
import {
  INVALID_OUTCOME,
  DEFAULT_GAS_PRICE_IN_GWEI,
  MAX_TRADE_GAS_PERCENTAGE_DIVISOR,
  WORST_CASE_FILL,
  EULERS_NUMBER,
  CLAIM_GAS_COST,
  SECONDS_IN_YEAR,
  MINIMUM_INVALID_ORDER_VALUE_IN_ATTO_DAI,
} from "../../constants";
import { Orderbook, OrderType, MarketData, MarketType } from "../logs/types";
import { BigNumber } from "bignumber.js";


// Need this interface to access these items on the documents
interface MarketDataDoc extends PouchDB.Core.ExistingDocument<PouchDB.Core.AllDocsMeta> {
  market: string;
  topic: string;
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

interface BidsAsksLiquidity {
  bids: number;
  asks: number;
}

interface HorizontalLiquidity {
  total: number;
  [outcome: number]: BidsAsksLiquidity;
}

interface LeftRightLiquidity {
  left: number;
  right: number;
}

interface VerticalLiquidity extends LeftRightLiquidity {
  [outcome: number]: LeftRightLiquidity;
}

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");

/**
 * Market specific derived DB intended for filtering purposes
 */
export class MarketDB extends DerivedDB {
  protected augur: Augur;
  private readonly events = new Subscriptions(augurEmitter);
  private flexSearch?: FlexSearch;

  constructor(db: DB, networkId: number, augur: Augur) {
    super(db, networkId, "Markets", ["MarketCreated", "MarketVolumeChanged", "MarketOIChanged"], ["market"]);
    
    this.augur = augur;

    this.events.subscribe('DerivedDB:updated:CurrentOrders', this.syncOrderBooks);

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

  public async doSync(highestAvailableBlockNumber: number): Promise<void> {
    await super.doSync(highestAvailableBlockNumber);
    await this.syncOrderBooks(true);
    await this.syncFullTextSearch();
  }

  public async syncOrderBooks(syncing: boolean): Promise<void> {
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(this.dbName);
    let success = true;
    let documents = [];
    const request = {
      selector: {
        blockNumber: { $gte: highestSyncedBlockNumber }
      }
    };

    const result = await this.stateDB.findInDerivedDB(this.stateDB.getDatabaseName("CurrentOrders"), request);
    
    if (result.docs.length < 1) return;

    const marketIds: Array<string> = _.uniq(_.map(result.docs, "market")) as Array<string>;
    const highestBlockNumber: number = _.max(_.map(result.docs, "blockNumber")) as number;
    const marketsData = await this.stateDB.findMarkets({
      selector: {
        market: { $in: marketIds }
      }
    });

    const marketDataById = _.keyBy(marketsData, "market");

    const reportingFeeDivisor = await this.augur.contracts.universe.getReportingFeeDivisor_();
    // TODO Get ETH -> DAI price via uniswap when we integrate that as an oracle
    const ETHInAttoDAI = new BigNumber(200).multipliedBy(10**18);

    for (const marketId of marketIds) {
      documents.push(await this.getOrderbookData(marketId, marketDataById[marketId], reportingFeeDivisor, ETHInAttoDAI));
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

  public async getOrderbookData(marketId: string, marketData: MarketData, reportingFeeDivisor: BigNumber, ETHInAttoDAI: BigNumber): Promise<MarketOrderbookData> {
    const numOutcomes = marketData.marketType == MarketType.Categorical ? marketData.outcomes.length : 3;
    const estimatedTradeGasCost = WORST_CASE_FILL[numOutcomes];
    const estimatedGasCost = ETHInAttoDAI.multipliedBy(DEFAULT_GAS_PRICE_IN_GWEI).div(10**9);
    const estimatedTradeGasCostInAttoDai = estimatedGasCost.multipliedBy(estimatedTradeGasCost);
    const estimatedClaimGasCostInAttoDai = estimatedGasCost.multipliedBy(CLAIM_GAS_COST);

    const orderbook = await this.getOrderbook(marketData, estimatedTradeGasCostInAttoDai);

    const invalidFilter = await this.recalcInvalidFilter(orderbook, marketData, reportingFeeDivisor, estimatedTradeGasCostInAttoDai, estimatedClaimGasCostInAttoDai);

    const liquidity10 = await this.recalcLiquidity(orderbook, marketData, 10);

    return {
      _id: marketId,
      invalidFilter,
      liquidity: {
        10: liquidity10
      },
    };
  }

  public async getOrderbook(marketData: MarketData, estimatedTradeGasCostInAttoDai: BigNumber): Promise<Orderbook> {
    const currentOrdersResponse = await this.stateDB.findCurrentOrderLogs({
      selector : {
        amount: { $gt: '0x00' },
        eventType: { $ne: 1 }
      }
    });

    const currentOrdersByOutcome = _.groupBy(currentOrdersResponse, "outcome");

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
      }
    });
    return outcomeBidAskOrders
  }

  // A Market is marked as True in the invalidFilter if the best bid for Invalid on the book would not be profitable to take were the market Valid
  public async recalcInvalidFilter(orderbook: Orderbook, marketData: MarketData, reportingFeeDivisor: BigNumber, estimatedTradeGasCostInAttoDai: BigNumber, estimatedClaimGasCostInAttoDai: BigNumber): Promise<boolean> {
    if (orderbook[INVALID_OUTCOME].bids.length < 1) return false;

    const bestBid = orderbook[INVALID_OUTCOME].bids[0];

    const bestBidAmount = new BigNumber(bestBid.amount);
    const bestBidPrice = new BigNumber(bestBid.price);
    const numTicks = new BigNumber(marketData.numTicks);
    const feeMultiplier = new BigNumber(1).minus(new BigNumber(1).div(reportingFeeDivisor)).minus(new BigNumber(1).div(marketData.feeDivisor));

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

  public async recalcLiquidity(orderbook: Orderbook, marketData: MarketData, spread: number): Promise<number> {
    const horizontalLiquidity = this.getHorizontalLiquidity(orderbook);
    const verticalLiquidity = this.getVerticalLiquidity(orderbook);

    let left_overlap = 0;
    let right_overlap = 0;
    // TS says outcome is a string??
    //for (const outcome in orderbook) {
    //  left_overlap += _.min([verticalLiquidity[outcome].left, horizontalLiquidity[outcome].bids]);
    //  right_overlap += _.min([verticalLiquidity[outcome].right, horizontalLiquidity[outcome].asks]);
    //}

    return verticalLiquidity.left + horizontalLiquidity.total + verticalLiquidity.right - left_overlap - right_overlap
  }

  public getHorizontalLiquidity(orderbook: Orderbook): HorizontalLiquidity {
    /*
    midpoint_liquidity = []
    For outcome in market:
          best_bid = get_best_bid(market, outcome)
          best_ask = get_best_ask(market, outcome)
          if(no_bid_exists or no_ask_exists):
              midpoint_liquidity = 0
              continue
          best_bid = best_bid / (1 - reporter_fee-creator_fee)
          best_ask = best_ask / (1 + reporter_fee+creator_fee)
          midpoint_price = (best_bid + best_ask)/2
          ask_price = midpoint_price + spread % * range/2
          bid_price = midpoint_price - spread % * range/2
    
          bid_quantities = 0
          ask_quantities = 0
          // for bids we get orders from the midpoint down to and inclusive of the bid price. For asks we get the orders from the midpoint *up to* inclusive of the ask price. 
          for order in get_orders_down_to_price(bids, outcome, bid_price): bid_quantities += order.quantity
          for order in get_orders_up_to_price(asks, outcome, ask_price): ask_quantities += order.quantity
          num_shares = min(ask_quantities, bid_quantities)
    
          raw_bid_value = 0
          raw_ask_value = 0
          // the getters return a dictionary of orders w/ quantity and price
          bid_quantity_gotten = 0
          ask_quantity_gotten = 0
          if(num_shares == 0):
              midpoint_liquidity = 0
          else:
              for order in get_orders_down_to_price(bids, outcome, bid_price):
                    if(order.quantity + bid_quantity_gotten > num_shares):
                         order.quantity = num_shares - bid_quantity_gotten
                    if(bid_quantity_gotten >= num_shares):
                      break
                    bid_value += order.quantity * order.price
                    raw_bid_value += order.quantity * (order.price - min)
                    bid_quantity_gotten += order.quantity
              for order in get_orders_up_to_price(asks, outcome, ask_price):
                    if(order.quantity + ask_quantity_gotten > num_shares):
                         order.quantity = num_shares - ask_quantity_gotten
                    if(ask_quantity_gotten >= num_shares):
                      break
                    ask_value += order.quantity * order.price
                    raw_ask_value += order.quantity * (max - order.price)
                    ask_quantity_gotten += order.quantity
              midpoint_liquidity[outcome].bids = raw_bid_value
              midpoint_liquidity[outcome].asks = raw_ask_value
    
    // sum midpoint liquidity across all outcomes
    horizontal_liquidity = sum(midpoint_liquidity bids and asks)
    */
    return {
      total: 3,
    };
  }

  public getVerticalLiquidity(orderbook: Orderbook): VerticalLiquidity {
/*
    bid_quantities = []
    bid_price = []
    bid_sum = 0
    ask_quantities = []
    ask_price = []
    ask_sum = 0
    if(binary or scalar):
      vertical_liquidity.left = 0
      vertical_liquidity.right = 0
    else:
      // for bids
      For outcome in market:
            best_bid = get_best_bid(market, outcome)
            if(no_best_bid):
              vertical_liquidity.left = 0
              break
            else:
              bid_price[outcome] = best_bid / (1 - reporter_fee-creator_fee)
              bid_sum += bid_price[outcome] - min
      excess_spread = bid_sum - range * (1 - spread %)
      // if liquidity > the spread % even at best bids or there is no best bid
      if(excess_spread <= 0 or bid_sum == 0):
        vertical_liquidity.left = 0
      else:
        bid_quantities = []
        for outcome in market:
              bid_price[outcome] = bid_price[outcome] - excess_spread/num_outcomes_excluding_skipped
              for order in get_orders_down_to_price(bids, outcome, bid_price[outcome]): bid_quantities[outcome] += order.quantity
        num_shares = min(bid_quantities)
        for outcome in market:
              raw_bid_value = 0
              bid_quantity_gotten = 0
              for order in get_orders_down_to_price(bids, outcome, bid_price[outcome]):
                if(order.quantity + bid_quantity_gotten > num_shares):
                  order.quantity = num_shares - bid_quantity_gotten
                if(bid_quantity_gotten >= num_shares):
                  break
                raw_bid_value += order.quantity * (order.price - min)
                bid_quantity_gotten += order.quantity
              vertical_liquidity[outcome].left = raw_bid_value
      // for asks
      For outcome in market:
              best_ask = get_best_ask(market, outcome)
              if(no_best_ask):
                vertical_liquidity.right = 0
                break
              else:
                ask_price[outcome] = best_ask / (1 + reporter_fee-creator_fee)
                // uses min b/c we want prices that add up to range to calculate a spread, so selling at 33 should be 33*3 ~= 100, not 66*3
                ask_sum += ask_price[outcome] - min
        excess_spread = range * (spread % + 1) - ask_sum
        // if liquidity > the spread % even at best asks or there is no best ask
        if(excess_spread <= 0 or ask_sum == 0):
          vertical_liquidity.right = 0
        else:
          ask_quantities = []
          for outcome in market:
                ask_price[outcome] = ask_price[outcome] + excess_spread/num_outcomes_excluding_invalid
                for order in get_orders_up_to_price(asks, outcome, ask_price[outcome]): ask_quantities[outcome] += order.quantity
          num_shares = min(ask_quantities)
          for outcome in market:
                raw_ask_value = 0
                ask_quantity_gotten = 0
                for order in get_orders_up_to_price(asks, outcome, ask_price[outcome]):
                  if(order.quantity + ask_quantity_gotten > num_shares):
                    order.quantity = num_shares - ask_quantity_gotten
                  if(ask_quantity_gotten >= num_shares):
                    break
                  raw_ask_value += order.quantity * (max - order.price)
                  ask_quantity_gotten += order.quantity
                vertical_liquidity[outcome].right = raw_ask_value

    // sum midpoint liquidity across all outcomes
    vertical_liquidity.left = sum(vertical_liquidity.left for all outcomes)
    vertical_liquidity.right = sum(vertical_liquidity.right for all outcomes)


    left_overlap = 0
    right_overlap = 0
    for outcome in market:
      left_overlap += min(vertical_liquidity[outcome].left, midpoint_liquidity[outcome].bids)
      right_overlap += min(vertical_liquidity[outcome].right, midpoint_liquidity[outcome].asks)
*/
    return {
      left: 1,
      right: 2
    }
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
