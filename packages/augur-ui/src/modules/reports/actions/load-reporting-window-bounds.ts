import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { createBigNumber } from "utils/create-big-number";
import { updateReportingWindowStats } from "modules/reports/actions/update-reporting-window-stats";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const loadReportingWindowBounds = (callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: Function
) => {
  const { universe, loginAccount } = getState();
  augur.augurNode.submitRequest(
    "getFeeWindowCurrent",
    {
      universe: universe.id,
      reporter: loginAccount.address
    },
    (err: any, result: any) => {
      if (err) return callback(err);

      augur.augurNode.submitRequest(
        "getFeeWindow",
        {
          universe: universe.id,
          reporter: loginAccount.address,
          feeWindowState: "next"
        },
        (err: any, nextResult: any) => {
          if (err) console.log(err); // just log error

          dispatch(
            updateReportingWindowStats({
              startTime: (result || {}).startTime,
              endTime: (result || {}).endTime,
              stake: combineValues(
                (result || {}).totalStake,
                (nextResult || {}).totalStake
              ),
              participantContributions: combineValues(
                (result || {}).participantContributions,
                (nextResult || {}).participantContributions
              ),
              participationTokens: combineValues(
                (result || {}).participationTokens,
                (nextResult || {}).participationTokens
              ),
              feeWindowRepStaked: combineValues(
                (result || {}).feeWindowRepStaked,
                (nextResult || {}).feeWindowRepStaked
              ),
              feeWindowEthFees: (result || {}).feeWindowEthFees || 0,
              participantContributionsCrowdsourcer: combineValues(
                (result || {}).participantContributionsCrowdsourcer,
                (nextResult || {}).participantContributionsCrowdsourcer
              ),
              participantContributionsInitialReport: combineValues(
                (result || {}).participantContributionsInitialReport,
                (nextResult || {}).participantContributionsInitialReport
              )
            })
          );
        }
      );
    }
  );
};

function combineValues(currentValue: any, nextValue: any) {
  const current = createBigNumber(currentValue || 0);
  const next = createBigNumber(nextValue || 0);
  return current.plus(next).toString();
}
