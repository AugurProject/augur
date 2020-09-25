import { AMMExchange } from "../../../generated/schema";

export function getOrCreateAMMExchange(
  id: String,
  createIfNotFound: boolean = true
): AMMExchange {
  let amm = AMMExchange.load(id);

  if (amm == null && createIfNotFound) {
    amm = new AMMExchange(id);
  }

  return amm as AMMExchange;
}

export function createAndSaveAMMExchange(
  id: String,
  market: String,
  shareToken: string
): AMMExchange {
  const amm = getOrCreateAMMExchange(id);
  amm.market = market;
  amm.shareToken = shareToken;

  amm.save();
  return amm;
}
