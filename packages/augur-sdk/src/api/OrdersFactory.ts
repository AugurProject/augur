import { BigNumber } from 'bignumber.js';
import { Augur } from './../Augur';
import { DB } from '../state/db/DB';
import * as _ from "lodash";

export interface OrdersFactoryAPI {
  getUserOrders(augur: Augur, db: DB, params: UserOrdersParams): Promise<any[]>;
}

export interface UserOrdersParams {
  account: string;
}

export class OrdersFactory implements OrdersFactoryAPI {

  async getUserOrders(augur: Augur, db: DB, params: UserOrdersParams): Promise<any[]> {
    const isZeroX = typeof augur.zeroX !== 'undefined';
    let currentOrdersResponse = [];
    if (isZeroX) {
      currentOrdersResponse = await db.ZeroXOrders.where('orderCreator')
        .equals(params.account)
        .or('orderFiller')
        .equals(params.account)
        .toArray();
    } else {
      currentOrdersResponse = await db.CurrentOrders.where('orderCreator')
        .equals(params.account)
        .or('orderFiller')
        .equals(params.account)
        .and(log => log.amount > '0x00')
        .toArray();
    }

    return currentOrdersResponse;
  }
}
