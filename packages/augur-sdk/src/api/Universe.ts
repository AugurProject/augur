import {IContract} from "./types";

export class Universe implements IContract {
  constructor(private _address:string) {}
  getAddress(): string {
    return this._address;
  }
}
