import { BigInt } from '@graphprotocol/graph-ts/index';
import {
  EnterPosition as EnterPositionEvent,
  ExitPosition as ExitPositionEvent,
  SwapPosition as SwapPositionEvent,
} from '../../generated/templates/AMMExchange/AMMExchange';
import {
  AddLiquidityCall,
  RemoveLiquidityCall,
} from '../../generated/templates/AMMExchange/AMMExchange';
import {
  AMMExchange,
  EnterPosition,
  ExitPosition,
  SwapPosition
} from "../../generated/schema";

export function handleAddLiquidity(call: AddLiquidityCall) {

}

export function handleRemoveLiquidity(call: RemoveLiquidityCall) {

}

// Volume = tokens * cash
export function handleEnterPosition(event: EnterPositionEvent) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let enterPositionEvent = new EnterPosition(id);

  let ammExchange = AMMExchange.load(event.address);

  enterPositionEvent.ammExchange = event.address;
  enterPositionEvent.cash = event.params.cash;
  enterPositionEvent.sender = event.params.sender;

  if(event.params.buyYes) {
    enterPositionEvent.yesShares = event.params.outputShares;
    ammExchange.volumeYes = ammExchange.volumeYes.plus(event.params.outputShares);

    enterPositionEvent.noShares = BigInt.fromI32(0);
  } else {
    enterPositionEvent.yesShares = BigInt.fromI32(0);

    enterPositionEvent.noShares = event.params.outputShares;
    ammExchange.volumeNo = ammExchange.volumeNo.plus(enterPositionEvent.noShares);
  }

  enterPositionEvent.save();
}

export function handleExitPosition(event: ExitPositionEvent) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let exitPositionEvent = new ExitPosition(id);

  let ammExchange = AMMExchange.load(event.address);

  exitPositionEvent.ammExchange = event.address;
  exitPositionEvent.cash = event.params.cashPayout;
  exitPositionEvent.invalidShares = event.params.invalidShares;

  exitPositionEvent.noShares = event.params.noShares;
  ammExchange.volumeNo = ammExchange.volumeNo.plus(enterPositionEvent.noShares);

  exitPositionEvent.yesShares = event.params.yesShares;
  ammExchange.volumeYes = ammExchange.volumeYes.plus(enterPositionEvent.yesShares);

  exitPositionEvent.save();
}

export function handleSwapPosition(event: SwapPositionEvent) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let swapPositionEvent = new SwapPosition(id);

  let ammExchange = AMMExchange.load(event.address);

  swapPositionEvent.ammExchange = event.address;

  if(event.params.inputYes) {
    swapPositionEvent.yesShares = event.params.inputShares.times(BigInt.fromI32(-1));
    ammExchange.volumeYes = ammExchange.volumeYes.plus(event.params.inputShares);

    swapPositionEvent.noShares = event.params.outputShares;
    ammExchange.volumeNo = ammExchange.volumeNo.plus(event.params.outputShares);
  } else {
    swapPositionEvent.noShares = event.params.inputShares.times(BigInt.fromI32(-1));
    ammExchange.volumeNo = ammExchange.volumeNo.plus(event.params.inputShares);

    swapPositionEvent.yesShares = event.params.outputShares;
    ammExchange.volumeYes = ammExchange.volumeYes.plus(event.params.outputShares);
  }

  swapPositionEvent.save();
}
