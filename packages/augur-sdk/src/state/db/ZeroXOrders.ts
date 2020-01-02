import * as _ from 'lodash';
import { AbstractTable, BaseDocument } from './AbstractTable';
import { SyncStatus } from './SyncStatus';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { MarketData, MarketType } from '../logs/types';
import { OrderInfo, OrderEvent } from '@0x/mesh-rpc-client';
import { getAddress } from "ethers/utils/address";
import { SignedOrder } from '@0x/types';
import { BigNumber } from 'bignumber.js';

// This database clears its contents on every sync.
// The primary purposes for even storing this data are:
// 1. To recalculate liquidity metrics. This can be stale so when the derived market DB is synced it should not wait for this to complete (it will already have recorded liquidity data from previous syncs)
// 2. To cache market orderbooks so a complete pull isnt needed on every subsequent load.

const EXPECTED_ASSET_DATA_LENGTH = 650;

const DEFAULT_TRADE_INTERVAL = new BigNumber(10**17);
const TRADE_INTERVAL_VALUE = new BigNumber(10**19);

export interface OrderData {
  market: string;
  price: string;
  outcome: string;
  orderType: string;
  kycToken: string;
  exchange: string;
}

export interface Document extends BaseDocument {
  blockNumber: number;
}

export interface SnapshotCounterDocument extends BaseDocument {
  snapshotCounter: number;
}

export interface StoredOrder extends OrderData {
  orderHash: string,
  signedOrder: SignedOrder,
  amount: string,
}

/**
 * Stores 0x orders
 */
export class ZeroXOrders extends AbstractTable {
  protected syncStatus: SyncStatus;
  protected stateDB: DB;
  private augur: Augur;
  readonly tradeTokenAddress: string;

  constructor(
    db: DB,
    networkId: number,
    augur: Augur
  ) {
    super(networkId, "ZeroXOrders", db.dexieDB);
    this.syncStatus = db.syncStatus;
    this.stateDB = db;
    this.augur = augur;
    this.tradeTokenAddress = this.augur.addresses.ZeroXTrade.substr(2).toLowerCase(); // normalize and remove the 0x
  }

  static async create(db: DB, networkId: number, augur: Augur): Promise<ZeroXOrders> {
    const zeroXOrders = new ZeroXOrders(db, networkId, augur);
    await zeroXOrders.clearDB();
    await zeroXOrders.subscribeToMeshEvents();
    return zeroXOrders;
  }

  async subscribeToMeshEvents(): Promise<void> {
    return await this.augur.zeroX.subscribeToMeshEvents(this.handleMeshEvent.bind(this));
  }

  async handleMeshEvent(orderEvents: OrderEvent[]): Promise<void> {
    const filteredOrders = _.filter(orderEvents, this.validateOrder.bind(this));
    let documents = _.map(filteredOrders, this.processOrder.bind(this));
    documents = _.filter(documents, this.validateStoredOrder.bind(this));
    await this.bulkUpsertDocuments(documents);
    this.augur.getAugurEventEmitter().emit("ZeroXOrders", documents);
  }

  async sync(): Promise<void> {
    const orders: Array<OrderInfo> = await this.augur.zeroX.getOrders();
    let documents;
    if (orders.length > 0) {
      documents = _.filter(orders, this.validateOrder.bind(this));
      documents = _.map(documents, this.processOrder.bind(this));
      const marketIds: string[] = _.uniq(_.map(documents, "market"));
      const markets = _.keyBy(await this.stateDB.Markets.where("market").anyOf(marketIds).toArray(), "market");
      documents = _.filter(documents, (document) => {
        return this.validateStoredOrder(document, markets);
      });
      await this.bulkUpsertDocuments(documents);
    }
    this.augur.getAugurEventEmitter().emit("ZeroXOrders", {});
  }

  validateOrder(order: OrderInfo): boolean {
    if (order.signedOrder.makerAssetData.length !== EXPECTED_ASSET_DATA_LENGTH) return false;
    if (order.signedOrder.makerAssetData !== order.signedOrder.takerAssetData) return false;
    if (order.signedOrder.makerAssetData.substr(34, 40) !== this.tradeTokenAddress) return false;
    return true;
  }

  validateStoredOrder(storedOrder: StoredOrder, markets: _.Dictionary<MarketData>): boolean {
    // Validate the order is a multiple of the recommended trade interval
    let tradeInterval = DEFAULT_TRADE_INTERVAL;
    const marketData = markets[storedOrder.market];
    if (marketData && marketData.marketType == MarketType.Scalar) {
      tradeInterval = TRADE_INTERVAL_VALUE.dividedBy(marketData.numTicks);
    }
    if (!storedOrder["numberAmount"].mod(tradeInterval).isEqualTo(0)) return false;
    return true;
  }

  processOrder(order: OrderInfo): StoredOrder {
    const augurOrderData = this.parseAssetData(order.signedOrder.makerAssetData);
    const amount = order.fillableTakerAssetAmount;
    const savedOrder = Object.assign({ signedOrder: order.signedOrder, amount: amount.toFixed(), numberAmount: amount, orderHash: order.orderHash }, augurOrderData);
    return savedOrder;
  }

  parseAssetData(assetData: string): OrderData {
    const data = assetData.substr(2); // remove the 0x
    return {
      market: getAddress(`0x${data.substr(392, 40)}`),
      price: `0x${data.substr(432, 20)}`,
      outcome: `0x${data.substr(452, 2)}`,
      orderType: `0x${data.substr(454, 2)}`,
      kycToken: getAddress(`0x${data.substr(224, 40)}`),
      exchange: getAddress(`0x${data.substr(288, 40)}`),
    }
  }
}
