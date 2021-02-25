import { Address } from '@graphprotocol/graph-ts';
import { BPool, LOG_CALL, LOG_EXIT, LOG_JOIN, LOG_SWAP } from '../../generated/templates/BPool/BPool';
import { BPool as BPoolEntity } from '../../generated/schema';

export function handleBPoolActionCall(event: LOG_CALL): void {
  updateBPool(event.address.toHexString());
}
export function handleBPoolActionExit(event: LOG_EXIT): void {
  updateBPool(event.address.toHexString());
}
export function handleBPoolActionJoin(event: LOG_JOIN): void {
  updateBPool(event.address.toHexString());
}
export function handleBPoolActionSwap(event: LOG_SWAP): void {
  updateBPool(event.address.toHexString());
}

export function updateBPool(id: string): void {
  let bPool = BPool.bind(Address.fromString(id));
  let bPoolEntity = BPoolEntity.load(id);

  let tokens = bPool.getCurrentTokens();
  bPoolEntity.cashBalance = bPool.getBalance(tokens[0]);
  bPoolEntity.cashWeight = bPool.getNormalizedWeight(tokens[0]);

  bPoolEntity.invalidBalance = bPool.getBalance(tokens[1]);
  bPoolEntity.invalidWeight = bPool.getNormalizedWeight(tokens[1]);

  bPoolEntity.save();
}
