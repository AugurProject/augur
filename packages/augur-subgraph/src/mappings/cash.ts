import { AMMExchange } from '../../generated/schema';
import {  Transfer } from '../../generated/templates/Cash/ERC20';

export function handleCashTransfer(event: Transfer): void {
  let _from = event.params.from.toHexString();
  let _to = event.params.to.toHexString()
  let _amount = event.params.value;

  let _fromExchange = AMMExchange.load(_from);
  if(_fromExchange != null) {
    _fromExchange.cashBalance = _fromExchange.cashBalance.minus(_amount);
  }

  let _toExchange = AMMExchange.load(_to);
  if(_toExchange != null) {
    _fromExchange.cashBalance = _fromExchange.cashBalance.plus(_amount);
  }
}
