import {Market} from "./Market";

export enum OrderStatus {
  PENDING,
  SUBMITTED,
  CANCELLING,
  CANCELLED,
  FILLED
}

export class Order {
  constructor(private _market:Market, private _orderId:string) {}
  cancelOrder(): boolean {
    // Cancel the order calling
    return this._market.cancelOrders([this._orderId]);
  }
}
