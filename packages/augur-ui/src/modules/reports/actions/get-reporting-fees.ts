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
import { ALL, CLAIM_FEE_WINDOWS } from "modules/common/constants";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

export const getReportingFees = (
  callback: NodeStyleCallback = logError
): ThunkAction<any, any, any, any> => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { universe, loginAccount } = getState();
  if (loginAccount.address === undefined) return callback(null);
  // TODO: getting users reporting fees, keeping code for reference
  return;
  /*
  augur.augurNode.submitRequest(
    "getReportingFees",
    {
      universe: universe.id,
      reporter: loginAccount.address
    },
    (err: any, result: any) => {
      if (err) return callback(err);

      const unclaimedRepTotal = createBigNumber(result.total.unclaimedRepStaked)
        .plus(createBigNumber(result.total.unclaimedRepEarned))
        .toString();

      const promises: Array<Promise<any>> = [];

      if (result.nonforkedMarkets.length > 0) {
        promises.push(
          new Promise(resolve =>
            dispatch(
              redeemStake({
                feeWindows: [],
                nonforkedMarkets: result.nonforkedMarkets,
                estimateGas: true,
                onSuccess: (gasCost: any) => {
                  resolve({ type: ALL, gasCost });
                },
                onFailed: (gasCost: any) => {
                  resolve({ type: ALL, gasCost });
                }
              })
            )
          )
        );
      }

      result.nonforkedMarkets.forEach((nonforkedMarket: any) => {
        promises.push(
          new Promise(resolve =>
            dispatch(
              redeemStake({
                feeWindows: [],
                nonforkedMarkets: [nonforkedMarket],
                estimateGas: true,
                onSuccess: (gasCost: any) => {
                  nonforkedMarket.gasCost = gasCost;
                  resolve();
                },
                onFailed: (gasCost: any) => {
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
          .times(0) // TODO: no more fee windows, prob use dispute window
          .toNumber();
        const gasPrice = getGasPrice(getState());
        const gasCost = formatGasCostToEther(
          windowGas.toString(),
          { decimalsRounded: 4 },
          gasPrice.toString()
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
              unclaimedParticipationTokenEthFees: formatAttoRep(
                result.total.unclaimedParticipationTokenEthFees,
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
              feeWindows: [], // TODO: no more fee windows, prob use dispute window
              forkedMarket: result.forkedMarket,
              nonforkedMarkets: result.nonforkedMarkets,
              gasCosts: {
                ...gasCosts
                  .filter(i => i !== undefined)
                  .reduce((p, i: any) => ({ ...p, [i.type]: i.gasCost }), {}),
                [CLAIM_FEE_WINDOWS]: gasCost
              }
            }
          })
        );
        callback(null, result);
      });
    }
  );
  */
};
