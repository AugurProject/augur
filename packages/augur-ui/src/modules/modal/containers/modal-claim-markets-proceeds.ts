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
  // claimMarketsProceeds: (marketId: string, callback: NodeStyleCallback) =>
  //   dispatch(claimMarketsProceeds(marketId, callback)),
  startClaimingMarketsProceeds: (
    marketIds: string[],
    callback: NodeStyleCallback
  ) => dispatch(startClaimingMarketsProceeds(marketIds, callback)),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const marketIdsToTest = Object.keys(sP.accountPositions);
  const markets: ActionRowsProps[] = [];
  const marketIds: string[] = [];
  let totalProceeds: any = createBigNumber(0); // BigNumber @type required
  marketIdsToTest.forEach(marketId => {
    const market = selectMarket(marketId);
    const winningOutcomeShares = formatDai(
      sP.accountPositions[market.marketId].tradingPositionsPerMarket
        .totalUnclaimedProceeds
    );

    const pending =
      sP.pendingQueue[CLAIM_MARKETS_PROCEEDS] &&
      sP.pendingQueue[CLAIM_MARKETS_PROCEEDS][marketId];
    markets.push({
      // @ts-ignore
      title: market.description,
      status: pending && pending.status,
      properties: [
        {
          label: 'Proceeds',
          value: winningOutcomeShares.full,
        },
      ],
      text: 'Claim Proceeds',
      action: () => dP.startClaimingMarketsProceeds([marketId], () => {}),
    });
    marketIds.push(marketId);
    totalProceeds = totalProceeds.plus(winningOutcomeShares.formatted);
  });
  const totalGas = formatEther(
    // @ts-ignore
    createBigNumber(sP.gasCost).times(markets.length)
  );
  const multiMarket = markets.length > 1 ? 's' : '';
  totalProceeds = formatDai(totalProceeds);

  const submitAllTxCount = Math.ceil(
    markets.length / MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT
  );

  return {
    title: 'Claim Proceeds',
    descriptionMessage: [
      {
        preText: 'You currently have a total of',
        boldText: totalProceeds.full,
        postText: `to be claimed in the following market${multiMarket}:`,
      },
    ],
    rows: markets,
    needsApproval: false,
    submitAllTxCount,
    breakdown: [
      {
        label: 'Estimated Gas',
        value: totalGas.full,
      },
      {
        label: 'Total Proceeds',
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
