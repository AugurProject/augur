import {
  AMMExchange,
  Market
} from '../../../generated/schema';
import { Address, BigInt, BigDecimal } from '@graphprotocol/graph-ts'
import { ERC20 } from '../../../generated/templates/Cash/ERC20';
import { ParaShareToken } from '../../../generated/templates/ParaShareToken/ParaShareToken';
import { AMMExchange as AMMExchangeContract } from "../../../generated/templates/AMMExchange/AMMExchange";
import { AMMExchange as AMMExchangeTemplate } from '../../../generated/templates';

import { getOrCreateParaShareToken } from './paraDeployer';
import { getOrCreateCash } from './cash';

export function getOrCreateAMMExchange(
  id: string,
  createIfNotFound: boolean = true
): AMMExchange {
  let amm = AMMExchange.load(id);

  if (amm == null && createIfNotFound) {
    let ZERO = BigDecimal.fromString('0');

    amm = new AMMExchange(id);
    amm.cashBalance = BigInt.fromI32(0);
    amm.liquidity = ZERO;
    amm.liquidityCash = ZERO;
    amm.liquidityInvalid = ZERO;
    amm.liquidityNo = ZERO;
    amm.liquidityYes = ZERO;
    amm.percentageNo = BigDecimal.fromString('0');
    amm.percentageYes = BigDecimal.fromString('0');
    amm.totalSupply =  BigInt.fromI32(0);
    amm.volumeNo = BigInt.fromI32(0);
    amm.volumeYes = BigInt.fromI32(0);
    AMMExchangeTemplate.create(Address.fromString(id));
  }

  return amm as AMMExchange;
}

export function createAndSaveAMMExchange(
  id: string,
  market: string,
  shareTokenId: string,
  cashId: string
): AMMExchange {
  // This just create the entity.
  let cash = getOrCreateCash(cashId);
  let shareToken = getOrCreateParaShareToken(shareTokenId);
  shareToken.cash = cashId;
  shareToken.save()

  let amm = getOrCreateAMMExchange(id);
  amm.market = market;
  amm.shareToken = shareTokenId;
  amm.cash = cashId;
  amm.save()

  return updateAMM(id);
}

export function updateAMM(id: string):AMMExchange {
  let amm = AMMExchange.load(id);
  let ammExchangeInstance = AMMExchangeContract.bind(Address.fromString(id));
  let market = Market.load(amm.market);

  let shareTokenInstance = ParaShareToken.bind(
    Address.fromString(amm.shareToken));

  let cash = ERC20.bind(Address.fromString(amm.cash));
  let decimals = BigInt.fromI32(10 ).pow(cash.decimals() as u8).toBigDecimal();
  amm.liquidityCash = cash.balanceOf(Address.fromString(id)).toBigDecimal().div(decimals);
  amm.liquidityInvalid = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(0), Address.fromString(id)).times(market.numTicks).toBigDecimal().div(decimals);
  amm.liquidityNo = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(1), Address.fromString(id)).times(market.numTicks).toBigDecimal().div(decimals);
  amm.liquidityYes = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(2), Address.fromString(id)).times(market.numTicks).toBigDecimal().div(decimals);

  let totalShares = amm.liquidityNo.plus(amm.liquidityYes);

  amm.liquidity = totalShares;

  let ZERO = BigDecimal.fromString('0');
  if(totalShares.gt(ZERO)) {
    amm.percentageNo = amm.liquidityNo.times(BigDecimal.fromString('100')).div(totalShares);
    amm.percentageYes = amm.liquidityYes.times(BigDecimal.fromString('100')).div(totalShares);
  } else {
    amm.percentageNo = ZERO;
    amm.percentageYes = ZERO;
  }

  amm.totalSupply = ammExchangeInstance.totalSupply();

  amm.save();

  return amm as AMMExchange;
}

