import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectMarket } from 'modules/markets/selectors/market';
import { MarketHeaderReporting } from 'modules/market/components/market-header/market-header-reporting';
import { sendFinalizeMarket } from 'modules/markets/actions/finalize-market';
import { updateModal } from 'modules/modal/actions/update-modal';
import {
  MODAL_CLAIM_MARKETS_PROCEEDS,
  DESIGNATED_REPORTER_SELF,
  MODAL_REPORTING,
} from 'modules/common/constants';
import { NodeStyleCallback } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';
import { ZERO } from 'modules/common/constants';
import { isSameAddress } from 'utils/isSameAddress';

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const disputeInfoStakes = market.disputeInfo && market.disputeInfo.stakes;
  const marketId = ownProps.market ? ownProps.market.id : ownProps.marketId;
  return {
    market,
    isForking: !!state.universe.forkingInfo,
    isForkingMarket: state.universe.forkingInfo && state.universe.forkingInfo.forkingMarket === market.id,
    isLogged: state.authStatus.isLogged && !state.universe.forkingInfo,
    isLoggedIn: state.authStatus.isLogged,
    isDesignatedReporter: ownProps.preview
      ? market.designatedReporterType === DESIGNATED_REPORTER_SELF
      : isSameAddress(market.designatedReporter, state.loginAccount.address),
    tentativeWinner: disputeInfoStakes && disputeInfoStakes.find(stake => stake.tentativeWinning) || {},
    canClaimProceeds:
      state.accountPositions[marketId] &&
      state.accountPositions[marketId].tradingPositionsPerMarket &&
      createBigNumber(
        state.accountPositions[marketId].tradingPositionsPerMarket
          .unclaimedProceeds
      ).gt(ZERO)
        ? true
        : false,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  finalizeMarket: (marketId, cb) => dispatch(sendFinalizeMarket(marketId, cb)),
  showReportingModal: () =>
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        market: ownProps.market || selectMarket(ownProps.marketId),
      })
    ),
  claimMarketsProceeds: (marketIds: string[], cb: NodeStyleCallback) =>
    dispatch(
      updateModal({ type: MODAL_CLAIM_MARKETS_PROCEEDS, marketIds, cb })
    ),
});

const MarketHeaderReportingContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketHeaderReporting)
);

export default MarketHeaderReportingContainer;
