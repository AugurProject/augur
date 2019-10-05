import { connect } from 'react-redux';
import { ReportingBondsView } from 'modules/reporting/common';
import { convertAttoValueToDisplayValue } from '@augurproject/sdk/src';
import { ZERO } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'store';

const mapStateToProps = (state: AppState, ownProps) => {
  const { universe, loginAccount } = state;
  const { market } = ownProps;
  const userAvailableRep = createBigNumber(loginAccount.balances && loginAccount.balances.attoRep || ZERO);
  const hasForked = !!state.universe.forkingInfo;
  const migrateRep =
    hasForked && universe.forkingInfo.forkingMarket === market.id;
  const migrateMarket =
    hasForked && !!universe.forkingInfo.winningChildUniverseId;
  const initialReport = !migrateMarket && !migrateRep;

  return {
    initialReport,
    migrateMarket,
    migrateRep,
    userAvailableRep: convertAttoValueToDisplayValue(userAvailableRep),
  };
};

const mapDispatchToProps = dispatch => ({
});

const ReportingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingBondsView);

export default ReportingBondsViewContainer;
