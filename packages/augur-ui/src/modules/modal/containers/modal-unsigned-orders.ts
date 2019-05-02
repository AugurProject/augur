import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { UnsignedOrders } from "modules/modal/unsigned-orders";
import { selectMarket } from "modules/markets/selectors/market";
import { closeModal } from "modules/modal/actions/close-modal";
import {
  startOrderSending,
  clearMarketLiquidityOrders,
  removeLiquidityOrder,
  sendLiquidityOrder
} from "modules/orders/actions/liquidity-management";
import { getGasPrice } from "modules/auth/selectors/get-gas-price";
import {
  CATEGORICAL,
  NEW_ORDER_GAS_ESTIMATE
} from "src/modules/common-elements/constants";
import { createBigNumber } from "utils/create-big-number";
import { formatGasCostToEther, formatEther } from "utils/format-number";

const mapStateToProps = (state: any) => {
  const market = selectMarket(state.modal.marketId);
  return {
    modal: state.modal,
    market,
    liquidity: state.pendingLiquidityOrders[market.id],
    gasPrice: getGasPrice(state),
    loginAccount: state.loginAccount
  };
};

const mapDispatchToProps = (dispatch: Function) => ({
  closeModal: () => dispatch(closeModal()),
  startOrderSending: (options: Object) => dispatch(startOrderSending(options)),
  clearMarketLiquidityOrders: (marketId: string) =>
    dispatch(clearMarketLiquidityOrders(marketId)),
  removeLiquidityOrder: (data: Object) => dispatch(removeLiquidityOrder(data)),
  sendLiquidityOrder: (data: Object) => dispatch(sendLiquidityOrder(data))
});

const mergeProps = (sP, dP, oP) => {
  let numberOfTransactions = 0;
  let totalCost = createBigNumber(0);

  sP.market.outcomes.forEach((outcome: any) => {
    const target =
      sP.market.marketType === CATEGORICAL ? outcome.name : outcome.id;
    sP.liquidity &&
      sP.liquidity[target] &&
      sP.liquidity[target].forEach((order: any, index: number) => {
        totalCost = totalCost.plus(order.orderEstimate);
        numberOfTransactions += numberOfTransactions;
      });
  });
  const gasCost = formatGasCostToEther(
    NEW_ORDER_GAS_ESTIMATE.times(numberOfTransactions).toFixed(),
    { decimalsRounded: 4 },
    sP.gasPrice
  );
  const bnAllowance = createBigNumber(sP.loginAccount.allowance, 10);
  const {
    marketType,
    scalarDenomination,
    description: marketTitle,
    id: marketId,
    numTicks,
    minPrice,
    maxPrice
  } = sP.market;
  return {
    title: "Unsigned Orders",
    description: [
      "You have unsigned orders pending for this market's initial liquidity:"
    ],
    scalarDenomination,
    marketType,
    marketTitle,
    marketId,
    numTicks,
    maxPrice,
    minPrice,
    breakdown: [
      {
        label: "Estimated GAS",
        value: formatEther(gasCost).full
      },
      {
        label: "Total Cost (ETH)",
        value: formatEther(totalCost.toFixed()).full,
        highlight: true
      }
    ],
    header: [
      "outcome",
      "type",
      "quantity",
      "price",
      "estimated costs (eth)",
      ""
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
        action: () => dP.startOrderSending({ marketId })
      },
      {
        text: "Cancel All",
        action: () => {
          dP.clearMarketLiquidityOrders(sP.market.id);
          dP.closeModal();
        }
      }
    ],
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    }
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(UnsignedOrders)
);
