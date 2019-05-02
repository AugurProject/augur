import React from "react";
import PropTypes from "prop-types";
import { formatAttoRep } from "utils/format-number";
import Styles from "modules/reporting/components/reporting-dispute-progress/reporting-dispute-progress.styles";
import {
  calculateAddedStakePercentage,
  calculateTentativeCurrentRep
} from "modules/reports/helpers/progress-calculations";

const ReportingDisputeProgress = ({
  percentageComplete = 0,
  percentageAccount = 0,
  bondSizeCurrent = "0",
  isSelected,
  tentativeStake = 0,
  accountStakeCurrent = "0",
  stakeCurrent = "0"
}) => {
  let totalPercentageComplete = percentageComplete;
  let userPercentage = percentageAccount;
  const currentPercentageComplete = percentageComplete;
  const userStaked = tentativeStake > 0 && isSelected;
  const bondSizeCurrentFormatted = formatAttoRep(bondSizeCurrent, {
    decimals: 4,
    roundUp: true
  });
  let repStakedFormatted = formatAttoRep(stakeCurrent, {
    decimals: 4,
    roundUp: true
  }).formatted;

  if (userStaked) {
    const accountStakeCurrentFormatted = formatAttoRep(accountStakeCurrent, {
      decimals: 4,
      roundUp: true
    }).formattedValue;
    userPercentage = calculateAddedStakePercentage(
      bondSizeCurrentFormatted.fullPrecision,
      accountStakeCurrentFormatted,
      tentativeStake
    );
    repStakedFormatted = calculateTentativeCurrentRep(
      stakeCurrent,
      tentativeStake
    );
    totalPercentageComplete = currentPercentageComplete + userPercentage;
  }

  const percentageAccountStyle = {
    width: `${userPercentage}%`
  };
  const percentageCompleteStyle = {
    width: `${currentPercentageComplete}%`
  };

  return (
    <article className={Styles.ReportingDisputeProgress}>
      <div>
        <div>
          <div style={percentageCompleteStyle} />
          <div style={percentageAccountStyle} />
        </div>
        <div>
          {repStakedFormatted} / {bondSizeCurrentFormatted.formatted} REP
        </div>
      </div>
      {userStaked &&
        totalPercentageComplete >= 100 && <div>New tentative outcome</div>}
    </article>
  );
};

ReportingDisputeProgress.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  percentageComplete: PropTypes.number,
  percentageAccount: PropTypes.number,
  tentativeStake: PropTypes.number,
  bondSizeCurrent: PropTypes.string,
  stakeCurrent: PropTypes.string,
  accountStakeCurrent: PropTypes.string
};

ReportingDisputeProgress.defaultProps = {
  percentageComplete: 0,
  percentageAccount: 0,
  tentativeStake: 0,
  bondSizeCurrent: "0",
  stakeCurrent: "0",
  accountStakeCurrent: "0"
};

export default ReportingDisputeProgress;
