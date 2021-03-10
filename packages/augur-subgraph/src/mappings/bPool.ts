import {Address, BigInt} from '@graphprotocol/graph-ts';
import { BPool, LOG_CALL, LOG_EXIT, LOG_JOIN, LOG_SWAP } from '../../generated/templates/BPool/BPool';
import { BPool as BPoolEntity } from '../../generated/schema';

export function handleBPoolActionCall(event: LOG_CALL): void {
  updateOrCreateBPool(event.address.toHexString());
}
export function handleBPoolActionExit(event: LOG_EXIT): void {
  updateOrCreateBPool(event.address.toHexString());
}
export function handleBPoolActionJoin(event: LOG_JOIN): void {
  updateOrCreateBPool(event.address.toHexString());
}
export function handleBPoolActionSwap(event: LOG_SWAP): void {
  updateOrCreateBPool(event.address.toHexString());
}

export function updateOrCreateBPool(id: string): void {
  let bPool = BPool.bind(Address.fromString(id));
  let bPoolEntity = BPoolEntity.load(id);

  if(bPoolEntity == null) {
    bPoolEntity = new BPoolEntity(id);
  }

  let tokens = bPool.getCurrentTokens();
  bPoolEntity.cashBalance = bPool.getBalance(tokens[0]);
  bPoolEntity.cashWeight = bPool.getNormalizedWeight(tokens[0]);

  bPoolEntity.invalidBalance = bPool.getBalance(tokens[1]);
  bPoolEntity.invalidWeight = bPool.getNormalizedWeight(tokens[1]);

  let cashPrice = bPool.getSpotPrice(tokens[0], tokens[1]);
  let invalidPrice = bPool.getSpotPrice(tokens[1], tokens[0]);

  bPoolEntity.spotPrice = new Array(2);
  bPoolEntity.spotPrice.push(invalidPrice);
  bPoolEntity.spotPrice.push(cashPrice);

  bPoolEntity.swapFee = bPool.getSwapFee();

  bPoolEntity.save();
}
