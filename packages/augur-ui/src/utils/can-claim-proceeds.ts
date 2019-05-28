import { createBigNumber } from "utils/create-big-number";
import { constants } from "services/constants";

// Check that the CLAIM_PROCEEDS_WAIT_TIME has passed since finalization
export default function canClaimProceeds(
  finalizationTime,
  outstandingReturns,
  currentTimestamp
) {
  let canClaim = false;
  if (finalizationTime && outstandingReturns && currentTimestamp) {
    const endTimestamp = createBigNumber(finalizationTime).plus(
      createBigNumber(constants.CONTRACT_INTERVAL.CLAIM_PROCEEDS_WAIT_TIME)
    );
    const timeHasPassed = createBigNumber(currentTimestamp).minus(endTimestamp);
    canClaim = timeHasPassed.toNumber() > 0;
  }
  return canClaim;
}
