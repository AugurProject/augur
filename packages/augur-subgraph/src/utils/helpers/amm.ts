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
    amm = new AMMExchange(id);
    amm.cashBalance = BigInt.fromI32(0);
    amm.liquidity = BigInt.fromI32(0);
    amm.liquidityCash = BigInt.fromI32(0);
    amm.liquidityInvalid = BigInt.fromI32(0);
    amm.liquidityNo = BigInt.fromI32(0);
    amm.liquidityYes = BigInt.fromI32(0);
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
  amm.liquidityCash = cash.balanceOf(Address.fromString(id));
  amm.liquidityInvalid = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(0), Address.fromString(id));
  amm.liquidityNo = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(1), Address.fromString(id)).div(market.numTicks);
  amm.liquidityYes = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(2), Address.fromString(id)).div(market.numTicks);

  let totalShares = amm.liquidityNo.plus(amm.liquidityYes);

  amm.liquidity = totalShares;

  if(totalShares.gt(BigInt.fromI32(0))) {
    amm.percentageNo = amm.liquidityNo.toBigDecimal().times(BigDecimal.fromString('100')).div(totalShares.toBigDecimal());
    amm.percentageYes = amm.liquidityYes.toBigDecimal().times(BigDecimal.fromString('100')).div(totalShares.toBigDecimal());
  } else {
    amm.percentageNo = BigDecimal.fromString('0');
    amm.percentageYes = BigDecimal.fromString('0');
  }

  amm.totalSupply = ammExchangeInstance.totalSupply();

  amm.save();

  return amm as AMMExchange;
}

