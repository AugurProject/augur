import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  MODAL_MIGRATE_MARKET,
  MODAL_REPORTING,
  REPORTING_STATE,
  MODAL_CLAIM_FEES,
  ZERO,
} from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';
import { selectMarket } from 'modules/markets/selectors/market';
import { AppState } from 'store';
import { dateHasPassed } from 'utils/format-date';
import { DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { DismissableNotice } from 'modules/reporting/common';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import { MarketReportClaimableContracts } from 'modules/types';

const mapStateToProps = (state: AppState, ownProps) => {
  const marketId = ownProps.marketId;
  const market = selectMarket(marketId);
  const { endTime, reportingState } = market;

  const hasPassed = dateHasPassed(
    state.blockchain.currentAugurTimestamp * 1000,
    endTime
  );
  const releasableRep = selectReportingWinningsByMarket(state);
  let hasReleaseRep = releasableRep.totalUnclaimedRep.gt(ZERO);
  if (hasReleaseRep && releasableRep.claimableMarkets && releasableRep.claimableMarkets.unclaimedRep) {
    hasReleaseRep = releasableRep.claimableMarkets.marketContracts.filter(c => c.marketId === marketId).length > 0;
  }
  const show =
    !!(
      state.universe.forkingInfo &&
      (state.universe.forkingInfo.winningChildUniverseId || hasReleaseRep)
    ) &&
    (reportingState !== REPORTING_STATE.FINALIZED &&
      reportingState !== REPORTING_STATE.AWAITING_FINALIZATION);

  let title =
    'Fork has finalized. Please migrate this market to the new universe.';
  let buttonText = 'Migrate Market';

  if (hasPassed) {
    title =
      'Fork has finalized. This market needs initial report to migrate to new universe.';
    buttonText = 'Report and Migrate Market';
  }
  return {
    market,
    hasPassed,
    show,
    buttonText,
    buttonType: DISMISSABLE_NOTICE_BUTTON_TYPES.BUTTON,
    title,
    description: 'migrate market to new universe',
    releasableRep,
    hasReleaseRep,
  };
};

const mapDispatchToProps = dispatch => ({
  report: market =>
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        market,
      })
    ),
  migrate: market =>
    dispatch(
      updateModal({
        type: MODAL_MIGRATE_MARKET,
        market,
      })
    ),
  releaseReportingRep: (allRep: MarketReportClaimableContracts) =>
    dispatch(
      updateModal({
        type: MODAL_CLAIM_FEES,
        ...allRep,
      })
    ),
});

const mergeProps = (sP, dP, oP) => {
  let action = sP.hasPassed
    ? () => dP.report(sP.market)
    : () => dP.migrate(sP.market);
  action = sP.hasReleaseRep
    ? () => dP.releaseReportingRep(sP.releasableRep)
    : action;
  return {
    ...sP,
    ...dP,
    ...oP,
    buttonAction: action,
  };
};

const MigrateMarketNotice = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(DismissableNotice)
);

export default MigrateMarketNotice;
