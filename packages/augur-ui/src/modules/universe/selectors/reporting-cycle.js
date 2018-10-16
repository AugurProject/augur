import { createBigNumber } from "utils/create-big-number";
import { createSelector } from "reselect";
import moment from "moment";
import {
  selectBlockchainCurrentBlockTimestamp,
  selectUniverseReportingPeriodDurationInSeconds
} from "src/select-state";
import { augur } from "services/augurjs";
import { ONE } from "modules/trades/constants/numbers";

export const selectReportingCycleSelector = () =>
  createSelector(
    selectUniverseReportingPeriodDurationInSeconds,
    selectBlockchainCurrentBlockTimestamp,
    (reportingPeriodDurationInSeconds, timestamp) => {
      const currentReportingPeriodPercentComplete = augur.reporting.getCurrentPeriodProgress(
        reportingPeriodDurationInSeconds || 0,
        timestamp
      );
      const bnReportingPeriodDurationInSeconds = createBigNumber(
        reportingPeriodDurationInSeconds || 0,
        10
      );
      const secondsRemaining = ONE.minus(
        createBigNumber(currentReportingPeriodPercentComplete, 10).dividedBy(
          100
        )
      ).times(bnReportingPeriodDurationInSeconds);
      return {
        currentReportingPeriodPercentComplete,
        reportingCycleTimeRemaining: moment
          .duration(secondsRemaining.toNumber(), "seconds")
          .humanize(true)
      };
    }
  );

export const selectReportingCycle = selectReportingCycleSelector();
