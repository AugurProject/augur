import { Address, BigDecimal, BigInt, Bytes, crypto, log } from '@graphprotocol/graph-ts';
import { toChecksumAddress, mapAddressArray, mapByteArray, mapArray, bigIntToHexString } from './utils';
import {
  ApprovalForAll as ApprovalForAllEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from '../generated/ShareToken/ShareToken';

import {
  ApprovalForAllEvent as ApprovalForAllEntity,
  TransferBatchEvent as TransferBatchEntity,
  TransferSingleEvent as TransferSingleEntity,
  URIEvent as URIEntity,
} from '../generated/schema';

export function handleApprovalForAllEvent(event: ApprovalForAllEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ApprovalForAllEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "ApprovalForAll";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.owner = toChecksumAddress(event.params.owner);
  entity.operator = toChecksumAddress(event.params.operator);
  entity.approved = event.params.approved;

  entity.save();
}

export function handleTransferBatchEvent(event: TransferBatchEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TransferBatchEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "TransferBatch";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.operator = toChecksumAddress(event.params.operator);
  entity.from = toChecksumAddress(event.params.from);
  entity.to = toChecksumAddress(event.params.to);
  entity.ids = mapArray(event.params.ids);
  entity.values = mapArray(event.params.values);

  entity.save();
}

export function handleTransferSingleEvent(event: TransferSingleEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TransferSingleEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "TransferSingle";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.operator = toChecksumAddress(event.params.operator);
  entity.from = toChecksumAddress(event.params.from);
  entity.to = toChecksumAddress(event.params.to);
  entity.id = bigIntToHexString(event.params.id);
  entity.value = bigIntToHexString(event.params.value);

  entity.save();
}

export function handleURIEvent(event: URIEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new URIEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.logPosition = event.block.number.toString().padStart(10, "0") + "-" + event.logIndex.toString().padStart(5, "0");
  entity.name = "URI";
  entity.transactionHash = event.transaction.hash.toHexString();
  entity.origin = event.transaction.from.toHexString();

  entity.value = event.params.value;
  entity.id = bigIntToHexString(event.params.id);

  entity.save();
}
