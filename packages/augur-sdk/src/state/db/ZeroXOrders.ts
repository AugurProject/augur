import { BigNumber, OrderEvent, OrderInfo } from '@0x/mesh-rpc-client';
import {
  MarketData,
  MarketType,
  OrderEventType,
  SubscriptionEventName,
  OrderData,
  parseAssetData
} from '@augurproject/sdk-lite';
import { logger, LoggerLevels, DEFAULT_TRADE_INTERVAL } from '@augurproject/utils';
import { getAddress } from 'ethers/utils/address';
import * as _ from 'lodash';
import { Augur } from '../../Augur';
import { getTradeInterval } from '../../utils';
import { AbstractTable, BaseDocument } from './AbstractTable';
import { DB } from './DB';
import { SyncStatus } from './SyncStatus';

// This database clears its contents on every sync.
// The primary purposes for even storing this data are:
// 1. To recalculate liquidity metrics. This can be stale so when the derived market DB is synced it should not wait for this to complete (it will already have recorded liquidity data from previous syncs)
// 2. To cache market orderbooks so a complete pull isnt needed on every subsequent load.

const EXPECTED_ASSET_DATA_LENGTH = 2122;


export interface Document extends BaseDocument {
  blockNumber: number;
}

export interface SnapshotCounterDocument extends BaseDocument {
  snapshotCounter: number;
}

export interface StoredOrder extends OrderData {
  orderHash: string,
  signedOrder: StoredSignedOrder,
  amount: string,
  numberAmount: BigNumber,
  orderCreator: string,
  orderId?: string,
}

export interface StoredSignedOrder {
  signature: string;
  senderAddress: string;
  makerAddress: string;
  takerAddress: string;
  makerFee: string;
  takerFee: string;
  makerAssetAmount: string;
  takerAssetAmount: string;
  makerAssetData: string;
  takerAssetData: string;
  salt: string;
  exchangeAddress: string;
  feeRecipientAddress: string;
  expirationTimeSeconds: string;
}

/**
 * Stores 0x orders
 */
export class ZeroXOrders extends AbstractTable {
  protected syncStatus: SyncStatus;
  protected stateDB: DB;
  private augur: Augur;
  readonly tradeTokenAddress: string;
  readonly cashAssetData: string;
  readonly shareAssetData: string;
  readonly takerAssetData: string;
  private pastOrders: _.Dictionary<StoredOrder> = {};

  constructor(
    db: DB,
    networkId: number,
    augur: Augur
  ) {
    super(networkId, 'ZeroXOrders', db.dexieDB);
    this.handleOrderEvent = this.handleOrderEvent.bind(this);
    this.cacheOrdersAndSync = this.cacheOrdersAndSync.bind(this);
    this.syncStatus = db.syncStatus;
    this.stateDB = db;
    this.augur = augur;
    this.tradeTokenAddress = this.augur.config.addresses.ZeroXTrade.substr(2).toLowerCase(); // normalize and remove the 0x
    const cashTokenAddress = this.augur.config.addresses.Cash.substr(2).toLowerCase(); // normalize and remove the 0x
    const shareTokenAddress = this.augur.config.addresses.ShareToken.substr(2).toLowerCase(); // normalize and remove the 0x
    this.cashAssetData = `0xf47261b0000000000000000000000000${cashTokenAddress}`;
    this.shareAssetData = `0xa7cb5fb7000000000000000000000000${shareTokenAddress}000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
    this.takerAssetData = `0xa7cb5fb7000000000000000000000000${this.tradeTokenAddress}000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;

    this.subscribeToOrderEvents();
  }

  protected async saveDocuments(documents: BaseDocument[]): Promise<void> {
    return super.bulkPutDocuments(documents);
  }

  static create(db: DB, networkId: number, augur: Augur): ZeroXOrders {
    const zeroXOrders = new ZeroXOrders(db, networkId, augur);
    return zeroXOrders;
  }

  async cacheOrdersAndSync(): Promise<void> {
    this.pastOrders = Object.assign(this.pastOrders, _.keyBy(await this.allDocs(), 'orderHash'));
    await this.sync();
  }

  subscribeToOrderEvents() {
    // This only works if `zeroX` has been set on the augur instance and
    // it doesn't get over-written so... something.
    this.augur.events.on(SubscriptionEventName.ZeroXMeshOrderEvent, this.handleOrderEvent);
    this.augur.events.on(SubscriptionEventName.ZeroXRPCOrderEvent, this.handleOrderEvent);
  }

  async delete() {
    this.augur.events.off(SubscriptionEventName.ZeroXStatusReady, this.cacheOrdersAndSync);
    this.augur.events.off(SubscriptionEventName.ZeroXMeshOrderEvent, this.handleOrderEvent);
    this.augur.events.off(SubscriptionEventName.ZeroXRPCOrderEvent, this.handleOrderEvent);
  }

  async handleOrderEvent(orderEvents: OrderEvent[]): Promise<void> {
    if (orderEvents.length < 1) return;
    const bulkOrderEvents = [];
    const filteredOrders = orderEvents.filter(this.validateOrder, this);
    console.log("Filtered Orders", filteredOrders);
    let documents: StoredOrder[] = filteredOrders.map(this.processOrder, this);
    console.log("Processed Orders: ", documents);

    // Remove Canceled, Expired, and Invalid Orders and emit event
    const canceledOrders = _.keyBy(
      filteredOrders.filter((orderEvent) => ['CANCELLED', 'EXPIRED', 'INVALID', 'UNFUNDED'].includes(orderEvent.endState)),
      'orderHash'
    );

    this.table.where('orderHash').anyOf(Object.keys(canceledOrders)).delete();
    for (const d of documents) {
      if (!canceledOrders[d.orderHash]) continue;
      // Spread this once to avoid extra copies
      const eventType = canceledOrders[d.orderHash].endState === "EXPIRED" ? OrderEventType.Expire : OrderEventType.Cancel;
      const event = {eventType, orderId: d.orderHash, ...d};
      bulkOrderEvents.push(event);
      this.augur.events.emit(SubscriptionEventName.DBUpdatedZeroXOrders, event);
    }
    documents = documents.filter((d: StoredOrder) => !canceledOrders[d.orderHash]);

    // Deal with partial fills and emit event
    const filledOrders = _.keyBy(
      filteredOrders.filter(orderEvent => ['FILLED', 'FULLY_FILLED'].includes(orderEvent.endState)),
      'orderHash'
    );

    const marketIds: string[] = _.uniq(documents.map(d => d.market));
    const markets = _.keyBy(await this.stateDB.Markets.where('market').anyOf(marketIds).toArray(), 'market');
    documents = documents.filter(d => this.validateStoredOrder(d, markets));
    await this.saveDocuments(documents);

    // Emit these events after saving the documents so that they are queryable
    for (const d of documents) {
      const eventType = filledOrders[d.orderHash] ? OrderEventType.Fill : OrderEventType.Create;
      const event = {eventType, orderId: d.orderHash,...d};
      bulkOrderEvents.push(event);
      this.augur.events.emit(SubscriptionEventName.DBUpdatedZeroXOrders, event);
    }
    if (bulkOrderEvents.length > 0) this.augur.events.emit(SubscriptionEventName.BulkOrderEvent, { logs: bulkOrderEvents });
  }

  async sync(): Promise<void> {
    logger.info('Syncing ZeroX Orders');
    const orders: OrderInfo[] = await this.augur.zeroX.getOrders();
    const bulkOrderEvents = [];
    let documents = [];
    if (orders?.length > 0) {
      documents = orders.filter(this.validateOrder, this).map(this.processOrder, this);
      const marketIds: string[] = _.uniq(documents.map((d) => d.market));
      const markets = _.keyBy(await this.stateDB.Markets.where('market').anyOf(marketIds).toArray(), 'market');
      documents = documents.filter((d) => this.validateStoredOrder(d, markets));
      await this.saveDocuments(documents);
      for (const d of documents) {
        const event = {eventType: OrderEventType.Create, ...d};
        bulkOrderEvents.push(event);
      }
    }
    const chainId = Number(this.augur.config.networkId);
    const ordersToAdd = Object.values(this.pastOrders).map((order) => {
      return Object.assign({
        chainId,
        makerFeeAssetData: '0x',
        takerFeeAssetData: '0x',
      }, order.signedOrder);
    });

    this.augur.events.emit(SubscriptionEventName.ZeroXStatusSynced, {});
    if (bulkOrderEvents.length > 0) this.augur.events.emit(SubscriptionEventName.BulkOrderEvent, { logs: bulkOrderEvents });

    setImmediate(() => {
      logger.info(`Synced ${orders.length} Orders from ZeroX Peers`);
      logger.debug("ZeroX Sync Summary: ")
      logger.table(LoggerLevels.debug, [{
        "Received from Mesh": orders.length,
        "Valid orders from Mesh": documents.length,
        "Cached Local Orders not Received": ordersToAdd.length
      }]);

      logger.debug("Orders Per Market")
      logger.table(LoggerLevels.debug, _.countBy(documents, 'market'));
    });

    const statusToEndState = {
      'OrderCancelled': 'CANCELLED',
      'OrderExpired': 'EXPIRED',
      'OrderUnfunded': 'UNFUNDED',
      'OrderFullyFilled': 'FULLY_FILLED'
    };
    if (ordersToAdd.length > 0) {
      // PG: Purposefully not awaiting here
      console.log("Adding orders back to mesh", ordersToAdd);
      this.augur.zeroX.addOrders(ordersToAdd).then((r) => {
        console.log("Add orders result: ", r);
        try {
          if(r.rejected.length > 0) {
            this.handleOrderEvent(r.rejected.map((order) => {
              order.endState = statusToEndState[order.status.code] || 'INVALID';
              order.fillableTakerAssetAmount = new BigNumber("0");
              return order;
            }));
          }
        } catch(e) {
          console.log("Error with order events", e);
        }
      }).catch((e) => {
        console.error("Error adding cached orders: ", e);
      });
    }
    this.pastOrders = {};
  }

  validateOrder(order: OrderInfo): boolean {
    if (!order.signedOrder.makerAssetAmount.eq(order.signedOrder.takerAssetAmount)) return false;
    if (order.signedOrder.makerAssetData.length !== EXPECTED_ASSET_DATA_LENGTH) return false;
    if (order.signedOrder.takerAssetData !== this.takerAssetData) return false;
    return true;
  }

  validateStoredOrder(storedOrder: StoredOrder, markets: _.Dictionary<MarketData>): boolean {
    // Validate the order is a multiple of the recommended trade interval
    let tradeInterval = DEFAULT_TRADE_INTERVAL;
    const marketData = markets[storedOrder.market];
    if (storedOrder.invalidOrder) return false;
    if (marketData && marketData.marketType == MarketType.Scalar) {
      tradeInterval = getTradeInterval(new BigNumber(marketData.prices[0]), new BigNumber(marketData.prices[1]), new BigNumber(marketData.numTicks));
    }
    if (!storedOrder['numberAmount'].mod(tradeInterval).isEqualTo(0)) return false;

    if (storedOrder.numberAmount.isEqualTo(0)) {
      console.log('Deleting filled order');
      this.table.where('orderHash').equals(storedOrder.orderHash).delete();
      const event = {eventType: OrderEventType.Fill, orderId: storedOrder.orderHash,...storedOrder};
      this.augur.events.emit(SubscriptionEventName.BulkOrderEvent, { logs: [event] });
      this.augur.events.emit(SubscriptionEventName.DBUpdatedZeroXOrders, event);
      return false;
    }
    return true;
  }

  processOrder(order: OrderInfo): StoredOrder {
    const augurOrderData = this.parseAssetDataAndValidate(order.signedOrder.makerAssetData);
    const signedOrder = order.signedOrder;
    return {
      orderId: order.orderHash,
      market: augurOrderData.market,
      price: augurOrderData.price,
      outcome: augurOrderData.outcome,
      orderType: augurOrderData.orderType,
      orderHash: order.orderHash,
      amount: order.fillableTakerAssetAmount.toFixed(),
      numberAmount: order.fillableTakerAssetAmount,
      orderCreator: getAddress(signedOrder.makerAddress),
      signedOrder: {
        signature: signedOrder.signature,
        senderAddress: getAddress(signedOrder.senderAddress),
        makerAddress: getAddress(signedOrder.makerAddress),
        takerAddress: getAddress(signedOrder.takerAddress),
        makerFee: signedOrder.makerFee.toFixed(),
        takerFee: signedOrder.takerFee.toFixed(),
        makerAssetAmount: signedOrder.makerAssetAmount.toFixed(),
        takerAssetAmount: signedOrder.takerAssetAmount.toFixed(),
        makerAssetData: signedOrder.makerAssetData,
        takerAssetData: signedOrder.takerAssetData,
        salt: signedOrder.salt.toFixed(),
        exchangeAddress: getAddress(signedOrder.exchangeAddress),
        feeRecipientAddress: signedOrder.feeRecipientAddress,
        expirationTimeSeconds: signedOrder.expirationTimeSeconds.toFixed(),
      },
    }
  }

  parseAssetDataAndValidate(assetData: string): OrderData {
    try {
      const { orderData, multiAssetData } = parseAssetData(assetData);
      orderData.invalidOrder = !this.isValidMultiAssetFormat(multiAssetData);
      return orderData;
    } catch(e) {
      throw new Error(`Validation raised error. Error: ${e}`);
    }
  }

  isValidMultiAssetFormat(multiAssetData: any): boolean {
    const amounts = multiAssetData[0] as BigNumber[];
    if (amounts.length !== 3) return false;
    if (!amounts[0].eq(1)) return false;
    if (!amounts[1].eq(0)) return false;
    if (!amounts[2].eq(0)) return false;
    const nestedAssetData = multiAssetData[1] as string[];
    const tradeTokenAssetData = nestedAssetData[0];
    const cashAssetData = nestedAssetData[1];
    const shareAssetData = nestedAssetData[2];
    if (tradeTokenAssetData.substr(34, 40) !== this.tradeTokenAddress) return false;
    if (cashAssetData !== this.cashAssetData) return false;
    if (shareAssetData !== this.shareAssetData) return false;
    return true;
  }
}
