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
import { ERC20 } from '../../generated/templates/Cash/ERC20';

function updateVolumeValues(address: Address, cash: BigInt, noShares: BigInt, yesShares: BigInt): void {
  let ammExchange = AMMExchange.load(
    address.toHexString()
  );

  let cash = ERC20.bind(Address.fromString(ammExchange.cash));
  let decimals = BigInt.fromI32(10 ).pow(cash.decimals() as u8).toBigDecimal();

  let market = Market.load(ammExchange.market);
  let numTicks = market.numTicks.toBigDecimal();

  ammExchange.volumeNo = ammExchange.volumeNo.plus(noShares.abs().toBigDecimal().times(numTicks).div(decimals));
  ammExchange.volumeYes = ammExchange.volumeYes.plus(yesShares.abs().toBigDecimal().times(numTicks).div(decimals));

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
}

export function handleEnterPosition(event: EnterPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let enterPosition = new EnterPosition(id);

  let ammExchange = AMMExchange.load(
    event.address.toHexString()
  );

  let market = Market.load(ammExchange.market);
  let numTicks = market.numTicks.toBigDecimal();

  getOrCreateUser(event.params.sender.toHexString());
  enterPosition.tx_hash = event.transaction.hash.toHexString();
  enterPosition.timestamp = event.block.timestamp;
  enterPosition.ammExchange = event.address.toHexString();
  enterPosition.cash = event.params.cash;
  enterPosition.price = event.params.cash.toBigDecimal().div(event.params.outputShares.toBigDecimal().times(numTicks))

  if(event.params.buyYes) {
    updateVolumeValues(event.address, event.params.cash, BigInt.fromI32(0), event.params.outputShares);
    enterPosition.noShares = BigInt.fromI32(0);
    enterPosition.yesShares = event.params.outputShares;
  } else {
    updateVolumeValues(event.address, event.params.cash, event.params.outputShares, BigInt.fromI32(0));
    enterPosition.noShares = event.params.outputShares;
    enterPosition.yesShares = BigInt.fromI32(0);
  }

  enterPosition.sender = event.params.sender.toHexString();
  enterPosition.save();
}

export function handleExitPosition(event: ExitPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let exitPosition = new ExitPosition(id);

  let ammExchange = AMMExchange.load(
    event.address.toHexString()
  );

  let market = Market.load(ammExchange.market);
  let numTicks = market.numTicks.toBigDecimal();

  getOrCreateUser(event.params.sender.toHexString());
  exitPosition.tx_hash = event.transaction.hash.toHexString();
  exitPosition.timestamp = event.block.timestamp;
  exitPosition.ammExchange = event.address.toHexString();
  exitPosition.cash = event.params.cashPayout.times(BigInt.fromI32(-1));
  exitPosition.invalidShares = event.params.invalidShares;
  exitPosition.noShares = event.params.noShares;
  exitPosition.yesShares = event.params.yesShares;
  exitPosition.sender = event.params.sender.toHexString();
  exitPosition.price = event.params.cashPayout.toBigDecimal().div(event.params.yesShares.plus(event.params.noShares).toBigDecimal().times(numTicks))
  exitPosition.save();

  updateVolumeValues(
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
    updateVolumeValues(
      event.address,
      BigInt.fromI32(0),
      event.params.outputShares,
      event.params.inputShares.times(BigInt.fromI32(-1))
    );
  } else {
    updateVolumeValues(
      event.address,
      BigInt.fromI32(0),
      event.params.inputShares.times(BigInt.fromI32(-1)),
      event.params.outputShares
    );
  }
}
