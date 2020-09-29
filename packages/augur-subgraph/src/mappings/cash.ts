import { AMMExchange } from '../../generated/schema';
import {  Transfer } from '../../generated/templates/Cash/ERC20';

export function handleCashTransfer(event: Transfer): void {
  const _from = event.params.from.toHexString();
  const _to = event.params.to.toHexString()
  const _amount = event.params.value;

  const _fromExchange = AMMExchange.load(_from);
  if(_fromExchange != null) {
    _fromExchange.cashBalance = _fromExchange.cashBalance.minus(_amount);
  }

  const _toExchange = AMMExchange.load(_to);
  if(_toExchange != null) {
    _fromExchange.cashBalance = _fromExchange.cashBalance.plus(_amount);
  }
}
