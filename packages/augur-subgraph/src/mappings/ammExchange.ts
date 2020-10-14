import { BigInt } from '@graphprotocol/graph-ts';
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
  SwapPosition,
} from '../../generated/schema';
import { updateAMM } from '../utils/helpers/amm';

type PositionEventType = AddLiquidityEvent | RemoveLiquidityEvent | EnterPositionEvent | ExitPositionEvent | SwapPositionEvent;
type EventConstructor  = AddLiquidity | RemoveLiquidity | EnterPosition | ExitPosition | SwapPosition;

function buildEvent(EventConstructor: EventConstructor, event: PositionEventType, cash: BigInt, noShares: BigInt, yesShares: BigInt) {
  const id = `${event.transaction.hash.toHex()}-${event.logIndex.toString()}`;

  let positionEvent = new EventConstructor(id);
  positionEvent.ammExchange = event.address;
  positionEvent.cash = cash;
  positionEvent.noShares = noShares;
  positionEvent.yesShares = yesShares;
  positionEvent.sender = event.params.sender;
  positionEvent.save();

  let ammExchange = AMMExchange.load(event.address);
  let market = ammExchange.market;
  market.volume = market.volume.plus(noShares.abs());
  market.volume = market.volume.plus(yesShares.abs());

  market.save();

  ammExchange.volumeNo = ammExchange.volumeNo.plus(noShares.abs());
  ammExchange.volumeYes = ammExchange.volumeYes.plus(yesShares.abs());

  ammExchange.save();

  updateAMM(event.address);

  return positionEvent;
}

export function handleAddLiquidity(event: AddLiquidityEvent) {
  const {
    cash,
    noShares,
    yesShares
  } = event.params;
  buildEvent(AddLiquidity, event, cash, noShares, yesShares);
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent) {
  const {
    cash,
    noShares,
    yesShares
  } = event.params;
  buildEvent(RemoveLiquidity, event, cash.times(BigInt.fromI32(-1)), noShares.times(BigInt.fromI32(-1)), yesShares.times(BigInt.fromI32(-1)));
}

export function handleEnterPosition(event: EnterPositionEvent) {
  const {
    buyYes,
    cash,
    outputShares
  } = event.params;

  if(buyYes) {
    buildEvent(EnterPosition, event, cash, BigInt.fromI32(0), outputShares);
  } else {
    buildEvent(EnterPosition, event, cash, outputShares, BigInt.fromI32(0));
  }
}

export function handleExitPosition(event: ExitPositionEvent) {
  const {
    cashPayout,
    invalidShares,
    noShares,
    yesShares
  } = event.params;

  let exitPosition = buildEvent(ExitPosition, event,
    cashPayout.times(BigInt.fromI32(-1)), noShares, yesShares);
  exitPosition.invalidShares = invalidShares;
  exitPosition.save();
}

export function handleSwapPosition(event: SwapPositionEvent) {
  const {
    inputShares,
    outputShares
  } = event.params;

  if (event.params.inputYes) {
    buildEvent(SwapPosition, event, BigInt.fromI32(0), outputShares,
      inputShares.times(BigInt.fromI32(-1)));
  } else {
    buildEvent(SwapPosition, event, BigInt.fromI32(0),
      inputShares.times(BigInt.fromI32(-1)), outputShares);
  }
}
