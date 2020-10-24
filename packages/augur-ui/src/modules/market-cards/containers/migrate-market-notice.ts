import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import {
  MODAL_MIGRATE_MARKET,
  MODAL_REPORTING,
  REPORTING_STATE,
  MODAL_CLAIM_FEES,
  ZERO,
  MARKETMIGRATED,
} from 'modules/common/constants';
import { updateModal } from 'modules/modal/actions/update-modal';
import { selectMarket } from 'modules/markets/selectors/market';
import { AppState } from 'appStore';
import { dateHasPassed } from 'utils/format-date';
import { DISMISSABLE_NOTICE_BUTTON_TYPES } from 'modules/reporting/common';
import { DismissableNotice } from 'modules/reporting/common';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import { MarketReportClaimableContracts } from 'modules/types';
import { createBigNumber } from 'utils/create-big-number';

const mapStateToProps = (state: AppState, ownProps) => {
  const { universe, blockchain } = state;
  const { forkingInfo } = universe;
  const isForking = !!forkingInfo;
  const marketId = ownProps.marketId;
  const market = selectMarket(marketId);
  const { endTime } = market;

  let show = isForking;
  let canMigrateMarkets = false;
  let hasReleaseRepOnThisMarket = false;

  const hasMarketEnded = dateHasPassed(
    state.blockchain.currentAugurTimestamp * 1000,
    endTime
  );

  const hasForkPassed = forkingInfo && forkingInfo.isForkingMarketFinalized;

  if (
    isForking &&
    forkingInfo.winningChildUniverseId &&
    universe.children &&
    universe.children.length > 0
  ) {
    const winning = universe.children.find(
      c => c.id === forkingInfo.winningChildUniverseId
    );
    if (createBigNumber(winning.usersRep || ZERO).gt(ZERO)) {
      canMigrateMarkets = true;
    }
  }

  const releasableRep = selectReportingWinningsByMarket(state);
  let hasReleaseRep = releasableRep.totalUnclaimedRep.gt(ZERO);

  if (
    hasReleaseRep &&
    releasableRep.claimableMarkets &&
    releasableRep.claimableMarkets.unclaimedRep
  ) {
    hasReleaseRepOnThisMarket =
      releasableRep.claimableMarkets.marketContracts.filter(
        c => c.marketId === marketId
      ).length > 0;
  }
  let title =
    'Fork has been initiated. Fork needs to be resolved before migrating this market to the new universe.';
  let buttonText = '';
  let description = '';
  let buttonType = DISMISSABLE_NOTICE_BUTTON_TYPES.NONE;
  let queueName = '';
  let queueId = '';

  if (hasForkPassed && canMigrateMarkets) {
    title =
      'Fork has finalized. Please migrate this market to the new universe.';
    description = 'This market will be migrated to the winning universe and will no longer be viewable in the current universe.';
    buttonType = DISMISSABLE_NOTICE_BUTTON_TYPES.BUTTON;
    if (hasMarketEnded) {
      buttonText = 'Report and Migrate Market';
      queueName = MARKETMIGRATED;
      queueId = marketId;
    } else {
      buttonText = 'Migrate Market';
    }
  }

  if (hasForkPassed && !canMigrateMarkets) {
    title =
      'Fork has finalized. REPv2 on Winning Universe is needed to migrate markets ';
    buttonType = DISMISSABLE_NOTICE_BUTTON_TYPES.NONE;
  }

  if (hasReleaseRepOnThisMarket) {
    title =
      'Disputing is paused on this market. Disputing can continue once the fork has finalised.';
    description =
      'As you hold REPv2 in this market’s dispute, please release it now to migrate in the fork.';
    buttonText = 'Release REPv2';
    buttonType = DISMISSABLE_NOTICE_BUTTON_TYPES.BUTTON;
  }

  if (isForking && forkingInfo.forkingMarket === market.id) {
    show = false;
  }

  return {
    market,
    show,
    buttonText,
    queueName,
    queueId,
    buttonType,
    title,
    description,
    hasMarketEnded,
    releasableRep,
    hasReleaseRep,
    canMigrateMarkets,
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
  let action = null;
  action = sP.hasReleaseRep
    ? () => dP.releaseReportingRep(sP.releasableRep)
    : action;

  if (sP.canMigrateMarkets) {
    action = sP.hasMarketEnded
      ? () => dP.report(sP.market)
      : () => dP.migrate(sP.market);
  }

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
