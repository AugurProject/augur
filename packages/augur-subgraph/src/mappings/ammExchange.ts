import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
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

export function updateVolumeValues(address: Address, noShares: BigInt, yesShares: BigInt): void {
  let ammExchange = AMMExchange.load(
    address.toHexString()
  );

  let cash: ERC20 = ERC20.bind(Address.fromString(ammExchange.cash));
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
  addLiquidity.lpTokens = event.params.lpTokens;
  addLiquidity.noShares = event.params.shortShares;
  addLiquidity.yesShares = event.params.longShares;
  addLiquidity.sender = event.params.sender.toHexString();

  // Will be zero if ratio is 50-50.
  let netShares = addLiquidity.noShares.minus(addLiquidity.yesShares).abs();
  let noShares = addLiquidity.noShares.toBigDecimal();
  let yesShares = addLiquidity.yesShares.toBigDecimal();
  let totalShares = noShares.plus(yesShares);
  let priceOfNoShares = yesShares.div(totalShares);
  let priceOfYesShares = noShares.div(totalShares);

  let priceOfGainedShares: BigDecimal;
  if(yesShares.gt(noShares)) {
    priceOfGainedShares = priceOfYesShares;
  } else {
    priceOfGainedShares = priceOfNoShares;
  }

  // Cash value is the cost of the lp tokens received accounting for shares returned to user.
  addLiquidity.cashValue = addLiquidity.cash.toBigDecimal().minus(priceOfGainedShares.times(netShares.toBigDecimal())).truncate(0);

  addLiquidity.noShareCashValue = priceOfNoShares.times(noShares);
  addLiquidity.yesShareCashValue = priceOfYesShares.times(yesShares);

  addLiquidity.save();

  updateAMM(addLiquidity.ammExchange);
}

export function handleRemoveLiquidity(event: RemoveLiquidityEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let removeLiquidity = new RemoveLiquidity(id);
  getOrCreateUser(event.params.sender.toHexString());
  removeLiquidity.tx_hash = event.transaction.hash.toHexString();
  removeLiquidity.timestamp = event.block.timestamp;
  removeLiquidity.ammExchange = event.address.toHexString();
  removeLiquidity.noShares = event.params.shortShares;
  removeLiquidity.yesShares = event.params.longShares;
  removeLiquidity.sender = event.params.sender.toHexString();

  let noShares = removeLiquidity.noShares.toBigDecimal();
  let yesShares = removeLiquidity.yesShares.toBigDecimal();
  let shareCashValue = noShares.times(yesShares).div(noShares.plus(yesShares));
  removeLiquidity.noShareCashValue = shareCashValue;
  removeLiquidity.yesShareCashValue = shareCashValue;

  // Cash value is the cost of the lp tokens received accounting for shares returned to user.
  removeLiquidity.cashValue = removeLiquidity.noShareCashValue.plus(removeLiquidity.yesShareCashValue).truncate(0);
  removeLiquidity.save();

  updateAMM(removeLiquidity.ammExchange);
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

  if(event.params.buyLong) {
    updateVolumeValues(event.address, BigInt.fromI32(0), event.params.outputShares);
    enterPosition.noShares = BigInt.fromI32(0);
    enterPosition.yesShares = event.params.outputShares;
  } else {
    updateVolumeValues(event.address, event.params.outputShares, BigInt.fromI32(0));
    enterPosition.noShares = event.params.outputShares;
    enterPosition.yesShares = BigInt.fromI32(0);
  }

  enterPosition.sender = event.params.sender.toHexString();
  enterPosition.save();

  updateAMM(enterPosition.ammExchange);
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
  exitPosition.invalidShares = event.params.shortShares;
  exitPosition.noShares = event.params.shortShares;
  exitPosition.yesShares = event.params.longShares;
  exitPosition.sender = event.params.sender.toHexString();
  exitPosition.price = event.params.cashPayout.toBigDecimal().div(event.params.longShares.plus(event.params.shortShares).toBigDecimal().times(numTicks))
  exitPosition.save();

  updateVolumeValues(
    event.address,
    event.params.shortShares,
    event.params.longShares
  );

  updateAMM(exitPosition.ammExchange);
}

export function handleSwapPosition(event: SwapPositionEvent): void {
  let id = event.transaction.hash.toHexString() + "-" + event.logIndex.toString();
  let swapPosition = new SwapPosition(id);
  getOrCreateUser(event.params.sender.toHexString());

  swapPosition.tx_hash = event.transaction.hash.toHexString();
  swapPosition.timestamp = event.block.timestamp;
  swapPosition.ammExchange = event.address.toHexString();
  swapPosition.sender = event.params.sender.toHexString();

  if (event.params.inputLong) {
    updateVolumeValues(
      event.address,
      event.params.outputShares,
      event.params.inputShares.times(BigInt.fromI32(-1))
    );
  } else {
    updateVolumeValues(
      event.address,
      event.params.inputShares.times(BigInt.fromI32(-1)),
      event.params.outputShares
    );
  }

  updateAMM(swapPosition.ammExchange);
}
