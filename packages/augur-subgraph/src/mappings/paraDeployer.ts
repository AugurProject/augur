import { ParaAugurDeployFinished} from "../../generated/ParaDeployer/ParaDeployer";
import { ShareToken } from '../../generated/schema';
import {
  getOrCreateParaShareToken,
  createAndSaveParaAugurDeployFinishedEvent
} from "../utils/helpers";

export function handleParaAugurDeployFinished(
  event: ParaAugurDeployFinished
): void {
  let paraShareToken = getOrCreateParaShareToken(event.params.shareToken.toHexString())
  paraShareToken.cash = event.params.cash.toHexString();

  paraShareToken.save();

  createAndSaveParaAugurDeployFinishedEvent(event);
}
