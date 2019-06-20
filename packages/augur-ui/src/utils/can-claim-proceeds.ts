import { createBigNumber } from "utils/create-big-number";
import { CONTRACT_INTERVAL } from "modules/common/constants";

// Check that the CLAIM_PROCEEDS_WAIT_TIME has passed since finalization
export default function canClaimProceeds(
  finalizationTime: number,
  outstandingReturns: number
): boolean {
  if (finalizationTime && outstandingReturns) {
    return true;
  }
  return false;
}
