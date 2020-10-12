import { AddAMMCall } from "../../generated/AMMFactory/AMMFactory";
import {
  createAndSaveAMMExchange
} from "../utils/helpers";

export function handleAddAMMExchange(call: AddAMMCall): void {
  let id = call.outputs.value0.toHexString();
  let marketId = call.inputs._market.toHexString();
  let shareTokenId = call.inputs._para.toHexString();

  // @todo The hardcoded cash will eventually come from the ShareToken pending ShareToken creation event.
  createAndSaveAMMExchange(id, marketId, shareTokenId, '0xDb4FeE45f9D8C9241e8ff42ADe3daa83405C8766');
}
