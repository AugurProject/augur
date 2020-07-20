import { MarketData, ZeroXOrder, ZeroXOrders, OrderState, ignoreCrossedOrders } from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import Dexie from 'dexie';
import { getAddress } from 'ethers/utils/address';
import * as t from 'io-ts';
import * as _ from 'lodash';
import {
  Augur,
  convertOnChainAmountToDisplayAmount,
  convertOnChainPriceToDisplayPrice,
  numTicksToTickSize,
} from '../../index';
import { DB } from '../db/DB';
import { StoredOrder } from '../db/ZeroXOrders';
import { getMarkets} from './OnChainTrading';
import { Getter } from './Router';


export const ZeroXOrdersParams = t.partial({
  marketId: t.string,
  outcome: t.number,
  orderType: t.string,
  account: t.string,
  orderState: t.string,
  matchPrice: t.string,
  ignoreOrders: t.array(t.string),
  expirationCutoffSeconds: t.number,
  ignoreCrossOrders: t.boolean,
});

export const ZeroXOrderParams = t.type({
  orderHash: t.string,
});

export const MarketInvalidBestBidParams = t.type({
  marketId: t.string,
})
export class ZeroXOrdersGetters {
  static GetZeroXOrdersParams = ZeroXOrdersParams;
  static GetZeroXOrderParams = ZeroXOrderParams;
  static GetMarketInvalidBestBidParams = MarketInvalidBestBidParams;

  @Getter('GetZeroXOrderParams')
  static async getZeroXOrder(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof ZeroXOrdersGetters.GetZeroXOrderParams>
  ): Promise<ZeroXOrder> {
    const storedOrder: StoredOrder = await db.ZeroXOrders.where('orderHash')
      .equals(params.orderHash)
      .last();
    const markets = await getMarkets([storedOrder.market], db, false);
    return ZeroXOrdersGetters.storedOrderToZeroXOrder(markets, storedOrder);
  }

  // TODO: Split this into a getter for orderbooks and a getter to get matching orders
  // TODO: When getting an orderbook for a specific market if the Database has not finished syncing we should just pull the orderbook from mesh directly
  @Getter('GetZeroXOrdersParams')
  static async getZeroXOrders(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof ZeroXOrdersGetters.GetZeroXOrdersParams>
  ): Promise<ZeroXOrders> {
    if (!params.marketId && !params.account) {
      throw new Error(
        "'getOrders' requires 'marketId' or 'account' param be provided"
      );
    }
    const ignoreCrossOrders = params.ignoreCrossOrders
    const outcome = params.outcome !== undefined ? `0x0${params.outcome.toString()}` : null;
    const orderType = params.orderType !== undefined ? `0x0${params.orderType}` : null;
    const account = params.account ? getAddress(params.account) : null;
    const accountOnly = account && !ignoreCrossOrders;

    let storedOrders: StoredOrder[];
    if (!params.marketId && accountOnly) {
      storedOrders = await db.ZeroXOrders.where({
        orderCreator: account,
      }).toArray();
    } else if (!outcome || !orderType) {
      storedOrders = await db.ZeroXOrders.where('[market+outcome+orderType]')
        .between(
          [params.marketId, Dexie.minKey, Dexie.minKey],
          [params.marketId, Dexie.maxKey, Dexie.maxKey]
        )
        .and(order => {
          return !accountOnly || order.orderCreator === account;
        })
        .toArray();
    } else {
      storedOrders = await db.ZeroXOrders.where('[market+outcome+orderType]')
        .equals([params.marketId, outcome, orderType])
        .and(order => !accountOnly || order.orderCreator === account)
        .toArray();
    }

    if (params.matchPrice) {
      if (!params.orderType)
        throw new Error('Cannot specify match price without order type');

      const price = new BigNumber(params.matchPrice, 16);
      storedOrders = _.filter(storedOrders, storedOrder => {
        // 0 == "buy"
        const orderPrice = new BigNumber(storedOrder.price, 16);
        return params.orderType === '0'
          ? orderPrice.gte(price)
          : orderPrice.lte(price);
      });
    }

    const marketIds: string[] = await storedOrders.reduce(
      (ids, order) => Array.from(new Set([...ids, order.market])),
      []
    );
    const markets = await getMarkets(marketIds, db, false);
    const book = ZeroXOrdersGetters.mapStoredToZeroXOrders(
      markets,
      storedOrders,
      params.ignoreOrders || [],
      typeof params.expirationCutoffSeconds === 'number'
        ? params.expirationCutoffSeconds
        : 0,
    );
    return ignoreCrossOrders ? ignoreCrossedOrders(book, account) : book;
  }

  static mapStoredToZeroXOrders(
    markets: _.Dictionary<MarketData>,
    storedOrders: StoredOrder[],
    ignoredOrderIds: string[],
    expirationCutoffSeconds: number,
  ): ZeroXOrders {
    let orders = storedOrders.map(storedOrder => {
      return {
        storedOrder,
        zeroXOrder: ZeroXOrdersGetters.storedOrderToZeroXOrder(
          markets,
          storedOrder
        ),
      };
    });
    // Remove orders somehow belonging to unknown markets
    orders = orders.filter(order => order.zeroXOrder !== null);
    // Remove intentionally ignored orders.
    orders = orders.filter(
      order => ignoredOrderIds.indexOf(order.zeroXOrder.orderId) === -1
    );
    // Remove orders soon to expire.
    const now = Math.floor(new Date().valueOf() / 1000);
    const expirationCutoffTimestamp = now + expirationCutoffSeconds;
    orders = orders.filter(
      order =>
        order.zeroXOrder.expirationTimeSeconds >
        expirationCutoffTimestamp
    );
    // Shape orders into market-order-type tree.
    return orders.reduce(
      (orders: ZeroXOrders, order): ZeroXOrders => {
        const { storedOrder, zeroXOrder } = order;
        const { market } = storedOrder;
        const { orderId } = zeroXOrder;
        const outcome = new BigNumber(storedOrder.outcome).toNumber();
        const orderType = new BigNumber(storedOrder.orderType).toNumber();

        if (!orders[market]) {
          orders[market] = {};
        }
        if (!orders[market][outcome]) {
          orders[market][outcome] = {};
        }
        if (!orders[market][outcome][orderType]) {
          orders[market][outcome][orderType] = {};
        }

        orders[market][outcome][orderType][orderId] = zeroXOrder;
        return orders;
      },
      {} as ZeroXOrders
    );
  }

  static storedOrderToZeroXOrder(
    markets: _.Dictionary<MarketData>,
    storedOrder: StoredOrder
  ): ZeroXOrder {
    const market = markets[storedOrder.market];
    if (!market) {
      return null; // cannot convert orders unaffiliated with any known market
    }

    const minPrice = new BigNumber(market.prices[0]);
    const maxPrice = new BigNumber(market.prices[1]);
    const numTicks = new BigNumber(market.numTicks);
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const amount = convertOnChainAmountToDisplayAmount(
      new BigNumber(storedOrder.amount),
      tickSize
    ).toString(10);
    const amountFilled = convertOnChainAmountToDisplayAmount(
      new BigNumber(storedOrder.signedOrder.makerAssetAmount).minus(
        new BigNumber(storedOrder.amount)
      ),
      tickSize
    ).toString(10);
    const price = convertOnChainPriceToDisplayPrice(
      new BigNumber(storedOrder.price, 16),
      minPrice,
      tickSize
    ).toString(10);

    return {
      owner: storedOrder.signedOrder.makerAddress,
      orderState: OrderState.OPEN,
      orderId: storedOrder['_id'] || storedOrder.orderHash,
      price,
      amount,
      amountFilled,
      expirationTimeSeconds: parseInt(
        storedOrder.signedOrder.expirationTimeSeconds
      ),
      fullPrecisionPrice: price,
      fullPrecisionAmount: amount,
      originalFullPrecisionAmount: '0',
      makerAssetAmount: storedOrder.signedOrder.makerAssetAmount,
      takerAssetAmount: storedOrder.signedOrder.takerAssetAmount,
      salt: storedOrder.signedOrder.salt,
      makerAssetData: storedOrder.signedOrder.makerAssetData,
      takerAssetData: storedOrder.signedOrder.takerAssetData,
      signature: storedOrder.signedOrder.signature,
      makerFeeAssetData: '0x',
      takerFeeAssetData: '0x',
      feeRecipientAddress: storedOrder.signedOrder.feeRecipientAddress,
      takerAddress: storedOrder.signedOrder.takerAddress,
      makerAddress: storedOrder.signedOrder.makerAddress,
      senderAddress: storedOrder.signedOrder.senderAddress,
      makerFee: storedOrder.signedOrder.makerFee,
      takerFee: storedOrder.signedOrder.takerFee,
    } as ZeroXOrder; // TODO this is hiding some missing properties
  }
}

export function flattenZeroXOrders(orders): ZeroXOrder[] {
  const collapsed: ZeroXOrder[] = [];
  _.forOwn(orders, market => {
    _.forOwn(market, outcome => {
      _.forOwn(outcome, orderType => {
        _.forOwn(orderType, order => {
          collapsed.push(order);
        });
      });
    });
  });
  return collapsed;
}

export function collapseZeroXOrders(orders): ZeroXOrder[] {
  const collapsed: ZeroXOrder[] = [];
  _.forOwn(orders, (market, marketId) => {
    _.forOwn(market, (outcome, outcomeId) => {
      _.forOwn(outcome, (orderType, orderTypeId) => {
        _.forOwn(orderType, order => {
          collapsed.push({
            ...order,
            orderType: orderTypeId,
            outcome: outcomeId,
            market: marketId,
          });
        });
      });
    });
  });
  return collapsed;
}

