import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ForkingBanner from 'modules/reporting/forking-banner';
import { updateModal } from 'modules/modal/actions/update-modal';
import { MODAL_REPORTING, ZERO, MODAL_CLAIM_FEES } from 'modules/common/constants';
import { AppState } from 'store';
import { createBigNumber } from 'utils/create-big-number';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { selectMarket } from 'modules/markets/selectors/market';
import { MarketReportClaimableContracts } from 'modules/types';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';

const mapStateToProps = (state: AppState) => {
  const { universe, loginAccount, blockchain } = state;
  const { forkingInfo } = universe;
  const isForking = forkingInfo !== null;
  // if (!isForking) return null;
  const { reporting, balances } = loginAccount;
  let hasStakedRep = false;
  if (reporting) {
    hasStakedRep = !hasStakedRep
      ? createBigNumber(reporting.disputing.totalStaked).gt(ZERO)
      : hasStakedRep;
    hasStakedRep = !hasStakedRep
      ? createBigNumber(reporting.reporting.totalStaked).gt(ZERO)
      : hasStakedRep;
    hasStakedRep = !hasStakedRep
      ? createBigNumber(reporting.participationTokens.totalStaked).gt(ZERO)
      : hasStakedRep;
  }
  const hasRepBalance = balances && createBigNumber(balances.rep).gt(ZERO);
  const market = selectMarket(forkingInfo.forkingMarket);
  const releasableRep = selectReportingWinningsByMarket(state);

  return {
    hasStakedRep,
    hasRepBalance,
    market,
    releasableRep,
    forkTime: convertUnixToFormattedDate(forkingInfo.forkEndTime),
    currentTime: convertUnixToFormattedDate(blockchain.currentAugurTimestamp)
  };
};

const mapDispatchToProps = dispatch => ({
  releaseReportingRep: (allRep: MarketReportClaimableContracts) =>
    dispatch(
      updateModal({
        type: MODAL_CLAIM_FEES,
        ...allRep,
      })
    ),
  migrateRep: market =>
    dispatch(
      updateModal({
        type: MODAL_REPORTING,
        market,
      })
    ),
});

const mergeProps = (sP, dP, oP) => {

  return {
    ...oP,
    ...sP,
    ...dP,
    hasRepMigrationAction: () => dP.migrateRep(sP.market),
    hasStakedRepAction: () => dP.releaseReportingRep(sP.releasableRep),
  };
};

const ForkContainer = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
  )(ForkingBanner)
);

export default ForkContainer;
