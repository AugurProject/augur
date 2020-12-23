import { Address, BigDecimal, BigInt, Bytes, crypto, log } from '@graphprotocol/graph-ts';
import { toChecksumAddress, mapAddressArray, mapByteArray, mapArray, bigIntToHexString } from './utils';
import {
  ApprovalForAll as ApprovalForAllEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from '../generated/templates/ParaShareToken/ParaShareToken';

import {
  ApprovalForAll as ApprovalForAllEntity,
  TransferBatch as TransferBatchEntity,
  TransferSingle as TransferSingleEntity,
  URI as URIEntity,
} from '../generated/schema';

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ApprovalForAllEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "ApprovalForAll";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.owner = toChecksumAddress(event.params.owner);
  entity.operator = toChecksumAddress(event.params.operator);
  entity.approved = event.params.approved;

  entity.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TransferBatchEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "TransferBatch";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.operator = toChecksumAddress(event.params.operator);
  entity.from = toChecksumAddress(event.params.from);
  entity.to = toChecksumAddress(event.params.to);
  entity.ids = mapArray(event.params.ids);
  entity.values = mapArray(event.params.values);

  entity.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TransferSingleEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "TransferSingle";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.operator = toChecksumAddress(event.params.operator);
  entity.from = toChecksumAddress(event.params.from);
  entity.to = toChecksumAddress(event.params.to);
  entity.id = bigIntToHexString(event.params.id);
  entity.value = bigIntToHexString(event.params.value);

  entity.save();
}

export function handleURI(event: URIEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new URIEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number.toI32();
  entity.logIndex = event.logIndex.toI32();
  entity.name = "URI";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.value = event.params.value;
  entity.id = bigIntToHexString(event.params.id);

  entity.save();
}
