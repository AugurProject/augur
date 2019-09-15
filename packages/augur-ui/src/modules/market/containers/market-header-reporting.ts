import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { selectMarket } from 'modules/markets/selectors/market';
import MarketHeaderReporting from 'modules/market/components/market-header/market-header-reporting';
import { sendFinalizeMarket } from 'modules/markets/actions/finalize-market';
import { selectCurrentTimestampInSeconds } from 'store/select-state';
import { updateModal } from 'modules/modal/actions/update-modal';
import {
  MODAL_CLAIM_MARKETS_PROCEEDS,
  DESIGNATED_REPORTER_SELF,
} from 'modules/common/constants';
import { NodeStyleCallback } from 'modules/types';
import { createBigNumber } from '../../../utils/create-big-number';
import { ZERO } from 'modules/common/constants';

const mapStateToProps = (state, ownProps) => {
  const market = ownProps.market || selectMarket(ownProps.marketId);
  const disputeOutcomes = {}; // marketDisputeOutcomes() || {};
  return {
    currentTimestamp: selectCurrentTimestampInSeconds(state) || 0,
    market,
    isLogged: state.authStatus.isLogged,
    isDesignatedReporter: ownProps.preview
      ? market.designatedReporterType === DESIGNATED_REPORTER_SELF
      : market.designatedReporter === state.loginAccount.address,
    tentativeWinner:
      disputeOutcomes[ownProps.marketId] &&
      disputeOutcomes[ownProps.marketId].find(o => o.tentativeWinning),
    canClaimProceeds:
      state.accountPositions[ownProps.marketId] &&
      state.accountPositions[ownProps.marketId].tradingPositionsPerMarket &&
      createBigNumber(
        state.accountPositions[ownProps.marketId].tradingPositionsPerMarket
          .totalUnclaimedProceeds
      ).gt(ZERO)
        ? true
        : false,
  };
};

const mapDispatchToProps = dispatch => ({
  finalizeMarket: (marketId, cb) => dispatch(sendFinalizeMarket(marketId, cb)),
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
