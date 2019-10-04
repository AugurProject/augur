import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  MODAL_MIGRATE_MARKET,
  MODAL_REPORTING,
  REPORTING_STATE,
} from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';
import { selectMarket } from 'modules/markets/selectors/market';
import { AppState } from 'store';
import { dateHasPassed } from 'utils/format-date';
import { DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { DismissableNotice } from 'modules/reporting/common';

const mapStateToProps = (state: AppState, ownProps) => {
  const marketId = ownProps.marketId;
  const market = selectMarket(marketId);
  const { endTime, reportingState } = market;

  const hasPassed = dateHasPassed(
    state.blockchain.currentAugurTimestamp * 1000,
    endTime
  );

  const show =
    !!(
      state.universe.forkingInfo &&
      state.universe.forkingInfo.winningChildUniverseId
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
});

const mergeProps = (sP, dP, oP) => {
  const action = sP.hasPassed ? dP.report : dP.migrate;

  return {
    ...sP,
    ...dP,
    ...oP,
    buttonAction: () => action(sP.market),
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
