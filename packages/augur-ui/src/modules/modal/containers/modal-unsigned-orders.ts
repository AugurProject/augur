import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { UnsignedOrders } from 'modules/modal/unsigned-orders';
import { selectMarket } from 'modules/markets/selectors/market';
import { closeModal } from 'modules/modal/actions/close-modal';
import {
  clearMarketLiquidityOrders,
  removeLiquidityOrder,
  sendLiquidityOrder,
  startOrderSending,
} from 'modules/orders/actions/liquidity-management';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import {
  MAX_BULK_ORDER_COUNT,
  NEW_ORDER_GAS_ESTIMATE,
  ZERO,
} from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import {
  formatDai,
  formatEther,
  formatGasCostToEther,
} from 'utils/format-number';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { CreateLiquidityOrders } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';

const mapStateToProps = (state: AppState) => {
  const market = selectMarket(state.modal.marketId);
  let availableDai = totalTradingBalance(state.loginAccount);
  return {
    modal: state.modal,
    market,
    liquidity: state.pendingLiquidityOrders[market.transactionHash],
    gasPrice: getGasPrice(state),
    loginAccount: state.loginAccount,
    chunkOrders: !state.appStatus.zeroXEnabled,
    Gnosis_ENABLED: state.appStatus.gnosisEnabled,
    ethToDaiRate: state.appStatus.ethToDaiRate,
    availableDai
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  startOrderSending: (options: CreateLiquidityOrders) => dispatch(startOrderSending(options)),
  clearMarketLiquidityOrders: (marketId: string) =>
    dispatch(clearMarketLiquidityOrders(marketId)),
  removeLiquidityOrder: (data) =>
    dispatch(removeLiquidityOrder(data)),
  sendLiquidityOrder: (data: object) => dispatch(sendLiquidityOrder(data)),
});

const mergeProps = (sP, dP, oP) => {
  const { chunkOrders } = sP;
  let numberOfTransactions = 0;
  let totalCost = ZERO;

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
    sP.gasPrice
  );
  const bnAllowance = createBigNumber(sP.loginAccount.allowance, 10);
  const needsApproval = bnAllowance.lte(ZERO);
  const submitAllTxCount = chunkOrders ? Math.ceil(
    numberOfTransactions / MAX_BULK_ORDER_COUNT
  ) : numberOfTransactions;
  const insufficientFunds = sP.availableDai.lt(totalCost);
  const {
    marketType,
    scalarDenomination,
    description: marketTitle,
    id: marketId,
    numTicks,
    minPrice,
    maxPrice,
    transactionHash,
  } = sP.market;
  // all orders have been created or removed.
  if (numberOfTransactions === 0) {
    if (sP.modal.cb) {
      sP.modal.cb();
    }
    dP.closeModal();
  }
  return {
    title: 'Unsigned Orders',
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
    insufficientFunds,
    submitAllTxCount,
    breakdown: [
      {
        label: 'Transaction Fee',
        value: sP.Gnosis_ENABLED ? displayGasInDai(gasCost, sP.ethToDaiRate) : formatEther(gasCost).full,
      },
      {
        label: 'Total Cost (DAI)',
        value: formatDai(totalCost.toFixed()).full,
        highlight: true,
      },
    ],
    header: [
      'outcome',
      'type',
      'quantity',
      'price',
      'estimated costs (dai)',
      '',
      '',
    ],
    liquidity: sP.liquidity,
    outcomes: sP.liquidity && Object.keys(sP.liquidity),
    removeLiquidityOrder: dP.removeLiquidityOrder,
    sendLiquidityOrder: dP.sendLiquidityOrder,
    loginAccount: sP.loginAccount,
    bnAllowance,
    buttons: [
      {
        disabled: insufficientFunds,
        text: 'Submit All',
        action: () => dP.startOrderSending({ marketId, chunkOrders }),
      },
      // Temporarily removed because there is no confirmation, the button just cancels everything on a single click
      // {
      //   text: 'Cancel All',
      //   action: () => {
      //     dP.clearMarketLiquidityOrders(sP.market.transactionHash);
      //     dP.closeModal();
      //   },
      // },
    ],
    closeAction: () => {
      dP.closeModal();
    },
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(UnsignedOrders)
);
