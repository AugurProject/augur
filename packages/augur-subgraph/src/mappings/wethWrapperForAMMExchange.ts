import { BigInt } from '@graphprotocol/graph-ts';
import {
  AddLiquidity,
  EnterPosition,
  ExitPosition,
  RemoveLiquidity,
  TradingProceedsClaimed
} from '../../generated/schema';
import {
  AddLiquidity as AddLiquidityEvent,
  EnterPosition as EnterPositionEvent,
  ExitPosition as ExitPositionEvent,
  TradingProceedsClaimed as TradingProceedsClaimedEvent,
} from '../../generated/WethWrapperForAMMExchange/WethWrapperForAMMExchange';
import { getOrCreateUser } from '../utils/helpers';

export function wethWrapperHandleAddLiquidity(event: AddLiquidityEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(1)).toString();
  let addLiquidity = AddLiquidity.load(id);
  if(addLiquidity == null) {
    return;
  }

  getOrCreateUser(event.params.sender.toHexString());
  addLiquidity.sender = event.params.sender.toHexString();
  addLiquidity.save();
}

export function wethWrapperHandleEnterPosition(event: EnterPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(1)).toString();
  let enterPosition = EnterPosition.load(id);
  if(enterPosition == null) {
    return;
  }

  getOrCreateUser(event.params.sender.toHexString());
  enterPosition.sender = event.params.sender.toHexString();
  enterPosition.save();
}

export function wethWrapperHandleExitPosition(event: ExitPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(1)).toString();
  let exitPosition = ExitPosition.load(id);
  if(exitPosition == null) {
    return;
  }

  getOrCreateUser(event.params.sender.toHexString());
  exitPosition.sender = event.params.sender.toHexString();
  exitPosition.save();
}

export function wethWrapperHandleRemoveLiquidity(event: ExitPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(1)).toString();
  let removeLiquidity = RemoveLiquidity.load(id);
  if(removeLiquidity == null) {
    return;
  }

  getOrCreateUser(event.params.sender.toHexString());
  removeLiquidity.sender = event.params.sender.toHexString();
  removeLiquidity.save();
}

export function wethTradingProceedsClaimed(event: TradingProceedsClaimedEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.minus(BigInt.fromI32(3)).toString();
  let tradingProceedsClaimed = TradingProceedsClaimed.load(id);
  if(tradingProceedsClaimed == null) {
    return;
  }

  getOrCreateUser(event.params.sender.toHexString());
  tradingProceedsClaimed.sender = event.params.sender.toHexString();
  tradingProceedsClaimed.save();
}
