import { getEventId } from "./index";

import {
  ParaShareToken,
  ParaAugurDeployFinishedEvent
} from "../../../generated/schema"

import {
  ParaAugurDeployFinished
} from "../../../generated/ParaDeployer/ParaDeployer";

export function createAndSaveParaAugurDeployFinishedEvent(
  ethereumEvent: ParaAugurDeployFinished
): void {
  let id = getEventId(ethereumEvent);
  let event = new ParaAugurDeployFinishedEvent(id);

  event.shareToken = ethereumEvent.params.shareToken.toHexString();

  event.save();
}

export function getOrCreateParaShareToken(
  id: string,
  createIfNotFound: boolean = true
): ParaShareToken {
  let paraShareToken: ParaShareToken = ParaShareToken.load(id) as ParaShareToken;

  if (paraShareToken === null && createIfNotFound) {
    paraShareToken = new ParaShareToken(id);
  }

  return paraShareToken;
}
