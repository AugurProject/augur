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
    <article>
      <section className={Styles["ReportingDisputeProgress__dispute-wrapper"]}>
        <div className={Styles["ReportingDisputeProgress__dispute-graph"]}>
          <div className={Styles.ReportingDisputeProgress__graph}>
            <div className={Styles["ReportingDisputeProgress__graph-current"]}>
              <div style={percentageCompleteStyle} />
              <div style={percentageAccountStyle} />
            </div>
          </div>
        </div>
        <div className={Styles["ReportingDisputeProgress__dispute-label"]}>
          <span
            className={
              Styles["ReportingDisputeProgress__dispute-label-total-rep-text"]
            }
          >
            {repStakedFormatted}
          </span>
          <span
            className={Styles["ReportingDisputeProgress__dispute-label-break"]}
          >
            {" "}
            /{" "}
          </span>
          <span
            className={
              Styles["ReportingDisputeProgress__dispute-label-goal-text"]
            }
          >
            {bondSizeCurrentFormatted.formatted} REP
          </span>
        </div>
        {userStaked &&
          totalPercentageComplete >= 100 && (
            <div
              className={Styles["ReportingDisputeProgress__dispute-tentative"]}
            >
              New tentative outcome
            </div>
          )}
      </section>
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
