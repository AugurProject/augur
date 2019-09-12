import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectMarket } from "modules/markets/selectors/market";
import { claimTradingProceeds, claimMarketsProceeds } from "modules/positions/actions/claim-trading-proceeds";
import { selectCurrentTimestampInSeconds } from "store/select-state";
import { createBigNumber } from "utils/create-big-number";
import canClaimProceeds from "utils/can-claim-proceeds";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { formatGasCostToEther, formatEther } from "utils/format-number";
import { closeModal } from "modules/modal/actions/close-modal";
import { Proceeds } from "modules/modal/proceeds";
import { REPORTING_STATE } from "modules/common/constants";
import { ActionRowsProps } from "modules/modal/common";
import { CLAIM_PROCEEDS } from "modules/common/constants";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";

const mapStateToProps = (state: AppState) => {
console.log('state');
console.log(state);
// How to get marketIds
  return {
    modal: state.modal,
    // pendingQueue: state.pendingQueue || [],
    // gasCost: formatGasCostToEther(
    //   // @ts-ignore
    //   CLAIM_SHARES_GAS_COST,
    //   { decimalsRounded: 4 },
    //   getGasPrice(state),
    // ),
    currentTimestamp: selectCurrentTimestampInSeconds(state),
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  claimTradingProceeds: (marketId: string, callback: NodeStyleCallback) =>
    dispatch(claimTradingProceeds(marketId, callback)),
  claimMultipleTradingProceeds: (
    marketIds: string[],
    callback: NodeStyleCallback
  ) => dispatch(claimMarketsProceeds(marketIds, callback)),
});

// const mapStateToProps = (state: AppState) => {
//   const market = selectMarket(state.modal.marketId);

//   return {
//     modal: state.modal,
//     marketDescription: market.description,
//   };
// };

const mergeProps = async (sP: any, dP: any, oP: any) => {
console.log('!!!!! in mergeProps');
console.log(sP);
await claimMarketsProceeds(
  ['0xcB4D43F9799d6320f8cDFF2c757D85c82832A9C5'],
  '0xbd355A7e5a7ADb23b51F54027E624BfE0e238DF6',
  '0x0000000000000000000000000000000000000000'
);
  const marketIdsToTest = []; Object.keys(sP.modal.accountShareBalances);
  const markets: ActionRowsProps[] = [];
  const marketIds: string[] = [];
  let totalProceeds: any = createBigNumber(0); // BigNumber @type required
  marketIdsToTest.forEach((marketId) => {
    const market = selectMarket(marketId);
    if (
      market &&
      market.reportingState === REPORTING_STATE.FINALIZED
    ) {
      const winningOutcomeShares = formatEther(market.outstandingReturns);

      if (
        canClaimProceeds(
          market.finalizationTime,
          market.outstandingReturns,
          sP.currentTimestamp,
        ) &&
        winningOutcomeShares.value > 0
      ) {
        const pending =
          sP.pendingQueue[CLAIM_PROCEEDS] &&
          sP.pendingQueue[CLAIM_PROCEEDS][marketId];
        markets.push({
          // @ts-ignore
          title: market.description,
          status: pending && pending.status,
          properties: [
            {
              label: "Proceeds",
              value: winningOutcomeShares.full,
            },
          ],
          text: "Claim Proceeds",
          action: () => dP.claimTradingProceeds(marketId, () => {}),
        });
        marketIds.push(marketId);
        totalProceeds = totalProceeds.plus(winningOutcomeShares.formatted);
      }
    }
  });
  const totalGas = formatEther(
    // @ts-ignore
    createBigNumber(sP.gasCost).times(markets.length),
  );
  const multiMarket = markets.length > 1 ? "s" : "";
  totalProceeds = formatEther(totalProceeds);
  return {
    title: "Claim Proceeds",
    descriptionMessage: [
      {
        preText: "You currently have a total of",
        boldText: totalProceeds.full,
        postText: `to be claimed in the following market${multiMarket}:`,
      },
    ],
    rows: markets,
    breakdown: [
      {
        label: "Estimated Gas",
        value: totalGas.full,
      },
      {
        label: "Total Proceeds",
        value: totalProceeds.full,
      },
    ],
    closeAction: () => {
      dP.closeModal();
      if (sP.modal.cb) {
        sP.modal.cb();
      }
    },
    buttons: [
      {
        text: `${multiMarket ? "Claim All" : "Claim Proceeds"}`,
        // @ts-ignore
        disabled: markets.find((market) => market.status === "pending"),
        action: () => {
          dP.closeModal();
          if (multiMarket) {
            dP.claimMultipleTradingProceeds(marketIds, sP.modal.cb);
          } else {
            dP.claimTradingProceeds(marketIds[0], sP.modal.cb);
          }
        },
      },
    ],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(Proceeds),
);
