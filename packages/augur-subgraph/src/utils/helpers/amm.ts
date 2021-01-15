import {
  AMMExchange,
  Market
} from '../../../generated/schema';
import { Address, BigInt, BigDecimal, log } from '@graphprotocol/graph-ts'
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
  log.error('checkpoint1', []);
  let amm = AMMExchange.load(id);

  log.error('checkpoint1', []);

  if (amm == null && createIfNotFound) {
    let ZERO = BigDecimal.fromString('0');
    log.error('checkpoint2', [])
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
    amm.volumeNo = BigDecimal.fromString('0');
    amm.volumeYes = BigDecimal.fromString('0');
    amm.fee = BigInt.fromI32(0);
    amm.feePercent = BigDecimal.fromString('0');

    log.error('checkpoint3', [])

    AMMExchangeTemplate.create(Address.fromString(id));
  }

  return amm as AMMExchange;
}

export function createAndSaveAMMExchange(
  id: string,
  market: string,
  shareTokenId: string,
  cashId: string,
  fee: BigInt
): AMMExchange {
  // This just create the entity.

  log.error('1checkpoint1', []);
  let cash = getOrCreateCash(cashId);
  let shareToken = getOrCreateParaShareToken(shareTokenId);
  shareToken.cash = cashId;
  shareToken.save();


  let amm = getOrCreateAMMExchange(id);
  amm.market = market;
  amm.shareToken = shareTokenId;
  amm.cash = cashId;
  amm.fee = fee;
  amm.feePercent = fee.divDecimal(BigInt.fromI32(100).toBigDecimal());
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

  let ZERO = BigDecimal.fromString('0');
  if(totalShares.gt(ZERO)) {
    amm.percentageNo = amm.liquidityNo.times(BigDecimal.fromString('100')).div(totalShares);
    amm.percentageYes = amm.liquidityYes.times(BigDecimal.fromString('100')).div(totalShares);
  } else {
    amm.percentageNo = ZERO;
    amm.percentageYes = ZERO;
  }

  amm.liquidity = amm.liquidityNo.times(amm.percentageYes.div(BigDecimal.fromString('100'))).plus(amm.liquidityYes.times(amm.percentageNo.div(BigDecimal.fromString('100')))).plus(amm.liquidityCash);
  amm.totalSupply = ammExchangeInstance.totalSupply();

  amm.save();

  return amm as AMMExchange;
}

