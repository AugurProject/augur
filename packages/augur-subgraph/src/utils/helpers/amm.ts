import { AMMExchange } from "../../../generated/schema";
import { BigInt } from '@graphprotocol/graph-ts'
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

  let amm = getOrCreateAMMExchange(id);
  amm.market = market;
  amm.shareToken = shareToken;
  amm.cash = cash;

  amm.save();
  return amm;
}
