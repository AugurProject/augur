import * as _ from 'lodash';
import { BigNumber } from 'bignumber.js';
import { Augur } from '../Augur';
import { MarketType } from '../state/logs/types';
import { QUINTILLION } from '../utils';

export interface Order {
  price: string;
  amount: string;
}

export interface OutcomeOrderBook {
  bids: Order[];
  asks: Order[];
}

export interface OrderBook {
  [outcome: number]: OutcomeOrderBook;
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

export interface GetLiquidityParams {
  orderBook: OrderBook;
  numTicks: BigNumber;
  marketType: MarketType;
  reportingFeeDivisor: BigNumber;
  feePerCashInAttoCash: BigNumber;
  numOutcomes: number;
  spread?: number;
}

export class Liquidity {
  private readonly augur: Augur;

  constructor(augur: Augur) {
    this.augur = augur;
  }

  async getLiquidityForSpread(params: GetLiquidityParams): Promise<BigNumber> {
    const marketFee = new BigNumber(params.feePerCashInAttoCash).dividedBy(QUINTILLION);
    const feeMultiplier = new BigNumber(1).minus(new BigNumber(1).div(params.reportingFeeDivisor)).minus(marketFee);
    const horizontalLiquidity = this.getHorizontalLiquidity(params.orderBook, params.numTicks, feeMultiplier, params.numOutcomes, params.spread);
    const verticalLiquidity = this.getVerticalLiquidity(params.orderBook, params.numTicks, params.marketType, feeMultiplier, params.numOutcomes, params.spread);

    let left_overlap = new BigNumber(0);
    let right_overlap = new BigNumber(0);
    for (let outcome = 1; outcome < params.numOutcomes; outcome++) {
      const left = verticalLiquidity[outcome] === undefined ? new BigNumber(0) : verticalLiquidity[outcome].left;
      const right = verticalLiquidity[outcome] === undefined ? new BigNumber(0) : verticalLiquidity[outcome].right;
      left_overlap = left_overlap.plus(BigNumber.min(left, horizontalLiquidity[outcome].bids));
      right_overlap = right_overlap.plus(BigNumber.min(right, horizontalLiquidity[outcome].asks));
    }

    return verticalLiquidity.left.plus(horizontalLiquidity.total).plus(verticalLiquidity.right).minus(left_overlap).minus(right_overlap);
  }

  getHorizontalLiquidity(orderBook: OrderBook, numTicks: BigNumber, feeMultiplier: BigNumber, numOutcomes: number, spread: number): HorizontalLiquidity {
    const horizontalLiquidity: HorizontalLiquidity  = {
      total: new BigNumber(0),
    };
    for (let outcome = 1; outcome < numOutcomes; outcome++) {
      horizontalLiquidity[outcome] = {
        bids: new BigNumber(0),
        asks: new BigNumber(0),
      };

      if (!orderBook[outcome] || orderBook[outcome].bids.length < 1 || orderBook[outcome].asks.length < 1) continue;

      let best_bid = new BigNumber(orderBook[outcome].bids[0].price);
      let best_ask = new BigNumber(orderBook[outcome].asks[0].price);
      best_bid = best_bid.multipliedBy(feeMultiplier);
      best_ask = best_ask.dividedBy(feeMultiplier);
      const midpoint_price = best_bid.plus(best_ask).div(2);
      const ask_price = midpoint_price.plus(numTicks.div(2).multipliedBy(spread).div(100));
      const bid_price = midpoint_price.minus(numTicks.div(2).multipliedBy(spread).div(100));

      let bid_quantities = new BigNumber(0);
      let ask_quantities = new BigNumber(0);
      const bidOrders = _.takeWhile(orderBook[outcome].bids, (order) => bid_price.lte(order.price));
      const askOrders = _.takeWhile(orderBook[outcome].asks, (order) => ask_price.gte(order.price));


      // Sort bids by Price, Amount and group by orderCreator
      const sortedBidOrders = _.groupBy(
        bidOrders
          .sort((a, b) => {
            return (
              new BigNumber(a.price).minus(new BigNumber(b.price)).toNumber() ||
              new BigNumber(a.amount).minus(new BigNumber(b.amount)).toNumber()
            );
          })
          .reverse(),
        'orderCreator'
      );

      // Sort asks by Price, Amount and group by orderCreator
      const sortedAskOrders = _.groupBy(
        askOrders.sort((a, b) => {
          return (
            new BigNumber(a.price).minus(new BigNumber(b.price)).toNumber() ||
            new BigNumber(b.amount).minus(new BigNumber(a.amount)).toNumber()
          );
        }),
        'orderCreator'
      );

      let bidOrdersTopThree = [];
      let askOrdersTopThree = [];

      // Only count for the liquidity sorts/filters up to 3 orders per side of the book per outcome per user per market
      Object.keys(sortedBidOrders).forEach(ordersByUser => {
        bidOrdersTopThree = bidOrdersTopThree.concat(
          sortedBidOrders[ordersByUser].slice(0, 3)
        );
      });

      Object.keys(sortedAskOrders).forEach(ordersByUser => {
        askOrdersTopThree = askOrdersTopThree.concat(
          sortedAskOrders[ordersByUser].slice(0, 3)
        );
      });

      // for bids we get orders from the midpoint down to and inclusive of the bid price. For asks we get the orders from the midpoint *up to* inclusive of the ask price.
      for (const order of bidOrdersTopThree) bid_quantities = bid_quantities.plus(order.amount);
      for (const order of askOrdersTopThree) ask_quantities = ask_quantities.plus(order.amount);
      const num_shares = BigNumber.max(bid_quantities, ask_quantities);

      let raw_bid_value = new BigNumber(0);
      let raw_ask_value = new BigNumber(0);
      // the getters return a dictionary of orders w/ quantity and price
      let bid_quantity_gotten = new BigNumber(0);
      let ask_quantity_gotten = new BigNumber(0);
      if (num_shares.gt(0)) {
        for (const order of bidOrdersTopThree) {
          let quantityToTake = new BigNumber(order.amount);
          if (bid_quantity_gotten.plus(quantityToTake).gt(num_shares)) quantityToTake = num_shares.minus(bid_quantity_gotten);
          if (bid_quantity_gotten.gte(num_shares)) break;
          raw_bid_value = raw_bid_value.plus(quantityToTake.multipliedBy(order.price));
          bid_quantity_gotten = bid_quantity_gotten.plus(quantityToTake);
        }
        for (const order of askOrdersTopThree) {
          let quantityToTake = new BigNumber(order.amount);
          if (ask_quantity_gotten.plus(quantityToTake).gt(num_shares)) quantityToTake = num_shares.minus(ask_quantity_gotten);
          if (ask_quantity_gotten.gte(num_shares)) break;
          raw_ask_value = raw_ask_value.plus(quantityToTake.multipliedBy(numTicks.minus(order.price)));
          ask_quantity_gotten = ask_quantity_gotten.plus(quantityToTake);
        }

        horizontalLiquidity[outcome].bids = raw_bid_value;
        horizontalLiquidity[outcome].asks = raw_ask_value;
        horizontalLiquidity.total = horizontalLiquidity.total.plus(raw_bid_value).plus(raw_ask_value);
      }
    }

    return horizontalLiquidity;
  }

  getVerticalLiquidity(orderBook: OrderBook, numTicks: BigNumber, marketType: MarketType, feeMultiplier: BigNumber, numOutcomes: number, spread: number): VerticalLiquidity {
    const vertical_liquidity = {
      left: new BigNumber(0),
      right: new BigNumber(0),
    };

    const bid_quantities = {};
    const ask_quantities = {};
    const bid_prices = {};
    const ask_prices = {};
    let bid_sum = new BigNumber(0);
    let ask_sum = new BigNumber(0);

    if (marketType == MarketType.Categorical) {
      for (let outcome = 1; outcome < numOutcomes; outcome++) {
        vertical_liquidity[outcome] = {
          left: new BigNumber(0),
          right: new BigNumber(0),
        };
      }

      // BIDS (`outcome` starts at 1 because the Invalid outcome is 0 and is not included in liquidity calculations)
      for (let outcome = 1; outcome < numOutcomes; outcome++) {
        if (!orderBook[outcome] || orderBook[outcome].bids.length < 1) {
          bid_sum = new BigNumber(0);
          break;
        }
        const best_bid = orderBook[outcome].bids[0];
        bid_prices[outcome] = feeMultiplier.multipliedBy(best_bid.price);
        bid_sum = bid_sum.plus(bid_prices[outcome]);
      }

      let excess_spread = bid_sum.minus(numTicks.multipliedBy(100 - spread).div(100));
      // if liquidity > the spread % even at best bids or there is no best bid we dont calulate anything
      if (excess_spread.gt(0) && !bid_sum.isZero()) {
        for (let outcome = 1; outcome < numOutcomes; outcome++) {
          bid_prices[outcome] = bid_prices[outcome].minus(excess_spread.div(numOutcomes - 1));
          const bidOrders = _.takeWhile(orderBook[outcome].bids, (order) => bid_prices[outcome].lte(order.price));
          if (bid_quantities[outcome] === undefined) bid_quantities[outcome] = new BigNumber(0);
          for (const order of bidOrders) bid_quantities[outcome] = bid_quantities[outcome].plus(order.amount);
        }
        const num_shares = BigNumber.min.apply(null, _.values(bid_quantities));
        for (let outcome = 1; outcome < numOutcomes; outcome++) {
          let raw_bid_value = new BigNumber(0);
          let bid_quantity_gotten = new BigNumber(0);
          const bidOrders = _.takeWhile(orderBook[outcome].bids, (order) => bid_prices[outcome].lte(order.price));
          for (const order of bidOrders) {
            let quantityToTake = new BigNumber(order.amount);
            if (bid_quantity_gotten.plus(quantityToTake).gt(num_shares)) quantityToTake = num_shares.minus(bid_quantity_gotten);
            if (bid_quantity_gotten.gte(num_shares)) break;
            raw_bid_value = raw_bid_value.plus(quantityToTake.multipliedBy(order.price));
            bid_quantity_gotten = bid_quantity_gotten.plus(quantityToTake);
          }
          vertical_liquidity[outcome].left = raw_bid_value;
          vertical_liquidity.left = vertical_liquidity.left.plus(raw_bid_value);
        }
      }

      // ASKS (`outcome` starts at 1 because the Invalid outcome is 0 and is not included in liquidity calculations)
      for (let outcome = 1; outcome < numOutcomes; outcome++) {
        if (!orderBook[outcome] || orderBook[outcome].asks.length < 1) {
          ask_sum = new BigNumber(0);
          break;
        }
        const best_ask = orderBook[outcome].asks[0];
        ask_prices[outcome] = new BigNumber(best_ask.price).div(feeMultiplier);
        ask_sum = ask_sum.plus(ask_prices[outcome]);
      }

      excess_spread = ask_sum.minus(numTicks.multipliedBy(100 - spread).div(100));
      // if liquidity > the spread % even at best asks or there is no best ask we dont calulate anything
      if (excess_spread.gt(0) && !ask_sum.isZero()) {
        for (let outcome = 1; outcome < numOutcomes; outcome++) {
          ask_prices[outcome] = ask_prices[outcome].plus(excess_spread.div(numOutcomes - 1));
          const askOrders = _.takeWhile(orderBook[outcome].asks, (order) => ask_prices[outcome].gte(order.price));
          if (ask_quantities[outcome] === undefined) ask_quantities[outcome] = new BigNumber(0);
          for (const order of askOrders) ask_quantities[outcome] = ask_quantities[outcome].plus(order.amount);
        }
        const num_shares = BigNumber.min.apply(null, _.values(ask_quantities));
        for (let outcome = 1; outcome < numOutcomes; outcome++) {
          let raw_ask_value = new BigNumber(0);
          let ask_quantity_gotten = new BigNumber(0);
          const askOrders = _.takeWhile(orderBook[outcome].asks, (order) => ask_prices[outcome].gte(order.price));
          for (const order of askOrders) {
            let quantityToTake = new BigNumber(order.amount);
            if (ask_quantity_gotten.plus(quantityToTake).gt(num_shares)) quantityToTake = num_shares.minus(ask_quantity_gotten);
            if (ask_quantity_gotten.gte(num_shares)) break;
            raw_ask_value = raw_ask_value.plus(quantityToTake.multipliedBy(numTicks.minus(order.price)));
            ask_quantity_gotten = ask_quantity_gotten.plus(quantityToTake);
          }
          vertical_liquidity[outcome].right = raw_ask_value;
          vertical_liquidity.right = vertical_liquidity.right.plus(raw_ask_value);
        }
      }
    }
    return vertical_liquidity;
  }
}
