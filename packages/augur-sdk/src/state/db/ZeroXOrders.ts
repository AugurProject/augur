import * as _ from 'lodash';
import { AbstractDB, BaseDocument } from './AbstractDB';
import { SyncStatus } from './SyncStatus';
import { Augur } from '../../Augur';
import { DB } from './DB';
import { augurEmitter } from '../../events';
import { OrderInfo } from '@0x/mesh-rpc-client';
import { getAddress } from "ethers/utils/address";
import { SignedOrder } from '@0x/types';

// Save incremented id with logs
// Do Below in background. Use old orders DB until this is done via old incremented id
// On completion replace incremented id market and delete all not that incremented id
// for blockstream start subscription

export interface OrderData {
  market: string;
  price: string;
  outcome: string;
  orderType: string;
  kycToken: string;
}

export interface Document extends BaseDocument {
  blockNumber: number;
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

  async sync(): Promise<void> {
    const orders: Array<OrderInfo> = await this.augur.zeroX.getOrders();
    let success = true;
    let documents;
    if (orders.length > 0) {
      documents = _.map(orders, this.processOrder.bind(this));

      success = await this.bulkUpsertOrderedDocuments(
        documents[0]._id,
        documents
      );
    }
    if (success) {
      augurEmitter.emit("ZeroXOrders", {});
    } else {
      throw new Error('Unable to sync ZeroX Orders');
    }
  }

  processOrder(order: OrderInfo): BaseDocument {
    const _id = order.orderHash;
    const augurOrderData = this.parseAssetData(order.signedOrder.takerAssetData);
    const savedOrder = Object.assign({ _id, signedOrder: order.signedOrder, amount: order.fillableTakerAssetAmount }, augurOrderData);
    return savedOrder;
  }

  parseAssetData(assetData: string): OrderData {
    const data = assetData.substr(2); // remove the 0x
    return {
      market: getAddress(`0x${data.substr(96, 40)}`),
      price: `0x${data.substr(136, 64)}`,
      outcome: `0x${data.substr(200, 64)}`,
      orderType: `0x${data.substr(264, 64)}`,
      kycToken: getAddress(`0x${data.substr(352, 40)}`),
    }
  }
}
