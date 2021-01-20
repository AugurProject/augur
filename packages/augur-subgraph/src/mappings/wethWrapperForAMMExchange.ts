import { BigInt } from '@graphprotocol/graph-ts';
import {
  AddLiquidity,
  EnterPosition,
  ExitPosition,
  RemoveLiquidity,
} from '../../generated/schema';
import {
  AddLiquidity as AddLiquidityEvent,
  EnterPosition as EnterPositionEvent,
  ExitPosition as ExitPositionEvent,
} from '../../generated/WethWrapperForAMMExchange/WethWrapperForAMMExchange';

export function wethWrapperHandleAddLiquidity(event: AddLiquidityEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(1)).toString();
  let addLiquidity = AddLiquidity.load(id);

  addLiquidity.sender = event.params.sender.toHexString();
  addLiquidity.save();
}

export function wethWrapperHandleEnterPosition(event: EnterPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(1)).toString();
  let enterPosition = EnterPosition.load(id);

  enterPosition.sender = event.params.sender.toHexString();
  enterPosition.save();
}

export function wethWrapperHandleExitPosition(event: ExitPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(1)).toString();
  let exitPosition = ExitPosition.load(id);

  exitPosition.sender = event.params.sender.toHexString();
  exitPosition.save();
}

export function wethWrapperHandleRemoveLiquidity(event: ExitPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(1)).toString();
  let removeLiquidity = RemoveLiquidity.load(id);

  removeLiquidity.sender = event.params.sender.toHexString();
  removeLiquidity.save();
}
