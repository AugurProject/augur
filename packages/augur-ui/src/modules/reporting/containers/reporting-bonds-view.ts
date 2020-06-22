import { connect } from 'react-redux';
import { ReportingBondsView } from 'modules/reporting/common';
import { convertAttoValueToDisplayValue } from '@augurproject/sdk-lite';
import { ZERO, REPORTING_STATE, GSN_WALLET_SEEN, MODAL_INITIALIZE_ACCOUNT } from 'modules/common/constants';
import { createBigNumber } from 'utils/create-big-number';
import { AppState } from 'appStore';
import { isSameAddress } from 'utils/isSameAddress';
import getGasPrice from 'modules/auth/selectors/get-gas-price';
import { isGSNUnavailable } from 'modules/app/selectors/is-gsn-unavailable';
import { updateModal } from 'modules/modal/actions/update-modal';
import getValueFromlocalStorage from 'utils/get-local-storage-value';

const mapStateToProps = (state: AppState, ownProps) => {
  const { universe, loginAccount } = state;
  const { market } = ownProps;
  const userAttoRep = createBigNumber(loginAccount.balances && loginAccount.balances.attoRep || ZERO);
  const userFunds = state.appStatus.gsnEnabled ? createBigNumber(loginAccount.balances && loginAccount.balances.dai || ZERO) : createBigNumber(loginAccount.balances && loginAccount.balances.eth || ZERO);
  const hasForked = !!state.universe.forkingInfo;
  const migrateRep =
    hasForked && universe.forkingInfo?.forkingMarket === market.id;
  const migrateMarket =
    hasForked && !!universe.forkingInfo.winningChildUniverseId;
  const initialReport = !migrateMarket && !migrateRep;
  const openReporting = market.reportingState === REPORTING_STATE.OPEN_REPORTING;
  const owesRep = migrateMarket ? migrateMarket : (!openReporting && !universe.forkingInfo?.forkingMarket === market.id && !isSameAddress(market.author, loginAccount.address));
  const enoughRepBalance = owesRep ? userAttoRep.gte(createBigNumber(market.noShowBondAmount)) : true;
  const gsnWalletInfoSeen = getValueFromlocalStorage(GSN_WALLET_SEEN);

  return {
    userFunds,
    owesRep,
    initialReport,
    migrateMarket,
    migrateRep,
    userAttoRep: convertAttoValueToDisplayValue(userAttoRep),
    GsnEnabled: state.appStatus.gsnEnabled,
    gasPrice: getGasPrice(state),
    openReporting,
    enoughRepBalance,
    gsnUnavailable: isGSNUnavailable(state),
    gsnWalletInfoSeen,
  };
};

const mapDispatchToProps = dispatch => ({
  initializeGsnWallet: (customAction = null) => dispatch(updateModal({ customAction, type: MODAL_INITIALIZE_ACCOUNT })),
});

const ReportingBondsViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportingBondsView);

export default ReportingBondsViewContainer;
