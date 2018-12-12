import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { createBigNumber } from "utils/create-big-number";
import { formatAttoRep, formatAttoEth } from "utils/format-number";
import { updateReportingWindowStats } from "modules/reports/actions/update-reporting-window-stats";

export const getReportingFees = (callback = logError) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address === undefined) return callback(null);
  augur.augurNode.submitRequest(
    "getReportingFees",
    {
      universe: universe.id,
      reporter: loginAccount.address
    },
    (err, result) => {
      if (err) return callback(err);

      const unclaimedRepTotal = createBigNumber(result.total.unclaimedRepStaked)
        .plus(createBigNumber(result.total.unclaimedRepEarned))
        .toString();

      dispatch(
        updateReportingWindowStats({
          reportingFees: {
            unclaimedEth: formatAttoEth(result.total.unclaimedEth, {
              decimals: 4,
              decimalsRounded: 4,
              zeroStyled: true,
              formatZero: true,
            }),
            unclaimedRep: formatAttoRep(unclaimedRepTotal, {
              decimals: 4,
              decimalsRounded: 4,
              zeroStyled: true,
              formatZero: true,
            }),
            unclaimedForkEth: formatAttoEth(result.total.unclaimedForkEth, {
              decimals: 4,
              decimalsRounded: 4,
              zeroStyled: true,
              formatZero: true,
            }),
            unclaimedForkRepStaked: formatAttoRep(
              result.total.unclaimedForkRepStaked,
              { decimals: 4, decimalsRounded: 4, zeroStyled: true, formatZero: true }
            ),
            feeWindows: result.feeWindows,
            forkedMarket: result.forkedMarket,
            nonforkedMarkets: result.nonforkedMarkets
          }
        })
      );

      callback(null, result);
    }
  );
};
