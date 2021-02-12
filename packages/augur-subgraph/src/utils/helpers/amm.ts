import {
  AMMExchange,
  Market
} from '../../../generated/schema';
import { Address, BigInt, BigDecimal } from '@graphprotocol/graph-ts'
import { ERC20 } from '../../../generated/templates/Cash/ERC20';
import { ParaShareToken } from '../../../generated/templates/ParaShareToken/ParaShareToken';
import { AMMExchange as AMMExchangeContract } from "../../../generated/templates/AMMExchange/AMMExchange";

export function updateAMM(id: string):AMMExchange {
  let amm = AMMExchange.load(id);
  let ammExchangeInstance = AMMExchangeContract.bind(Address.fromString(id));
  let market = Market.load(amm.market);

  let shareTokenInstance = ParaShareToken.bind(
    Address.fromString(amm.shareToken));

  let cash = ERC20.bind(Address.fromString(amm.cash));
  let decimals = BigInt.fromI32(10 ).pow(cash.decimals() as u8).toBigDecimal();
  amm.liquidityInvalid = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(0), Address.fromString(id)).times(market.numTicks).toBigDecimal().div(decimals);
  amm.liquidityNo = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(1), Address.fromString(id)).times(market.numTicks).toBigDecimal().div(decimals);
  amm.liquidityYes = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(2), Address.fromString(id)).times(market.numTicks).toBigDecimal().div(decimals);

  let totalShares = amm.liquidityNo.plus(amm.liquidityYes);

  let ZERO = BigDecimal.fromString('0');
  if(totalShares.gt(ZERO)) {
    amm.percentageNo = amm.liquidityNo.times(BigDecimal.fromString('100')).div(totalShares);
    amm.percentageYes = amm.liquidityYes.times(BigDecimal.fromString('100')).div(totalShares);
  }

  amm.liquidity = amm.liquidityNo.times(amm.percentageYes.div(BigDecimal.fromString('100'))).plus(amm.liquidityYes.times(amm.percentageNo.div(BigDecimal.fromString('100'))));
  amm.totalSupply = ammExchangeInstance.totalSupply();

  amm.save();

  return amm as AMMExchange;
}

