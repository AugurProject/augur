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
import { claimMarketsProceedsEstimateGas } from 'modules/contracts/actions/contractCalls';

const mapStateToProps = async (state: AppState) => {
  const gasPrice = getGasPrice(state);
  const accountAddreess = state.loginAccount.address;
  const pendingQueue = state.pendingQueue || [];
  const accountMarketClaimablePositions: MarketClaimablePositions = selectLoginAccountClaimablePositions(
    state
  );
  let totalGas = ZERO;
  let claimableMarkets = [];
  if (
    accountMarketClaimablePositions.markets &&
    accountMarketClaimablePositions.markets.length > 0
  ) {
    claimableMarkets = await accountMarketClaimablePositions.markets.map(
      async (market: MarketData) => {
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
        const claimGas = await claimMarketsProceedsEstimateGas(
          [marketId],
          accountAddreess
        );
        totalGas = totalGas.plus(createBigNumber(claimGas));
        const gasCost = formatGasCostToEther(
          claimGas,
          { decimalsRounded: 4 },
          gasPrice
        );
        return {
          marketId,
          title: market.description,
          status: pending && pending.status,
          properties: [
            {
              label: 'Proceeds',
              value: unclaimedProceeds.formatted,
            },
            {
              label: 'Profit',
              value: unclaimedProfit.formatted,
            },
            {
              label: 'Transaction Cost',
              value: gasCost,
            },
          ],
          text: 'Claim Proceeds',
          action: null,
        };
      }
    );
  }
  const totalGasCost = formatGasCostToEther(
    totalGas,
    { decimalsRounded: 4 },
    gasPrice
  );
  return {
    modal: state.modal,
    totalGasCost,
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    claimableMarkets,
    totalUnclaimedProfit:
      accountMarketClaimablePositions.totals.totalUnclaimedProfit,
    totalUnclaimedProceeds:
      accountMarketClaimablePositions.totals.totalUnclaimedProceeds,
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
  if (!markets) return { buttons: [] };
  const claimableMarkets = markets.map(m => ({
    ...m,
    action: () => dP.startClaimingMarketsProceeds([m.marketId], () => {}),
  }));

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
      },
    ],
    rows: claimableMarkets,
    submitAllTxCount,
    breakdown: [
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
        value: sP.totalGasCost,
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
          dP.startClaimingMarketsProceeds(
            claimableMarkets.map(m => m.marketId),
            sP.modal.cb
          );
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
