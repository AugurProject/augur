import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { UnsignedOrders } from 'modules/modal/unsigned-orders';
import { selectMarket } from 'modules/markets/selectors/market';
import { closeModal } from 'modules/modal/actions/close-modal';
import {
  sendLiquidityOrder,
  startOrderSending,
} from 'modules/orders/actions/liquidity-management';
import { NEW_ORDER_GAS_ESTIMATE, ZERO } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { formatDai, formatGasCostToEther } from 'utils/format-number';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { CreateLiquidityOrders } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { totalTradingBalance } from 'modules/auth/helpers/login-account';
import { AppStatus } from 'modules/app/store/app-status';
import { PendingOrders } from 'modules/app/store/pending-orders';

const mapStateToProps = (state: AppState) => {
  const {
    loginAccount,
    modal,
    gsnEnabled: GsnEnabled,
    gasPriceInfo,
  } = AppStatus.get();
  const { pendingLiquidityOrders } = PendingOrders.get();
  const market = selectMarket(modal.marketId);
  let availableDai = totalTradingBalance();
  const gasPrice = gasPriceInfo.userDefinedGasPrice || gasPriceInfo.average;
  return {
    modal,
    market,
    liquidity: pendingLiquidityOrders[market.transactionHash],
    gasPrice,
    loginAccount,
    GsnEnabled,
    availableDai,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => closeModal(),
  startOrderSending: (options: CreateLiquidityOrders) =>
    dispatch(startOrderSending(options)),
  clearMarketLiquidityOrders: (txParamHash: string) =>
    PendingOrders.actions.clearAllMarketLiquidity({ txParamHash }),
  removeLiquidityOrder: data => PendingOrders.actions.removeLiquidity(data),
  sendLiquidityOrder: (data: object) => dispatch(sendLiquidityOrder(data)),
});

const mergeProps = (sP, dP, oP) => {
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

  const gasCost = sP.GsnEnabled
    ? NEW_ORDER_GAS_ESTIMATE.times(numberOfTransactions).multipliedBy(
        sP.gasPrice
      )
    : formatGasCostToEther(
        NEW_ORDER_GAS_ESTIMATE.times(numberOfTransactions).toFixed(),
        { decimalsRounded: 4 },
        sP.gasPrice
      );

  const bnAllowance = createBigNumber(sP.loginAccount.allowance, 10);
  const needsApproval = bnAllowance.lte(ZERO);
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
    numberOfTransactions,
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
    bnAllowance,
    buttons: [
      {
        disabled: insufficientFunds,
        text: 'Submit All',
        action: () => dP.startOrderSending({ marketId }),
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
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(UnsignedOrders)
);
