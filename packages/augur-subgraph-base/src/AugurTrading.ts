import { Address, BigDecimal, BigInt, Bytes, crypto, log } from '@graphprotocol/graph-ts';
import { toChecksumAddress, mapAddressArray, mapByteArray, mapArray } from './utils';
import {
  CancelZeroXOrder as CancelZeroXOrderEvent,
  MarketVolumeChanged as MarketVolumeChangedEvent,
  OrderEvent as OrderEventEvent,
  ProfitLossChanged as ProfitLossChangedEvent,
} from '../generated/AugurTrading/AugurTrading';

import {
  CancelZeroXOrder as CancelZeroXOrderEntity,
  MarketVolumeChanged as MarketVolumeChangedEntity,
  OrderEvent as OrderEventEntity,
  ProfitLossChanged as ProfitLossChangedEntity,
} from '../generated/schema';

export function handleCancelZeroXOrder(event: CancelZeroXOrderEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new CancelZeroXOrderEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "CancelZeroXOrder";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.account = toChecksumAddress(event.params.account);
  entity.outcome = event.params.outcome.toHexString();
  entity.price = event.params.price.toHexString();
  entity.amount = event.params.amount.toHexString();
  entity.orderType = event.params.orderType;
  entity.orderHash = event.params.orderHash;

  entity.save();
}

export function handleMarketVolumeChanged(event: MarketVolumeChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new MarketVolumeChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "MarketVolumeChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.volume = event.params.volume.toHexString();
  entity.outcomeVolumes = mapArray(event.params.outcomeVolumes);
  entity.totalTrades = event.params.totalTrades.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}

export function handleOrderEvent(event: OrderEventEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new OrderEventEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "OrderEvent";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.eventType = event.params.eventType;
  entity.orderType = event.params.orderType;
  entity.orderId = event.params.orderId;
  entity.tradeGroupId = event.params.tradeGroupId;
  entity.addressData = mapAddressArray(event.params.addressData);
  entity.uint256Data = mapArray(event.params.uint256Data);

  entity.save();
}

export function handleProfitLossChanged(event: ProfitLossChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ProfitLossChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "ProfitLossChanged";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.account = toChecksumAddress(event.params.account);
  entity.outcome = event.params.outcome.toHexString();
  entity.netPosition = event.params.netPosition.toHexString();
  entity.avgPrice = event.params.avgPrice.toHexString();
  entity.realizedProfit = event.params.realizedProfit.toHexString();
  entity.frozenFunds = event.params.frozenFunds.toHexString();
  entity.realizedCost = event.params.realizedCost.toHexString();
  entity.timestamp = event.params.timestamp.toHexString();

  entity.save();
}
