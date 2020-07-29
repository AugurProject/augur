import { connect } from 'react-redux';
import { ReportingBondsView } from 'modules/reporting/common';
import { convertAttoValueToDisplayValue } from '@augurproject/sdk-lite';
import { ZERO, REPORTING_STATE, MODAL_INITIALIZE_ACCOUNT } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'appStore';
import { isSameAddress } from 'utils/isSameAddress';
import getGasPrice from 'modules/auth/selectors/get-gas-price';
import { updateModal } from 'modules/modal/actions/update-modal';
import getValueFromlocalStorage from 'utils/get-local-storage-value';

const mapStateToProps = (state: AppState, ownProps) => {
  const { universe, loginAccount } = state;
  const { market } = ownProps;
  const userAttoRep = createBigNumber(loginAccount.balances && loginAccount.balances.attoRep || ZERO);
  const userFunds = createBigNumber(loginAccount.balances && loginAccount.balances.eth || ZERO);
  const hasForked = !!state.universe.forkingInfo;
  const migrateRep =
    hasForked && universe.forkingInfo?.forkingMarket === market.id;
  const migrateMarket =
    hasForked && !!universe.forkingInfo.winningChildUniverseId;
  const initialReport = !migrateMarket && !migrateRep;
  const openReporting = market.reportingState === REPORTING_STATE.OPEN_REPORTING;
  const owesRep = migrateMarket ? migrateMarket : (!openReporting && !universe.forkingInfo?.forkingMarket === market.id && !isSameAddress(market.author, loginAccount.address));
  const enoughRepBalance = owesRep ? userAttoRep.gte(createBigNumber(market.noShowBondAmount)) : true;

  return {
    userFunds,
    owesRep,
    initialReport,
    migrateMarket,
    migrateRep,
    userAttoRep: convertAttoValueToDisplayValue(userAttoRep),
    gasPrice: getGasPrice(state),
    openReporting,
    enoughRepBalance,
  };
};

const ReportingBondsViewContainer = connect(
  mapStateToProps
)(ReportingBondsView);

export default ReportingBondsViewContainer;
