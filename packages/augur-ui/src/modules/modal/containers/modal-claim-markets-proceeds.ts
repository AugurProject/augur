import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { startClaimingMarketsProceeds, claimMarketsProceedsGas } from 'modules/positions/actions/claim-markets-proceeds';
import { selectCurrentTimestampInSeconds } from 'appStore/select-state';
import {
  formatEther,
  formatDai,
  formatGasCostToEther,
} from 'utils/format-number';
import { closeModal } from 'modules/modal/actions/close-modal';
import { Proceeds } from 'modules/modal/proceeds';
import {
  MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT,
  PROCEEDS_TO_CLAIM_TITLE,
  CLAIM_ALL_TITLE,
  GWEI_CONVERSION,
} from 'modules/common/constants';
import { CLAIM_MARKETS_PROCEEDS } from 'modules/common/constants';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {
  NodeStyleCallback,
  MarketClaimablePositions,
  MarketData,
} from 'modules/types';
import { selectLoginAccountClaimablePositions } from 'modules/positions/selectors/login-account-claimable-winnings';
import { labelWithTooltip } from 'modules/common/label-with-tooltip';
import { getTransactionLabel } from 'modules/auth/selectors/get-gas-price';
import { createBigNumber } from 'utils/create-big-number';
import { getGasCost } from 'modules/modal/gas';

const mapStateToProps = (state: AppState) => {
  const pendingQueue = state.pendingQueue || [];
  const accountMarketClaimablePositions: MarketClaimablePositions = selectLoginAccountClaimablePositions(
    state
  );

  return {
    modal: state.modal,
    currentTimestamp: selectCurrentTimestampInSeconds(state),
    totalUnclaimedProfit:
      accountMarketClaimablePositions.totals.totalUnclaimedProfit,
    totalUnclaimedProceeds:
    accountMarketClaimablePositions.totals.totalUnclaimedProceeds,
    totalFees:
    accountMarketClaimablePositions.totals.totalFees,
    accountMarketClaimablePositions,
    account: state.loginAccount.address,
    pendingQueue,
    transactionLabel: getTransactionLabel(state),
    gasPrice: state.gasPriceInfo.userDefinedGasPrice || state.gasPriceInfo.average,
    ethToDaiRate: state.appStatus.ethToDaiRate,
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<void, any, Action>) => ({
  closeModal: () => dispatch(closeModal()),
  startClaimingMarketsProceeds: (
    marketIds: string[],
    account: string,
    callback: NodeStyleCallback
  ) => startClaimingMarketsProceeds(marketIds, account, callback),
  estimateGas: (
    marketIds: string[],
    address: string,
  ) => claimMarketsProceedsGas(marketIds, address),
});

const mergeProps = (sP: any, dP: any, oP: any) => {
  const transactionLabel = sP.transactionLabel;
  const pendingQueue = sP.pendingQueue;
  const accountMarketClaimablePositions = sP.accountMarketClaimablePositions;
  const showBreakdown = accountMarketClaimablePositions.markets.length > 1;
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
        return {
          marketId,
          title: market.description,
          status: pending && pending.status,
          properties: [
            {
              label: labelWithTooltip({
                labelText: "Proceeds after market fees",
                key: "proceeds-after-market-fees",
                tipText: "This number is the return of Frozen Funds for any position(s) held in addition to any profit or loss accrued in this market."
              }),
              value: unclaimedProceeds.full,
            },
          ],
          text: PROCEEDS_TO_CLAIM_TITLE,
          action: showBreakdown ? () => dP.startClaimingMarketsProceeds([marketId], sP.account, () => {}) : null,
          estimateGas: async () => {
              const gasLimit = await dP.estimateGas([marketId], sP.account);
              const gasCostDai = getGasCost(gasLimit, sP.gasPrice, sP.ethToDaiRate);
              const displayfee = `$${gasCostDai.formattedValue}`;
              return {
                label: transactionLabel,
                value: String(displayfee),
              };
          },
        };
      }
    );
  }

  const multiMarket = claimableMarkets.length > 1 ? 's' : '';
  const totalUnclaimedProceedsFormatted = formatDai(sP.totalUnclaimedProceeds);
  const submitAllTxCount = Math.ceil(
    claimableMarkets.length / MAX_BULK_CLAIM_MARKETS_PROCEEDS_COUNT
  );

  if (claimableMarkets.length === 0) {
    if (sP.modal.cb) {
      sP.modal.cb();
    }
    dP.closeModal();
    return {};
  }

  const breakdown = showBreakdown ? [
    {
      label: 'Total Proceeds',
      value: totalUnclaimedProceedsFormatted.full,
    },
  ] : null;

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
    estimateGas: async () => {
      if (breakdown) {
        const gasLimit = await dP.estimateGas(claimableMarkets.map(m => m.marketId), sP.account);
        const gasCostDai = getGasCost(gasLimit, sP.gasPrice, sP.ethToDaiRate);
        const displayfee = `$${gasCostDai.formattedValue}`;
        return {
          label: transactionLabel,
          value: String(displayfee),
        };
      }
      return null;
    },
    breakdown,
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
            sP.account,
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
