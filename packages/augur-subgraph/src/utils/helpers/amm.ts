import { AMMExchange } from "../../../generated/schema";
import { BigInt } from '@graphprotocol/graph-ts'

export function getOrCreateAMMExchange(
  id: string,
  createIfNotFound: boolean = true
): AMMExchange {
  let amm = AMMExchange.load(id);

  if (amm == null && createIfNotFound) {
    amm = new AMMExchange(id);
    amm.cashBalance = BigInt.fromI32(0);
  }

  return amm as AMMExchange;
}

export function createAndSaveAMMExchange(
  id: string,
  market: string,
  shareToken: string,
  cash: string
): AMMExchange {
  const amm = getOrCreateAMMExchange(id);
  amm.market = market;
  amm.shareToken = shareToken;
  amm.cash = cash;

  amm.save();
  return amm;
}
