import { connect } from 'react-redux';
import { ReportingBondsView } from 'modules/reporting/common';
import { convertAttoValueToDisplayValue } from '@augurproject/sdk/src';
import { ZERO, REPORTING_STATE } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'appStore';
import { isSameAddress } from 'utils/isSameAddress';
import getGasPrice from 'modules/auth/selectors/get-gas-price';

const mapStateToProps = (state: AppState, ownProps) => {
  const { universe, loginAccount } = state;
  const { market } = ownProps;
  const userAttoRep = createBigNumber(loginAccount.balances && loginAccount.balances.attoRep || ZERO);
  const hasForked = !!state.universe.forkingInfo;
  const migrateRep =
    hasForked && universe.forkingInfo.forkingMarket === market.id;
  const migrateMarket =
    hasForked && !!universe.forkingInfo.winningChildUniverseId;
  const initialReport = !migrateMarket && !migrateRep;
  const openReporting = market.reportingState === REPORTING_STATE.OPEN_REPORTING;
  const owesRep = migrateMarket ? migrateMarket : (!openReporting && !isSameAddress(market.author, loginAccount.address));
  const enoughRepBalance = owesRep ? userAttoRep.gte(createBigNumber(market.noShowBondAmount)) : true;

  return {
    owesRep,
    initialReport,
    migrateMarket,
    migrateRep,
    userAttoRep: convertAttoValueToDisplayValue(userAttoRep),
    Gnosis_ENABLED: state.appStatus.gnosisEnabled,
    ethToDaiRate: state.appStatus.ethToDaiRate,
    gasPrice: getGasPrice(state),
    openReporting,
    enoughRepBalance
  };
};

const mapDispatchToProps = dispatch => ({
});

const ReportingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingBondsView);

export default ReportingBondsViewContainer;
