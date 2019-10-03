import * as _ from 'lodash';
import { AbstractDB, BaseDocument } from './AbstractDB';
import { SyncStatus } from './SyncStatus';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { augurEmitter } from '../../events';
import { OrderInfo, OrderEvent } from '@0x/mesh-rpc-client';
import { getAddress } from "ethers/utils/address";
import { SignedOrder } from '@0x/types';

// This database clears its contents on every sync. The primary purposes for even storing this data are:
// 1. To recalculate liquidity metrics. This can be stale so when the derived market DB is synced it should not wait for this to complete (it will already have recorded liquidity data from previous syncs)
// 2. To cache market orderbooks so a complete pull isnt needed on every subsequent load. We can do this on demand if the full sync above is too slow

const EXPECTED_ASSET_DATA_LENGTH = 714;

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
export class ZeroXOrders extends AbstractDB {
  protected syncStatus: SyncStatus;
  protected stateDB: DB;
  private augur: Augur;

  constructor(
    db: DB,
    networkId: number,
    augur: Augur
  ) {
    super(networkId, db.getDatabaseName("ZeroXOrders"), db.pouchDBFactory);
    this.syncStatus = db.syncStatus;
    this.stateDB = db;
    this.augur = augur;
    // TODO: add indicies
  }

  static async create(db: DB, networkId: number, augur: Augur): Promise<ZeroXOrders> {
    const zeroXOrders = new ZeroXOrders(db, networkId, augur);
    await zeroXOrders.deleteOld();
    await zeroXOrders.subscribeToMeshEvents();
    return zeroXOrders;
  }

  async subscribeToMeshEvents(): Promise<void> {
    return await this.augur.zeroX.subscribeToMeshEvents(this.handleMeshEvent.bind(this));
  }

  async deleteOld(): Promise<void> {
    const oldSnapshotRawDocs = await this.allDocs();
    const oldSnapshotDocs = oldSnapshotRawDocs.rows ? oldSnapshotRawDocs.rows.map(row => Object.assign(row.doc, { _deleted: true})) : [];
    if (oldSnapshotDocs.length > 0) {
      await this.bulkUpsertUnorderedDocuments(oldSnapshotDocs);
    }
  }

  // TODO: Investigate actual data returned to see if we need to handle the "KIND" field. If for example a "EXPIRED" kind does not also set the fillableTakerAssetAmount to 0 then we'll need to handle that
  handleMeshEvent(orderEvents: OrderEvent[]): void {
    const filteredOrders = _.filter(orderEvents, this.validateOrder.bind(this));
    const documents = _.map(filteredOrders, this.processOrder.bind(this));
    this.bulkUpsertUnorderedDocuments(
      documents
    ).then((success) => {
      if (success) {
        augurEmitter.emit("ZeroXOrders", documents);
      } else {
        throw new Error('Unable to handle mesh events for ZeroX Orders');
      }
    });
  }

  async sync(): Promise<void> {
    const orders: Array<OrderInfo> = await this.augur.zeroX.getOrders();
    let success = true;
    let documents;
    if (orders.length > 0) {
      documents = _.filter(orders, this.validateOrder.bind(this));
      documents = _.map(documents, this.processOrder.bind(this));

      success = await this.bulkUpsertUnorderedDocuments(
        documents
      );
    }
    if (success) {
      augurEmitter.emit("ZeroXOrders", {});
    } else {
      throw new Error('Unable to sync ZeroX Orders');
    }
  }

  validateOrder(order: OrderInfo): boolean {
    if (order.signedOrder.makerAssetData.length !== EXPECTED_ASSET_DATA_LENGTH) return false;
    if (order.signedOrder.makerAssetData !== order.signedOrder.takerAssetData) return false;
    // TODO Validate minimum order size
    return true;
  }

  processOrder(order: OrderInfo): BaseDocument {
    const _id = order.orderHash;
    const augurOrderData = this.parseAssetData(order.signedOrder.makerAssetData);
    const savedOrder = Object.assign({ _id, signedOrder: order.signedOrder, amount: order.fillableTakerAssetAmount }, augurOrderData);
    return savedOrder;
  }

  parseAssetData(assetData: string): OrderData {
    const data = assetData.substr(2); // remove the 0x
    return {
      market: getAddress(`0x${data.substr(456, 40)}`),
      price: `0x${data.substr(496, 20)}`,
      outcome: `0x${data.substr(516, 2)}`,
      orderType: `0x${data.substr(518, 2)}`,
      kycToken: getAddress(`0x${data.substr(288, 40)}`),
      exchange: getAddress(`0x${data.substr(352, 40)}`),
    }
  }
}
