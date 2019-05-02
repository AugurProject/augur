import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { createBigNumber } from "utils/create-big-number";
import {
  formatAttoRep,
  formatAttoEth,
  formatGasCostToEther
} from "utils/format-number";
import { updateReportingWindowStats } from "modules/reports/actions/update-reporting-window-stats";
import {
  redeemStake,
  CLAIM_WINDOW_GAS_COST
} from "modules/reports/actions/claim-reporting-fees";
import { ALL, CLAIM_FEE_WINDOWS } from "modules/common-elements/constants";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";

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

      const promises = [];

      if (result.feeWindows.length > 0 || result.nonforkedMarkets.length > 0) {
        promises.push(
          new Promise(resolve =>
            dispatch(
              redeemStake({
                feeWindows: result.feeWindows,
                nonforkedMarkets: result.nonforkedMarkets,
                estimateGas: true,
                onSuccess: gasCost => {
                  resolve({ type: ALL, gasCost });
                },
                onFailed: gasCost => {
                  resolve({ type: ALL, gasCost });
                }
              })
            )
          )
        );
      }

      result.nonforkedMarkets.forEach(nonforkedMarket => {
        promises.push(
          new Promise(resolve =>
            dispatch(
              redeemStake({
                feeWindows: [],
                nonforkedMarkets: [nonforkedMarket],
                estimateGas: true,
                onSuccess: gasCost => {
                  nonforkedMarket.gasCost = gasCost;
                  resolve();
                },
                onFailed: gasCost => {
                  nonforkedMarket.gasCost = gasCost;
                  resolve();
                }
              })
            )
          )
        );
      });

      Promise.all(promises).then(gasCosts => {
        const windowGas = createBigNumber(CLAIM_WINDOW_GAS_COST)
          .times(result.feeWindows.length)
          .toNumber();
        const gasPrice = getGasPrice(getState());
        const gasCost = formatGasCostToEther(
          windowGas,
          { decimalsRounded: 4 },
          gasPrice
        );

        dispatch(
          updateReportingWindowStats({
            reportingFees: {
              unclaimedEth: formatAttoEth(result.total.unclaimedEth, {
                decimals: 4,
                decimalsRounded: 4,
                zeroStyled: false
              }),
              unclaimedRep: formatAttoRep(unclaimedRepTotal, {
                decimals: 4,
                decimalsRounded: 4,
                zeroStyled: false
              }),
              unclaimedForkEth: formatAttoEth(result.total.unclaimedForkEth, {
                decimals: 4,
                decimalsRounded: 4,
                zeroStyled: false
              }),
              unclaimedForkRepStaked: formatAttoRep(
                result.total.unclaimedForkRepStaked,
                {
                  decimals: 4,
                  decimalsRounded: 4,
                  zeroStyled: false
                }
              ),
              participationTokenRepStaked: formatAttoRep(
                result.total.participationTokenRepStaked,
                {
                  decimals: 4,
                  decimalsRounded: 4,
                  zeroStyled: false
                }
              ),
              unclaimedParticipationTokenEthFees: formatAttoRep(
                result.total.unclaimedParticipationTokenEthFees,
                {
                  decimals: 4,
                  decimalsRounded: 4,
                  zeroStyled: false
                }
              ),
              feeWindows: result.feeWindows,
              forkedMarket: result.forkedMarket,
              nonforkedMarkets: result.nonforkedMarkets,
              gasCosts: {
                ...gasCosts
                  .filter(i => i !== undefined)
                  .reduce((p, i) => ({ ...p, [i.type]: i.gasCost }), {}),
                [CLAIM_FEE_WINDOWS]: gasCost
              }
            }
          })
        );
        callback(null, result);
      });
    }
  );
};
