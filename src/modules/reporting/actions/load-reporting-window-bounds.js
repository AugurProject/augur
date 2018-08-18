import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { updateReportingWindowStats } from "modules/reporting/actions/update-reporting-window-stats";

export const loadReportingWindowBounds = (callback = logError) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();
  augur.augurNode.submitRequest(
    "getFeeWindowCurrent",
    {
      universe: universe.id,
      reporter: loginAccount.address
    },
    (err, result) => {
      if (err) return callback(err);

      dispatch(
        updateReportingWindowStats({
          startTime: (result || {}).startTime,
          endTime: (result || {}).endTime,
          stake: (result || {}).totalStake || 0,
          participantContributions:
            (result || {}).participantContributions || 0,
          participationTokens: (result || {}).participationTokens || 0,
          feeWindowRepStaked: (result || {}).feeWindowRepStaked || 0,
          feeWindowEthFees: (result || {}).feeWindowEthFees || 0,
          participantContributionsCrowdsourcer:
            (result || {}).participantContributionsCrowdsourcer || 0,
          participantContributionsInitialReport:
            (result || {}).participantContributionsInitialReport || 0
        })
      );
    }
  );
};
