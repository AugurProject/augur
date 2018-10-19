import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { createBigNumber } from "utils/create-big-number";
import { updateReportingWindowStats } from "modules/reports/actions/update-reporting-window-stats";
import { setSelectedUniverse } from "modules/auth/actions/selected-universe-management";
import { loadUniverse } from "modules/app/actions/load-universe";

export const loadReportingWindowBounds = (callback = logError) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount, env } = getState();
  augur.augurNode.submitRequest(
    "getFeeWindowCurrent",
    {
      universe: universe.id,
      reporter: loginAccount.address
    },
    (err, result) => {
      if (err) {
        if (err.code === -32602 && err.message === "Universe does not exist") {
          const defaultUniverseId =
            env.universe ||
            augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
          dispatch(setSelectedUniverse(defaultUniverseId));
          dispatch(loadUniverse(defaultUniverseId));
          return dispatch(loadReportingWindowBounds(callback));
        }
        return callback(err);
      }

      augur.augurNode.submitRequest(
        "getFeeWindow",
        {
          universe: universe.id,
          reporter: loginAccount.address,
          feeWindowState: "next"
        },
        (err, nextResult) => {
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

function combineValues(currentValue, nextValue) {
  const current = createBigNumber(currentValue || 0);
  const next = createBigNumber(nextValue || 0);
  return current.plus(next).toString();
}
