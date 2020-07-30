import type { Getters } from '@augurproject/sdk';
import { AppState } from 'appStore';
import { totalTradingBalance } from 'modules/auth/selectors/login-account';
import {
  MAX_BULK_ORDER_COUNT,
  NEW_ORDER_GAS_ESTIMATE,
  ZERO,
} from 'modules/common/constants';
import { selectMarket } from 'modules/markets/selectors/market';
import { closeModal } from 'modules/modal/actions/close-modal';
import { UnsignedOrders } from 'modules/modal/unsigned-orders';
import {
  clearMarketLiquidityOrders,
  removeLiquidityOrder,
  sendLiquidityOrder,
  startOrderSending,
} from 'modules/orders/actions/liquidity-management';
import { CreateLiquidityOrders } from 'modules/types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { formatDai } from 'utils/format-number';

const mapStateToProps = (state: AppState) => {
  const market = selectMarket(state.modal.marketId);
  let availableDai = totalTradingBalance(state.loginAccount);
  const gasPrice = state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average;

  return {
    modal: state.modal,
    market,
    liquidity: state.pendingLiquidityOrders[market.transactionHash],
    gasPrice,
    loginAccount: state.loginAccount,
    chunkOrders: !state.appStatus.zeroXEnabled,
    availableDai,
    affiliate: state.loginAccount?.affiliate,
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
    insufficientFunds,
    submitAllTxCount,
    affiliate: sP.affiliate,
    gasPrice: sP.gasPrice,
    breakdown: [
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
    buttons: [
      {
        disabled: insufficientFunds,
        text: 'Submit All',
        action: async () => await dP.startOrderSending({marketId, chunkOrders}),
      },
      // Temporarily removed because there is no confirmation, the button just cancels everything on a single click
      // {
      //   text: 'Cancel All',
      //   action: () => {
      //     dP.clearMarketLiquidityOrders(sP.market.transactionHash);
      //     dP.closeModal();
      //   },
      // },
      {
        text: 'Close',
        action: () => {
          dP.closeModal();
        },
      },
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
