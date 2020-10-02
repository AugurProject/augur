import { AddAMMCall } from "../../generated/AMMFactory/AMMFactory";
import { Market } from '../../generated/schema';
import {
  getOrCreateMarket,
  createAndSaveAMMExchange
} from "../utils/helpers";

export function handleAddAMMExchange(call: AddAMMCall): void {
  const id = call.outputs.value0.toHexString();
  const marketId = call.inputs._market.toHexString();
  const shareTokenId = call.inputs._para.toHexString();

  // @todo The hardcoded cash will eventually come from the ShareToken pending ShareToken creation event.
  createAndSaveAMMExchange(id, marketId, shareTokenId, '0xDb4FeE45f9D8C9241e8ff42ADe3daa83405C8766');
}
