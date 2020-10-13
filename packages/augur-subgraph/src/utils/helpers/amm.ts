import { log } from '@graphprotocol/graph-ts';
import {
  AMMExchange,
  Market
} from '../../../generated/schema';
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { ERC20 } from '../../../generated/templates/Cash/ERC20';
import { ParaShareToken } from '../../../generated/templates/ParaShareToken/ParaShareToken';

import { getOrCreateCash } from './cash';
import { getOrCreateParaShareToken } from './token';

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
    amm.volumeNo = BigInt.fromI32(0);
    amm.volumeYes = BigInt.fromI32(0);
  }

  return amm as AMMExchange;
}

export function createAndSaveAMMExchange(
  id: string,
  market: string,
  shareToken: string,
  cash: string
): AMMExchange {
  // This just create the entity.
  getOrCreateCash(cash);
  getOrCreateParaShareToken(shareToken, cash);

  let amm = getOrCreateAMMExchange(id);

  amm.market = market;
  amm.shareToken = shareToken;
  amm.cash = cash;
  amm.save()

  return updateAMM(id);
}

export function updateAMM(id: string):AMMExchange {
  let amm = AMMExchange.load(id);
  let market = Market.load(amm.market);

  let shareTokenInstance = ParaShareToken.bind(
    Address.fromString(amm.shareToken));

  let cash = ERC20.bind(Address.fromString(amm.cash));
  amm.liquidityCash = cash.balanceOf(Address.fromString(id));
  amm.liquidityInvalid = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(0), Address.fromString(id));
  amm.liquidityNo = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(1), Address.fromString(id));
  amm.liquidityYes = shareTokenInstance.balanceOfMarketOutcome(
    Address.fromString(amm.market), BigInt.fromI32(2), Address.fromString(id));

  let totalShares = amm.liquidityNo.plus(amm.liquidityYes);

  // @todo confirm this is correct.
  amm.liquidity = totalShares.div(market.numTicks);

  amm.save();

  return amm as AMMExchange;
}

