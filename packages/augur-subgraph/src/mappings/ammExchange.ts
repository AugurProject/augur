import { Address, BigInt } from '@graphprotocol/graph-ts';
import {
  EnterPosition as EnterPositionEvent,
  ExitPosition as ExitPositionEvent,
  SwapPosition as SwapPositionEvent,
  AddLiquidity as AddLiquidityEvent,
  RemoveLiquidity as RemoveLiquidityEvent,
} from '../../generated/templates/AMMExchange/AMMExchange';
import {
  AddLiquidity,
  AMMExchange,
  EnterPosition,
  ExitPosition,
  Market,
  RemoveLiquidity,
  SwapPosition,
} from '../../generated/schema';
import { getOrCreateUser } from '../utils/helpers';
import { updateAMM } from '../utils/helpers/amm';


function updateAggregateValues(address: Address, cash: BigInt, noShares: BigInt, yesShares: BigInt): void {
  let ammExchange = AMMExchange.load(
    address.toHexString()
  );

  let market = Market.load(ammExchange.market);
  let numTicks = market.numTicks.toBigDecimal();

  market.volume = market.volume.plus(noShares.abs().toBigDecimal().div(numTicks));
  market.volume = market.volume.plus(yesShares.abs().toBigDecimal().div(numTicks));

  market.save();

  ammExchange.volumeNo = ammExchange.volumeNo.plus(noShares.abs().toBigDecimal().div(numTicks));
  ammExchange.volumeYes = ammExchange.volumeYes.plus(yesShares.abs().toBigDecimal().div(numTicks));

  ammExchange.save();

  updateAMM(address.toHexString());
}

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let addLiquidity = new AddLiquidity(id);
  getOrCreateUser(event.params.sender.toHexString());
  addLiquidity.tx_hash = event.transaction.hash.toHexString();
  addLiquidity.timestamp = event.block.timestamp;
  addLiquidity.ammExchange = event.address.toHexString();
  addLiquidity.cash = event.params.cash;
  addLiquidity.noShares = event.params.noShares;
  addLiquidity.yesShares = event.params.yesShares;
  addLiquidity.sender = event.params.sender.toHexString();
  addLiquidity.save();

  updateAggregateValues(
    event.address,
    event.params.cash,
    event.params.noShares,
    event.params.yesShares
  );
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let removeLiquidity = new RemoveLiquidity(id);
  getOrCreateUser(event.params.sender.toHexString());
  removeLiquidity.tx_hash = event.transaction.hash.toHexString();
  removeLiquidity.timestamp = event.block.timestamp;
  removeLiquidity.ammExchange = event.address.toHexString();
  removeLiquidity.cash = event.params.cash;
  removeLiquidity.noShares = event.params.noShares;
  removeLiquidity.yesShares = event.params.yesShares;
  removeLiquidity.sender = event.params.sender.toHexString();
  removeLiquidity.save();

  updateAggregateValues(
    event.address,
    event.params.cash.times(BigInt.fromI32(-1)),
    event.params.noShares.times(BigInt.fromI32(-1)),
    event.params.yesShares.times(BigInt.fromI32(-1))
  );
}

export function handleEnterPosition(event: EnterPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let enterPosition = new EnterPosition(id);
  getOrCreateUser(event.params.sender.toHexString());
  enterPosition.tx_hash = event.transaction.hash.toHexString();
  enterPosition.timestamp = event.block.timestamp;
  enterPosition.ammExchange = event.address.toHexString();
  enterPosition.cash = event.params.cash;
  enterPosition.price = event.params.cash.toBigDecimal().div(event.params.outputShares.toBigDecimal())

  if(event.params.buyYes) {
    updateAggregateValues(event.address, event.params.cash, BigInt.fromI32(0), event.params.outputShares);
    enterPosition.noShares = BigInt.fromI32(0);
    enterPosition.yesShares = event.params.outputShares;
  } else {
    updateAggregateValues(event.address, event.params.cash, event.params.outputShares, BigInt.fromI32(0));
    enterPosition.noShares = event.params.outputShares;
    enterPosition.yesShares = BigInt.fromI32(0);
  }

  enterPosition.sender = event.params.sender.toHexString();
  enterPosition.save();
}

export function handleExitPosition(event: ExitPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let exitPosition = new ExitPosition(id);
  getOrCreateUser(event.params.sender.toHexString());
  exitPosition.tx_hash = event.transaction.hash.toHexString();
  exitPosition.timestamp = event.block.timestamp;
  exitPosition.ammExchange = event.address.toHexString();
  exitPosition.cash = event.params.cashPayout.times(BigInt.fromI32(-1));
  exitPosition.invalidShares = event.params.invalidShares;
  exitPosition.noShares = event.params.noShares;
  exitPosition.yesShares = event.params.yesShares;
  exitPosition.sender = event.params.sender.toHexString();
  exitPosition.price = event.params.cashPayout.toBigDecimal().div(event.params.yesShares.plus(event.params.noShares).toBigDecimal())
  exitPosition.save();

  updateAggregateValues(
    event.address,
    event.params.cashPayout.times(BigInt.fromI32(-1)),
    event.params.noShares,
    event.params.yesShares
  );
}

export function handleSwapPosition(event: SwapPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let swapPosition = new SwapPosition(id);
  getOrCreateUser(event.params.sender.toHexString());

  swapPosition.tx_hash = event.transaction.hash.toHexString();
  swapPosition.timestamp = event.block.timestamp;
  swapPosition.ammExchange = event.address.toHexString();
  swapPosition.sender = event.params.sender.toHexString();

  if (event.params.inputYes) {
    updateAggregateValues(
      event.address,
      BigInt.fromI32(0),
      event.params.outputShares,
      event.params.inputShares.times(BigInt.fromI32(-1))
    );
  } else {
    updateAggregateValues(
      event.address,
      BigInt.fromI32(0),
      event.params.inputShares.times(BigInt.fromI32(-1)),
      event.params.outputShares
    );
  }
}
