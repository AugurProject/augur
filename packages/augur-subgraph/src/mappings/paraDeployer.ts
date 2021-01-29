import { log } from '@graphprotocol/graph-ts'
import { ParaAugurDeployFinished} from "../../generated/ParaDeployer/ParaDeployer";
import { ParaAugur as ParaAugurTemplate } from '../../generated/templates';

import {
  getOrCreateParaShareToken,
  createAndSaveParaAugurDeployFinishedEvent
} from "../utils/helpers";
import { getOrCreateCash } from '../utils/helpers/cash';

export function handleParaAugurDeployFinished(
  event: ParaAugurDeployFinished
): void {
  let paraShareToken = getOrCreateParaShareToken(event.params.shareToken.toHexString())
  let cash = event.params.cash.toHexString();
  // This just create the entity.
  getOrCreateCash(cash);

  paraShareToken.cash = cash;
  paraShareToken.save();
  log.debug("Added ParaShareToken: {}", [paraShareToken.id]);

  ParaAugurTemplate.create(event.params.paraAugur);

  createAndSaveParaAugurDeployFinishedEvent(event);
}
