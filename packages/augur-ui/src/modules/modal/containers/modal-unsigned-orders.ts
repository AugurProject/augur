import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { UnsignedOrders } from "modules/modal/unsigned-orders";
import { selectMarket } from "modules/markets/selectors/market";
import { closeModal } from "modules/modal/actions/close-modal";
import {
  startOrderSending,
  clearMarketLiquidityOrders,
  removeLiquidityOrder,
  sendLiquidityOrder,
} from "modules/orders/actions/liquidity-management";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import {
  NEW_ORDER_GAS_ESTIMATE, MAX_BULK_ORDER_COUNT, ZERO,
} from "modules/common/constants";
import { createBigNumber } from "utils/create-big-number";
import { formatGasCostToEther, formatEther, formatDai } from "utils/format-number";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { BaseAction } from "modules/types";
import { Getters } from "@augurproject/sdk";

const mapStateToProps = (state: AppState) => {
  const market = selectMarket(state.modal.marketId);
  return {
    modal: state.modal,
    market,
    liquidity: state.pendingLiquidityOrders[market.transactionHash],
    gasPrice: getGasPrice(state),
    loginAccount: state.loginAccount,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  startOrderSending: (options: object) => dispatch(startOrderSending(options)),
  clearMarketLiquidityOrders: (marketId: string) =>
    dispatch(clearMarketLiquidityOrders(marketId)),
  removeLiquidityOrder: (data: BaseAction) => dispatch(removeLiquidityOrder(data)),
  sendLiquidityOrder: (data: object) => dispatch(sendLiquidityOrder(data)),
});

const mergeProps = (sP, dP, oP) => {
  let numberOfTransactions = 0;
  let totalCost = createBigNumber(0);

  sP.market.outcomes.forEach((outcome: Getters.Markets.MarketInfoOutcome) => {
    sP.liquidity &&
      sP.liquidity[outcome.id] &&
      sP.liquidity[outcome.id].forEach((order: any, index: number) => {
        totalCost = totalCost.plus(order.orderEstimate);
        numberOfTransactions += 1;
      });
  });
  const gasCost = formatGasCostToEther(
    NEW_ORDER_GAS_ESTIMATE.times(numberOfTransactions).toFixed(),
    { decimalsRounded: 4 },
    sP.gasPrice,
  );
  const bnAllowance = createBigNumber(sP.loginAccount.allowance, 10);
  const needsApproval = bnAllowance.gt(ZERO);
  const submitAllTxCount = Math.ceil(numberOfTransactions / MAX_BULK_ORDER_COUNT);
  const {
    marketType,
    scalarDenomination,
    description: marketTitle,
    id: marketId,
    numTicks,
    minPrice,
    maxPrice,
    transactionHash
  } = sP.market;
  // all orders have been created or removed.
  if (numberOfTransactions === 0) dP.closeModal();
  return {
    title: "Unsigned Orders",
    description: [
      "You have unsigned orders pending for this market's initial liquidity:",
    ],
    scalarDenomination,
    marketType,
    marketTitle,
    marketId,
    numTicks,
    maxPrice,
    minPrice,
    transactionHash,
    needsApproval,
    submitAllTxCount,
    breakdown: [
      {
        label: "Estimated GAS",
        // @ts-ignore
        value: formatEther(gasCost).full,
      },
      {
        label: "Total Cost (DAI)",
        // @ts-ignore
        value: formatDai(totalCost.toFixed()).full,
        highlight: true,
      },
    ],
    header: [
      "outcome",
      "type",
      "quantity",
      "price",
      "estimated costs (dai)",
      "",
      "",
    ],
    liquidity: sP.liquidity,
    outcomes: sP.liquidity && Object.keys(sP.liquidity),
    removeLiquidityOrder: dP.removeLiquidityOrder,
    sendLiquidityOrder: dP.sendLiquidityOrder,
    loginAccount: sP.loginAccount,
    bnAllowance,
    buttons: [
      {
        text: "Submit All",
        action: () => dP.startOrderSending({ marketId }),
      },
      {
        text: "Cancel All",
        action: () => {
          dP.clearMarketLiquidityOrders(sP.market.transactionHash);
          dP.closeModal();
        },
      },
    ],
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
  )(UnsignedOrders),
);
