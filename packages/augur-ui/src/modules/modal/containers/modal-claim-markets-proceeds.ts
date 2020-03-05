import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
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
  PROCEEDS_TO_CLAIM_TITLE,
  CLAIM_ALL_TITLE,
} from 'modules/common/constants';
import { CLAIM_MARKETS_PROCEEDS } from 'modules/common/constants';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  NodeStyleCallback,
  MarketClaimablePositions,
  MarketData,
} from 'modules/types';
import { selectLoginAccountClaimablePositions } from 'modules/positions/selectors/login-account-claimable-winnings';
import { displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';

const mapStateToProps = (state: AppState) => {
  const gasCost = formatGasCostToEther(
    CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE,
    { decimalsRounded: 4 },
    getGasPrice(state)
  );

  const pendingQueue = state.pendingQueue || [];
  const accountMarketClaimablePositions: MarketClaimablePositions = selectLoginAccountClaimablePositions(
    state
  );
  let claimableMarkets = [];
  if (
    accountMarketClaimablePositions.markets &&
    accountMarketClaimablePositions.markets.length > 0
  ) {
    claimableMarkets = accountMarketClaimablePositions.markets.map(
      (market: MarketData) => {
        const marketId = market.id;
        const claimablePosition =
          accountMarketClaimablePositions.positions[marketId];
        const pending =
          pendingQueue[CLAIM_MARKETS_PROCEEDS] &&
          pendingQueue[CLAIM_MARKETS_PROCEEDS][marketId];

        const unclaimedProceeds = formatDai(
          claimablePosition.unclaimedProceeds
        );
        const unclaimedProfit = formatDai(claimablePosition.unclaimedProfit);

        return {
          marketId,
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
          text: PROCEEDS_TO_CLAIM_TITLE,
          action: null,
        };
      }
    );
  }
  return {
    modal: state.modal,
    gasCost,
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    claimableMarkets,
    totalUnclaimedProfit:
      accountMarketClaimablePositions.totals.totalUnclaimedProfit,
    totalUnclaimedProceeds:
    accountMarketClaimablePositions.totals.totalUnclaimedProceeds,
    Gnosis_ENABLED: state.appStatus.gnosisEnabled,
    ethToDaiRate: state.appStatus.ethToDaiRate,
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
  const markets = sP.claimableMarkets;
  const showBreakdown = markets.length > 1;
  const totalGas = formatEther(
    createBigNumber(sP.gasCost).times(markets.length)
  );
  const claimableMarkets = showBreakdown
    ? markets.map(m => ({
        ...m,
        action: () => dP.startClaimingMarketsProceeds([m.marketId], () => {}),
      }))
    : markets.map(m => ({
        ...m,
        action: () => dP.startClaimingMarketsProceeds([m.marketId], () => {}),
        properties: [
          ...m.properties,
          {
            label: 'Transaction Fee',
            value: sP.Gnosis_ENABLED
              ? displayGasInDai(totalGas.value, sP.ethToDaiRate)
              : totalGas.formattedValue,
          },
        ],
      }));

  const multiMarket = claimableMarkets.length > 1 ? 's' : '';
  const totalUnclaimedProceedsFormatted = formatDai(sP.totalUnclaimedProceeds);
  const totalUnclaimedProfitFormatted = formatDai(sP.totalUnclaimedProfit);

  const submitAllTxCount = Math.ceil(
    claimableMarkets.length / MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT
  );

  if (markets.length === 0) {
    if (sP.modal.cb) {
      sP.modal.cb();
    }
    dP.closeModal();
    return {};
  }

  return {
    title: PROCEEDS_TO_CLAIM_TITLE,
    descriptionMessage: [
      {
        preText: 'You currently have a total of',
        boldText: totalUnclaimedProceedsFormatted.full,
      },
    ],
    rows: claimableMarkets,
    submitAllTxCount,
    breakdown: showBreakdown ? [
      {
        label: 'Total Proceeds',
        value: totalUnclaimedProceedsFormatted.formatted,
      },
      {
        label: 'Total Profit',
        value: totalUnclaimedProfitFormatted.formatted,
      },
      {
        label: 'Transaction Fee',
        value: sP.Gnosis_ENABLED ? displayGasInDai(totalGas.value, sP.ethToDaiRate) : totalGas.formattedValue,
      },
    ] : null,
    closeAction: () => {
      if (sP.modal.cb) {
        sP.modal.cb();
      }
      dP.closeModal();
    },
    buttons: [
      {
        text: `${multiMarket ? CLAIM_ALL_TITLE : PROCEEDS_TO_CLAIM_TITLE}`,
        disabled: claimableMarkets.find(market => market.status === 'pending'),
        action: () => {
          dP.startClaimingMarketsProceeds(
            claimableMarkets.map(m => m.marketId),
            sP.modal.cb
          );
          dP.closeModal();
        },
      },
      {
        text: 'Close',
        action: () => {
          if (sP.modal.cb) {
            sP.modal.cb();
          }
          dP.closeModal();
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
