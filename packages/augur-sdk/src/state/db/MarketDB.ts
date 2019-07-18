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
  bids: BigNumber;
  asks: BigNumber;
}

interface HorizontalLiquidity {
  total: BigNumber;
  [outcome: number]: BidsAsksLiquidity;
}

interface LeftRightLiquidity {
  left: BigNumber;
  right: BigNumber;
}

interface VerticalLiquidity extends LeftRightLiquidity {
  [outcome: number]: LeftRightLiquidity;
}

// because flexsearch is a UMD type lib
import FlexSearch = require("flexsearch");
import { bigNumberify } from "ethers/utils";

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

    const feeMultiplier = new BigNumber(1).minus(new BigNumber(1).div(reportingFeeDivisor)).minus(new BigNumber(1).div(marketData.feeDivisor));

    const orderbook = await this.getOrderbook(marketData, numOutcomes, estimatedTradeGasCostInAttoDai);

    const invalidFilter = await this.recalcInvalidFilter(orderbook, marketData, feeMultiplier, estimatedTradeGasCostInAttoDai, estimatedClaimGasCostInAttoDai);

    const liquidity10 = await this.recalcLiquidity(orderbook, marketData, feeMultiplier, numOutcomes, 10);

    return {
      _id: marketId,
      invalidFilter,
      liquidity: {
        10: liquidity10.toNumber()
      },
    };
  }

  public async getOrderbook(marketData: MarketData, numOutcomes: number, estimatedTradeGasCostInAttoDai: BigNumber): Promise<Orderbook> {
    const currentOrdersResponse = await this.stateDB.findCurrentOrderLogs({
      selector : {
        amount: { $gt: '0x00' },
        eventType: { $ne: 1 }
      }
    });

    const currentOrdersByOutcome = _.groupBy(currentOrdersResponse, (order) => { return new BigNumber(order.outcome).toNumber(); });
    for (let outcome = 0; outcome < numOutcomes; outcome++) {
      if (currentOrdersByOutcome[outcome] == undefined) currentOrdersByOutcome[outcome] = [];
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
      }
    });
    return outcomeBidAskOrders
  }

  // A Market is marked as True in the invalidFilter if the best bid for Invalid on the book would not be profitable to take were the market Valid
  public async recalcInvalidFilter(orderbook: Orderbook, marketData: MarketData, feeMultiplier: BigNumber, estimatedTradeGasCostInAttoDai: BigNumber, estimatedClaimGasCostInAttoDai: BigNumber): Promise<boolean> {
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

  public async recalcLiquidity(orderbook: Orderbook, marketData: MarketData, feeMultiplier: BigNumber, numOutcomes: number, spread: number): Promise<BigNumber> {
    const horizontalLiquidity = this.getHorizontalLiquidity(orderbook, marketData, feeMultiplier, numOutcomes, spread);
    const verticalLiquidity = this.getVerticalLiquidity(orderbook, marketData, feeMultiplier, numOutcomes, spread);

    let left_overlap = new BigNumber(0);
    let right_overlap = new BigNumber(0);
    for (let outcome = 1; outcome < numOutcomes; outcome++) {
      const left = verticalLiquidity[outcome] === undefined ? new BigNumber(0) : verticalLiquidity[outcome].left;
      const right = verticalLiquidity[outcome] === undefined ? new BigNumber(0) : verticalLiquidity[outcome].right;
      left_overlap = left_overlap.plus(BigNumber.min(left, horizontalLiquidity[outcome].bids));
      right_overlap = right_overlap.plus(BigNumber.min(right, horizontalLiquidity[outcome].asks));
    }

    return verticalLiquidity.left.plus(horizontalLiquidity.total).plus(verticalLiquidity.right).minus(left_overlap).minus(right_overlap);
  }

  public getHorizontalLiquidity(orderbook: Orderbook, marketData: MarketData, feeMultiplier: BigNumber, numOutcomes: number, spread: number): HorizontalLiquidity {
    const horizontalLiquidity: HorizontalLiquidity  = {
      total: new BigNumber(0)
    };
    const numTicks = new BigNumber(marketData.numTicks);
    for (let outcome = 1; outcome < numOutcomes; outcome++) {
      horizontalLiquidity[outcome] = {
        bids: new BigNumber(0),
        asks: new BigNumber(0),
      }

      if (orderbook[outcome].bids.length < 1 || orderbook[outcome].asks.length < 1) continue;

      let best_bid = new BigNumber(orderbook[outcome].bids[0].price);
      let best_ask = new BigNumber(orderbook[outcome].asks[0].price);
      best_bid = best_bid.multipliedBy(feeMultiplier);
      best_ask = best_ask.dividedBy(feeMultiplier);
      const midpoint_price = best_bid.plus(best_ask).div(2);
      const ask_price = midpoint_price.plus(numTicks.div(2).multipliedBy(spread).div(100));
      const bid_price = midpoint_price.minus(numTicks.div(2).multipliedBy(spread).div(100));

      let bid_quantities = new BigNumber(0);
      let ask_quantities = new BigNumber(0);
      const bidOrders = _.takeWhile(orderbook[outcome].bids, function(order) { return bid_price.lte(order.price); });
      const askOrders = _.takeWhile(orderbook[outcome].asks, function(order) { return ask_price.gte(order.price); });
      // for bids we get orders from the midpoint down to and inclusive of the bid price. For asks we get the orders from the midpoint *up to* inclusive of the ask price. 
      for (const order of bidOrders) bid_quantities = bid_quantities.plus(order.amount);
      for (const order of askOrders) ask_quantities = ask_quantities.plus(order.amount);
      const num_shares = BigNumber.max(bid_quantities, ask_quantities);

      let raw_bid_value = new BigNumber(0);
      let raw_ask_value = new BigNumber(0);
      // the getters return a dictionary of orders w/ quantity and price
      let bid_quantity_gotten = new BigNumber(0);
      let ask_quantity_gotten = new BigNumber(0);
      if (num_shares.gt(0)) {
        for (const order of bidOrders) {
          let quantityToTake = new BigNumber(order.amount);
          if (bid_quantity_gotten.plus(quantityToTake).gt(num_shares)) quantityToTake = num_shares.minus(bid_quantity_gotten);
          if (bid_quantity_gotten.gte(num_shares)) break;
          raw_bid_value = raw_bid_value.plus(quantityToTake.multipliedBy(order.price));
          bid_quantity_gotten = bid_quantity_gotten.plus(quantityToTake);
        }
        for (const order of askOrders) {
          let quantityToTake = new BigNumber(order.amount);
          if (ask_quantity_gotten.plus(quantityToTake).gt(num_shares)) quantityToTake = num_shares.minus(ask_quantity_gotten);
          if (ask_quantity_gotten.gte(num_shares)) break;
          raw_ask_value = raw_ask_value.plus(quantityToTake.multipliedBy(numTicks.minus(order.price)));
          ask_quantity_gotten = ask_quantity_gotten.plus(quantityToTake);
        }

        horizontalLiquidity[outcome].bids = raw_bid_value
        horizontalLiquidity[outcome].asks = raw_ask_value
        horizontalLiquidity.total = horizontalLiquidity.total.plus(raw_bid_value).plus(raw_ask_value);
      }
    }
    
    return horizontalLiquidity;
  }

  public getVerticalLiquidity(orderbook: Orderbook, marketData: MarketData, feeMultiplier: BigNumber, numOutcomes: number, spread: number): VerticalLiquidity {
    const vertical_liquidity = {
      left: new BigNumber(0),
      right: new BigNumber(0),
    }

    const numTicks = new BigNumber(marketData.numTicks);

    const bid_quantities = {};
    const ask_quantities = {};
    const bid_prices = {};
    const ask_prices = {};
    let bid_sum = new BigNumber(0);
    let ask_sum = new BigNumber(0);

    if (marketData.marketType == MarketType.Categorical) {

      // BIDS
      for (let outcome = 1; outcome < numOutcomes; outcome++) {
        if (orderbook[outcome].bids.length < 1) {
          bid_sum = new BigNumber(0);
          break;
        }
        const best_bid = orderbook[outcome].bids[0];
        bid_prices[outcome] = feeMultiplier.multipliedBy(best_bid.price);
        bid_sum = bid_sum.plus(bid_prices[outcome]);
      }

      let excess_spread = bid_sum.minus(numTicks.multipliedBy(100 - spread).div(100));
      // if liquidity > the spread % even at best bids or there is no best bid we dont calulate anything
      if (excess_spread.gt(0) && !bid_sum.isZero()) {
        for (let outcome = 1; outcome < numOutcomes; outcome++) {
          bid_prices[outcome] = bid_prices[outcome].minus(excess_spread.div(numOutcomes - 1));
          const bidOrders = _.takeWhile(orderbook[outcome].bids, (order) => { return bid_prices[outcome].lte(order.price); });
          if (bid_quantities[outcome] === undefined) bid_quantities[outcome] = new BigNumber(0);
          for (const order of bidOrders) bid_quantities[outcome] = bid_quantities[outcome].plus(order.amount);
        }
        const num_shares = BigNumber.min.apply(null, _.values(bid_quantities));
        for (let outcome = 1; outcome < numOutcomes; outcome++) {
          let raw_bid_value = new BigNumber(0);
          let bid_quantity_gotten = new BigNumber(0);
          const bidOrders = _.takeWhile(orderbook[outcome].bids, (order) => { return bid_prices[outcome].lte(order.price); });
          for (const order of bidOrders) {
            let quantityToTake = new BigNumber(order.amount);
            if (bid_quantity_gotten.plus(quantityToTake).gt(num_shares)) quantityToTake = num_shares.minus(bid_quantity_gotten);
            if (bid_quantity_gotten.gte(num_shares)) break;
            raw_bid_value = raw_bid_value.plus(quantityToTake.multipliedBy(order.price));
            bid_quantity_gotten = bid_quantity_gotten.plus(quantityToTake);
          }
          vertical_liquidity[outcome].left = raw_bid_value
          vertical_liquidity.left = vertical_liquidity.left.plus(raw_bid_value);
        }
      }

      // ASKS
      for (let outcome = 1; outcome < numOutcomes; outcome++) {
        if (orderbook[outcome].asks.length < 1) {
          ask_sum = new BigNumber(0);
          break;
        }
        const best_ask = orderbook[outcome].asks[0];
        ask_prices[outcome] = new BigNumber(best_ask.price).div(feeMultiplier);
        ask_sum = ask_sum.plus(ask_prices[outcome]);
      }

      excess_spread = numTicks.multipliedBy(100 + spread).div(100).minus(ask_sum);
      // if liquidity > the spread % even at best asks or there is no best ask we dont calulate anything
      if (excess_spread.gt(0) && !ask_sum.isZero()) {
        for (let outcome = 1; outcome < numOutcomes; outcome++) {
          ask_prices[outcome] = ask_prices[outcome].minus(excess_spread.div(numOutcomes - 1));
          const askOrders = _.takeWhile(orderbook[outcome].asks, (order) => { return ask_prices[outcome].gte(order.price); });
          if (ask_quantities[outcome] === undefined) ask_quantities[outcome] = new BigNumber(0);
          for (const order of askOrders) ask_quantities[outcome] = ask_quantities[outcome].plus(order.amount);
        }
        const num_shares = BigNumber.min.apply(null, _.values(ask_quantities));
        for (let outcome = 1; outcome < numOutcomes; outcome++) {
          let raw_ask_value = new BigNumber(0);
          let ask_quantity_gotten = new BigNumber(0);
          const askOrders = _.takeWhile(orderbook[outcome].asks, (order) => { return ask_prices[outcome].gte(order.price); });
          for (const order of askOrders) {
            let quantityToTake = new BigNumber(order.amount);
            if (ask_quantity_gotten.plus(quantityToTake).gt(num_shares)) quantityToTake = num_shares.minus(ask_quantity_gotten);
            if (ask_quantity_gotten.gte(num_shares)) break;
            raw_ask_value = raw_ask_value.plus(quantityToTake.multipliedBy(numTicks.minus(order.price)));
            ask_quantity_gotten = ask_quantity_gotten.plus(quantityToTake);
          }
          vertical_liquidity[outcome].right = raw_ask_value
          vertical_liquidity.right = vertical_liquidity.right.plus(raw_ask_value);
        }
      }
      
    }

    return vertical_liquidity;
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
