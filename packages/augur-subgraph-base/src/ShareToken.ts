import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
  ApprovalForAll as ApprovalForAllEvent,
  TransferBatch as TransferBatchEvent,
  TransferSingle as TransferSingleEvent,
  URI as URIEvent,
} from '../generated/ShareToken/ShareToken';

import {
  ApprovalForAll as ApprovalForAllEntity,
  TransferBatch as TransferBatchEntity,
  TransferSingle as TransferSingleEntity,
  URI as URIEntity,
} from '../generated/schema';


function mapAddressArray(arr:Address[]):string[] {
  let result = new Array<string>(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i].toHexString());
  }

  return result;
}

function mapByteArray(arr:Bytes[]):string[] {
  let result = new Array<string>(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i].toHexString());
  }

  return result;
}

function mapArray(arr: BigInt[]):string[] {
  let result = new Array<string>(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i].toHexString());
  }

  return result;
}


export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new ApprovalForAllEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number;
  entity.logIndex = event.logIndex.toString();
  entity.name = "ApprovalForAll";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.owner = event.params.owner.toHexString();
  entity.operator = event.params.operator.toHexString();
  entity.approved = event.params.approved;

  entity.save();
}

export function handleTransferBatch(event: TransferBatchEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TransferBatchEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number;
  entity.logIndex = event.logIndex.toString();
  entity.name = "TransferBatch";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.operator = event.params.operator.toHexString();
  entity.from = event.params.from.toHexString();
  entity.to = event.params.to.toHexString();
  entity.ids = mapArray(event.params.ids);
  entity.values = mapArray(event.params.values);

  entity.save();
}

export function handleTransferSingle(event: TransferSingleEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new TransferSingleEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number;
  entity.logIndex = event.logIndex.toString();
  entity.name = "TransferSingle";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.operator = event.params.operator.toHexString();
  entity.from = event.params.from.toHexString();
  entity.to = event.params.to.toHexString();
  entity.id = event.params.id.toHexString();
  entity.value = event.params.value.toHexString();

  entity.save();
}

export function handleURI(event: URIEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let entity = new URIEntity(id);

  entity.blockHash = event.block.hash.toHexString();
  entity.blockNumber = event.block.number;
  entity.logIndex = event.logIndex.toString();
  entity.name = "URI";
  entity.transactionHash = event.transaction.hash.toHexString();

  entity.value = event.params.value;
  entity.id = event.params.id.toHexString();

  entity.save();
}

