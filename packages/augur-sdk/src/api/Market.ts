import {IContract} from "./types";
import {Order} from "./Order";


export class Market implements IContract {
  constructor(private _address: string) {
  }

  getAddress(): string {
    return this._address;
  }

  getOrders(): Array<Order> {
    // Grab orders for market here and return them.
  }

  cancelOrders(orderIds: Array<string>): boolean {
    // Call CancelOrders contract here.
  }


}
