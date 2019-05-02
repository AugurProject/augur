import React from "react";
import { AWAITING_SIGNATURE, PENDING } from "modules/common-elements/constants";
import { CompactButton } from "modules/common-elements/buttons";
import Styles from "modules/market/components/complete-sets/complete-sets.styles";

export interface EmptyDisplayProps {
  numCompleteSets: any;
  transactionsStatus: any;
  sellCompleteSets: Function;
  marketId: string;
}

const CompleteSets = (props: EmptyDisplayProps) => {
  const {
    numCompleteSets,
    transactionsStatus,
    sellCompleteSets,
    marketId
  } = props;

  const pendingCompleteSetsHash = `pending-${marketId}-${numCompleteSets &&
    numCompleteSets.fullPrecision}`;
  const pendingCompleteSetsInfo = transactionsStatus[pendingCompleteSetsHash];
  const status = pendingCompleteSetsInfo && pendingCompleteSetsInfo.status;
  let completeSetButtonText = "Sell Complete Sets";
  switch (status) {
    case AWAITING_SIGNATURE:
      completeSetButtonText = "Awaiting Signature...";
      break;
    case PENDING:
      completeSetButtonText = "Pending transaction...";
      break;
    default:
      completeSetButtonText = "Sell Complete Sets";
      break;
  }
  if (!numCompleteSets || numCompleteSets.value <= 0) return null;

  return (
    <div className={Styles.CompleteSets}>
      <span>{`You currently have ${
        numCompleteSets.full
      } of all outcomes.`}</span>
      <CompactButton
        disabled={!!pendingCompleteSetsInfo}
        text={completeSetButtonText}
        action={e => {
          sellCompleteSets(marketId, numCompleteSets, () => {});
        }}
      />
    </div>
  );
};

export default CompleteSets;
