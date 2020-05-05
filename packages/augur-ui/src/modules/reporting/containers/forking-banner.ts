import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ForkingBanner from 'modules/reporting/forking-banner';
import {
  MODAL_REPORTING,
  ZERO,
  MODAL_CLAIM_FEES,
} from 'modules/common/constants';
import { AppState } from 'appStore';
import { createBigNumber } from 'utils/create-big-number';
import { convertUnixToFormattedDate } from 'utils/format-date';
import { selectMarket } from 'modules/markets/selectors/market';
import { MarketReportClaimableContracts } from 'modules/types';
import { selectReportingWinningsByMarket } from 'modules/positions/selectors/select-reporting-winnings-by-market';
import { AppStatus } from 'modules/app/store/app-status';

const mapStateToProps = (state: AppState) => {
  const {
    loginAccount: { reporting, balances },
    universe: { forkingInfo },
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const isForking = !!forkingInfo;
  if (!isForking) return { show: false };
  let hasStakedRep = false;
  if (reporting) {
    const stakes = selectReportingWinningsByMarket(state);
    hasStakedRep =
      stakes.claimableMarkets &&
      stakes.claimableMarkets.marketContracts &&
      stakes.claimableMarkets.marketContracts.length > 0;
  }
  const market = selectMarket(forkingInfo.forkingMarket);
  const hasRepBalance =
    market !== null && balances && createBigNumber(balances.rep).gt(ZERO);
  const releasableRep = selectReportingWinningsByMarket(state);
 
  return {
    show: true,
    hasStakedRep,
    hasRepBalance,
    market,
    releasableRep,
    forkTime: convertUnixToFormattedDate(forkingInfo.forkEndTime),
    currentTime: convertUnixToFormattedDate(currentAugurTimestamp),
    isForking: !forkingInfo.isForkingMarketFinalized,
  };
};

const mapDispatchToProps = dispatch => {
  const { setModal } = AppStatus.actions;
  return {
    releaseReportingRep: (allRep: MarketReportClaimableContracts) =>
      setModal({
        type: MODAL_CLAIM_FEES,
        ...allRep,
      }),
    migrateRep: market =>
      setModal({
        type: MODAL_REPORTING,
        market,
      }),
  };
};
const mergeProps = (sP, dP, oP) => ({
  ...oP,
  ...sP,
  ...dP,
  hasStakedRepAction: () => dP.releaseReportingRep(sP.releasableRep),
  hasRepMigrationAction: () => dP.migrateRep(sP.market),
});

const ForkContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(ForkingBanner)
);

export default ForkContainer;
