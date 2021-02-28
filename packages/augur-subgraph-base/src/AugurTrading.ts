import { Address, BigDecimal, BigInt, Bytes, crypto, log } from '@graphprotocol/graph-ts';
import { toChecksumAddress, mapAddressArray, mapByteArray, mapArray, bigIntToHexString } from './utils';
import {
  CancelZeroXOrder as CancelZeroXOrderEvent,
  MarketVolumeChanged as MarketVolumeChangedEvent,
  OrderEvent as OrderEventEvent,
  ProfitLossChanged as ProfitLossChangedEvent,
} from '../generated/AugurTrading/AugurTrading';

import {
  CancelZeroXOrderEvent as CancelZeroXOrderEntity,
  MarketVolumeChangedEvent as MarketVolumeChangedEntity,
  OrderEventEvent as OrderEventEntity,
  ProfitLossChangedEvent as ProfitLossChangedEntity,
} from '../generated/schema';

export function handleCancelZeroXOrderEvent(event: CancelZeroXOrderEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new CancelZeroXOrderEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "CancelZeroXOrder";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.account = toChecksumAddress(event.params.account);
  entity.outcome = bigIntToHexString(event.params.outcome);
  entity.price = bigIntToHexString(event.params.price);
  entity.amount = bigIntToHexString(event.params.amount);
  entity.orderType = event.params.orderType;
  entity.orderHash = event.params.orderHash;

  entity.save();
}

export function handleMarketVolumeChangedEvent(event: MarketVolumeChangedEvent): void {
  let market = toChecksumAddress(event.params.market);

  let id = market;

  let entity = MarketVolumeChangedEntity.load(id);
  if (entity == null) {
    entity = new MarketVolumeChangedEntity(id);
  }

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "MarketVolumeChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.volume = bigIntToHexString(event.params.volume);
  entity.outcomeVolumes = mapArray(event.params.outcomeVolumes);
  entity.totalTrades = bigIntToHexString(event.params.totalTrades);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}

export function handleOrderEventEvent(event: OrderEventEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new OrderEventEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "OrderEvent";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

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

export function handleProfitLossChangedEvent(event: ProfitLossChangedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ProfitLossChangedEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "ProfitLossChanged";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.universe = toChecksumAddress(event.params.universe);
  entity.market = toChecksumAddress(event.params.market);
  entity.account = toChecksumAddress(event.params.account);
  entity.outcome = bigIntToHexString(event.params.outcome);
  entity.netPosition = bigIntToHexString(event.params.netPosition);
  entity.avgPrice = bigIntToHexString(event.params.avgPrice);
  entity.realizedProfit = bigIntToHexString(event.params.realizedProfit);
  entity.frozenFunds = bigIntToHexString(event.params.frozenFunds);
  entity.realizedCost = bigIntToHexString(event.params.realizedCost);
  entity.timestamp = bigIntToHexString(event.params.timestamp);

  entity.save();
}
