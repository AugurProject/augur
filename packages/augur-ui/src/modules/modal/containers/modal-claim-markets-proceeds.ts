import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectMarket } from 'modules/markets/selectors/market';
import { startClaimingMarketsProceeds } from 'modules/positions/actions/claim-markets-proceeds';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { createBigNumber } from 'utils/create-big-number';
import { getGasPrice } from 'modules/auth/selectors/get-gas-price';
import {
  formatGasCostToEther,
  formatDai,
  formatEther,
} from 'utils/format-number';
import { closeModal } from 'modules/modal/actions/close-modal';
import { Proceeds } from 'modules/modal/proceeds';
import {
  CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE,
  MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT,
} from 'modules/common/constants';
import { ActionRowsProps } from 'modules/modal/common';
import { CLAIM_MARKETS_PROCEEDS } from 'modules/common/constants';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback } from 'modules/types';

const mapStateToProps = (state: AppState) => {
  return {
    modal: state.modal,
    pendingQueue: state.pendingQueue || [],
    gasCost: formatGasCostToEther(
      // @ts-ignore
      CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE,
      { decimalsRounded: 4 },
      getGasPrice(state)
    ),
    accountPositions: state.accountPositions,
    currentTimestamp: selectCurrentTimestampInSeconds(state),
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  startClaimingMarketsProceeds: (
    marketIds: string[],
    callback: NodeStyleCallback
  ) => dispatch(startClaimingMarketsProceeds(marketIds, callback)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const marketIds = Object.keys(sP.accountPositions);
  let totalUnclaimedProceeds: any = createBigNumber(0); // BigNumber @type required
  let totalUnclaimedProfit: any = createBigNumber(0);
  const markets = marketIds.map(marketId => {
    const market = selectMarket(marketId);
    const unclaimedProceeds = formatDai(
      sP.accountPositions[market.marketId].tradingPositionsPerMarket
        .totalUnclaimedProceeds
    );
    const unclaimedProfit = formatDai(
      sP.accountPositions[market.marketId].tradingPositionsPerMarket
        .totalUnclaimedProfit
    );

    const pending =
      sP.pendingQueue[CLAIM_MARKETS_PROCEEDS] &&
      sP.pendingQueue[CLAIM_MARKETS_PROCEEDS][marketId];

    totalUnclaimedProceeds = totalUnclaimedProceeds.plus(unclaimedProceeds.formatted);
    totalUnclaimedProfit = totalUnclaimedProfit.plus(unclaimedProfit.formatted);

    return {
      title: market.description,
      status: pending && pending.status,
      properties: [
        {
          label: 'Proceeds',
          value: unclaimedProceeds.full,
        },
        {
          label: 'Profit',
          value: unclaimedProfit.full,
        },
      ],
      text: 'Claim Proceeds',
      action: () => dP.startClaimingMarketsProceeds([marketId], () => {}),
    };
  });
  const totalGas = formatEther(
    createBigNumber(sP.gasCost).times(markets.length)
  );
  const multiMarket = markets.length > 1 ? 's' : '';
  totalUnclaimedProceeds = formatDai(totalUnclaimedProceeds);
  totalUnclaimedProfit = formatDai(totalUnclaimedProfit);

  const submitAllTxCount = Math.ceil(
    markets.length / MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT
  );

  return {
    title: 'Claim Proceeds',
    descriptionMessage: [
      {
        preText: 'You currently have a total of',
        boldText: totalUnclaimedProceeds.full,
        postText: `to be claimed in the following market${multiMarket}:`,
      },
    ],
    rows: markets,
    submitAllTxCount,
    breakdown: [
      {
        label: 'Estimated Gas',
        value: totalGas.full,
      },
      {
        label: 'Total Proceeds',
        value: totalUnclaimedProceeds.full,
      },
      {
        label: 'Total Profit',
        value: totalUnclaimedProfit.full,
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
        text: `${multiMarket ? 'Claim All' : 'Claim Proceeds'}`,
        // @ts-ignore
        disabled: markets.find(market => market.status === 'pending'),
        action: () => {
          dP.closeModal();
          dP.startClaimingMarketsProceeds(marketIds, sP.modal.cb);
        },
      },
    ],
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(Proceeds)
);
