import { AddAMMCall } from "../generated/Augur/Augur";
import {
  getOrCreateMarket,
  createAndSaveAMMExchange
} from "../utils/helpers";
import { AMMExchange } from "../generated/schema";

export function handleAddAMM(call: AddAMMCall) {
  const id = call.outputs.value0.toHexString();
  const marketId = call.inputs._market.toHexString();
  const shareTokenId = call.inputs._para.toHexString();

  createAndSaveAMMExchange(id, marketId, shareTokenId);

  const market = getOrCreateMarket(marketId);
  market.amm.push(id);
  market.save();

  AMMExchange.create(id);
}
