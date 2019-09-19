import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectMarket } from 'modules/markets/selectors/market';
import { startClaimingMarketsProceeds } from 'modules/positions/actions/claim-markets-proceeds';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
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
  ZERO,
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

const mapStateToProps = (state: AppState) => {
  const gasCost = formatGasCostToEther(
    CLAIM_MARKETS_PROCEEDS_GAS_ESTIMATE,
    { decimalsRounded: 4 },
    getGasPrice(state)
  );
  const pendingQueue = state.pendingQueue || [];
  const accountMarketClaimablePositions: MarketClaimablePositions =  selectLoginAccountClaimablePositions(
    state
  );
  let totalUnclaimedProceeds: BigNumber = ZERO; // BigNumber @type required
  let totalUnclaimedProfit: BigNumber = ZERO;
  let claimableMarkets = [];
  if (
    accountMarketClaimablePositions.markets &&
    accountMarketClaimablePositions.markets.length > 0
  ) {
    claimableMarkets = accountMarketClaimablePositions.markets.map(
      (market: MarketData) => {
        const marketId = market.id;
        const claimablePosition = accountMarketClaimablePositions.positions[marketId]
          const pending =
            pendingQueue[CLAIM_MARKETS_PROCEEDS] &&
            pendingQueue[CLAIM_MARKETS_PROCEEDS][marketId];

          totalUnclaimedProceeds = totalUnclaimedProceeds.plus(
            claimablePosition.unclaimedProceeds
          );
          totalUnclaimedProfit = totalUnclaimedProfit.plus(
            claimablePosition.unclaimedProfit
          );
          const unclaimedProceeds = formatDai(
            claimablePosition.unclaimedProceeds
          );
          const unclaimedProfit = formatDai(claimablePosition.unclaimedProfit);

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
            action: () => () => {},
          };
        });
      }
  return {
    modal: state.modal,
    gasCost,
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    claimableMarkets,
    totalUnclaimedProceeds,
    totalUnclaimedProfit
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

  const claimableMarkets = sP.claimableMarkets;

  const totalGas = formatEther(
    createBigNumber(sP.gasCost).times(claimableMarkets.length)
  );
  const multiMarket = claimableMarkets.length > 1 ? 's' : '';
  const totalUnclaimedProceedsFormatted = formatDai(sP.totalUnclaimedProceeds);
  const totalUnclaimedProfitFormatted = formatDai(sP.totalUnclaimedProfit);

  const submitAllTxCount = Math.ceil(
    claimableMarkets.length / MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT
  );

  return {
    title: 'Claim Proceeds',
    descriptionMessage: [
      {
        preText: 'You currently have a total of',
        boldText: totalUnclaimedProceedsFormatted.formatted,
        postText: `to be claimed in the following market${multiMarket}:`,
      },
    ],
    rows: claimableMarkets,
    submitAllTxCount,
    breakdown: [
      {
        label: 'Estimated Gas',
        value: totalGas.full,
      },
      {
        label: 'Total Proceeds',
        value: totalUnclaimedProceedsFormatted.formatted,
      },
      {
        label: 'Total Profit',
        value: totalUnclaimedProfitFormatted.formatted,
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
        disabled: claimableMarkets.find(market => market.status === 'pending'),
        action: () => {
          dP.closeModal();
          dP.startClaimingMarketsProceeds(claimableMarkets.map(m => m.marketId), sP.modal.cb);
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
