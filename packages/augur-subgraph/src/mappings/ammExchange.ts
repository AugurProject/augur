import { BigInt } from '@graphprotocol/graph-ts/index';
import {
  EnterPosition as EnterPositionEvent,
  ExitPosition as ExitPositionEvent,
  SwapPosition as SwapPositionEvent,
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,

} from '../../generated/templates/AMMExchange/AMMExchange';
import {
  AMMExchange,
  EnterPosition,
  ExitPosition,
  AddLiquidity,
  RemoveLiquidity,
  SwapPosition
} from "../../generated/schema";

export function handleAddLiquidity(event: AddLiquidityEvent) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let ammExchange = AMMExchange.load(event.address);

  let addLiquidityEvent = new AddLiquidity(id);


  addLiquidityEvent.noShares = event.params.noShares;
  addLiquidityEvent.yesShares = event.params.yesShares;
  addLiquidityEvent.cash = event.params.cash;

  addLiquidityEvent.save();

  ammExchange.volumeNo = ammExchange.volumeNo.plus(addLiquidityEvent.noShares);
  ammExchange.volumeYes = ammExchange.volumeYes.plus(addLiquidityEvent.yesShares);

  ammExchange.save();

  let market = ammExchange.market;
  market.volume = market.volume.plus(addLiquidityEvent.noShares);
  market.volume = market.volume.plus(addLiquidityEvent.yesShares);

  market.save();
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let ammExchange = AMMExchange.load(event.address);

  let removeLiquidityEvent = new RemoveLiquidity(id);

  removeLiquidityEvent.noShares = event.params.noShares;
  removeLiquidityEvent.yesShares = event.params.yesShares;
  removeLiquidityEvent.cash = event.params.cash;

  removeLiquidityEvent.save();

  ammExchange.volumeNo = ammExchange.volumeNo.plus(removeLiquidityEvent.noShares);
  ammExchange.volumeYes = ammExchange.volumeYes.plus(removeLiquidityEvent.yesShares);

  ammExchange.save();

  let market = ammExchange.market;
  market.volume = market.volume.plus(removeLiquidityEvent.noShares);
  market.volume = market.volume.plus(removeLiquidityEvent.yesShares);

  market.save();
}

export function handleEnterPosition(event: EnterPositionEvent) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let ammExchange = AMMExchange.load(event.address);

  let enterPosition = new EnterPosition(id);

  enterPosition.ammExchange = event.address;
  enterPosition.cash = event.params.cash;
  enterPosition.sender = event.params.sender;

  if(event.params.buyYes) {
    enterPosition.noShares = BigInt.fromI32(0);

    enterPosition.yesShares = event.params.outputShares;
    ammExchange.volumeYes = ammExchange.volumeYes.plus(enterPosition.yesShares);
  } else {
    enterPosition.yesShares = BigInt.fromI32(0);

    enterPosition.noShares = event.params.outputShares;
    ammExchange.volumeNo = ammExchange.volumeNo.plus(enterPosition.noShares);
  }

  let market = ammExchange.market;
  market.volume = market.volume.plus(event.params.outputShares);

  enterPosition.save();
}

export function handleExitPosition(event: ExitPositionEvent) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let ammExchange = AMMExchange.load(event.address);

  let exitPosition = new ExitPosition(id);


  exitPosition.ammExchange = event.address;
  exitPosition.cash = event.params.cashPayout;
  exitPosition.invalidShares = event.params.invalidShares;
  exitPosition.sender = event.params.sender;

  exitPosition.noShares = event.params.noShares;
  ammExchange.volumeNo = ammExchange.volumeNo.plus(enterPositionEvent.noShares);

  exitPosition.yesShares = event.params.yesShares;
  ammExchange.volumeYes = ammExchange.volumeYes.plus(enterPositionEvent.yesShares);

  ammExchange.save();

  exitPosition.save();

  let market = ammExchange.market;
  market.volume = market.volume.plus(exitPosition.noShares);
  market.volume = market.volume.plus(exitPosition.yesShares);
  market.save();
}

export function handleSwapPosition(event: SwapPositionEvent) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;
  let ammExchange = AMMExchange.load(event.address);

  let swapPosition = new SwapPosition(id);

  swapPosition.ammExchange = event.address;
  swapPosition.sender

  if(event.params.inputYes) {
    swapPosition.yesShares = event.params.inputShares.times(BigInt.fromI32(-1));
    ammExchange.volumeYes = ammExchange.volumeYes.plus(event.params.inputShares);

    swapPosition.noShares = event.params.outputShares;
    ammExchange.volumeNo = ammExchange.volumeNo.plus(event.params.outputShares);
  } else {
    swapPosition.noShares = event.params.inputShares.times(BigInt.fromI32(-1));
    ammExchange.volumeNo = ammExchange.volumeNo.plus(event.params.inputShares);

    swapPosition.yesShares = event.params.outputShares;
    ammExchange.volumeYes = ammExchange.volumeYes.plus(event.params.outputShares);
  }

  ammExchange.save();

  swapPosition.save();

  let market = ammExchange.market;
  market.volume = market.volume.plus(event.params.inputShares);
  market.volume = market.volume.plus(event.params.outputShares);

  market.save();
}
