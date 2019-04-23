import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectMarket } from "modules/markets/selectors/market";
import claimTradingProceeds, {
  CLAIM_SHARES_GAS_COST,
  claimMultipleTradingProceeds
} from "modules/positions/actions/claim-trading-proceeds";
import { selectCurrentTimestampInSeconds } from "src/select-state";
import { createBigNumber } from "utils/create-big-number";
import canClaimProceeds from "utils/can-claim-proceeds";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import { formatGasCostToEther, formatEther } from "utils/format-number";
import { closeModal } from "modules/modal/actions/close-modal";
import { Proceeds } from "modules/modal/proceeds";
import { constants } from "services/augurjs";
import { ActionRowsProps } from "modules/modal/common";
import { CLAIM_PROCEEDS } from "modules/common-elements/constants";

const mapStateToProps = (state: any) => ({
  modal: state.modal,
  pendingQueue: state.pendingQueue || [],
  gasCost: formatGasCostToEther(
    CLAIM_SHARES_GAS_COST,
    { decimalsRounded: 4 },
    getGasPrice(state)
  ),
  accountShareBalances: state.accountShareBalances,
  currentTimestamp: selectCurrentTimestampInSeconds(state)
});

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal()),
  claimTradingProceeds: (marketId: string, callback: Function) =>
    dispatch(claimTradingProceeds(marketId, callback)),
  claimMultipleTradingProceeds: (
    marketIds: Array<string>,
    callback: Function
  ) => dispatch(claimMultipleTradingProceeds(marketIds, callback))
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const marketIdsToTest = Object.keys(sP.accountShareBalances);
  const markets: Array<ActionRowsProps> = [];
  const marketIds: Array<string> = [];
  let totalProceeds: any = createBigNumber(0); // BigNumber @type required
  marketIdsToTest.forEach(marketId => {
    const market = selectMarket(marketId);
    if (
      market &&
      market.reportingState === constants.REPORTING_STATE.FINALIZED
    ) {
      const winningOutcomeShares = formatEther(market.outstandingReturns);

      if (
        canClaimProceeds(
          market.finalizationTime,
          market.outstandingReturns,
          sP.currentTimestamp
        ) &&
        winningOutcomeShares.value > 0
      ) {
        const pending =
          sP.pendingQueue[CLAIM_PROCEEDS] &&
          sP.pendingQueue[CLAIM_PROCEEDS][marketId];
        markets.push({
          title: market.description,
          status: pending && pending.status,
          properties: [
            {
              label: "Proceeds",
              value: winningOutcomeShares.full
            }
          ],
          text: "Claim Proceeds",
          action: () => dP.claimTradingProceeds(marketId, () => {})
        });
        marketIds.push(marketId);
        totalProceeds = totalProceeds.plus(winningOutcomeShares.formatted);
      }
    }
  });
  const totalGas = formatEther(
    createBigNumber(sP.gasCost).times(markets.length)
  );
  const multiMarket = markets.length > 1 ? "s" : "";
  totalProceeds = formatEther(totalProceeds);
  return {
    title: "Claim Proceeds",
    descriptionMessage: [
      {
        preText: "You currently have a total of",
        boldText: totalProceeds.full,
        postText: `to be claimed in the following market${multiMarket}:`
      }
    ],
    rows: markets,
    breakdown: [
      {
        label: "Estimated Gas",
        value: totalGas.full
      },
      {
        label: "Total Proceeds",
        value: totalProceeds.full
      }
    ],
    closeAction: () => {
      dP.closeModal();
      if (sP.modal.cb) {
        sP.modal.cb();
      }
    },
    buttons: [
      {
        text: `${multiMarket ? "Claim All Proceeds" : "Claim Proceeds"}`,
        disabled: markets.find(market => market.status === "pending"),
        action: () => {
          dP.closeModal();
          if (multiMarket) {
            dP.claimMultipleTradingProceeds(marketIds, sP.modal.cb);
          } else {
            dP.claimTradingProceeds(marketIds[0], sP.modal.cb);
          }
        }
      }
    ]
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Proceeds)
);
