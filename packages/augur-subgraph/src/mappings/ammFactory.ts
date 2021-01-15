import { AMMCreated } from '../../generated/AMMFactory/AMMFactory';
import {
  createAndSaveAMMExchange,
  getOrCreateParaShareToken,
} from "../utils/helpers";

export function handleAMMCreated(event: AMMCreated): void {
  let id = event.params.amm.toHexString();
  let marketId = event.params.market.toHexString();
  let shareTokenId = event.params.shareToken.toHexString();
  let paraShareToken = getOrCreateParaShareToken(shareTokenId);
  let fee = event.params.fee;

  // @todo The hardcoded cash will eventually come from the ShareToken pending ShareToken creation event.
  createAndSaveAMMExchange(id, marketId, shareTokenId, paraShareToken.cash, fee);
}
